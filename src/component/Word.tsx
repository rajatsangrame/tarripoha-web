import React from 'react';
import { Grid2 as Grid, Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Share,
} from '@mui/icons-material';
import { Word } from '../types/Word';

interface WordCardProps {
  word: Word;
  toggleLike: (word: Word) => void;
  toggleSave: (word: Word) => void;
}

const getLanguageSymbol = (languageId?: number) => {
  if (languageId === 1) return 'म';
  if (languageId === 2) return 'हिं';
  return null;
};

const WordCard: React.FC<WordCardProps> = ({ word, toggleLike, toggleSave }) => {
  return (
    <Card
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
          {getLanguageSymbol(word.languageId)}
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
  toggleLike: (word: Word) => void;
  toggleSave: (word: Word) => void;
}

const WordGrid: React.FC<WordGridProps> = ({ words, toggleLike, toggleSave }) => {

  return (
    <Grid container justifyContent="center" rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
      {words?.map((word) => (
        <Grid key={word.id} sx={{ width: '250px' }}>
          <WordCard word={word} toggleLike={toggleLike} toggleSave={toggleSave} />
        </Grid>
      ))}
    </Grid>
  );
};

export { WordCard, WordGrid };
export default WordGrid;
