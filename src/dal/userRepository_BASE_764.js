import { login_Info_DB } from "../services/mongoose";

async function getUserByEmail(_email) {
  return await login_Info_DB.findOne({
    email: _email,
  });
}

async function getUserById(_user_id) {
  return await login_Info_DB.findOne({
    _id: _user_id,
  });
}

async function createNewUser(_email, _password, _first_name, _last_name) {
  return await login_Info_DB.insertOne({
    email: _email,
    password: _password,
    first_name: _first_name,
    last_name: _last_name,
  });
}

export default {
  createNewUser,
  getUserByEmail,
  getUserById,
};
