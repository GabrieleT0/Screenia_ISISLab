const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment_paragraph', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    flat_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_opera: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paragraph',
        key: 'id_opera'
      }
    },
    number_book: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paragraph',
        key: 'number_book'
      }
    },
    number_chapter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paragraph',
        key: 'number_chapter'
      }
    },
    number_paragraph: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paragraph',
        key: 'number'
      }
    },
    insert_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    from_paragraph: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    to_paragraph: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    impact: {
      allowNull: true,
      type: DataTypes.ENUM('major', 'minor')
    }
  }, {
    sequelize,
    tableName: 'comment_paragraph',
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
        name: "comment_paragraph_fk",
        using: "BTREE",
        fields: [
          { name: "number_paragraph" },
          { name: "number_chapter" },
          { name: "number_book" },
          { name: "id_opera" },
        ]
      },
    ]
  });
};
