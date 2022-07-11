const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.send({ error: "Please provide user ID in params" });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-passowrd")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.find({ _id: createdChat._id }).populate(
        "users",
        "-passowrd"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        console.log(results);
        res.send(results);
      });
  } catch (error) {
    res.send(400);
    throw new Error();
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name)
    return res.status(400).send({ message: "PLease fil all the fields" });

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send({ message: "Mininum 2 users allow for chat" });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.find({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send({ message: "Error" });
    throw new Error();
  }
});
const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatName) {
    return res.status(200).send({ error: "Please fill field" });
  }

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    res.status(404);
    throw new Error("Chat not found!");
  } else {
    res.json(updateChat);
  }
});
const addToGroup = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const chatId = req.body.chatId

  console.log('chat s ==>', userId)
  if (!userId) {
    return res.status(200).send({ error: "Please fill field" });
  } else {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
      if(!added){
        res.status(400)
        throw new Error("User not added")
      }
      else{
        res.json(added)
      }
  }
});

const removeFromGroup = asyncHandler(async(req , res)=>{

  const { userId, chatId } = req.body;
    if (!userId) {
    return res.status(200).send({ error: "Please fill field" });
  }else{
    const removeUser = await Chat.findByIdAndUpdate(chatId,
      {
        $pull:{users:userId}
      },
      {
        new:true
      }
      ).populate("users" , "-password").populate("groupAdmin" , "-password")

      if(!removeUser){
        res.status(400)
        throw new Error("User not remove")
      }
      else{
        res.json(removeUser)
      }
  }

})
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup
};
