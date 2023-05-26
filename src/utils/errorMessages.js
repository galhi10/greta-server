export const errorMessages = {
  user: {
    notExist: { status: 400, message: "User does not exists" },
    exists: { status: 400, message: "The user already exists" },
    badEmailOrPassword: { status: 400, message: "Bad email or password" },
    badUserID: { status: 400, message: "User id is not exists" },
  },
  device: {
    exists: { status: 400, message: "The sensor id already exists" },
    notExist: { status: 400, message: "The sensor does not exists" },
    generalFailure: { status: 400, message: "General Failure" },
  },

  IrrigationGroupData: {
    notExist: { status: 400, message: "Table is not exist" },
    generalFailure: { status: 400, message: "General Failure" },
  },
};
