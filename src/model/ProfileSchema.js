const mongoose = require("mongoose");
const User = require("./user"); // Make sure path is correct
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic Personal Details
    familydetail: { 
      type: String, 
      default: "" 
    },
    age: { 
      type: Number, 
      default: null 
    },
    growup: { 
      type: String, 
      default: "" 
    },
    bloodgroup: { 
      type: String, 
      default: "" 
    },
    healthinformation: { 
      type: String, 
      default: "" 
    },
    disability: { 
      type: String, 
      default: "" 
    },

    // Religious & Cultural Background
    religion: {
      type: String,
      default: ""
    },
    community: {
      type: String,
      default: ""
    },
    subCommunity: {
      type: String,
      default: ""
    },
    gothram: { 
      type: String, 
      default: "" 
    },
    mothertongue: { 
      type: String, 
      default: "" 
    },
    manglik: { 
      type: String, 
      default: "" 
    },

    // Birth Details
    cityofbirth: { 
      type: String, 
      default: "" 
    },
    timeofbirth: { 
      type: String, 
      default: "" 
    },

    // Family Details
    motherdetails: { 
      type: String, 
      default: "" 
    },
    fatherdetails: { 
      type: String, 
      default: "" 
    },
    familylocation: { 
      type: String, 
      default: "" 
    },
    nosisters: { 
      type: Number, 
      default: 0 
    },
    nobrothers: { 
      type: Number, 
      default: 0 
    },
    familyfinancialstatus: { 
      type: String, 
      default: "" 
    },

    // Education & Career
    highestqualification: { 
      type: String, 
      default: "" 
    },
    collegesattended: { 
      type: String, 
      default: "" 
    },
    annualincome: { 
      type: String, 
      default: "" 
    },

    // Work Information
    workingwith: { 
      type: String, 
      default: "" 
    },
    workingas: { 
      type: String, 
      default: "" 
    },
    employername: { 
      type: String, 
      default: "" 
    },

    // Location Details
    currentresidence: { 
      type: String, 
      default: "" 
    },
    stateofresidence: { 
      type: String, 
      default: "" 
    },
    residencystatus: { 
      type: String, 
      default: "" 
    },
    zippincode: { 
      type: String, 
      default: "" 
    },

    // Personal Interests
    hobbies: { 
      type: String, 
      default: "" 
    },

    // Additional Profile Information
    city: {
      type: String,
      default: "",
    },
    liveWithFamily: {
      type: Boolean,
      default: false,
    },
    livingInIndiaSince: {
      type: String,
      default: "",
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: "Single",
    },
    diet: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Other"],
      default: "Other",
    },
    height: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);



// ✅ Age Calculation from User's DOB
profileSchema.pre("save", async function (next) {
  try {
    const user = await User.findById(this.userId);
    if (user && user.dob) {
      const today = new Date();
      const birthDate = new Date(user.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.age = age;
    }
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Profile", profileSchema);
