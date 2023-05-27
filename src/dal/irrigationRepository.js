import irrigationScheduleModel from "./models/irrigation_schedule";
import irrigationGroupsModel from "./models/avg_irrigation_groups";

async function getIrregSecDocByUserId(_user_id) {
  const result = await irrigationScheduleModel.findOne({
    user_id: _user_id,
  });
  return result;
}

async function getAVGIrregDocByParams(_location, _ground, _grass, _light, _evaporation) {
  return await irrigationGroupsModel.findOne({
    location: _location,
    ground: _ground,
    grass: _grass,
    light: _light,
    evaporation: _evaporation,
  });
}

async function getAVGLiterPerSQMByParams(_location, _ground, _grass, _light, _evaporation) {
  const avgIrreg = await irrigationGroupsModel.findOne({
    location: _location,
    light: _light,
    grass: _grass,
    ground: _ground,
    evaporation: _evaporation,
  });
  if (avgIrreg) {
    return avgIrreg.liter_per_sqm;
  }
  return null;
}

async function setAVGLiterPerSQMByParams(_location, _ground, _grass, _light, _evaporation, _water_per_sqm) {
  const avgIrreg = await irrigationGroupsModel.findOne({
    location: _location,
    light: _light,
    grass: _grass,
    ground: _ground,
    evaporation: _evaporation,
  });
  if (avgIrreg) {
    const new_avg = (avgIrreg.updates * avgIrreg.liter_per_sqm + _water_per_sqm) / (avgIrreg.updates + 1)
    return await irrigationGroupsModel.updateOne(
      { liter_per_sqm: new_avg },
      { $inc: { updates: 1 } }
    );
  }
  return null;
}

const updateEndIrrigHumidity = async (userId, newEndHumidity) => {
  try {
    const user = await irrigationScheduleModel.findOne({ user_id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const lastScheduleIndex = user.schedule.length - 1;
    user.schedule[lastScheduleIndex].end_humidity = newEndHumidity;
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update last end_humidity: " + error.message);
  }
};

async function pushIrrigSchedByUserId(_user_id, new_irreg_sec) {
  const user = await irrigationScheduleModel.findOne({ user_id: _user_id });
  if (user.schedule.length > 6) {
    await irrigationScheduleModel.updateOne(
      { user_id: _user_id },
      { $pop: { schedule: -1 } }
    );
  }
  return await irrigationScheduleModel.updateOne(
    { user_id: _user_id },
    { $push: { schedule: new_irreg_sec } }
  );
}

async function createAVGIrregFiled(default_irreg_group) {
  return await irrigationGroupsModel.create(default_irreg_group);
}

async function createIrrigationScheduleDocument(_user_id, default_irrigation_schedule) {
  return await irrigationScheduleModel.create({
    user_id: _user_id,
  });
}

export default {
  createAVGIrregFiled,
  createIrrigationScheduleDocument,
  getIrregSecDocByUserId,
  getAVGIrregDocByParams,
  getAVGLiterPerSQMByParams,
  setAVGLiterPerSQMByParams,
  pushIrrigSchedByUserId,
  updateEndIrrigHumidity,
};
