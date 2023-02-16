const router = require("express").Router();
const verify = require("../utils/verifications");
const response = require("../utils/response");
const STATUS = require("../utils/status_codes");
const general = require("../utils/general");
const user_status = require("../utils/user_status");
const manage_users = require("../manage/users");
const auth = require("../services/jwt/auth");
const server_messages = require("../utils/server_messages");

router.put("/create", (req, res) => {
  const body = {
    full_name: req.body.full_name,
    email: req.body.email,
    password: req.body.password,
    creation_date: general.date(),
    status: user_status.created,
    is_admin: false,
    logged_in: false,
  };

  const isVerified = verify.userInfo(body);
  if (!isVerified.verified) {
    response.send(
      res,
      response.error(
        server_messages.USER_REGISTRATION_FAILED + isVerified.msg,
        STATUS.BAD_REQUEST
      )
    );
  } else {
    manage_users.createUser(body).then((dataResponse) => {
      response.send(res, dataResponse);
    });
  }
});

router.post("/login", async (req, res) => {
  const body = {
    email: req.body.email,
    password: req.body.password,
  };

  const validEmail = verify.isEmail(body.email);
  if (!validEmail) {
    response.send(
      res,
      response.error(
        server_messages.USER_LOGIN_FAILED + server_messages.BAD_EMAIL,
        STATUS.BAD_REQUEST
      )
    );
  } else {
    await manage_users.login(body).then((dataResponse) => {
      response.send(res, dataResponse);
    });
  }
});

router.post("/logout", auth.authenticateUser, async (req, res) => {
  if (res.statusCode == STATUS.OK) {
    await manage_users.logout(req.payload.user_id).then((dataResponse) => {
      response.send(res, dataResponse);
    });
    // can only be forbidden
  } else {
    response.send(
      res,
      response.error(server_messages.FORBIDDEN, res.statusCode)
    );
  }
});

router.put("/post", auth.authenticateUser, async (req, res) => {
  const body = {
    text: req.body.text,
  };

  const isVerified = verify.postInfo(body);

  if (res.statusCode == STATUS.OK && isVerified.verified) {
    await manage_users
      .savePost(body.text, req.payload.user_id)
      .then((dataResponse) => {
        response.send(res, dataResponse);
      });
  } else if (res.statusCode == STATUS.FORBIDDEN) {
    response.send(
      res,
      response.error(server_messages.FORBIDDEN, res.statusCode)
    );
  } else {
    response.send(
      res,
      response.error(
        server_messages.POST_SEND_FAILED + isVerified.msg,
        STATUS.BAD_REQUEST
      )
    );
  }
});

router.put("/message", auth.authenticateUser, async (req, res) => {
  const body = {
    user_id: req.body.user_id,
    text: req.body.text,
  };

  const isVerified = verify.messageInfo(body);

  if (typeof body.user_id == "string") body.user_id = parseInt(body.user_id);

  if (res.statusCode == STATUS.OK && isVerified.verified) {
    await manage_users
      .sendMessage(body, req.payload.user_id)
      .then((dataResponse) => {
        response.send(res, dataResponse);
      });
  } else if (res.statusCode == STATUS.FORBIDDEN) {
    response.send(
      res,
      response.error(server_messages.FORBIDDEN, res.statusCode)
    );
  } else {
    response.send(
      res,
      response.error(
        server_messages.MESSAGE_SEND_FAILED + isVerified.msg,
        STATUS.BAD_REQUEST
      )
    );
  }
});

router.get("/get/messages", auth.authenticateUser, async (req, res) => {
  if (res.statusCode == STATUS.OK) {
    await manage_users
      .getAllUserMessages(req.payload.user_id)
      .then((dataResponse) => {
        response.send(res, dataResponse);
      });
    // can only be forbidden
  } else {
    response.send(
      res,
      response.error(server_messages.FORBIDDEN, res.statusCode)
    );
  }
});

router.get("/get/posts", auth.authenticateUser, async (req, res) => {
  if (res.statusCode == STATUS.OK) {
    await manage_users.getAllPosts().then((dataResponse) => {
      response.send(res, dataResponse);
    });
    // can only be forbidden
  } else {
    response.send(
      res,
      response.error(server_messages.FORBIDDEN, res.statusCode)
    );
  }
});

router.get("/get/users", auth.authenticateUser, async (req, res) => {
  if (res.statusCode == STATUS.OK) {
    await manage_users.getAllUsers().then((dataResponse) => {
      response.send(res, dataResponse);
    });
    // can only be forbidden
  } else {
    response.send(
      res,
      response.error(server_messages.FORBIDDEN, res.statusCode)
    );
  }
});

router.delete("/delete/user", auth.authenticateUser, async (req, res) => {
  if (res.statusCode == STATUS.OK) {
    await manage_users.deleteUser(req.payload.user_id).then((dataResponse) => {
      response.send(res, dataResponse);
    });
    // can only be forbidden
  } else {
    response.send(
      res,
      response.error(server_messages.FORBIDDEN, res.statusCode)
    );
  }
});

module.exports = router;
