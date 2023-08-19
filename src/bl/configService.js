import password from "../utils/password";
import userRepository from "../dal/configRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'
import weatherApi from "../services/weatherApi";

const default_config = {
  country: "",
  city: "",
  lat: "",
  lon: "",
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
    const objectId = new ObjectId(body.user_id);
    const coord = weatherApi.convertCityCountryToLatLong(body.config.city, body.config.country);
    if (coord == null)
      throw errorMessages.user.badLocation;
    const newConfig = {
      country: body.config.country,
      city: body.config.city,
      lat: coord.lat,
      lon: coord.lon,
    };

    const res = await userRepository.setConfigDocByUserId(objectId, newConfig);
    return res.acknowledged;
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

export default { getConfig, setConfig, createConfig };
