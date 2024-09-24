require('dotenv').config()

export default {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    synchronize: process.env.NODE_ENV !== 'production'
}