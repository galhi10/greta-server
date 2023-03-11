import { sign } from "jsonwebtoken";
import { config } from "../config";

const generateJWT = (id) => {
  return sign(
    {
      user_id: id,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.exp }
  );
};

export default { generateJWT };