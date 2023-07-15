import password from "../utils/password";
import deviceRepository from "../dal/devicesRepository";
import irrigationRepository from "./irrigationService";
import configRepository from "../dal/configRepository";
import weatherAPI from "../services/weatherApi";
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
    return await deviceRepository.createDeviceDocument(objectId, body.sensor, default_Humidity,);
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

const updateHumidity = async (sensor_id, humidity) => {
  try {
    const res = await deviceRepository.setHumidityBySensorId(sensor_id, humidity);
    if (res) {
      return {
        time: 0,
        state: "HourlyUpdate"
      };
    }
  } catch (err) {
    throw err;
  }
};

const startIrrigation = async (sensor_id, humidity, _irrigation_time, _irrigation_volume, user_id) => {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const body = {
      user_id: user_id,
      schedule: {
        date: new Date().toLocaleDateString('en-US', options),
        time: new Date().toLocaleTimeString(),
        status: "Active",
        start_humidity: humidity,
        end_humidity: 0,
        irrigation_time: _irrigation_time,
        irrigation_volume: _irrigation_volume
      }
    };
    const res = await irrigationRepository.pushIrregSec(body);
    if (res) {
      return {
        time: _irrigation_time,
        state: "StartIrrigation"
      };
    }
  } catch (err) {
    throw err;
  }
};

const endIrrigation = async (humidity, user_id) => {
  try {
    const body = {
      user_id: user_id,
      schedule: {
        status: "InActive",
        end_humidity: humidity,
      }
    };
    const res = irrigationRepository.updateExistsIrregSec(body);
    if (res) {
      return {
        time: 0,
        state: "EndIrrigation"
      };
    }
  } catch (err) {
    throw err;
  }
};

const callIrrigationAlgo = async (sensor_id, humidity, state, _irrigation_time, _irrigation_volume, user_id) => {
  try {
    if (state === "HourlyUpdate") {
      return await updateHumidity(sensor_id, humidity);
    } else if (state === "StartIrrigation") {
      return await startIrrigation(sensor_id, humidity, _irrigation_time, _irrigation_volume, user_id);
    } else if (state === "EndIrrigation") {
      await updateHumidity(sensor_id, humidity);
      return await endIrrigation(humidity, user_id);
    }
  } catch (err) {
    throw err;
  }
};


const setValuesForIrrigationAlgo = async (sensor_id, humidity, _state, _irrigation_time, _irrigation_volume) => {
  try {
    console.log("_state: ", _state);
    const device = await deviceRepository.getDeviceDocumentById(sensor_id);
    const willItRain = await weatherAPI.GetItWillRainByHour(device.sensor.location_city, device.sensor.location_country, 12);
    let deviceNextState = "HourlyUpdate";
    if (humidity < 30 && willItRain == false && _state == "HourlyUpdate") {
      deviceNextState = "StartIrrigation";
    }
    else if (_state == "StartIrrigation" && device.sensor.mode == "Automatic") {
      deviceNextState = "EndIrrigation";
    }
    else if (_state == "EndIrrigation") {
      deviceNextState = "HourlyUpdate";
    }
    return await callIrrigationAlgo(sensor_id, humidity, deviceNextState, _irrigation_time, _irrigation_volume, userId);
  }
  catch (err) {
    throw err;
  }
};

const setHumidity = async (body) => {
  try {
    const isExs = await deviceRepository.isDeviceExistsBySensorId(body.sensor_id);
    if (isExs) {
      return await setValuesForIrrigationAlgo(body.sensor_id, body.humidity, body.state, "40", 3);
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
