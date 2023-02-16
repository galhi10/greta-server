const router = require("express").Router();
const verify = require("../utils/verifications");
const response = require("../utils/response");
const manage_admin = require("../manage/admin");
const auth = require("../services/jwt/auth");
const server_messages = require("../utils/server_messages");
const STATUS = require("../utils/status_codes");

router.put("/users/status", auth.authenticateUser, async (req, res) => {
  await auth.authenticateAdmin(res, req.payload);

  const body = {
    user_id: req.body.user_id,
    status: req.body.status,
  };
  const isVerified = verify.changeStatusInfo(body);

  if (res.statusCode == STATUS.OK) {
    if (isVerified.verified) {
      manage_admin.changeUserStatus(body).then((dataResponse) => {
        response.send(res, dataResponse);
      });
    } else {
      response.send(
        res,
        response.error(
          server_messages.STATUS_CHANGE_FAILED + isVerified.msg,
          STATUS.BAD_REQUEST
        )
      );
    }
  }
});

router.put("/message", auth.authenticateUser, async (req, res) => {
  await auth.authenticateAdmin(res, req.payload);

  const body = {
    text: req.body.text,
  };

  if (res.statusCode == STATUS.OK) {
    const isVerified = verify.postInfo(body);
    if (isVerified.verified) {
      manage_admin.messageAllUsers(body.text).then((dataResponse) => {
        response.send(res, dataResponse);
      });
    } else {
      response.send(
        res,
        response.error(
          server_messages.MESSAGE_SEND_FAILED + isVerified.msg,
          STATUS.BAD_REQUEST
        )
      );
    }
  }
});

router.delete("/delete/post", auth.authenticateUser, async (req, res) => {
  await auth.authenticateAdmin(res, req.payload);

  const body = {
    post_id: req.body.post_id,
  };

  if (res.statusCode == STATUS.OK) {
    const isVerified = verify.isValidPostId(body.post_id);
    if (isVerified.verified) {
      manage_admin.deletePost(body.post_id).then((dataResponse) => {
        response.send(res, dataResponse);
      });
    } else {
      response.send(
        res,
        response.error(
          server_messages.POST_SEND_FAILED + isVerified.msg,
          STATUS.BAD_REQUEST
        )
      );
    }
  }
});

router.get("/get/users", auth.authenticateUser, async (req, res) => {
  await auth.authenticateAdmin(res, req.payload);
  if (res.statusCode == STATUS.OK) {
    await manage_admin.getAllUsers().then((dataResponse) => {
      response.send(res, dataResponse);
    });
  }
});
module.exports = router;
