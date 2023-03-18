import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

export default function CardOpera({ id, title, date, author, edition }) {
  return (
    <Card key={id} sx={{ maxWidth: 345 }}>
      <CardActionArea component={Link} to={`/opera/${id}`}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Insert Date: <b>{date}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Author: <b>{author}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edition: <b>{edition}</b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

CardOpera.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  date:  PropTypes.string,
  author: PropTypes.string,
  edition: PropTypes.string,
};
