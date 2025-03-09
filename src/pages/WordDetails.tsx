import React, { useEffect, useState } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/EditNote';
import TagIcon from '@mui/icons-material/Tag';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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

  if (!word) {
    return <Typography variant="h6" textAlign="center">Word not found.</Typography>;
  }

  return (
    <>
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 8, p: 3, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" fontWeight="bold">{word.name}</Typography>
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

          <Typography variant="h5" color="text.secondary" sx={{ mt: 1 }}>{word.meaning}</Typography>

          {word.englishMeaning && (
            <Typography variant="h6" sx={{ mt: 1, fontStyle: 'italic' }}>
              {word.englishMeaning}
            </Typography>
          )}

          {word.description && (
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
              {word.description}
            </Typography>
          )}

          {/* Additional Details */}
          {word.language?.name && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Language:</strong> {word.language.name}
            </Typography>
          )}

          {word.user?.username && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Added by User:</strong> {word.user.username}
            </Typography>
          )}

          {/* Tags Section */}
          {word.tags && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {word.tags.split(' ').map((tag, index) => (
                  <Chip key={index} label={`#${tag}`} variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

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
            onChange={(e) => setEditedWord({ ...editedWord!, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Meaning"
            value={editedWord?.meaning || ''}
            onChange={(e) => setEditedWord({ ...editedWord!, meaning: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="English Meaning"
            value={editedWord?.englishMeaning || ''}
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
    </>
  );
};

export default WordDetail;
