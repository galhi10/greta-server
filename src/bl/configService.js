import password from "../utils/password";
import userRepository from "../dal/configRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'

const default_config = {
  grass: "",
  mode: "",
  ground: "",
  country: "",
  city: "",
  size: 0,
  liters_per_minute: 0,
  light: "",
};

const createConfig = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    return await userRepository.createConfigDocument(objectId, default_config);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const getConfig = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id);
    return await userRepository.getConfigDcByUserId(objectId);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const setConfig = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    const res = await userRepository.setConfigDocByUserId(objectId, body.config);
    return res.acknowledged;
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

export default { getConfig, setConfig, createConfig };
