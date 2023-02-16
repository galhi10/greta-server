const hash = require("../utils/password_encryption");
const general = require("../utils/general");
const file = require("../utils/file");
const admin_actions = require("../actions/admin");
const user_status = require("../utils/user_status");
const response = require("../utils/response");
const STATUS = require("../utils/status_codes");
const server_messages = require("../utils/server_messages");
const query = require("../actions/query");

const createAdmin = async () => {
  const users_json = {
    users: [
      {
        full_name: "Gal Hikri",
        email: "gal@gmail.com",
        password: await hash.encrypt("123456"),
        creation_date: general.date(),
        status: user_status.active,
        is_admin: true,
        logged_in: false,
        id: 1,
      },
    ],
  };
  const isExists = await adminExists();
  if (!isExists) {
    file.write(users_json, "users.json");
  }
};

const adminExists = async () => {
  const users = await query.getAllUsers();
  if (users.length == 0) {
    return false;
  } else {
    for(let i = 0; i < users.length; i++){
      if(users[i].is_admin) return true;
    }
    return false;
  }
};



const changeUserStatus = async (request_body) => {
  try {
    await admin_actions.changeUserStatus(request_body);
    return response.response(
      "user_id:" +
        request_body.user_id +
        server_messages.SUCCESSFUL_STATUS_CHANGE +
        request_body.status,
      STATUS.OK
    );
  } catch (exception) {
    return response.error(exception.toString(), STATUS.BAD_REQUEST);
  }
};

const messageAllUsers = async (text) => {
  try {
    if (await admin_actions.messageAllUsers(text))
      return response.response(
        server_messages.SUCCESSFULLY_SENT_MESSAGE,
        STATUS.OK
      );
    return response.error(
      server_messages.INTERNAL_SERVER_ERROR,
      STATUS.INTERNAL_SERVER_ERROR
    );
  } catch (exception) {
    return response.error(exception.toString(), STATUS.INTERNAL_SERVER_ERROR);
  }
};

const deletePost = async (post_id) => {
  try {
    if (await admin_actions.deletePost(post_id))
      return response.response(
        server_messages.POST_HAS_BEEN_DELETED,
        STATUS.OK
      );
    return response.error(
      server_messages.INTERNAL_SERVER_ERROR,
      STATUS.INTERNAL_SERVER_ERROR
    );
  } catch (exception) {
    return response.error(exception.toString(), STATUS.BAD_REQUEST);
  }
};

const getAllUsers = async () => {
  try {
    return response.response(await admin_actions.getAllUsers(), STATUS.OK);
  } catch (exception) {
    return response.error(exception.toString(), STATUS.BAD_REQUEST);
  }
};

module.exports = {
  createAdmin,
  changeUserStatus,
  messageAllUsers,
  deletePost,
  getAllUsers,
};
