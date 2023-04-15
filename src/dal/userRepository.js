import userModel from "./models/user";

async function getUserByEmail(_email) {
  return await userModel.findOne({
    email: _email,
  });
}

async function getUserById(_user_id) {
  return await userModel.findOne({
    _id: _user_id,
  });
}

async function setPasswordByUserId(_user_id, _password) {
  const newPassword = {
    $set: {
      password: _password,
    },
  };
  const user = { _id: _user_id };
  return await userModel.updateOne(user, newPassword);
}

async function createNewUser(_email, _password, _first_name, _last_name) {
  const result = await userModel.create({
    email: _email,
    password: _password,
    first_name: _first_name,
    last_name: _last_name,
  });
  console.log(result._id);
  return result._id;
}

export default {
  createNewUser,
  getUserByEmail,
  getUserById,
  setPasswordByUserId,
};
