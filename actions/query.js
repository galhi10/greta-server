const config = require("../config");
const file = require("../utils/file");
const user_status = require("../utils/user_status");

const findUserById = (users, id) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id && users[i].status !== user_status.deleted) return i;
  }
  return -1;
};

const findUserByEmail = (users, email) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].status !== user_status.deleted)
      return i;
  }
  return -1;
};

const getAllUsers = async () => {
  const arr = await getJSON("users.json");
  return arr.users;
};

const getAllPosts = async () => {
  const arr = await getJSON("posts.json");
  return arr.posts;
};

const getAllMessages = async () => {
  const arr = await getJSON("messages.json");
  return arr.messages;
};

const getJSON = async (fileToRead) => {
  const json_str = await file.read(fileToRead);
  const arr = JSON.parse(json_str.toString());
  return arr;
};

const getPostById = (posts, id) => {
  for (let i = 0; i < posts.length; i++) if (posts[i].id == id) return posts[i];
  return -1;
};

const isAdminId = (user_id) => {
  return user_id === config.admin.id;
};

const deleteAllUserMessages = async (user_id) => {
  const messages = await getAllMessages();
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].receiver_user_id == user_id) {
      messages[i].status = "deleted";
    }
  }
  const messages_json = {
    messages: messages,
  };
  await file.write(messages_json, "messages.json");
};

module.exports = {
  getAllUsers,
  findUserByEmail,
  getAllPosts,
  getAllMessages,
  findUserById,
  getPostById,
  isAdminId,
  deleteAllUserMessages,
};
