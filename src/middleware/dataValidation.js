const { Patient } = require("../patient/model");
const { check, validationResult } = require("express-validator");

const validateProfile = [
  check("firstName").optional().isLength({ min: 2 }),
  check("lastName").optional().isLength({ min: 2 }),
  check("email").optional().isEmail(),
  check("password").optional().isLength({ min: 8 }),
  check("gender").optional().isIn(["Homme", "Femme"]),
  check("username").optional().isLength({ min: 2 }),
  check("nationality").optional().isLength({ min: 2 }),
  check("telephone").optional().isMobilePhone(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //verify if email already exist
    const patient = await Patient.findOne({ email: req.body.email });
    if (patient) {
      return res.status(400).send({ message: "email already used" });
    }

    next();
  },
];

const validateSignup = async (req, res) => {
  try {
    //getting data from form body
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
    } else if (!/^[a-zA-Z ]*$/.test(firstName, lastName)) {
      return res.status(400).json({ message: "Invalid name!!!" });
    } else if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/.test(
        email
      )
    ) {
      throw Error("Invalid email");
    } else if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must contain atleast 8 caracters!!!" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const validateSignin = async (req, res) => {
  try {
    let { email, password } = req.body;

    //validation de longeur du email
    if (!(email || email.trim().length === 0)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Validation de la longueur du mot de passe
    if (!password || password.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { validateSignup, validateProfile, validateSignin };
