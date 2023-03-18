const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('edition', {
    id_opera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'opera_primary_literature',
        key: 'id'
      }
    },
    IPI: {
      type: DataTypes.CHAR(11),
      allowNull: true
    },
    is_reference: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    place: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    series: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    publisher: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ISBN: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'edition',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ISBN" },
        ]
      },
      {
        name: "edition_ISBN_uindex",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ISBN" },
        ]
      },
      {
        name: "edition_opera_primary_literature_id_fk",
        using: "BTREE",
        fields: [
          { name: "id_opera" },
        ]
      },
    ]
  });
};
