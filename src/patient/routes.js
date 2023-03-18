const express = require("express");
const router = express.Router();
const {
  signIn,
  signUp,
} = require("./controller");
const { validateProfile } = require("../middleware/dataValidation");

const { verifyToken } = require("../middleware/auth");

//Signup route
router.post("/signup", signUp);

//Signin
router.post("/signin", signIn);

//Consulter profile
//router.get("/profile", verifyToken, getProfile);

// //Mettre à jour son profile
//router.post("/editProfile", verifyToken, validateProfile, editProfile);

module.exports = router;