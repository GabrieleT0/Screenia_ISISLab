const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('date_author_primary_literature', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    data: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_reference_date: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    is_birth_date: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    is_death_date: {
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
    }
  }, {
    sequelize,
    tableName: 'date_author_primary_literature',
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
        name: "date_author_primary_literature_author_primary_literature_id_fk",
        using: "BTREE",
        fields: [
          { name: "id_author" },
        ]
      },
    ]
  });
};
