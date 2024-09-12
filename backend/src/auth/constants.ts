import * as dotenv from 'dotenv';
dotenv.config();
export const jwtConstants = {
  secret: process.env.JWT_ACCESS_SECRET,
  accessExpiry: process.env.JWT_ACCESS_EXPIRY,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY,
  nodeEnv: process.env.NODE_ENV,
};
