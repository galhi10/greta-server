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

async function getAVGIrregSQMAndIdByParams(_location, _ground, _grass, _light, _evaporation) {
  const avgIrreg = await irrigationGroupsModel.findOne({
    location: _location,
    ground: _ground,
    grass: _grass,
    light: _light,
    evaporation: _evaporation,
  });
  return { _id: avgIrreg._id, liter_per_sqm: avgIrreg.liter_per_sqm };
}

async function pushIrrigSchedByUserId(_user_id, new_irreg_sec) {
  const user = await irrigationScheduleModel.findOne({ user_id: _user_id });
  if (user.irrigation_schedule.length > 5) {
    await irrigationScheduleModel.updateOne(
      { user_id: _user_id },
      { $pop: { irrigation_schedule: -1 } }
    );
  }
  return await irrigationScheduleModel.updateOne(
    { user_id: _user_id },
    { $push: { irrigation_schedule: new_irreg_sec } }
  );
}

async function setAVGIrregSQMById(irreg_id, _water_per_sqm) {
  newvalues = {
    $set: {
      water_per_sqm: _water_per_sqm,
    },
  };
  const id = { _id: irreg_id };
  return await irrigationGroupsModel.updateOne(id, newvalues);
}

async function createAVGIrregFiled(default_irreg_group) {
  return await irrigationGroupsModel.create(default_irreg_group);
}

async function createIrrigationScheduleDocument(_user_id, default_irrigation_schedule) {
  return await irrigationScheduleModel.create({
    user_id: _user_id,
    schedule: default_irrigation_schedule,
  });
}

export default {
  createAVGIrregFiled,
  createIrrigationScheduleDocument,
  getIrregSecDocByUserId,
  getAVGIrregDocByParams,
  getAVGIrregSQMAndIdByParams,
  pushIrrigSchedByUserId,
  setAVGIrregSQMById,
};
