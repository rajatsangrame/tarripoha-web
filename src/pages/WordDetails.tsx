import React, { useEffect, useState } from 'react';

import {
  Bookmark,
  BookmarkBorder,
  Favorite,
  FavoriteBorder,
  Share,
} from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/EditNote';
import TagIcon from '@mui/icons-material/Tag';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { userRoleType } from '../common/enum';
import { getLanguageById } from '../common/util';
import { useAuth } from '../context/AuthContext';
import { Word } from '../types/Word';

const fetchWord = async (id: number, token: string) => {
  const response = await axios.get<Word>(`http://localhost:3001/word/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const WordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUser, getToken } = useAuth();
  const [word, setWord] = useState<Word | null>(null);
  const [editedWord, setEditedWord] = useState<Word | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const authToken = getToken();
  const user = getUser();
  const canEdit = user?.roles?.some((role: string) =>
    [userRoleType.ADMIN.name, userRoleType.EDITOR.name].includes(role)
  );

  useEffect(() => {
    const fetch = async () => {
      const wordId = Number(id);
      if (isNaN(wordId) || !authToken) return;
      setIsFetching(true);
      try {
        const fetchedWord = await fetchWord(wordId, authToken);
        setWord(fetchedWord);
        setEditedWord(fetchedWord);
      } catch (error) {
        console.error('Error fetching word:', error);
      }
      setIsFetching(false);
    };

    fetch();
  }, [id]);

  const handleEditClick = () => setIsDialogOpen(true);
  const handleCancelEdit = () => {
    setIsDialogOpen(false);
    setEditedWord(word);
  };
  const handleSaveClick = () => {
    setIsDialogOpen(false);
    console.log('Saving word:', editedWord);
  };

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const toggleLike = async (word: Word) => {
    //
  };

  const toggleSave = async (word: Word) => {
    //
  };

  if (!word) {
    return <Typography variant="h6" textAlign="center">Word not found.</Typography>;
  }

  return (

    <Container maxWidth="xl" sx={{ mt: 4, height: '100vh', display: 'flex' }}>

      <Box sx={{ flex: 1, p: 2 }}>

        <Typography variant="h1" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
          {word.name}
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {canEdit && (
            <Button
              color="primary"
              onClick={handleEditClick}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ borderRadius: 2, boxShadow: 2 }}
            >
              Edit
            </Button>
          )}
        </Box>

        {word.language && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                top: 8,
                right: 8,
                backgroundColor: 'divider',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              {getLanguageById(word.languageId)?.symbol}
            </Box>
            <Typography variant="body1" color="text.secondary">
              {getLanguageById(word.languageId)?.value}
            </Typography>
          </Box>
        )}

        <Typography sx={{ mt: 2 }} variant="subtitle1" fontWeight="bold">
          Meaning:
        </Typography>

        <Typography variant="body1" color="text.secondary">{word.meaning}</Typography>

        {word.englishMeaning && (
          <>
            <Typography sx={{ mt: 2 }} variant="subtitle1" fontWeight="bold">
              In English:
            </Typography>
            <Typography variant="body2">
              {word.englishMeaning}
            </Typography>
          </>

        )}

        {word.description && (
          <>
            <Typography sx={{ mt: 2 }} variant="subtitle1" fontWeight="bold">
              Discription:
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {word.description}
            </Typography>
          </>

        )}

        {word.tags && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Tags:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {word.tags.split(' ').map((tag, index) => (
                <Chip key={index} label={`#${tag}`} variant="outlined" color="primary" />
              ))}
            </Box>
          </Box>
        )}

        <Box display="flex" justifyContent="space-evenly" p={2}>
          <Button onClick={() => toggleLike(word)}
            color="secondary"
            size="small" sx={{ px: 4 }}
            startIcon={word.isLiked ? <Favorite /> : <FavoriteBorder />}
          >
            Like
          </Button>
          <Button onClick={() => toggleSave(word)}
            color="secondary"
            size="small"
            sx={{ px: 4 }}
            startIcon={word.isSaved ? <Bookmark /> : <BookmarkBorder />}
          >
            Save
          </Button>
          <Button color="secondary"
            size="small"
            startIcon={<Share />}
            sx={{ px: 4 }}
          >
            Share
          </Button>
        </Box>

        {word.user?.username && (
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
            @{word.user.username}
          </Typography>
        )}

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {new Date(word.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>

      </Box>

      <Box sx={{ flex: 1, p: 2 }}>
        <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '70vh' }}>
          <Typography variant="body1" color="text.secondary" mt={2}>
            Comment 1: This is an interesting word!
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={2}>
            Comment 2: I have seen this word used in literature.
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={2}>
            Comment 3: Does this word have multiple meanings?
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
          <TextField fullWidth label="Add a comment" variant="outlined" size="small" />
          <Button variant="contained" color="primary">Post</Button>
        </Box>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={handleCancelEdit}
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            boxShadow: 6,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          Edit Word
        </DialogTitle>

        <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Word"
            value={editedWord?.name || ''}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onChange={(e) => setEditedWord({ ...editedWord!, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Meaning"
            value={editedWord?.meaning || ''}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onChange={(e) => setEditedWord({ ...editedWord!, meaning: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="English Meaning"
            value={editedWord?.englishMeaning || ''}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onChange={(e) => setEditedWord({ ...editedWord!, englishMeaning: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            label="Description"
            value={editedWord?.description || ''}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onChange={(e) => setEditedWord({ ...editedWord!, description: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Tags:
            </Typography>

            <OutlinedInput
              sx={{ mt: 1 }}

              placeholder="Enter the tags..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {

                  const target = e.currentTarget as HTMLInputElement;
                  const newTag = target.value;

                  if (newTag) {
                    const tagsArray = editedWord?.tags ? editedWord.tags.split(' ') : [];
                    if (!tagsArray.includes(newTag)) {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      setEditedWord({ ...editedWord!, tags: [...tagsArray, newTag].join(' ') });
                    }
                    target.value = '';
                  }
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <TagIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              }
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {editedWord?.tags && editedWord?.tags?.split(' ').map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  variant="outlined"
                  onDelete={() => {
                    const newTags = editedWord.tags.split(' ').filter((t) => t !== tag).join(' ');
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    setEditedWord({ ...editedWord!, tags: newTags });
                  }}
                  sx={{ fontSize: '0.85rem' }}
                />
              ))}
            </Box>

          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelEdit}
            startIcon={<CancelIcon />}
            sx={{ borderRadius: 2, boxShadow: 2, px: 4, fontWeight: 'bold' }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSaveClick}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              px: 4,
              fontWeight: 'bold',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WordDetail;
