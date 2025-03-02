import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
  OutlinedInput,
  Card,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { SearchResponse } from '../types/SearchResponse';
import { WordGrid } from '../component/Word';
import { Word } from '../types/Word';
import { useSnackbarStore } from '../store/snackbarStore';
import RequireLogin from '../component/RequireLogin';

const searchWords = async (
  token: string,
  query: string,
  pageSize: number,
  pageNo?: number,
  languageId?: number
) => {
  if (!pageNo) return;
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
  if (!authToken) return <RequireLogin />;

  const [query, setQuery] = useState('');
  const [languageId, setLanguageId] = useState<number | undefined>(undefined);
  const [pageNo, setPageNo] = useState<number | undefined>(undefined);
  const pageSize = 20;

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['searchWords', query, pageNo, languageId],
    queryFn: () => searchWords(authToken, query, pageSize, pageNo, languageId),
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [pageNo]);

  const toggleLike = async (word: Word) => {
    try {

      const newSaveStatus = !word.isLiked;
      await axios.post(
        'http://localhost:3001/like/insert-like',
        {
          contentId: word.id,
          contentType: 1,
          isActive: newSaveStatus,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      refetch();
    } catch (error) {
      showSnackbar('Fail to update', 'error');
    }
  };

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const toggleSave = async (word: Word) => {
    try {

      const newSaveStatus = !word.isSaved;
      await axios.post(
        'http://localhost:3001/saved/insert-saved',
        {
          contentId: word.id,
          contentType: 1,
          isActive: newSaveStatus,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      showSnackbar('Updated Saved!');
      refetch();
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
    if (pageNo === 1) {
      refetch();
      return;
    }
    setPageNo(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNo(newPage);
  };

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
            words={data?.data || []}
            toggleLike={toggleLike}
            toggleSave={toggleSave}
          ></WordGrid>

          {data?.total === 0 && (
            <Box display="flex" justifyContent="center" width="100%" sx={{ mt: 3 }}>
              <Typography sx={{ color: 'text.secondary' }}>
                No results found
              </Typography>
            </Box>
          )}
        </Box>
      )}
      {data?.total !== undefined && data.total > 0 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <Pagination
            count={Math.ceil(data.total / pageSize) || 1}
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
