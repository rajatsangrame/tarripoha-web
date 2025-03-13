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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TagIcon from '@mui/icons-material/Tag';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField, Typography
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { userRoleType } from '../common/enum';
import { getLanguageById } from '../common/util';
import { useAuth } from '../context/AuthContext';
import { useSnackbarStore } from '../store/snackbarStore';
import { createUpdateWordRequest, UpdateWordRequest } from '../types/UpdateWordRequest';
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
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const authToken = getToken();
  const user = getUser();
  const canEdit = user?.roles?.some((role: string) =>
    [userRoleType.ADMIN.name, userRoleType.EDITOR.name].includes(role)
  );

  const resetEditWord = () => {
    // Reset the Edit word in update
    if (editedWord && word) {
      setEditedWord(word);
    }
  };

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
    resetEditWord();
  };
  const handleSaveClick = () => {
    updateWord();
    setIsDialogOpen(false);
  };

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const comments = [
    { id: 1, user: 'Alice', text: 'This is an interesting word!', timestamp: '2h ago' },
    { id: 2, user: 'Bob', text: 'I have seen this word used in literature.', timestamp: '3h ago' },
    { id: 3, user: 'Charlie', text: 'Does this word have multiple meanings?', timestamp: '5h ago' },
  ];

  const toggleLike = async (word: Word) => {
    try {
      const newStatus = !word.isLiked;
      await axios.post(
        'http://localhost:3001/like/insert-like',
        { contentId: word.id, contentType: 1, isActive: newStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setWord({
        ...word,
        isLiked: newStatus
      });
    } catch (error) {
      showSnackbar(`Fail to update ${error}`, 'error');
    }
  };

  const toggleSave = async (word: Word) => {
    try {
      const newSaveStatus = !word.isSaved;
      await axios.post('http://localhost:3001/saved/insert-saved',
        { contentId: word.id, contentType: 1, isActive: newSaveStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setWord({
        ...word,
        isSaved: newSaveStatus
      });
      showSnackbar('Updated Saved!');
    } catch (error) {
      showSnackbar('Fail update the save', 'error');
    }
  };

  const updateWord = async () => {
    try {
      if (!editedWord) return;
      const reqBody: UpdateWordRequest = createUpdateWordRequest(editedWord);
      const response = await axios.put<Word>(
        `http://localhost:3001/word/update-word/${editedWord.id}`,
        reqBody,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setWord({
        ...response.data,
      });
      setEditedWord({
        ...response.data,
      });
    } catch (error) {
      resetEditWord();
      showSnackbar(`Fail to update ${error}`, 'error');
    }
  };

  if (!word) {
    return <Typography variant="h5" textAlign="center" sx={{ margin: 4 }}>Word not found.</Typography>;
  }

  return (

    <Container maxWidth="xl" sx={{ mt: 4, height: '100vh', display: 'flex' }}>

      <Box sx={{ flex: 1, p: 2 }}>

        <Typography variant="h1" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
          {word.name}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
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
            {getLanguageById(word.languageId)?.value}
          </Box>
        </Box>

        {canEdit && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
            <Box
              sx={{
                top: 8,
                right: 8,
                backgroundColor: word.isActive ? 'green' : 'red',
                color: 'whitesmoke',
                px: 2,
                py: 0.9,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              {word.isActive ? 'Active' : 'Inactive'}
            </Box>

            <Button
              color="primary"
              onClick={handleEditClick}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ marginLeft: 2, borderRadius: 2, boxShadow: 2 }}
            >
              Edit
            </Button>

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
            <Typography variant="body1">
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
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Tags:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(JSON.parse(word.tags || '[]') as string[]).map((tag, index) => (
                <Chip key={index} label={`#${tag}`} variant="outlined" color="primary" />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ mt: 4 }} />

        <Box display="flex" justifyContent="space-evenly" p={1}>
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
            {word.user.firstName} {word.user.lastName} (@{word.user.username})
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

      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '35%',
          height: '80%',
          mx: 4,
          my: 4,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flex: 1, p: 1 }}>
          {comments.map((comment) => (
            <Box
              key={comment.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'background.default',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 24,
                  height: 24,
                  fontSize: 14,
                  fontWeight: 'bold',
                  mr: 2,
                  mt: 0.5,
                }}
              >
                {comment.user.charAt(0)}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {comment.user}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {comment.text}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {comment.timestamp}
                </Typography>
              </Box>

              <IconButton
                sx={{
                  p: 0.5,
                  alignSelf: 'center',
                }}
                color="primary"
              >
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
            </Box>

          ))}
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            bgcolor: 'background.paper',
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            variant="outlined"
            sx={{
              flex: 1,
              mr: 1,
              borderRadius: 2,
              backgroundColor: 'background.default',
              '& fieldset': { border: 'none' },
            }}
          />
          <Button
            color="secondary"
            size="small" sx={{ px: 1 }}
          >
            Send
          </Button>
        </Box>
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

          <Box display="flex" justifyContent="left" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={editedWord?.isApproved || false}
                  onChange={(e) =>
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    setEditedWord({ ...editedWord!, isApproved: e.target.checked })
                  }
                />
              }
              label="Approved"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={editedWord?.isActive || false}
                  onChange={(e) =>
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    setEditedWord({ ...editedWord!, isActive: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Box>

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
                    const tagsArray: string[] = JSON.parse(editedWord?.tags || '[]');
                    if (!tagsArray.includes(newTag)) {
                      tagsArray.push(newTag);
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      setEditedWord({ ...editedWord!, tags: JSON.stringify(tagsArray) });
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
              {editedWord?.tags && (
                (JSON.parse(editedWord?.tags || '[]') as string[]).map(
                  (tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      variant="outlined"
                      onDelete={() => {
                        const tagsArray: string[] = JSON.parse(editedWord?.tags || '[]');
                        const newTags = tagsArray.filter((t) => t !== tag);
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        setEditedWord({ ...editedWord!, tags: JSON.stringify(newTags) });
                      }}
                      sx={{ fontSize: '0.85rem' }}
                    />
                  )
                )
              )}
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
    </Container >
  );
};

export default WordDetail;
