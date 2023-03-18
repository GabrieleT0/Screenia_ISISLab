'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { default: config_db } = require('../config/config_db');
const initModels = require('./init-models');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(config_db.database, config_db.username, config_db.password, {
  host: config_db.host,
  dialect: config_db.dialect,
  port: config_db.port
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

db.sequelize = sequelize;
const models = initModels(db.sequelize);

module.exports = models;
module.exports.db = db;