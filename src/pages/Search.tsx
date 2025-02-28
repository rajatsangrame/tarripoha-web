import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { Word } from '../types/Word';

const searchWords = async (
  token: string,
  query: string,
  pageNo: number,
  pageSize: number,
  languageId?: number,
) => {
  const response = await axios.get('http://localhost:3001/word/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      query,
      pageNo,
      pageSize,
      ...(languageId !== undefined ? { languageId } : {}),
    },
  });
  return response.data;
};

export default function Search() {
  const { getToken } = useAuth();
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  const [query, setQuery] = useState('');
  const [languageId, setLanguageId] = useState<number | undefined>(undefined);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['searchWords', query, pageNo, languageId],
    queryFn: () => searchWords(token, query, pageNo, pageSize, languageId),
    enabled: false,
  });

  const handleSearch = () => {
    setPageNo(1);
    refetch();
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
    refetch();
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Word', flex: 1 },
    { field: 'meaning', headerName: 'Meaning', flex: 1 },
    { field: 'englishMeaning', headerName: 'English Meaning', flex: 1 },
  ];

  return (
    <Container sx={{ mt: 4, maxWidth: '900px', pb: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}
      >
        Search Words
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={3}
        sx={{
          backdropFilter: 'blur(12px)',
          padding: '14px',
          borderRadius: '14px',
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <FormControl fullWidth variant="outlined">
          <OutlinedInput
            placeholder="Search for a word..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            sx={{
              borderRadius: '10px',
            }}
          />
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={languageId}
            label="Language"
            onChange={(e) =>
              setLanguageId(
                e.target.value === '' ? undefined : Number(e.target.value),
              )
            }
          >
            <MenuItem value={1}>Marathi</MenuItem>
            <MenuItem value={2}>Hindi</MenuItem>
            <MenuItem value={3}>English</MenuItem>
          </Select>
        </FormControl>

        {/* Search Button */}
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            minWidth: 130,
            height: 46,
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '10px',
            textTransform: 'none',
          }}
        >
          Search
        </Button>
      </Box>

      <Box
        sx={{
          height: 450,
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          padding: 2,
        }}
      >
        {isFetching ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={data?.data || []}
            columns={columns}
            getRowId={(row) => row.id}
            rowCount={data?.total || 0}
            paginationModel={{ page: pageNo - 1, pageSize }}
            onPaginationModelChange={(model) => setPageNo(model.page + 1)}
            disableColumnFilter
            disableDensitySelector
            disableRowSelectionOnClick
          />
        )}
      </Box>
    </Container>
  );
}
