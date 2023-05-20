import password from "../utils/password";
import deviceRepository from "../dal/devicesRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'

const default_Device =
{
  id: -1,
  location: "",
  model: "",
};

const default_Humidity = 0;

const createDevice = async (body) => {
  try {
    const res = await deviceRepository.isDeviceExistsBySensorId(body.sensor.id);
    if (res) {
      throw errorMessages.device.exists;
    }
    const objectId = new ObjectId(body.user_id)
    return await deviceRepository.createDeviceDocument(objectId, body.sensor, default_Humidity);
  }
  catch
  {
    throw errorMessages.device.exists;
  }
};

const getDevicesId = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id);
    return await deviceRepository.getDeviceDocumentByUserId(objectId);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const setDevice = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    const res = await deviceRepository.setDeviceByUserId(objectId, body.device);
    return res.acknowledged;
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const getUserId = async (device_id) => {
  try {
    return await deviceRepository.getUserIdByDeviceId(device_id);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

export default { getDevicesId, setDevice, createDevice, getUserId };
