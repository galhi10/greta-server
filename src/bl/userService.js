import password from "../utils/password";
import userRepository from "../dal/userRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'

const default_config = {
  grass: "",
  mode: "",
  ground: "",
  location: "",
  size: 0,
  liters_per_minute: 0,
  light: "",
};
const default_irrigation_schedule = [
  {
    date: "",
    time: "",
    status: "",
    humidity: 0,
  },
];

const createUser = async (body) => {
  const user = await userRepository.getUserByEmail(body.email);
  if (user) {
    throw errorMessages.user.exists;
  }
  try{
  body.password = await password.encrypt(body.password.toString());
  const userid =  await userRepository.createNewUser(
    body.email,
    body.password,
    body.firstName,
    body.lastName
  );
    if(userid)
    {
      await userRepository.createConfigDocument(userid,default_config);
      await userRepository.createIrrigationScheduleDocument(userid,default_irrigation_schedule);
    }
  }
  catch(err)
  {
    return {ok: false}
  }
  return {ok: true}
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

const getIrregSec = async (body) => {
  try{
    const objectId = new ObjectId(body.user_id)  
    return await userRepository.getIrregSecDocByUserId(objectId);
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

export default { login, createUser, getConfig , setConfig, getIrregSec};
