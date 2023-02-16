const query = require("../actions/query");
const file = require("../utils/file");
const general = require("../utils/general");
const config = require("../config");
const user_status = require("../utils/user_status");
const server_messages = require("../utils/server_messages");

const changeUserStatus = async (request_body) => {
  const users = await query.getAllUsers();
  const index = query.findUserById(users, request_body.user_id);

  if (index == -1 || users[index].status == user_status.deleted)
    throw Error(server_messages.USER_DOES_NOT_EXIST);
  if (query.isAdminId(users[index].id))
    throw Error(server_messages.ADMIN_CANNOT_BE_MODIFIED);

  if (request_body.status == user_status.deleted) {
    await query.deleteAllUserMessages(users[index].id);
  }
  users[index].status = request_body.status;
  const users_json = {
    users: users,
  };
  await file.write(users_json, "users.json");
};

const messageAllUsers = async (text) => {
  const messages = await query.getAllMessages();
  const users = await query.getAllUsers();
  for (let i = 0; i < users.length; i++) {
    let message = {
      id: messages.length + 1,
      creation_date: general.date(),
      text: text,
      receiver_user_id: users[i].id,
      sender_user_id: config.admin.id,
      status: "active",
    };
    if (!query.isAdminId(users[i].id) && users[i].status === user_status.active)
      messages.push(message);
  }

  const messages_json = {
    messages: messages,
  };

  return await file.write(messages_json, "messages.json");
};

const deletePost = async (post_id) => {
  const posts = await query.getAllPosts();
  const index = posts.indexOf(query.getPostById(posts, post_id));
  if (index != -1) {
    posts[index].status = "deleted";
  } else throw Error("Could not find the given post");
  const posts_json = {
    posts: posts,
  };
  return await file.write(posts_json, "posts.json");
};

const getAllUsers = async () => {
  const users_arr = await query.getAllUsers();
  const users = [];
  for (let i = 0; i < users_arr.length; i++) {
    let user = {
      full_name: users_arr[i].full_name,
      email: users_arr[i].email,
      user_id: users_arr[i].id,
      creation_date: users_arr[i].creation_date,
      status: users_arr[i].status,
    };
    if (users_arr[i].status !== user_status.deleted) users.push(user);
  }

  return users;
};

module.exports = { changeUserStatus, messageAllUsers, deletePost, getAllUsers };
