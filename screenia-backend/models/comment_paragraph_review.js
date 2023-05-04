const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment_paragraph_review', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    flat_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    from_paragraph: {
      allowNull: true,
      type: DataTypes.STRING(255),
      defaultValue: 0
    },
    to_paragraph: {
      allowNull: true,
      type: DataTypes.STRING(255),
      defaultValue: 0
    },
    tag_update: {
        allowNull: false,
        type: DataTypes.ENUM('major', 'minor')
    },
    tags: {
        allowNull: true,
        type: DataTypes.JSON
    },
    id_parent_comment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'comment_paragraph',
          key: 'id'
        }
    },
  }, {
    sequelize,
    tableName: 'comment_paragraph_review',
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
        name: "comment_paragraph_parent_fk",
        using: "BTREE",
        fields: [
          { name: "id_parent_comment" }
        ]
      },
    ]
  });
};
