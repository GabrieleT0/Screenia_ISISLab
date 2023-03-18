const DataTypes = require("sequelize").DataTypes;
const _author_opera_primary_literature = require("./author_opera_primary_literature");
const _author_primary_literature = require("./author_primary_literature");
const _book = require("./book");
const _chapter = require("./chapter");
const _comment_paragraph = require("./comment_paragraph");
const _date_author_primary_literature = require("./date_author_primary_literature");
const _edition = require("./edition");
const _opera_primary_literature = require("./opera_primary_literature");
const _paragraph = require("./paragraph");
const _place_author_primary_literature = require("./place_author_primary_literature");
const _translation_paragraph = require("./translation_paragraph");
const _volume_edition = require("./volume_edition");
const _tag = require("./tag");
const _comment_tag = require("./comment_tag");
const _user = require("./user");
const _role = require("./role");
const _comment_paragraph_review = require("./comment_paragraph_review.js");
const _room = require("./room");
const _discussion = require("./discussion");

function initModels(sequelize) {
  const author_opera_primary_literature = _author_opera_primary_literature(sequelize, DataTypes);
  const author_primary_literature = _author_primary_literature(sequelize, DataTypes);
  const book = _book(sequelize, DataTypes);
  const chapter = _chapter(sequelize, DataTypes);
  const comment_paragraph = _comment_paragraph(sequelize, DataTypes);
  const date_author_primary_literature = _date_author_primary_literature(sequelize, DataTypes);
  const edition = _edition(sequelize, DataTypes);
  const opera_primary_literature = _opera_primary_literature(sequelize, DataTypes);
  const paragraph = _paragraph(sequelize, DataTypes);
  const place_author_primary_literature = _place_author_primary_literature(sequelize, DataTypes);
  const translation_paragraph = _translation_paragraph(sequelize, DataTypes);
  const volume_edition = _volume_edition(sequelize, DataTypes);
  const tag = _tag(sequelize, DataTypes);
  const comment_tag = _comment_tag(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const role = _role(sequelize, DataTypes);
  const comment_paragraph_review = _comment_paragraph_review(sequelize, DataTypes);
  const room = _room(sequelize, DataTypes);
  const discussion = _discussion(sequelize, DataTypes);

  author_primary_literature.belongsToMany(opera_primary_literature, { as: 'opera_authors', through: author_opera_primary_literature, foreignKey: "id_author", otherKey: "id_opera" });
  book.belongsToMany(book, { as: 'id_opera_books', through: chapter, foreignKey: "number_book", otherKey: "id_opera" });
  book.belongsToMany(book, { as: 'number_book_books', through: chapter, foreignKey: "id_opera", otherKey: "number_book" });
  opera_primary_literature.belongsToMany(author_primary_literature, { as: 'authors', through: author_opera_primary_literature, foreignKey: "id_opera", otherKey: "id_author" });
  author_opera_primary_literature.belongsTo(author_primary_literature, { as: "id_author_author_primary_literature", foreignKey: "id_author"});
  author_primary_literature.hasMany(author_opera_primary_literature, { as: "author_opera_primary_literatures", foreignKey: "id_author"});
  date_author_primary_literature.belongsTo(author_primary_literature, { as: "id_author_author_primary_literature", foreignKey: "id_author"});
  author_primary_literature.hasMany(date_author_primary_literature, { as: "date_author_primary_literatures", foreignKey: "id_author"});
  place_author_primary_literature.belongsTo(author_primary_literature, { as: "id_author_author_primary_literature", foreignKey: "id_author"});
  author_primary_literature.hasMany(place_author_primary_literature, { as: "place_author_primary_literatures", foreignKey: "id_author"});
  chapter.belongsTo(book, { as: "number_book_book", foreignKey: "number_book"});
  book.hasMany(chapter, { as: "chapters", foreignKey: "number_book"});
  chapter.belongsTo(book, { as: "id_opera_book", foreignKey: "id_opera"});
  book.hasMany(chapter, { as: "id_opera_chapters", foreignKey: "id_opera"});
  volume_edition.belongsTo(edition, { as: "ISBN_Edition_edition", foreignKey: "ISBN_Edition"});
  edition.hasMany(volume_edition, { as: "volume_editions", foreignKey: "ISBN_Edition"});
  author_opera_primary_literature.belongsTo(opera_primary_literature, { as: "id_opera_opera_primary_literature", foreignKey: "id_opera"});
  opera_primary_literature.hasMany(author_opera_primary_literature, { as: "author_opera_primary_literatures", foreignKey: "id_opera"});
  book.belongsTo(opera_primary_literature, { as: "id_opera_opera_primary_literature", foreignKey: "id_opera"});
  opera_primary_literature.hasMany(book, { as: "books", foreignKey: "id_opera"});
  edition.belongsTo(opera_primary_literature, { as: "id_opera_opera_primary_literature", foreignKey: "id_opera"});
  opera_primary_literature.hasMany(edition, { as: "editions", foreignKey: "id_opera"});
  comment_paragraph.belongsTo(paragraph, { as: "number_paragraph_paragraph", foreignKey: "number_paragraph"});
  paragraph.hasMany(comment_paragraph, { as: "comment_paragraphs", foreignKey: "number_paragraph"});
  comment_paragraph.belongsTo(paragraph, { as: "number_chapter_paragraph", foreignKey: "number_chapter"});
  paragraph.hasMany(comment_paragraph, { as: "number_chapter_comment_paragraphs", foreignKey: "number_chapter"});
  comment_paragraph.belongsTo(paragraph, { as: "number_book_paragraph", foreignKey: "number_book"});
  paragraph.hasMany(comment_paragraph, { as: "number_book_comment_paragraphs", foreignKey: "number_book"});
  comment_paragraph.belongsTo(paragraph, { as: "id_opera_paragraph", foreignKey: "id_opera"});
  paragraph.hasMany(comment_paragraph, { as: "id_opera_comment_paragraphs", foreignKey: "id_opera"});
  translation_paragraph.belongsTo(paragraph, { as: "number_paragraph_paragraph", foreignKey: "number_paragraph"});
  paragraph.hasMany(translation_paragraph, { as: "translation_paragraphs", foreignKey: "number_paragraph"});
  translation_paragraph.belongsTo(paragraph, { as: "number_chapter_paragraph", foreignKey: "number_chapter"});
  paragraph.hasMany(translation_paragraph, { as: "number_chapter_translation_paragraphs", foreignKey: "number_chapter"});
  translation_paragraph.belongsTo(paragraph, { as: "number_book_paragraph", foreignKey: "number_book"});
  paragraph.hasMany(translation_paragraph, { as: "number_book_translation_paragraphs", foreignKey: "number_book"});
  translation_paragraph.belongsTo(paragraph, { as: "id_opera_paragraph", foreignKey: "id_opera"});
  paragraph.hasMany(translation_paragraph, { as: "id_opera_translation_paragraphs", foreignKey: "id_opera"});
  book.belongsTo(volume_edition, { as: "number_volume_volume_edition", foreignKey: "number_volume"});
  volume_edition.hasMany(book, { as: "books", foreignKey: "number_volume"});
  book.belongsTo(volume_edition, { as: "ISBN_Edition_volume_edition", foreignKey: "ISBN_Edition"});
  volume_edition.hasMany(book, { as: "ISBN_Edition_books", foreignKey: "ISBN_Edition"});
  chapter.hasMany(paragraph, { as: "paragraphs", foreignKey: "number_chapter" });
  paragraph.belongsTo(chapter, { as: "chapters_paragraph", foreignKey: "number_chapter" });
  comment_paragraph.belongsToMany(tag, { through: comment_tag, foreignKey: "comment" });
  tag.belongsToMany(comment_paragraph, { through: comment_tag, foreignKey: "tag" });
  comment_paragraph.hasMany(comment_tag, { as: "comment_to_comment_tag", foreignKey: "comment" });
  user.belongsTo(role, { foreignKey: "role_id" });
  role.hasMany(user, { foreignKey: "role_id" });
  user.hasMany(comment_paragraph, { foreignKey: "user_id" });
  comment_paragraph.belongsTo(user, { foreignKey: "user_id" });
  comment_paragraph.hasOne(comment_paragraph_review, { foreignKey: "id_parent_comment" });
  comment_paragraph_review.belongsTo(comment_paragraph, { foreignKey: "id_parent_comment" });

  user.hasMany(room, { foreignKey: 'user_id' });
  room.belongsTo(user, { foreignKey: 'user_id' });

  comment_paragraph.hasOne(room, { foreignKey: 'comment_paragraph_id' });
  room.belongsTo(comment_paragraph, { foreignKey: 'comment_paragraph_id' });

  room.hasMany(discussion, { foreignKey: 'room_id' });
  discussion.belongsTo(room, { foreignKey: 'room_id' });

  user.hasMany(discussion, { foreignKey: 'user_id' });
  discussion.belongsTo(user, { foreignKey: 'user_id' });

  comment_paragraph.hasMany(comment_paragraph, {
    foreignKey: 'parent_id',
    as: 'revisions'
  });
  
  comment_paragraph.belongsTo(comment_paragraph, {
    foreignKey: 'parent_id',
    as: 'parent'
  });

  return {
    author_opera_primary_literature,
    author_primary_literature,
    book,
    chapter,
    comment_paragraph,
    comment_paragraph_review,
    date_author_primary_literature,
    edition,
    opera_primary_literature,
    paragraph,
    place_author_primary_literature,
    translation_paragraph,
    volume_edition,
    tag,
    comment_tag,
    user,
    role,
    room,
    discussion
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
