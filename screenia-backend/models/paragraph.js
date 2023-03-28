const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paragraph', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    number_chapter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chapter',
        key: 'number'
      }
    },
    number_book: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chapter',
        key: 'number_book'
      }
    },
    id_opera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chapter',
        key: 'id_opera'
      }
    },
    number_paragraph_supr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    number_paragraph_infr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'paragraph',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "number" },
          { name: "number_chapter" },
          { name: "number_book" },
          { name: "id_opera" },
        ]
      },
      {
        name: "paragraph_chapter2_number_number_book_id_opera_fk",
        using: "BTREE",
        fields: [
          { name: "number_chapter" },
          { name: "number_book" },
          { name: "id_opera" },
        ]
      },
    ]
  });
};
