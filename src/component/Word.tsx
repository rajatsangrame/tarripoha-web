import React from 'react';

import {
  Bookmark,
  BookmarkBorder,
  Favorite,
  FavoriteBorder,
  Share,
} from '@mui/icons-material';
import { Box, Card, CardContent, Grid2 as Grid, IconButton, Typography } from '@mui/material';

import { getLanguageById } from '../common/util';
import { Word } from '../types/Word';

interface WordCardProps {
  word: Word;
  // eslint-disable-next-line no-unused-vars
  toggleLike: (word: Word) => void;
  // eslint-disable-next-line no-unused-vars
  toggleSave: (word: Word) => void;
  // eslint-disable-next-line no-unused-vars
  onClickWord: (word: Word) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, toggleLike, toggleSave, onClickWord }) => {

  return (
    <Card
      onClick={() => onClickWord(word)}
      sx={{
        width: 250,
        height: 180,
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        textAlign: 'left',
      }}>
      {word.languageId && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'lightgray',
            color: 'black',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          {getLanguageById(word.languageId)?.symbol}
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton onClick={() => toggleLike(word)} color="error" size="small">
          {word.isLiked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton onClick={() => toggleSave(word)} color="primary" size="small">
          {word.isSaved ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
        <IconButton color="default" size="small">
          <Share />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography variant="h6" fontWeight="bold">
          {word.name}
        </Typography>
        <Typography color="text.secondary">{word.meaning}</Typography>
        {word.englishMeaning && (
          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            {word.englishMeaning}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

interface WordGridProps {
  words: Word[];
  // eslint-disable-next-line no-unused-vars
  toggleLike: (word: Word) => void;
  // eslint-disable-next-line no-unused-vars
  toggleSave: (word: Word) => void;
  // eslint-disable-next-line no-unused-vars
  onClickWord: (word: Word) => void;
}

const WordGrid: React.FC<WordGridProps> = ({ words, toggleLike, toggleSave, onClickWord }) => {

  return (
    <Grid container justifyContent="center" rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
      {words?.map((word) => (
        <Grid key={word.id} sx={{ width: '250px' }}>
          <WordCard word={word} toggleLike={toggleLike} toggleSave={toggleSave} onClickWord={onClickWord} />
        </Grid>
      ))}
    </Grid>
  );
};

export { WordCard, WordGrid };
export default WordGrid;
