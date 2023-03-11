import { hash, compare } from "bcrypt";

const encrypt = async (password) => {
  return await hash(password, 10);
};

const decrypt = async (password, encryptedPassword) => {
  return await compare(password, encryptedPassword);
};

export default { encrypt, decrypt };
