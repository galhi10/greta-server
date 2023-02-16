const jwt = require("jsonwebtoken");
const config = require("../../config");
const STATUS = require("../../utils/status_codes");
const query = require("../../actions/query");
const response = require("../../utils/response");
const server_messages = require("../../utils/server_messages");

const authenticateUser = async (req, res, next) => {
  // gets the token
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1];

  jwt.verify(token, config.jwt.secret, async (err, user_payload) => {
    // forbidden
    if (err) {
      res.statusCode = STATUS.FORBIDDEN;
      return;
    }
    // gets the user id for user validations
    req.payload = user_payload;
  });
  if (res.statusCode != STATUS.FORBIDDEN) {
    const users = await query.getAllUsers();
    const index = query.findUserById(users, req.payload.user_id);
    if (!users[index].logged_in) {
      res.statusCode = STATUS.FORBIDDEN;
    }
  }
  next();
};

const authenticateAdmin = async (res, payload) => {
  if (payload !== undefined && res.statusCode != STATUS.FORBIDDEN) {
    if (query.isAdminId(payload.user_id)) res.statusCode = STATUS.OK;
    else res.statusCode = STATUS.UNAUTHORIZED;
  }
  if (res.statusCode == STATUS.UNAUTHORIZED) {
    response.send(
      res,
      response.error(server_messages.UNAUTHORIZED, STATUS.UNAUTHORIZED)
    );
  } else if (res.statusCode == STATUS.FORBIDDEN) {
    response.send(
      res,
      response.error(server_messages.FORBIDDEN, STATUS.FORBIDDEN)
    );
  } else {
    if (res.statusCode != 200) console.log(res.statusCode);
  }
};

module.exports = { authenticateUser, authenticateAdmin };
