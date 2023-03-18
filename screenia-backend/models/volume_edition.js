const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('volume_edition', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    ISBN_Edition: {
      type: DataTypes.STRING(17),
      allowNull: true,
      primaryKey: true,
      references: {
        model: 'edition',
        key: 'ISBN'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'volume_edition',
    timestamps: false,
    indexes: [
      {
        name: "volume_edition_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "number" },
          { name: "ISBN_Edition" },
        ]
      },
      {
        name: "volume_edition_edition_ISBN_fk",
        using: "BTREE",
        fields: [
          { name: "ISBN_Edition" },
        ]
      },
    ]
  });
};
