import password from "../utils/password";
import deviceRepository from "../dal/devicesRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'
import { Console } from "winston/lib/winston/transports";

const default_Device =
{
  id: -1,
  location: "",
  model: "",
};

const default_Humidity = 0;

const createDevice = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    const isExs = await deviceRepository.isDeviceExistsBySensorAndUserId(body.sensor.id, objectId);
    if (isExs) {
      throw errorMessages.device.exists;
    }
    return await deviceRepository.createDeviceDocument(objectId, body.sensor, default_Humidity);
  }
  catch (err) {
    throw err;
  }
};

const deleteDevice = async (body) => {
  try {
    const userId = new ObjectId(body.user_id)
    const mongoId = new ObjectId(body.id)
    const isExs = await deviceRepository.isDeviceExistsByMongoId(mongoId);
    if (isExs) {
      return await deviceRepository.deleteDeviceByMongoAndUserId(userId, mongoId);
    }
    else {
      throw errorMessages.device.notExist;
    }
  }
  catch (err) {
    throw err;
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
    const isExs = await deviceRepository.isDeviceExistsBySensorAndUserId(body.sensor.id, body.user_id);
    if (isExs) {
      throw errorMessages.device.exists;
    }
    const objectId = new ObjectId(body.user_id)
    const res = await deviceRepository.setDeviceByUserId(body.sensor.id, body.sensor);
    return res;
  }
  catch (err) {
    throw err;
  }
};

const callIrrigationAlgo = async (body) => {
  try {
    return { time: 30 };
  }
  catch (err) {
    throw err;
  }
};

const setHumidity = async (body) => {
  try {
    const isExs = await deviceRepository.isDeviceExistsBySensorId(body.sensor_id);
    if (isExs) {
      await deviceRepository.setHumidityBySensorId(body.sensor_id, body.humidity);
      return await callIrrigationAlgo(body.sensor_id, body.humidity);
    }
    else {
      throw errorMessages.device.notExist;
    }
  }
  catch (err) {
    throw err;
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

export default { getDevicesId, setDevice, createDevice, getUserId, setHumidity, deleteDevice };
