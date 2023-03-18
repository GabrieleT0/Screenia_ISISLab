import { Sequelize } from 'sequelize';

const database = new Sequelize('screeniadb', 'gerardo99', 'Gerardo4599.', {
    host: 'localhost',
    dialect: 'mysql',
    logging: true
});

export {
    database
}