import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV as string,
    port: process.env.PORT as string,
    database_url: process.env.DATABASE_URL as string,
    ADMIN_PASSWORD : process.env.ADMIN_PASSWORD as string,
    ADMIN_EMAIL :process.env.ADMIN_EMAIL as string,
    JWT_SECRET : process.env.JWT_SECRET as string,
    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND as string),
}