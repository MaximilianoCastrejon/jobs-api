const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
require("dotenv").config();

const register = async (req, res) => {
  // MONGOOSE LAREADY PROVIDES VALIDATORS
  // if (!name || !password || !email) {
  // throw new BadRequestError("Provide all of the required fields");
  // }

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ data: user.getNameAndEmail(), token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Provide an email and a password to log in");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: user.getNameAndEmail(), token });
};

module.exports = { register, login };
