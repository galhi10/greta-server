const bcrypt = require("bcrypt");

const encrypt = async (password) => {
  return await bcrypt.hash(password, 10);
};

const decrypt = async (password, encryptedPassword) => {
  return await bcrypt.compare(password, encryptedPassword);
};

module.exports = { encrypt, decrypt };
