import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Market {
    id: number;
    question: string;
    category: string;
    yes_probability: number;
    volume: string;
    status: string;
    end_date: string;
    resolved_outcome?: string;
    image_url?: string;
}

interface MarketsState {
    allMarkets: Market[];
    filteredMarkets: Market[];
    loading: boolean;
    error: string | null;
    lastUpdate: number;
}

const initialState: MarketsState = {
    allMarkets: [],
    filteredMarkets: [],
    loading: false,
    error: null,
    lastUpdate: 0,
};

// Thunk to fetch all markets
export const fetchMarkets = createAsyncThunk(
    'markets/fetchMarkets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets/`);
            if (!response.ok) {
                return rejectWithValue('Failed to fetch markets');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue('Connection error');
        }
    }
);

const marketsSlice = createSlice({
    name: 'markets',
    initialState,
    reducers: {
        setFilteredMarkets: (state, action) => {
            state.filteredMarkets = action.payload;
        },
        clearMarkets: (state) => {
            state.allMarkets = [];
            state.filteredMarkets = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarkets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMarkets.fulfilled, (state, action) => {
                state.allMarkets = action.payload;
                state.filteredMarkets = action.payload;
                state.loading = false;
                state.lastUpdate = Date.now();
            })
            .addCase(fetchMarkets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilteredMarkets, clearMarkets } = marketsSlice.actions;
export default marketsSlice.reducer;
