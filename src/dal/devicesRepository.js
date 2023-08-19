import devicesModel from "./models/devices";

async function getDeviceObjectByUserId(user_objectId) {
  const user_Sensor = await devicesModel.findOne({
    user_id: user_objectId,
  });
  return user_Sensor.Sensor;
}

async function getUserIdByDeviceId(Device_Id) {
  const user = await devicesModel.findOne({
    "config.id": Device_Id
  });
  return user.user_id;
}

async function getDeviceDocumentByUserId(_user_id) {
  return await devicesModel.find({
    user_id: _user_id,
  });
}

async function getDeviceDocumentById(Device_Id) {
  return await devicesModel.findOne({
    "config.id": Device_Id
  });
}

async function isDeviceExistsBySensorId(Device_Id) {
  return await devicesModel.findOne({
    "config.id": Device_Id
  });
}

async function isDeviceExistsBySensorAndUserId(Device_Id, _user_id) {
  return await devicesModel.findOne({
    user_id: _user_id,
    "config.id": Device_Id
  });
}

async function isDeviceExistsByMongoId(mongo_id) {
  return await devicesModel.findOne({
    _id: mongo_id,
  });
}

async function deleteDeviceByMongoAndUserId(_user_id, mongo_id) {
  return await devicesModel.deleteOne({
    _id: mongo_id,
    user_id: _user_id
  });
}

async function setDeviceByUserId(config_id, _config) {
  const newvalues = {
    $set: {
      config: _config,
    },
  };
  const sensor = { "config.id": config_id };
  return await devicesModel.updateOne(sensor, newvalues);
}

async function setDeviceByConfigId(config_id, _config) {
  const newvalues = {
    $set: {
      config: _config,
    },
  };
  const sensor = { "_id": config_id };
  return await devicesModel.updateOne(sensor, newvalues);
}

async function setHumidityBySensorId(sensor_id, _humidity) {
  const newvalues = {
    $set: {
      humidity: _humidity,
    },
  };
  const sensor = { "config.id": sensor_id };
  return await devicesModel.updateOne(sensor, newvalues);
}

async function createDeviceDocument(_user_id, _humidity, _config) {
  const res = await devicesModel.create({
    user_id: _user_id,
    humidity: _humidity,
    config: _config,
  });
}

export default {
  createDeviceDocument,
  getDeviceObjectByUserId,
  getDeviceDocumentByUserId,
  setDeviceByUserId,
  getUserIdByDeviceId,
  isDeviceExistsBySensorId,
  setHumidityBySensorId,
  isDeviceExistsBySensorAndUserId,
  deleteDeviceByMongoAndUserId,
  isDeviceExistsByMongoId,
  getDeviceDocumentById,
  setDeviceByConfigId,
};
