import React, { useEffect, useState } from 'react';

import { Box, Button, Card, CardContent, Chip, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { UserRoleType } from '../common/enum';
import { useAuth } from '../context/AuthContext';
import { Word } from '../types/Word';

const WordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [word, setWord] = useState<Word | null>(null);
  const [editedWord, setEditedWord] = useState<Word | null>(null);
  const user = getUser();

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(`http://localhost:3001/word/${id}`);
        const data = await response.json();
        setWord(data);
        setEditedWord(data);
      } catch (error) {
        console.error('Error fetching word:', error);
      }
    };

    fetchWord();
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
