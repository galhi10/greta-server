import devicesModel from "./models/devices";

async function getDeviceObjectByUserId(user_objectId) {
  const user_Sensor = await devicesModel.findOne({
    user_id: user_objectId,
  });
  return user_Sensor.Sensor;
}

async function getUserIdByDeviceId(_sensor_id) {
  const sensor = await devicesModel.findOne({
    sensor: { id: _sensor_id },
  });
  return sensor.user_id;
}
async function getDeviceDocumentByUserId(_user_id) {
  return await devicesModel.find({
    user_id: _user_id,
  });
}

async function isDeviceExistsBySensorId(Device_Id) {
  return await devicesModel.findOne({
    "sensor.id": Device_Id
  });
}

async function setDeviceByUserId(_user_id, _Sensor) {
  const newvalues = {
    $set: {
      sensor: _Sensor,
    },
  };
  console.log(newvalues);
  const user = { user_id: _user_id };
  return await devicesModel.updateOne(user, newvalues);
}

async function setHumidityUserId(_user_id, _Sensor) {
  const newvalues = {
    $set: {
      sensor: _Sensor,
    },
  };
  console.log(newvalues);
  const user = { user_id: _user_id };
  return await devicesModel.updateOne(user, newvalues);
}

async function createDeviceDocument(_user_id, default_Sensor, _humidity) {
  const res = await devicesModel.create({
    user_id: _user_id,
    sensor: default_Sensor,
    humidity: _humidity,
  });
}

export default {
  createDeviceDocument,
  getDeviceObjectByUserId,
  getDeviceDocumentByUserId,
  setDeviceByUserId,
  getUserIdByDeviceId,
  isDeviceExistsBySensorId,
};
