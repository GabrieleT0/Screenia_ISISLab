const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('translation_paragraph', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    language: {
      type: DataTypes.ENUM('it','en','fr','de'),
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    number_paragraph: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paragraph',
        key: 'number'
      }
    },
    number_chapter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paragraph',
        key: 'number_chapter'
      }
    },
    number_book: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paragraph',
        key: 'number_book'
      }
    },
    id_opera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paragraph',
        key: 'id_opera'
      }
    },
    insert_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'translation_paragraph',
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
        name: "translation_paragraph_fk",
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
