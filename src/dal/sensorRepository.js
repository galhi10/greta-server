import sensorModel from "./models/sensor";

async function getSensorObjectByUserId(user_objectId) {
  const user_Sensor = await sensorModel.findOne({
    user_id: user_objectId,
  });
  return user_Sensor.Sensor;
}
async function getSensorDocumentByUserId(_user_id) {
  return await sensorModel.findOne({
    user_id: _user_id,
  });
}

async function setSensorByUserId(_user_id, _Sensor) {
  const newvalues = {
    $set: {
      Sensor: _Sensor,
    },
  };
  const user = { user_id: _user_id };
  return await sensorModel.updateOne(user, newvalues);
}

async function createSensorDocument(_user_id, default_Sensor) {
  return await sensorModel.create({
    user_id: _user_id,
    sensor: default_Sensor,
  });
}

export default {
  createSensorDocument,
  getSensorObjectByUserId,
  getSensorDocumentByUserId,
  setSensorByUserId,
};
