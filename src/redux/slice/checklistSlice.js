import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChechListDataForHistory, fetchChechListDataSortByDate, postChecklistAdminDoneAPI, updateChecklistData } from "../api/checkListApi";

export const fetchChecklistData = createAsyncThunk(
  'checklist/fetchChecklistData',
  async ({ page = 1, searchTerm = '' }, { getState }) => {
    const { checklist } = getState();
    const currentPage = page || checklist.currentPage;
    const response = await fetchChechListDataSortByDate(currentPage, 10, searchTerm);
    return {
      data: response.data,
      page: currentPage,
      hasMore: response.hasMore
    };
  }
);


export const searchChecklist = createAsyncThunk(
  'search/checklist',
  async (searchTerm, { dispatch }) => {
    // Reset and fetch first page with search term
    dispatch(resetChecklist());
    return dispatch(fetchChecklistData({ page: 1, searchTerm })).unwrap();
  }
);

export const checklistHistoryData = createAsyncThunk(
  'fetch/history',
  async () => {
    const historyData = await fetchChechListDataForHistory();
    return historyData;
  }
);

export const checklistAdminDone = createAsyncThunk(
  'insert/admin_done',
  async (selectedItems) => {
    const adminDone = await postChecklistAdminDoneAPI(selectedItems);
    return adminDone;
  }
);

export const updateChecklist = createAsyncThunk(
  'update/checklist',
  async (submissionData) => {
    const updated = await updateChecklistData(submissionData);
    return updated;
  }
);

const checkListSlice = createSlice({
  name: 'checklist',
  initialState: {
    checklist: [],
    error: null,
    loading: false,
    currentPage: 1,
    hasMore: true,
    searchTerm: ''
  },
  reducers: {
    resetChecklist: (state) => {
      state.checklist = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.searchTerm = '';
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklistData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklistData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.checklist = action.payload.data;
        } else {
          const existingIds = new Set(state.checklist.map(item => item.task_id));
          const newItems = action.payload.data.filter(item => !existingIds.has(item.task_id));
          state.checklist.push(...newItems);
        }
        state.currentPage = action.payload.page + 1;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchChecklistData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchChecklist.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchChecklist.fulfilled, (state) => {
        state.isSearching = false;
      })
      .addCase(searchChecklist.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.error.message;
      })
      .addCase(updateChecklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChecklist.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific items in checklist
        state.checklist = state.checklist.map(item => 
          action.payload.find(updated => updated.task_id === item.task_id) || item
        );
      })
      .addCase(updateChecklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(checklistHistoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checklistHistoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(checklistHistoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(checklistAdminDone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checklistAdminDone.fulfilled, (state, action) => {
        state.loading = false;
        // Update history items with admin_done status
        state.history = state.history.map(item => 
          action.payload.some(updated => updated.task_id === item.task_id) 
            ? { ...item, admin_done: new Date().toISOString() }
            : item
        );
      })
      .addCase(checklistAdminDone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default checkListSlice.reducer;
export const { resetChecklist, setSearchTerm } = checkListSlice.actions;