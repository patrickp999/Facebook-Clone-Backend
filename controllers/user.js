const { sendVerificationEmail } = require("../helpers/mailer");
const { generateToken } = require("../helpers/tokens");
const {
  validateEmail,
  validateLength,
  validateUserName,
} = require("../helpers/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const check = await User.findOne({ email });
    if (check) {
      return res
        .status(400)
        .json({ message: "Email already exists. Try with a different email" });
    }

    if (!validateLength(firstName, 3, 30)) {
      return res
        .status(400)
        .json({ message: "First name must be between 3 and 30 characters" });
    }
    if (!validateLength(lastName, 3, 30)) {
      return res
        .status(400)
        .json({ message: "Last name must be between 3 and 30 characters" });
    }
    if (!validateLength(password, 6, 40)) {
      return res
        .status(400)
        .json({ message: "Password must be between 3 and 30 characters" });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    let tempUserName = firstName + lastName;
    let newUserName = await validateUserName(tempUserName);
    const user = await new User({
      firstName,
      lastName,
      userName: newUserName,
      email,
      password: cryptedPassword,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.firstName, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.json({
      token,
      id: user._id,
      userName: user.userName,
      picture: user.picture,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bYear: user.bYear,
      bMonth: user.bMonth,
      bDay: user,
      verified: user.verified,
      message: "Registered successfully! Please verify your email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
