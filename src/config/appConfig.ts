import { DataSource } from 'typeorm';

export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
});
