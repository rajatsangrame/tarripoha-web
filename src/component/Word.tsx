import Grid2 from '@mui/material/Grid2';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material';
import { Word } from '../types/Word';

interface WordCardProps {
  word: Word;
  toggleLike: (id: number) => void;
  toggleSave: (id: number) => void;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  toggleLike,
  toggleSave,
}) => {
  return (
    <Card
      sx={{
        width: '100%',
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'left',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {word.name}
        </Typography>
        <Typography color="text.secondary">{word.meaning}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
          {word.englishMeaning}
        </Typography>
      </CardContent>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton onClick={() => toggleLike(word.id)} color="error">
          {true ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton onClick={() => toggleSave(word.id)} color="primary">
          {true ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
      </Box>
    </Card>
  );
};

interface WordGridProps {
  words: Word[];
  toggleLike: (id: number) => void;
  toggleSave: (id: number) => void;
}

const WordGrid: React.FC<WordGridProps> = ({
  words,
  toggleLike,
  toggleSave,
}) => {
  return (
    <Grid2 container spacing={2}>
      {words?.map((word) => (
        <Grid2 key={word.id}>
          <WordCard
            word={word}
            toggleLike={toggleLike}
            toggleSave={toggleSave}
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export { WordCard, WordGrid };
export default WordGrid;
