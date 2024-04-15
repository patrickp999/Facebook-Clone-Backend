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
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
