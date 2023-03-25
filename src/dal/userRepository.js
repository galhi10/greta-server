import { login_Info_DB,Configuration_DB,Irrigation_Schedule_DB,AVG_Irrigation_DB,mongoose } from "../services/mongoose";
import { ObjectId } from 'mongodb'

async function getUserByEmail(_email) {
  return await login_Info_DB.findOne({
    email: _email,
  });
}

async function getUserById(_user_id) {
  return await login_Info_DB.findOne({
    _id: _user_id,
  });
}

async function getConfigDcByUserId(user_objectId) {
  return await Configuration_DB.findOne({
    user_id: user_objectId,
  });
}

async function getIrregSecDocByUserId(_user_id) {
    return await Irrigation_Schedule_DB.findOne({
      user_id: _user_id,
    });
  }

  async function getConfigDocByUserId(_user_id) {
    return await Configuration_DB.findOne({
      user_id: _user_id,
    });
  }

  async function getAVGIrregDocByParams(_location,_ground ,_grass, _light, _evaporation) {
    return await AVG_Irrigation_DB.findOne({
      location:_location,
      ground: _ground,
      grass:_grass, 
      light:_light,
      evaporation:_evaporation,
    });
  }

  async function getAVGIrregSQMAndIdByParams(_location,_ground ,_grass, _light, _evaporation) {
    const avgIrreg = await AVG_Irrigation_DB.findOne({
      location:_location,
      ground: _ground,
      grass:_grass, 
      light:_light,
      evaporation:_evaporation,
    });
    return {_id: avgIrreg._id, liter_per_sqm: avgIrreg.liter_per_sqm};
  }

  async function pushIrrigSchedByUserId(_user_id, new_irreg_sec) {
    const user = await Irrigation_Schedule_DB.findOne({ user_id: _user_id });
    if (user.irrigation_schedule.length > 5) {
      await Irrigation_Schedule_DB.updateOne(
        { user_id: _user_id },
        { $pop: { irrigation_schedule: -1 } }
      );
    }
    return await Irrigation_Schedule_DB.updateOne(
      { user_id: _user_id },
      { $push: { irrigation_schedule: new_irreg_sec } }
    );
  }

async function setConfigDocByUserId(_user_id,_config) {

      const newvalues = {
        $set: {
          config : _config,
        },
      };
      const user = { user_id: _user_id };
      return await Configuration_DB.updateOne(user, newvalues);
  }

  async function setAVGIrregSQMById(irreg_id, _water_per_sqm) {
    newvalues = {
      $set: {
        water_per_sqm: _water_per_sqm,
      },
    };
    const id = { _id: irreg_id };
    return await AVG_Irrigation_DB.updateOne(id, newvalues);
  }

  async function createAVGIrregFiled(default_irreg_group) {
    return await AVG_Irrigation_DB.insertOne(default_irreg_group);
  }

  async function createConfigDocument(_user_id,default_config) {
    return await Configuration_DB.insertOne({
      user_id: _user_id,
      config: default_config,
    });
  }

  async function createIrrigationScheduleDocument(_user_id, default_irrigation_schedule) {
    return await Irrigation_Schedule_DB.insertOne({
      user_id: _user_id,
      irrigation_schedule: default_irrigation_schedule,
    });
  }
  
async function createNewUser(_email, _password, _first_name, _last_name) {
  return await login_Info_DB.insertOne({
    email: _email,
    password: _password,
    first_name: _first_name,
    last_name: _last_name,
  });
}


export default {
  createNewUser,
  createAVGIrregFiled,
  createConfigDocument,
  createIrrigationScheduleDocument,
  getUserByEmail,
  getUserById,
  getConfigDcByUserId,
  getIrregSecDocByUserId,
  getConfigDocByUserId,
  getAVGIrregDocByParams,
  getAVGIrregSQMAndIdByParams,
  pushIrrigSchedByUserId,
  setConfigDocByUserId,
  setAVGIrregSQMById,
};
