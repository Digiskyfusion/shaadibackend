const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assumes you have a User model
        required: true,
      },
  // Basic Personal Details
  name:{type:String},
  phonenumber:{type:String},
  emailId:{type:String},
  gender: {
  type: String,
  enum: ["male", "female"],
},
  familydetail: { type: String },
  age: { type: Number },
  dob: { type: Date }, // better to store as Date
  maritalstatus: { type: String },
  height: { type: Number },
  growup: { type: String },
  diet: { type: String },
  bloodgroup: { type: String },
  healthinformation: { type: String },
  disability: { type: String },

  // Religious & Cultural Background
  religion: { type: String },
  community: { type: String },
  subcommunity: { type: String },
  gothram: { type: String },
  mothertongue: { type: String },
  manglik: { type: String }, // or Boolean if it's just Yes/No

  // Birth Details
  timeofbirth: { type: String },
  cityofbirth: { type: String },

  // Family Details
  motherdetails: { type: String },
  fatherdetails: { type: String },
  familylocation: { type: String },
  nosisters: { type: Number },
  nobrothers: { type: Number },
  familyfinancialstatus: { type: String },

  // Education & Career
  highestqualification: { type: String },
  collegesattended: { type: String },
  annualincome: { type: String },

  // Work Information
  workingwith: { type: String },
  workingas: { type: String },
  employername: { type: String },

  // Location Details
  currentresidence: { type: String },
  stateofresidence: { type: String },
  residencystatus: { type: String },
  zippincode: { type: String },

  // Personal Interests
  hobbies: { type: String },
  profileImage: { 
    type: String,  // you can store a URL for the image here
    default: "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?t=st=1745472242~exp=1745475842~hmac=e786c75aeb71e49fab74d5727fff9d1333d8b3094859cc1c4d4664e5b01ad645&w=826"    // optional, default to an empty string or a placeholder image
  },


});

module.exports = mongoose.model("comProfile", profileSchema);
