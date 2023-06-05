import password from "../utils/password";
import irrigationRepository from "../dal/irrigationRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'

const default_irrigation_schedule = [
  {
    date: "",
    time: "",
    status: "",
    humidity: 0,
  },
];

const getIrregSec = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    return await irrigationRepository.getIrregSecDocByUserId(objectId);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const pushIrregSec = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    const res = await irrigationRepository.pushIrrigSchedByUserId(objectId, body.schedule);
    return res.acknowledged;
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const getIrregGroupAVGWatering = async (_location, _ground, _grass, _light, _evaporation) => {
  try {
    return await irrigationRepository.getAVGLiterPerSQMByParams(_location, _ground, _grass, _light, _evaporation);
  }
  catch
  {
    throw errorMessages.IrrigationGroupData.notExist;
  }
};

const updateExistsIrregSec = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    const res = await irrigationRepository.updateEndIrrigHumidity(objectId, body.schedule.end_humidity,body.schedule.status);
    return res;
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const setIrregGroupAVGWatering = async (_location, _ground, _grass, _light, _evaporation, _water_per_sqm) => {
  try {
    const reqStatus = await irrigationRepository.setAVGLiterPerSQMByParams(_location, _ground, _grass, _light, _evaporation, _water_per_sqm);
    if (reqStatus) {
      return reqStatus;
    }
    const res = await irrigationRepository.createAVGIrregFiled({ location: _location, ground: _ground, grass: _grass, light: _light, evaporation: _evaporation, water_per_sqm: _water_per_sqm, updates: 0 });
    return res.acknowledged;
  }
  catch
  {
    throw errorMessages.IrrigationGroupData.generalFailure;
  }
};

export default { updateExistsIrregSec, getIrregSec, pushIrregSec, getIrregGroupAVGWatering, setIrregGroupAVGWatering };