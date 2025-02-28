import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Container, Typography } from '@mui/material';
import { useAuth } from "../context/AuthContext";

interface Word {
    id: number;
    name: string;
    meaning: string;
    languageId: number; 
}

const fetchSavedWords = async (token: string): Promise<Word[]> => {
    const response = await axios.get<Word[]>('http://localhost:3001/word/get-words', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export default function Saved() {
    const { getToken } = useAuth();
    const token = getToken();

    const { data: words, error, isLoading } = useQuery({
        queryKey: ['savedWords'],
        queryFn: () => fetchSavedWords(token ?? "")
    });

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) {
        console.log(error);
        return <Typography variant="h6" color="error">Error loading data: {error instanceof Error ? error.message : "Unknown error"}</Typography>;
    }

    const columns: GridColDef[] = [
        { field: "name", headerName: "Word", align: "center", headerAlign: "center", width: 200 },
        { field: "meaning", headerName: "Meaning", align: "center", headerAlign: "center", width: 200 },
    ];

    return (
        <Container>
            <Box
                sx={{
                    py: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <Typography variant="h4">Saved Words</Typography>
            </Box>
            <DataGrid
                rows={words || []}
                columns={columns}
                sx={{
                    '& .MuiDataGrid-colu': {
                        fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                    },
                }}
            />
        </Container>
    );
}
