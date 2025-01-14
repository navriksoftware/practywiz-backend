import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.SQL_AZURE_USERNAME,
  password: process.env.SQL_AZURE_PWD,
  database: process.env.SQL_AZURE_DATABASE,
  server: process.env.SQL_AZURE_SERVER,
};
export default config;
