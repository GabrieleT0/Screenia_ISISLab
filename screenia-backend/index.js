require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
}

const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload');
import bodyParser from 'body-parser';
import morgan from 'morgan';
const app = express();
const operaRouter = require('./routes/opera/index')
const bookRouter = require('./routes/book/index');
const chapterRouter = require('./routes/chapter/index');
const paragraphRouter = require('./routes/paragraph/index');
const commentParagraphRouter = require('./routes/comment_paragraph/index');
const richTextRouter = require("./routes/richText/index");
const tagRouter = require("./routes/tag/index");
const authRouter = require("./routes/auth/index");
const commentReviewRouter = require("./routes/comment_paragraph_review/index");
const roomRouter = require("./routes/room/index");
const discussionRouter = require("./routes/discussion/index");
const userRouter = require("./routes/user/index");
const export_comments = require("./routes/export_comments/index");
const cookieParser = require('cookie-parser');

//resolve cors
app.use(cors({ credentials: true, origin: true }))

// enable files upload
app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: './tmp',
  //debug: true
}));

// Enabled middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//Enabled Cookies
app.use(cookieParser());

app.use('/opera', operaRouter);
app.use('/book', bookRouter);
app.use('/chapter', chapterRouter);
app.use('/paragraph', paragraphRouter);
app.use('/comment_parapragh', commentParagraphRouter);
app.use('/comment_paragraph_review', commentReviewRouter);
app.use('/rich_text', richTextRouter);
app.use('/tag', tagRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/room', roomRouter);
app.use('/discussion', discussionRouter);
app.use('/export_comments', export_comments);
app.listen(3001);