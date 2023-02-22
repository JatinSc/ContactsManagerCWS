const mongoose = require('mongoose')
const router = require('express').Router();
const User = require("../Models/userModal")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/userAuth')

router.post("/login");

// $ route for registering
router.post("/register", async (req, res) => {
  // #  we will take values from user by using req.body
  const { name, email, password } = req.body;

  //# if fields are empty 
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: 'please enter all the required fields' })

  //# validate name 
  if (name.length < 3) {
    return res
      .status(400)
      .json({ error: 'name should have at least 3 characters' });
  } else if (name.length > 25) {
    return res
      .status(400)
      .json({ error: 'name can only be 25 characters long.' });
  }
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // # validation of email through regex
  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "please enter a valid email address." });

  // # validation of password
  if (password.length <= 6)
    return res
      .status(400)
      .json({ error: 'password must be at least 6 characters' })

  // $ if everything is fine , we create our user in try catch
  try {
    // @ if user is already exists
    const doesUserAlreadyExist = await User.findOne({ email })
    if (doesUserAlreadyExist)
      return res
        .status(400)
        .json({ error: `a user with "${email}" already exists, so please try with different email` })


    // @ first we hash the password before saving it into database
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword })

    // @ saving the user 
    const result = await newUser.save()
    // @ .doc.password will not show saved password in postman while testing
    result._doc.password = undefined;
    return res.status(201).json({ ...result._doc })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});


// $ route for login 
router.post("/login", async (req, res) => {
  // #  we will take values from user by using req.body
  const { email, password } = req.body;

  // # if fields are missing
  if (!email || !password)
    return res
      .status(400)
      .json({ error: 'please enter all the required fields' })

  // # email validation with regex
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // # will test email with regex
  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "please enter a valid email address." });

  try {
    // @ if user not exists 
    const doesUserExists = await User.findOne({ email });
    if (!doesUserExists)
      return res
        .status(400)
        .json({ error: "invalid email or password" });

    // @ if there any user exists so we match the plain text password with hashed password
    const doesPasswordMatch = await bcrypt.compare(password, doesUserExists.password)

    if (!doesPasswordMatch)
      return res
        .status(400)
        .json({ error: " invalid email or password " })

    // # if everything is fine we will generate token
    // @ it takes id , secret key and we can give expiration duration 
    const payload = { _id: doesUserExists._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    const user = { ...doesUserExists._doc, password: undefined }
    return res
      .status(200)
      .json({ token, user })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message });

  }
});

router.get("/me", auth, async (req, res) => {
  return res
    .status(200)
    .json({ ...req.user._doc });
})

// $ now the thing which is left is ,
// $ we have to verify whether the token is valid or not
// $ we create a middleWares directory for that will code in userAuth.js
module.exports = router;