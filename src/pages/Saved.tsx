import React, { useEffect, useState } from 'react';

import {
  Box,
  CircularProgress,
  Container,
  Pagination,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import RequireLogin from '../component/RequireLogin';
import WordGrid from '../component/Word';
import { useAuth } from '../context/AuthContext';
import { useSnackbarStore } from '../store/snackbarStore';
import { Word } from '../types/Word';
import { WordsResponse } from '../types/WordsResponse';

const fetchSavedWords = async (
  token: string,
  pageSize: number,
  pageNo?: number
) => {
  const response = await axios.get<WordsResponse>(
    'http://localhost:3001/saved/get-saved',
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        contentType: 1,
        pageNo,
        pageSize,
      },
    }
  );
  return response.data;
};

const getUserTokenOrShowError = () => {
  const { getToken } = useAuth();
  const authToken = getToken();
  if (!authToken) return '';
  return authToken;
};

export default function Saved() {

  const navigate = useNavigate();
  const authToken = getUserTokenOrShowError();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [pageNo, setPageNo] = useState(1);
  const [savedData, setSavedData] = useState<WordsResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const pageSize = 20;

  const refetch = async () => {
    if (!pageNo || !authToken) return null;
    setIsFetching(true);
    const words = await fetchSavedWords(authToken, pageSize, pageNo);
    setSavedData(words);
    setIsFetching(false);
  };

  useEffect(() => {
    refetch();
  }, [pageNo]);

  const toggleLike = async (word: Word) => {
    try {
      const newStatus = !word.isLiked;
      await axios.post(
        'http://localhost:3001/like/insert-like',
        {
          contentId: word.id, contentType: 1, isActive: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setSavedData((prevWords) =>
        prevWords
          ? {
            ...prevWords,
            data: prevWords.data.map((w) =>
              w.id === word.id ? { ...w, isLiked: newStatus } : w
            ),
          }
          : prevWords
      );

    } catch (error) {
      showSnackbar(`Fail to update ${error}`, 'error');
    }
  };

  const toggleSave = async (word: Word) => {
    try {

      const newSaveStatus = !word.isSaved;
      await axios.post(
        'http://localhost:3001/saved/insert-saved',
        {
          contentId: word.id, contentType: 1, isActive: newSaveStatus,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setSavedData((prevWords) =>
        prevWords
          ? {
            ...prevWords,
            data: prevWords.data.map((w) =>
              w.id === word.id ? { ...w, isSaved: newSaveStatus } : w
            ),
          }
          : prevWords
      );
      showSnackbar('Updated Saved!');
    } catch (error) {
      showSnackbar('Fail update the save', 'error');
    }
  };

  const onClickWord = async (word: Word) => {
    navigate(`/word/${word.id}`);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNo(newPage);
  };

  if (!authToken) return <RequireLogin />;

  return (
    <Container sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        Saved Words
      </Typography>

      {isFetching && (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!isFetching && (
        <Box sx={{ flexGrow: 1, mt: 3 }} display="flex" width='100%'>
          <WordGrid
            words={savedData?.data || []}
            toggleLike={toggleLike}
            toggleSave={toggleSave}
            onClickWord={onClickWord}
          ></WordGrid>

          {savedData?.total === 0 && (
            <Box display="flex" justifyContent="center" width="100%" sx={{ mt: 3 }}>
              <Typography sx={{ color: 'text.secondary' }}>
                No results found
              </Typography>
            </Box>
          )}
        </Box>
      )}
      {savedData?.total !== undefined && savedData.total > 0 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <Pagination
            count={Math.ceil(savedData.total / pageSize) || 1}
            page={pageNo}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}
