const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chapter', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    number_book: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'book',
        key: 'number'
      }
    },
    id_opera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'book',
        key: 'id_opera'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    short_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chapter',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "number" },
          { name: "number_book" },
          { name: "id_opera" },
        ]
      },
      {
        name: "chapter_opera_primary_literature__fk",
        using: "BTREE",
        fields: [
          { name: "number_book" },
          { name: "id_opera" },
        ]
      },
    ]
  });
};
