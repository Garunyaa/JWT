const express = require("express");
const authRoutes = express.Router();
const User = require("../model/user");
const { hashGenerate } = require("../helpers/hashing");
const { hashValidator } = require("../helpers/hashing");
const { tokenGenerator } = require("../helpers/token");
//const authVerify = require("../helpers/authVerify");

authRoutes.post("/signup", async (req, res) => {
  try {
    const hashPassword = await hashGenerate(req.body.password);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.send(error);
  }
});

authRoutes.post("/login", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      res.send("Email is invalid");
    } else {
      const checkUser = await hashValidator(
        req.body.password,
        existingUser.password
      );
      if (!checkUser) {
        res.send("Incorrect password");
      } else {
        const token = await tokenGenerator(existingUser.email);
        res.cookie("jwt", token);
        res.send(token);
      }
    }
  } catch (error) {
    res.send(error);
  }
});

authRoutes.get("/protected", authVerify, (req, res) => {
  res.send("Protected route");
});

module.exports = authRoutes;
