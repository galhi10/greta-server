const send = (res, data) => {
  res.statusCode = data.status_code == undefined ? 200 : data.status_code;
  res.send(data);
};

const response = (response_data, status_code) => {
  return { data: response_data, status_code: status_code };
};

const error = (msg, status_code) => {
  return { error_msg: msg, status_code: status_code };
};

module.exports = { send, response, error };
