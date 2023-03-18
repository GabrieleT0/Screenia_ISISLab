import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { InView } from 'react-intersection-observer';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useRecoilState, useRecoilValue } from 'recoil';
import { commentRefAtom, commentContainerAtom } from "../../state/opera/commentAtom";
import { useScroll } from 'react-scroll-hooks';
import CommentIcon from '@mui/icons-material/Comment';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Avatar, 
  Grid, 
  List,
  ListItem,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from "moment";
import { fetchAllComment } from '../../api/opereApi';
import DraftEditor from '../RichText/DraftEditor';
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import CommentParagraph from '../Comment/CommentParagraph';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { syncTextCommentOpera } from '../../state/opera/opereAtom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      style={{
        overflow: "auto",
        width: "100%",
        height: 550
      }}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, textAlign: "justify" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const CommentsParagraph = ({ paragraph }) => {
  const [offset, setOffset] = useState(5);
  const [comments, setComments] = useState([]);
  const [maxComments, setMaxComments] = useState(0);

  useEffect(() => {
    if(paragraph && paragraph.number) {
      loadComment(offset);
      console.log('comments.length', comments.length);
      console.log('maxComments', maxComments);
    }
  }, [offset])

  const loadComment = async (limit) => {
    if(!paragraph.number) return;

    try {
      const response = await fetchAllComment(
        paragraph.id_opera, 
        paragraph.number_book, 
        paragraph.number_chapter,
        paragraph.number,
        limit
      );
      setComments(response?.data?.comments || []);
      if(response?.data?.maxComments) {
        setMaxComments(parseInt(response.data.maxComments));
      }
    } catch(e) {
      console.log('Error: ', e)
    }
  }

  const handleChangeOffset = useCallback((plus = true) => {
    setOffset((lastOffset) => plus ? lastOffset+3 : lastOffset-3);
  })

  return comments.length > 0 && (
      <Box sx={{ width: '100%', maxWidth: 700, bgcolor: 'background.paper' }}>
        <List sx={{ width: '100%' }}>
          {comments.map((comment) => (
            <ListItem key={comment.id}>
              <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                      <Avatar alt={`${comment.username}`} />
                  </Grid>
                  <Grid justifyContent="left" item xs zeroMinWidth>
                      <h4 style={{ margin: 0, textAlign: "left", display: "inline" }}>{comment.username}</h4>
                      <p style={{ textAlign: "left", color: "gray", display: "inline", marginLeft: 15 }}>
                          {moment(comment.insert_date).format("DD/MM/YY HH:mm")}
                      </p>
                      <CommentParagraph 
                        opera={{ 
                          idOpera: paragraph.id_opera, 
                          idBook: paragraph.number_book,
                          idChapter: paragraph.number_chapter,
                          idParagraph: paragraph.number_paragraph
                        }}
                        readOnly={true}
                        initializeEditor={JSON.parse(comment.text)}
                        tags={comment.tags}
                      />
                  </Grid>
              </Grid>
          </ListItem>
          ))}
        </List>
        {comments.length !== maxComments && 
          (<Button variant="text" onClick={() => handleChangeOffset(true)}>
            View more comments
          </Button>)}
        {comments.length > 5 && 
          (<Button variant="text" onClick={() => handleChangeOffset(false)}>
            View less comments
          </Button>)}
      </Box>
  )
}

const ParagraphText = ({ paragraphs, number, value, handleCommentParagraph }) => {
  const isSyncTextComment = useRecoilValue(syncTextCommentOpera);

  const handleChangeInView = (paragraph, options) => {
    const { id_opera, number_book, number_chapter, number } = paragraph;
    const { inView, entry } = options;

    if(inView) {
      console.log('number', number)
      scroller.scrollTo(`#comment-paragraph_${number}`, {
        duration: 1500,
        delay: 100,
        smooth: true,
        containerId: 'container_comment',
        offset: 50
      })
    }
  }

  return (
    <TabPanel id="container_paragraph" key={number} value={value} index={number}>
      {paragraphs.map((paragraph, index) => {
          const { number, number_book, number_chapter, id_opera, text } = paragraph;
          return (
            <InView 
              root={document.getElementById(`paragraph_box`)} 
              as="div" 
              onChange={isSyncTextComment ? 
                (inView, entry) => 
                  handleChangeInView(
                    { id_opera, number_book, number_chapter, number }, 
                    { inView, entry }) : null}>
              <Typography id={`paragraph-${id_opera}-${number_book}-${number_chapter}-${number}`} style={index !== 0 ? { marginTop: 10 } : null}>
                <p>
                  <IconButton edge="start" onClick={() => handleCommentParagraph(number)}>
                    <CommentIcon color="secondary" />
                  </IconButton>
                  <b>{`${index+1}. `}</b>{text}
                </p>
              </Typography>
              {/*<CommentsParagraph paragraph={paragraph} />*/}
            </InView>
          )
      })}

<Button onClick={() => {
        scroller.scrollTo('#par3', {
          duration: 1500,
          delay: 100,
          smooth: true,
          containerId: 'container_paragraph',
          offset: 50
        })
      }}>Clicca qui library</Button>
    </TabPanel>
  )
}

const ChapterTabs = (
  { 
    chapters = [], 
    paragraphs = [], 
    value, 
    handleSelect,
    handleCommentParagraph
  }) => {

  return (
    <Box
      id="paragraph_box"
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleSelect}
        sx={{ borderRight: 1, borderColor: 'divider', height: 550 }}
      >
        {chapters.map(({ number, title }) => {
            const label = number && title ? `Chapter #${number} - ${title}` : `Chapter #${number}`
            return (<Tab key={number} value={number} label={label} {...a11yProps(number)} />)
        })}
      </Tabs>
        {chapters.map(({ number }) => (
          <ParagraphText 
            paragraphs={paragraphs} 
            number={number} 
            value={value}
            handleCommentParagraph={handleCommentParagraph} />
        ))}
    </Box>
  );
}

export default ChapterTabs;
