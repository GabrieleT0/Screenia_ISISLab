module.exports = function(sequelize, DataTypes) {
  return sequelize.define('author_opera_primary_literature', {
    id_author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'author_primary_literature',
        key: 'id'
      }
    },
    id_opera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'opera_primary_literature',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'author_opera_primary_literature',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_opera" },
          { name: "id_author" },
        ]
      },
      {
        name: "author_opera_primary_literature_author_primary_literature_id_fk",
        using: "BTREE",
        fields: [
          { name: "id_author" },
        ]
      },
    ]
  });
};
