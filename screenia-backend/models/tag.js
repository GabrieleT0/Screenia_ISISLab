const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tag', {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    category: {
        type: DataTypes.ENUM({
            values: ['concepts', 'models']
          }),
        allowNull: false
    },
    insert_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tag',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "title" },
        ]
      }
    ]
  });
};
