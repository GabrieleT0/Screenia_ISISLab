const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('author_primary_literature', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "table_name_name_uindex"
    },
    it_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    en_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fr_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    de_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    insert_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    short_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'author_primary_literature',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "table_name_name_uindex",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
