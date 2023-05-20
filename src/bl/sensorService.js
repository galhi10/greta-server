import password from "../utils/password";
import sensorRepository from "../dal/sensorRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'

const default_Sensor = {
  id: -1,
};

const createSensor = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    return await sensorRepository.createSensorDocument(objectId, default_Sensor);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const getSensor = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id);
    return await sensorRepository.getSensorDocumentByUserId(objectId);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const setSensor = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    const res = await sensorRepository.setSensorByUserId(objectId, body.Sensor);
    return res.acknowledged;
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

export default { getSensor, setSensor, createSensor };
