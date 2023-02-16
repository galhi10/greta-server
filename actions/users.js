const password_encryption = require("../utils/password_encryption");
const query = require("../actions/query");
const file = require("../utils/file");
const user_status = require("../utils/user_status");
const general = require("../utils/general");
const server_messages = require("../utils/server_messages");

const createUser = async (request_body) => {
  const users = await query.getAllUsers();

  if (isEmailExists(request_body.email, users) != -1) {
    throw Error(server_messages.EMAIL_ALREADY_EXISTS);
  }

  request_body.password = await password_encryption.encrypt(
    request_body.password.toString()
  );
  request_body.id = users.length + 1;
  users.push(request_body);
  const users_json = {
    users: users,
  };

  return await file.write(users_json, "users.json");
};

const isEmailExists = (email, users) => {
  return query.findUserByEmail(users, email);
};

const login = async (request_body) => {
  const users = await query.getAllUsers();
  const i = isEmailExists(request_body.email, users);
  if (i == -1) throw Error(server_messages.USER_DOES_NOT_EXIST);

  switch (users[i].status) {
    case user_status.active:
      break;
    case user_status.created:
      throw Error(server_messages.USER_IS_NOT_ACTIVE);

    case user_status.deleted:
      throw Error(server_messages.USER_DOES_NOT_EXIST);

    case user_status.suspended:
      throw Error(server_messages.USER_HAS_BEEN_SUSPENDED);

    default:
      throw Error("Invalid user status");
  }

  return {
    verified: await password_encryption.decrypt(
      request_body.password,
      users[i].password
    ),
    user: users[i],
  };
};

const loggingIn = async (user_id) => {
  const users = await query.getAllUsers();
  const i = query.findUserById(users, user_id);
  users[i].logged_in = true;
  const users_json = {
    users: users,
  };
  await file.write(users_json, "users.json");
};

const logout = async (user_id) => {
  const users = await query.getAllUsers();
  const index = query.findUserById(users, user_id);
  users[index].logged_in = false;
  const users_json = {
    users: users,
  };
  return await file.write(users_json, "users.json");
};

const savePost = async (text, user_id) => {
  const posts = await query.getAllPosts();
  const post = {
    id: posts.length + 1,
    creation_date: general.date(),
    text: text,
    user_id: user_id,
    status: "active",
  };
  posts.push(post);
  const posts_json = {
    posts: posts,
  };
  return await file.write(posts_json, "posts.json");
};

const sendMessage = async (request_body, sender_user_id) => {
  const users = await query.getAllUsers();
  const i = query.findUserById(users, request_body.user_id);
  if (i == -1) throw Error(server_messages.USER_DOES_NOT_EXIST);

  switch (users[i].status) {
    case user_status.active:
      break;
    case user_status.created:
      throw Error(server_messages.USER_IS_NOT_ACTIVE);

    case user_status.deleted:
      throw Error(server_messages.USER_DOES_NOT_EXIST);

    case user_status.suspended:
      throw Error(server_messages.USER_HAS_BEEN_SUSPENDED);

    default:
      throw Error("Invalid user status");
  }

  const receiver_user_id = users[i].id;

  const messages = await query.getAllMessages();
  const message = {
    id: messages.length + 1,
    creation_date: general.date(),
    text: request_body.text,
    receiver_user_id: receiver_user_id,
    sender_user_id: sender_user_id,
    status: "active",
  };

  messages.push(message);
  const messages_json = {
    messages: messages,
  };
  return await file.write(messages_json, "messages.json");
};

const getAllUserMessages = async (user_id) => {
  const all_messages = await query.getAllMessages();
  const messages = all_messages.filter(
    (message) => message.receiver_user_id == user_id
  );

  const users = await query.getAllUsers();

  const user_messages = [];
  for (let i = 0; i < messages.length; i++) {
    let message = {
      sender_user_id: messages[i].sender_user_id,
      username:
        users[query.findUserById(users, messages[i].sender_user_id)].full_name,
      date_and_time: messages[i].creation_date,
      text: messages[i].text,
    };
    if (messages[i].status == "active") user_messages.push(message);
  }
  return user_messages;
};

const getAllPosts = async () => {
  let posts_arr = await query.getAllPosts();

  posts_arr = posts_arr.filter((post) => post.status == "active");
  posts_arr.reverse();

  const users = await query.getAllUsers();

  for (let i = 0; i < posts_arr.length; i++) {
    posts_arr[i].username =
      users[query.findUserById(users, posts_arr[i].user_id)].full_name;
  }
  return posts_arr;
};

const getAllUsers = async () => {
  const users_arr = await query.getAllUsers();
  const users = [];
  for (let i = 0; i < users_arr.length; i++) {
    let user = {
      full_name: users_arr[i].full_name,
      user_id: users_arr[i].id,
    };
    if (users_arr[i].status == user_status.active) users.push(user);
  }

  return users;
};

const deleteUser = async (user_id) => {
  const users = await query.getAllUsers();
  const index = query.findUserById(users, user_id);
  if (index == -1) throw Error(server_messages.USER_DOES_NOT_EXIST);
  if (users[index].is_admin) throw Error("admin deletion is prohibited");
  users[index].status = user_status.deleted;
  await query.deleteAllUserMessages(user_id);
  const users_json = {
    users: users,
  };
  return await file.write(users_json, "users.json");
};

module.exports = {
  createUser,
  login,
  savePost,
  sendMessage,
  getAllUserMessages,
  getAllPosts,
  getAllUsers,
  loggingIn,
  logout,
  deleteUser,
};
