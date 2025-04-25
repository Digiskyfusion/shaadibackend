const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // It's better to use environment variables

const multiForm = async (req, res) => {
  try {
    let { emailId, password, mobileNumber, ...otherData } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required in the second step" });
    }

    emailId = emailId.trim().toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({
      emailId,
      mobileNumber,
      password: hashedPassword,
      ...otherData,
    });

    await newUser.save();

    // Create JWT token
    const payload = { id: newUser._id, emailId: newUser.emailId , mobileNumber};
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        emailId: newUser.emailId,
        mobileNumber:mobileNumber,
        ...otherData
      }
    });
  } catch (error) {
    console.error("Error in user registration:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};


const login = async (req, res) => {
  const { identifier, password } = req.body;
  // console.log("Request Body:", req.body);

  if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({
      $or: [{ emailId: identifier }, { mobileNumber: identifier }],
    });

    console.log("Found user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // ✅ Create token
    const payload = {
      id: user._id,
      emailId: user.emailId,
      mobileNumber: user.mobileNumber,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // ✅ Remove password from user object before sending
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({
      message: "Login successful.",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};





module.exports ={multiForm,login};
