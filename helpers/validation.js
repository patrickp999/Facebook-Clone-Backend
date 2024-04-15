const User = require("../models/user");

exports.validateEmail = (email) => {
  return String(email)
    .toLocaleLowerCase()
    .match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
};
exports.validateLength = (text, min, max) => {
  if (text.length < min || text.length > max) {
    return false;
  }
  return true;
};
exports.validateUserName = async (userName) => {
  let a = false;

  do {
    let check = await User.findOne({ userName });
    if (check) {
      //change userName
      userName += (+new Date() * Math.random()).toString().substring(0, 3);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return userName;
};
