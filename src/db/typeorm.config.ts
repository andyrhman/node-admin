import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

const myDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "ep-jolly-silence-67568407.ap-southeast-1.aws.neon.tech",
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USERNAME || "andyrhman",
    password: process.env.POSTGRES_PASSWORD || "MgrmhKt0W9qd",
    database: process.env.POSTGRES_DATABASE || "node_admin",
    entities: [
        "src/entity/*.entity.ts"
    ],
    logging: false,
    synchronize: process.env.NODE_ENV === 'development',
    migrations: [
        "src/db/migrations/*.ts"
    ],
    migrationsTableName: 'migrations',
    ssl: true
});

export default myDataSource;