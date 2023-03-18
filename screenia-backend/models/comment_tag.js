const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment_tag', {
    comment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      references: {
        model: 'comment_paragraph',
        key: 'id'
      }
    },
    tag: {
        type: DataTypes.STRING(255),
        allowNull: true,
        primaryKey: true,
        references: {
            model: 'tag',
            key: 'title'
        }
    }
  }, {
    sequelize,
    tableName: 'comment_tag',
    timestamps: false,
    indexes: [
      {
        name: "comment_tag_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "comment", name: "tag" },
        ]
      }
    ]
  });
};