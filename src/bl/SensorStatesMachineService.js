import password from "../utils/password";
import deviceRepository from "../dal/devicesRepository";
import irrigationRepository from "./irrigationService";
import configRepository from "../dal/configRepository";
import weatherAPI from "../services/weatherApi";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'
import { Console } from "winston/lib/winston/transports";

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

const startIrrigation = async (_sensor_name, humidity, _irrigation_time, _irrigation_volume, user_id, _max_humidity) => {
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
        max_humidity: _max_humidity,
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

const callIrrigationAlgo = async (sensor_name, sensor_id, humidity, state, Pump_Volume, user_id, size, userConfig, max_humidity) => {
  try {
    const res = await updateHumidity(sensor_id, humidity);
    if (state === "StartIrrigation") {
      const evaporationParam = await weatherAPI.calculateEvaporationForLocation(userConfig.city, userConfig.country);
      const irrigation_Volume_Per_OneSQM = ((100 - humidity) / 20) * evaporationParam / 10;
      const total_Irrigation_Volume = irrigation_Volume_Per_OneSQM * size;
      const irrigation_time = Math.floor(((total_Irrigation_Volume / Pump_Volume) * 3));

      return await startIrrigation(sensor_name, humidity, irrigation_time, total_Irrigation_Volume, user_id, max_humidity);
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
    const willItRain = await weatherAPI.GetItWillRainByHour(userConfig.city, userConfig.country, RainForecastHours);
    let deviceNextState = "HourlyUpdate";
    if (device.config.mode == "Automatic") {
      if (humidity < device.config.min_humidity && willItRain == false && state == "HourlyUpdate") {
        deviceNextState = "StartIrrigation";
      }
      else if (state == "StartIrrigation") {
        deviceNextState = "EndIrrigation";
      }
      else if (state == "EndIrrigation") {
        deviceNextState = "HourlyUpdate";
      }
    }
    return await callIrrigationAlgo(device.config.name, device.config.id, humidity, deviceNextState, device.config.liters_per_minute, device.user_id, device.config.size, userConfig, device.config.max_humidity);
  }
  catch (err) {
    throw err;
  }
};

const setHumidity = async (body) => {
  if (!body.sensor_id) {
    throw errorMessages.device.notExist;
  }
  try {
    const isExs = await deviceRepository.isDeviceExistsBySensorId(body.sensor_id);
    const userConfig = await configRepository.getConfigDcByUserId(isExs.user_id);
    const device = await deviceRepository.getDeviceDocumentById(body.sensor_id);
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

