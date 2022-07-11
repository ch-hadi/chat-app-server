const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const genrateToken = require("./genrateToken");

const bcrypt = require("bcrypt");

const signUp = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const pic = req.body.pic;

  if (!name || !email || !password) {
    res.send({ Error: "All fields are Requier.." });

    throw new Error("All fields are Requier..");
  }

  const userFound = await User.findOne({ email });

  if (userFound) {
    res.send({ Error: "User Already Exist.." });

    throw new Error("UserAlready Exist");
  }

  const securedPassword = bcrypt.hashSync(password, 10);

  const user = await User.create({
    name: name,
    email: email,
    password: securedPassword,
    pic: pic,
  });

  if (user) {
    let data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: genrateToken(user._id),
    };

    res.send({ data: data });

    console.log(user);
  } else {
    res.send({ Error: "User not Created.." });

    throw new Error("User not Created..");
  }
});

//  Login Function

const login = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.send({ Error: "All fields are require..." });

    throw new Error("All fields are require...");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.send({
      _id: user._id,
      name:user.name,
      email: user.email,
      pic:user.pic,
      token: genrateToken(user._id),
    });
  } else {
    res.send({ Error: "User not Found.." });
    throw new Error("User not Found..");
  }
});

const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = {
  signUp,
  login,
  allUser,
};

// const genrateToken =
