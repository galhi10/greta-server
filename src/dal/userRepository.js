import userModel from "./models/user";

async function getUserByEmail(_email) {
  return userModel.findOne({ email: _email });
}

async function getUserById(_user_id) {
  return userModel.findOne({ _id: _user_id });
}

async function createNewUser(_email, _password, _first_name, _last_name) {
  const userResult = (
    await userModel.create({
      email: _email,
      password: _password,
      first_name: _first_name,
      last_name: _last_name,
    })
  ).toObject();
  delete userResult.password;
  return userResult;
}

export default {
  createNewUser,
  getUserByEmail,
  getUserById,
};
