const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    surname: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    registered_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    other_info: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'role',
          key: 'id'
        }
    },
    facebook_profile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    twitter_profile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    linkedin_profile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    personal_site: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    account_verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'user',
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
        name: "user_role_fk",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
    ]
  });
};
