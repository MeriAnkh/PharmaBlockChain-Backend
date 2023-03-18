const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new Schema({

  
  imgProfileUrl: {
    type: String,
    required: false,
  },
  
  
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  
  lastName: {
    type: String,
    required: true,
  },

  birthDate: {
    type: Date,
    required: true,
  },

  nationality: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },

  telephone: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  username: {
    type: String,
    required: true,
  },

  adress: {
    type: String,
    required: false,
  },

  alergies: [{
    type: String,
    required: false,
  }],
 
  isBlocked: {
    type: Boolean,
    required: false,
  },
});

const Patient = mongoose.model("Patients", PatientSchema);

module.exports = { Patient };