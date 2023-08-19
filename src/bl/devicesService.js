import password from "../utils/password";
import deviceRepository from "../dal/devicesRepository";
import irrigationRepository from "./irrigationService";
import configRepository from "../dal/configRepository";
import weatherAPI from "../services/weatherApi";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'
import { Console } from "winston/lib/winston/transports";

const default_Humidity = 0;

const createDevice = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    const isExs = await deviceRepository.isDeviceExistsBySensorAndUserId(body.config.id, objectId);
    if (isExs) {
      throw errorMessages.device.exists;
    }
    return await deviceRepository.createDeviceDocument(objectId, default_Humidity, body.config);
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
    const isExs = await deviceRepository.isDeviceExistsBySensorAndUserId(body.config.id, body.user_id);
    if (!isExs) {
      throw errorMessages.device.exists;
    }
    const objectId = new ObjectId(body.user_id);
    const res = await deviceRepository.setDeviceByConfigId(body._id, body.config);
    return res;
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

export default { getDevicesId, setDevice, createDevice, getUserId, deleteDevice };
