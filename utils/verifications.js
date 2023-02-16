const user_status = require("../utils/user_status");

const userInfo = (body) => {
  let verify = { verified: false };

  if (isUndefined(body.full_name)) {
    verify.msg = "invalid full name";
    return verify;
  }
  if (isUndefined(body.email || !isEmail(body.email))) {
    verify.msg = "invalid email";
    return verify;
  }
  if (isUndefined(body.password) || typeof body.password !== "string") {
    verify.msg = "invalid password";
    return verify;
  }

  verify.verified = true;
  return verify;
};

const messageInfo = (body) => {
  let verify = { verified: false };

  if (isUndefined(body.text)) {
    verify.msg = "invalid text";
    return verify;
  }
  if (
    isUndefined(body.user_id) ||
    isNaN(body.user_id) ||
    isNaN(parseInt(body.user_id))
  ) {
    verify.msg = "invalid user id";
    return verify;
  }

  verify.verified = true;
  return verify;
};

const postInfo = (body) => {
  let verify = { verified: false };

  if (isUndefined(body.text)) {
    verify.msg = "invalid text";
    return verify;
  }

  verify.verified = true;
  return verify;
};

const changeStatusInfo = (body) => {
  let verify = { verified: false };

  if (isUndefined(body.user_id) || isNaN(body.user_id)) {
    verify.msg = "invalid user id";
    return verify;
  }
  if (isUndefined(body.status) || !isValidStatus(body.status)) {
    verify.msg = "invalid status";
    return verify;
  }

  verify.verified = true;
  return verify;
};

const isEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isUndefined = (text) => {
  return text === undefined || text === null;
};

const isValidStatus = (status) => {
  return status == user_status.active
    ? true
    : status == user_status.deleted
    ? true
    : status == user_status.created
    ? true
    : status == user_status.suspended
    ? true
    : false;
};

const isValidPostId = (id) => {
  let verify = { verified: false };

  if (isUndefined(id) || isNaN(id)) {
    verify.msg = "invalid id";
    return verify;
  }

  verify.verified = true;
  return verify;
};

module.exports = {
  userInfo,
  isEmail,
  isValidStatus,
  messageInfo,
  postInfo,
  changeStatusInfo,
  isValidPostId,
};
