import password from "../utils/password";
import userRepository from "../dal/userRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'


const createUser = async (body) => {
  const user = await userRepository.getUserByEmail(body.email);
  if (user) {
    throw errorMessages.user.exists;
  }

  body.password = await password.encrypt(body.password.toString());

  return {
    ok: true,
    data: await userRepository.createNewUser(
      body.email,
      body.password,
      body.firstName,
      body.lastName
    ),
  };
};

const login = async (body) => {
  const user = await userRepository.getUserByEmail(body.email);
  if (!user) {
    throw errorMessages.user.badEmailOrPassword;
  }
  const passwordVerified = await password.decrypt(body.password, user.password);
  if (passwordVerified) {
    return {
      ok: true,
      data: {
        token: auth.generateJWT(user._id),
      },
    };
  } else {
    throw errorMessages.user.badEmailOrPassword;
  }
};

const getConfig = async (body) => {
  try{
    const objectId = new ObjectId(body.user_id)  
    return await userRepository.getConfigDcByUserId(objectId);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const setConfig = async (body) => {
  try{
    const objectId = new ObjectId(body.user_id)  
    return await userRepository.setConfigDocByUserId(objectId, body.config);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

export default { login, createUser, getConfig , setConfig};
