const { Patient } = require("./model");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");
const {
//   validateProfile,
 
  validateSignin,
} = require("../middleware/dataValidation");

//signin
const signIn = async (req, res) => {
  try {
    let { email, password } = req.body;
    email=email.trim();
    const fetchedPatient = await Patient.findOne({ email });
    const blocked=fetchedPatient.isBlocked;
    if (blocked) {
      return res.status(401).json({
        message: "Access denied due to some reasons!!",
      });
    } else if (!fetchedPatient) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      const hashedPassword = fetchedPatient.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const tokenData = { patientId: fetchedPatient._id, email };
      const token = await createToken(tokenData);

      return res.status(200).json({
        token,
        message: "User login successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

//Create neww patient
const signUp = async (req, res, next) => {
  try {
    let {
        firstName,
        lastName,
        birthDate,
        nationality,
        gender,
        email,
        telephone,
        password,
        username,
    } = req.body;
//removing blank spaces
firstName = firstName.trim();
lastName = lastName.trim();
birthDate = birthDate.trim();
nationality = nationality.trim();
gender = gender.trim();
email = email.trim();
email = email.trim();
telephone = telephone.trim();

password = password;
username = username.trim();


const genderPattern = /^(Homme|Femme)$/;

//data validation
//testing empty fields
if (
  !(
    firstName&&
    lastName&&
    birthDate&&
    nationality&&
    gender&&
    email&&
    telephone&&
    password&&
    username
  )
) {
  return res.status(400).json({ message: "Some fields are empty!!!" });
  //testing email,names,password
  //name test
} else if ((firstName.length < 3) || (lastName.length < 3)){
    return res
    .status(400)
    .json({ message: "Invalid name" });
} else if (
  !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/.test(
    email
  )
) {
  return res
    .status(400)
    .json({ message: "Invalid email" });
} else if (password.length < 8) {
  return res
    .status(400)
    .json({ message: "Password must contain atleast 8 caracters!!!" });
} else if(!genderPattern.test(gender)) {
    console.log("Returning error:Invalid gender")
    return res
    .status(400)
    .json({ message: "Invalid gender!" });

}



    //checking if CardId belongs to the system
    //checking if patient already exists
    //checking if username is already used
    const existingPatient = await Patient.findOne({ email });
    const existingUsername= await Patient.findOne({ username });

    if (existingPatient) {
      return res.status(400).json({ error: "email already used" });
    } else if (existingUsername) {
      return res.status(400).json({ error: "username already used" });
    }

    //hash password with the cryptage function in the services folder
    const hashedPassword = await cryptage(password);
    const newPatient = new Patient({
        firstName,
        lastName,
        birthDate,
        nationality,
        gender,
        email,
        telephone,
        password : hashedPassword,
        username
    });
    await newPatient.save();
    res.status(201).json({ message: "User registered successfully!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

//Afficher profile
// const getProfile = async (req, res) => {
//   try {
//     const token =
//       req.body.token || req.query.token || req.headers["x-access-token"];
//     if (!token) {
//       return res.status(401).send("Authentication token is required!!");
//     }
//     const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
//     const patient = await Patient.findById({ _id: decodedToken.patientId });
//     if (!patient) {
//       return res.status(404).send("No user found!!");
//     }
//     return res.status(200).json(patient);
//   } catch (error) {
//     return res.status(401).send("Invalid token provided");
//   }
// };

//Mettre à jour le profile patient
// const editProfile = async (req, res) => {
//   try {
//     // await validateProfile(req);
//     const token =
//       req.body.token || req.query.token || req.headers["x-access-token"];
//     if (!token) {
//       return res
//         .status(400)
//         .json({ error: "Authentication token is required!!" });
//     }
//     const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
//     const patient = await Patient.findById({ _id: decodedToken.patientId });
//     if (!patient) {
//       return res.status(404).json({ error: "User not found!!" });
//     }

//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       sex,
//       profession,
//       nationality,
//       phoneNumber,
//     } = req.body;

//     if (firstName) {
//       patient.firstName = firstName;
//     }
//     if (lastName) {
//       patient.lastName = lastName;
//     }
//     if (email) {
//       patient.email = email;
//     }
//     if (password) {
//       patient.password = await cryptage(password);
//     }
//     if (sex) {
//       patient.sex = sex;
//     }
//     if (profession) {
//       patient.profession = profession;
//     }
//     if (nationality) {
//       patient.nationality = nationality;
//     }
//     if (phoneNumber) {
//       patient.phoneNumber = phoneNumber;
//     }

//     const updatedPatient = await patient.save();
//     return res.status(200).json("Profil updated successfully");
//   } catch (error) {
//     return res.status(200).json("Invalid token");
//   }
// };

//Exporter les fonctions
module.exports = {
  signUp,
  signIn
};
