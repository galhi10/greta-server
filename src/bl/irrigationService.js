import password from "../utils/password";
import userRepository from "../dal/irrigationRepository";
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
    return await userRepository.getIrregSecDocByUserId(objectId);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

const pushIrregSec = async (body) => {
  try {
    const objectId = new ObjectId(body.user_id)
    console.log(body.schedule);
    return await userRepository.pushIrrigSchedByUserId(objectId, body.schedule);
  }
  catch
  {
    throw errorMessages.user.badUserID;
  }
};

export default { getIrregSec, pushIrregSec };
