import configurationModel from "./models/configuration";

async function getConfigDcByUserId(user_objectId) {
  const user_Config = await configurationModel.findOne({
    user_id: user_objectId,
  });
  return user_Config.config;
}

async function getCityByUserId(user_objectId) {
  const user_Config = await configurationModel.findOne({
    user_id: user_objectId,
  });
  return user_Config.config.city;
}

async function getConfigDocByUserId(_user_id) {
  return await configurationModel.findOne({
    user_id: _user_id,
  });
}

async function setConfigDocByUserId(_user_id, _config) {
  const newvalues = {
    $set: {
      config: _config,
    },
  };
  const user = { user_id: _user_id };
  return await configurationModel.updateOne(user, newvalues);
}

async function createConfigDocument(_user_id, default_config) {
  return await configurationModel.create({
    user_id: _user_id,
    config: default_config,
  });
}

export default {
  createConfigDocument,
  getConfigDcByUserId,
  getConfigDocByUserId,
  setConfigDocByUserId,
  getCityByUserId,
};
