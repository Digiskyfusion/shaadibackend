const profileModel = require("../model/ProfileSchema");

const profileByCity = async (req, res) => {
    try {
        const userid = req.user.id;
        console.log("hello",userid);
        
        const user = await profileModel.findOne({ userId: userid });
console.log(" full user", user);

        if (!user) {
            return res.status(404).json({ mess: "no user profile found." })
        };

        const users = await profileModel.find({ city: user.city, userId: { $ne: userid } }).populate("userId");

        if (users.length === 0) {
            return res.status(404).json({ message: "No user found in this city." });
        }

        return res.status(200).json({ users: users })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong.",
            error: error.message,
        });
    }
};


module.exports = { profileByCity };