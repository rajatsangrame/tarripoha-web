import React, { useEffect, useState } from 'react';

import { Box, Button, Card, CardContent, Chip, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { UserRoleType } from '../common/enum';
import { useAuth } from '../context/AuthContext';
import { Word } from '../types/Word';

const getUserTokenOrShowError = () => {
  const { getToken } = useAuth();
  const authToken = getToken();
  if (!authToken) return '';
  return authToken;
};

const fetchWord = async (
  id: number,
  token: string
) => {
  const response = await axios.get<Word>(
    `http://localhost:3001/word/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const WordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [word, setWord] = useState<Word | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [editedWord, setEditedWord] = useState<Word | null>(null);
  const user = getUser();
  const authToken = getUserTokenOrShowError();

  const fetch = async () => {

    const wordId = Number(id);
    if (isNaN(wordId)) {
      return;
    }

    setIsFetching(true);
    const word = await fetchWord(wordId, authToken);
    setIsFetching(false);
    setEditedWord(word);
    setWord(word);
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const isUserAllowedToEdit = user?.roles.some((role) =>
    [UserRoleType[UserRoleType.EDITOR], UserRoleType[UserRoleType.ADMIN]].includes(role)
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Call API to save changes
    console.log('Saving word:', editedWord);
  };

  if (!word) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Word Detail</Typography>
        {isEditing && editedWord ? (
          <TextField
            label="Name"
            value={editedWord.name}
            onChange={(e) => setEditedWord({ ...editedWord, name: e.target.value })}
            fullWidth
          />
        ) : (
          <Typography variant="h5">{word.name}</Typography>
        )}
        <Typography variant="body1">Meaning: {word.meaning}</Typography>
        {word.englishMeaning && <Typography variant="body2">English Meaning: {word.englishMeaning}</Typography>}
        {word.description && <Typography variant="body2">Description: {word.description}</Typography>}

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Tags</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {word.tags
              ?.split(' ')
              .filter((tag) => tag.trim() !== '') // Remove empty values
              .map((tag, index) => (
                <Chip key={index} label={`#${tag}`} variant="outlined" />
              ))}
          </Box>
        </Box>

        {isUserAllowedToEdit ? (
          isEditing ? (
            <Button variant="contained" color="primary" onClick={handleSaveClick}>
              Save
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleEditClick}>
              Edit
            </Button>
          )
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WordDetailPage;
