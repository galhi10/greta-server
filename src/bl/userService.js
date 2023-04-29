import password from "../utils/password";
import userRepository from "../dal/userRepository";
import configRepository from "../dal/configRepository";
import irrigationRepository from "../dal/irrigationRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from 'mongodb'

const default_config = {
  grass: "",
  mode: "",
  ground: "",
  location: "",
  size: 0,
  liters_per_minute: 0,
  light: "",
};

const default_irrigation_schedule = [
  {
    date: "",
    time: "",
    status: "",
    humidity: 0,
  },
];

const createUser = async (body) => {
  const user = await userRepository.getUserByEmail(body.email);
  if (user) {
    throw errorMessages.user.exists;
  }
  try {
    body.password = await password.encrypt(body.password.toString());
    const userid = await userRepository.createNewUser(
      body.email,
      body.password,
      body.firstName,
      body.lastName
    );
    if (userid) {
      const resConfig = await configRepository.createConfigDocument(userid, default_config);
      const resIrregation = await irrigationRepository.createIrrigationScheduleDocument(userid, default_irrigation_schedule);
      console.log(resIrregation);
    }
  }
  catch (err) {
    return { ok: false }
  }
  return { ok: true }
};

const login = async (body) => {
  const user = await userRepository.getUserByEmail(body.email);
  if (!user) {
    throw errorMessages.user.badEmailOrPassword;
  }
  const passwordVerified = await password.decrypt(body.password, user.password);
  if (passwordVerified) {
    return {
      ok: true,
      data: {
        token: auth.generateJWT(user.email, user.id),
      },
    };
  } else {
    throw errorMessages.user.badEmailOrPassword;
  }
};

const setPassword = async (body) => {
  body.password = await password.encrypt(body.password.toString());
  if (body.password) {
    const res = await userRepository.setPasswordByUserId(body.userid, body.password)
    console.log(res);
    return {
      ok: true,
    };
  } else {
    throw errorMessages.user.badEmailOrPassword;
  }
};

export default { login, createUser, setPassword };
