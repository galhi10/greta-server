import password from "../utils/password";
import deviceRepository from "../dal/devicesRepository";
import irrigationRepository from "./irrigationService";
import configRepository from "../dal/configRepository";
import weatherAPI from "../services/weatherApi";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'
import { Console } from "winston/lib/winston/transports";

const MinHumidity = 30;
const RainForecastHours = 12;

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

const startIrrigation = async (_sensor_name, humidity, _irrigation_time, _irrigation_volume, user_id) => {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const body = {
      user_id: user_id,
      schedule: {
        sensor_name: _sensor_name,
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

const callIrrigationAlgo = async (sensor_name, sensor_id, humidity, state, _irrigation_time, _irrigation_volume, user_id) => {
  try {
    const res = await updateHumidity(sensor_id, humidity);
    if (state === "StartIrrigation") {
      return await startIrrigation(sensor_name, humidity, _irrigation_time, _irrigation_volume, user_id);
    } else if (state === "EndIrrigation") {
      return await endIrrigation(humidity, user_id);
    }
    return res;
  } catch (err) {
    throw err;
  }
};

const setValuesForIrrigationAlgo = async (userConfig, device, humidity, state) => {
  try {
    const willItRain = await weatherAPI.GetItWillRainByHour(userConfig.config.city, userConfig.config.country, RainForecastHours);
    let deviceNextState = "HourlyUpdate";
    if (device.config.mode == "Automatic") {
      if (humidity < MinHumidity && willItRain == false && state == "HourlyUpdate") {
        deviceNextState = "StartIrrigation";
      }
      else if (state == "StartIrrigation") {
        deviceNextState = "EndIrrigation";
      }
      else if (state == "EndIrrigation") {
        deviceNextState = "HourlyUpdate";
      }
    }
    return await callIrrigationAlgo(device.config.name, device.config.id, humidity, deviceNextState, 40, 3, device.user_id);
  }
  catch (err) {
    throw err;
  }
};

const setHumidity = async (body) => {
  try {
    const isExs = await deviceRepository.isDeviceExistsBySensorId(body.config_id);
    const userConfig = await configRepository.getConfigDcByUserId(body.user_id);
    const device = await deviceRepository.getDeviceDocumentById(sensor_id);
    if (isExs && userConfig && device) {
      return await setValuesForIrrigationAlgo(userConfig, device, body.humidity, body.state);
    }
    else {
      throw errorMessages.device.notExist;
    }
  }
  catch (err) {
    throw err;
  }
};
export default { setHumidity };

