const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('place_author_primary_literature', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    place: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    current_place: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_birth_place: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    is_death_place: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    id_author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'author_primary_literature',
        key: 'id'
      }
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_reference_place: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'place_author_primary_literature',
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
        name: "place_author_primary_literature_author_primary_literature_id_fk",
        using: "BTREE",
        fields: [
          { name: "id_author" },
        ]
      },
    ]
  });
};
