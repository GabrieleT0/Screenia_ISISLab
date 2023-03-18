const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('book', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    id_opera: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      references: {
        model: 'opera_primary_literature',
        key: 'id'
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
    },
    ISBN_Edition: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: 'volume_edition',
        key: 'ISBN_Edition'
      }
    },
    number_volume: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'volume_edition',
        key: 'number'
      }
    }
  }, {
    sequelize,
    tableName: 'book',
    timestamps: false,
    indexes: [
      {
        name: "book_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "number" },
          { name: "id_opera" },
        ]
      },
      {
        name: "book_opera_primary_literature_id_fk",
        using: "BTREE",
        fields: [
          { name: "id_opera" },
        ]
      },
      {
        name: "book_volume_edition_number_ISBN_Edition_fk",
        using: "BTREE",
        fields: [
          { name: "number_volume" },
          { name: "ISBN_Edition" },
        ]
      },
    ]
  });
};
