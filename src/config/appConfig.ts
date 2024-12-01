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
  mailer: {
    host: process.env.NODE_MAILER_HOST,
    service: process.env.NODE_MAILER_SERVICE,
    port: process.env.NODE_MAILER_PORT,
    ssl: process.env.NODE_MAILER_SSL,
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
});
