import password from "../utils/password";
import userRepository from "../dal/userRepository";
import configRepository from "../dal/configRepository";
import irrigationRepository from "../dal/irrigationRepository";
import { errorMessages } from "../utils/errorMessages";
import auth from "../services/auth";
import { ObjectId } from "mongodb";

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
      const resConfig = await configRepository.createConfigDocument(
        userid,
        default_config
      );
      const resIrregation =
        await irrigationRepository.createIrrigationScheduleDocument(
          userid,
          default_irrigation_schedule
        );
      console.log(resIrregation);
    }
  } catch (err) {
    return { ok: false };
  }
  return { ok: true };
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

const updateUser = async (body) => {
  body.password = await password.encrypt(body.password.toString());
  if (!body.password) {
    body.password = undefined;
  }

  const res = await userRepository.updateUser(
    body.userId,
    body.password,
    body.first_name,
    body.lst_name
  );
  console.log(res);
  if (res) {
    return {
      ok: true,
    };
  } else {
    throw errorMessages.user.badEmailOrPassword;
  }
};

const getUser = async (userId) => {
  const user = await userRepository.getUserById(userId);
  if (user) {
    return { ok: true, data: user };
  } else {
    return { ok: false, message: "User not found" };
  }
};

export default { login, createUser, updateUser, getUser };
