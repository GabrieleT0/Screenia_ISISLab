const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('opera_primary_literature', {
    place_composition: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date_composition: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    short_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "opera_primary_literature_name_uindex"
    },
    it_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    en_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fr_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    de_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    current_place_composition: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    insert_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'opera_primary_literature',
    modelName: 'opera_primary_literature',
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
        name: "opera_primary_literature_name_uindex",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
};
