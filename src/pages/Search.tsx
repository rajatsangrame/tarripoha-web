import React, { useEffect, useState } from 'react';

import { Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Typography,
} from '@mui/material';
import axios from 'axios';

import RequireLogin from '../component/RequireLogin';
import WordGrid from '../component/Word';
import { useAuth } from '../context/AuthContext';
import { useSnackbarStore } from '../store/snackbarStore';
import { SearchResponse } from '../types/SearchResponse';
import { Word } from '../types/Word';

const searchWords = async (
  token: string,
  query: string,
  pageSize: number,
  pageNo?: number,
  languageId?: number
) => {
  const response = await axios.get<SearchResponse>(
    'http://localhost:3001/word/search',
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        query,
        pageNo,
        pageSize,
        ...(languageId !== undefined ? { languageId } : {}),
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

export default function Search() {

  const authToken = getUserTokenOrShowError();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [query, setQuery] = useState('');
  const [languageId, setLanguageId] = useState<number | undefined>(undefined);
  const [pageNo, setPageNo] = useState<number | undefined>(undefined);
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const pageSize = 20;

  const refetch = async () => {
    console.log('refetch', `pageNo ${pageNo} query ${query}`);
    if (!pageNo || !query) return null;
    setIsFetching(true);
    const words = await searchWords(authToken, query, pageSize, pageNo, languageId);
    setSearchData(words);
    setIsFetching(false);
  };

  useEffect(() => {
    console.log('useEffect', `pageNo ${pageNo} query ${query}`);
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

      setSearchData((prevWords) =>
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
      console.log(error);
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
      setSearchData((prevWords) =>
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

  /**
   * This will only get trigger when user hits search button.
   * We simply set the pageNo and refetch() will trigger from useEffect.
   * If the page no already 1. We force refresh as setPageNo(1) will have no effect.
   */
  const handleSearch = () => {
    if (!query.trim()) {
      showSnackbar('Please enter a search term.', 'info'); // Show error if query is empty
      return;
    }
    if (pageNo === 1) {
      refetch();
      return;
    }
    setPageNo(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNo(newPage);
  };

  if (!authToken) return <RequireLogin />;

  return (
    <Container sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        Search Words
      </Typography>

      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: (theme) => (theme.palette.mode === 'dark' ? 6 : 3),
          textAlign: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              placeholder="Search for a word..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: 2,
                bgcolor: 'background.paper',
                px: 1.5,
              }}
            />
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={languageId}
              label="Language"
              onChange={(e) =>
                setLanguageId(e.target.value === '' ? undefined : Number(e.target.value))
              }
              sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
            >
              <MenuItem>Select</MenuItem>
              <MenuItem value={1}>Marathi</MenuItem>
              <MenuItem value={2}>Hindi</MenuItem>
              <MenuItem value={3}>English</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!query.trim()}
            sx={{
              minWidth: 130,
              height: 46,
              fontSize: 16,
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Search
          </Button>
        </Box>
      </Card>

      {isFetching && (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!isFetching && (
        <Box sx={{ flexGrow: 1, mt: 3 }} display="flex" width='100%'>
          <WordGrid
            words={searchData?.data || []}
            toggleLike={toggleLike}
            toggleSave={toggleSave}
          ></WordGrid>

          {searchData?.total === 0 && (
            <Box display="flex" justifyContent="center" width="100%" sx={{ mt: 3 }}>
              <Typography sx={{ color: 'text.secondary' }}>
                No results found
              </Typography>
            </Box>
          )}
        </Box>
      )}
      {searchData?.total !== undefined && searchData.total > 0 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <Pagination
            count={Math.ceil(searchData.total / pageSize) || 1}
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
