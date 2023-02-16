const user_actions = require("../actions/users");
const response = require("../utils/response");
const STATUS = require("../utils/status_codes");
const server_messages = require("../utils/server_messages");
const token = require("../services/jwt/jwt");

const createUser = async (request_body) => {
  try {
    if (await user_actions.createUser(request_body))
      return response.response(
        {
          response: server_messages.USER_REGISTRATION,
          user_id: request_body.id,
        },
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

const login = async (request_body) => {
  try {
    const login = await user_actions.login(request_body);
    if (login.verified) {
      let user_token = token.generateJWT(login.user.id);
      await user_actions.loggingIn(login.user.id);
      return response.response({ token: user_token }, STATUS.OK);
    } else {
      return response.error(
        server_messages.INVALID_LOGIN_CREDENTIALS,
        STATUS.BAD_REQUEST
      );
    }
  } catch (exception) {
    const exception_msg = exception.toString();
    if (
      exception_msg.includes("not exist") ||
      exception_msg.includes("not active")
    )
      return response.error(exception_msg, STATUS.BAD_REQUEST);
    else
      return response.error(
        server_messages.INTERNAL_SERVER_ERROR,
        STATUS.INTERNAL_SERVER_ERROR
      );
  }
};

const logout = async (user_id) => {
  try {
    if (await user_actions.logout(user_id))
      return response.response(server_messages.SUCCESSFUL_LOGOUT, STATUS.OK);
    return response.error(
      server_messages.INTERNAL_SERVER_ERROR,
      STATUS.INTERNAL_SERVER_ERROR
    );
  } catch (exception) {
    return response.error(exception.toString(), STATUS.INTERNAL_SERVER_ERROR);
  }
};

const savePost = async (text, user_id) => {
  try {
    if (await user_actions.savePost(text, user_id))
      return response.response(
        server_messages.SUCCESSFULLY_SAVED_POST,
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

const sendMessage = async (request_body, sender_user_id) => {
  try {
    if (await user_actions.sendMessage(request_body, sender_user_id))
      return response.response(
        server_messages.SUCCESSFULLY_SENT_MESSAGE,
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

const getAllUserMessages = async (user_id) => {
  try {
    const user_messages = await user_actions.getAllUserMessages(user_id);
    if (user_messages.length > 0)
      return response.response(user_messages, STATUS.OK);
    return response.response(server_messages.NO_MESSAGES, STATUS.OK);
  } catch (exception) {
    return response.error(exception.toString(), STATUS.INTERNAL_SERVER_ERROR);
  }
};

const getAllPosts = async () => {
  try {
    const posts = await user_actions.getAllPosts();
    if (posts.length > 0) return response.response(posts, STATUS.OK);
    return response.response(server_messages.NO_POSTS, STATUS.OK);
  } catch (exception) {
    return response.error(exception.toString(), STATUS.BAD_REQUEST);
  }
};

const getAllUsers = async () => {
  try {
    return response.response(await user_actions.getAllUsers(), STATUS.OK);
  } catch (exception) {
    return response.error(exception.toString(), STATUS.INTERNAL_SERVER_ERROR);
  }
};

const deleteUser = async (user_id) => {
  try {
    if (await user_actions.deleteUser(user_id))
      return response.response(
        server_messages.USER_HAS_BEEN_DELETED,
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

module.exports = {
  createUser,
  login,
  logout,
  savePost,
  sendMessage,
  getAllUserMessages,
  getAllPosts,
  getAllUsers,
  deleteUser,
};
