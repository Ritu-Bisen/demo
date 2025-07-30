import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChechListDataForHistory, fetchChechListDataSortByDate, postChecklistAdminDoneAPI, updateChecklistData } from "../api/checkListApi";




export const checklistData=createAsyncThunk( 'fetch/checklist',async () => {
    const checklist = await fetchChechListDataSortByDate();
   
    return checklist;
  }
);

export const checklistHistoryData=createAsyncThunk( 'fetch/history',async () => {
    const histroydata = await fetchChechListDataForHistory();
   
    return histroydata;
  }
);

export const checklistAdminDone=createAsyncThunk( 'insert/admin_done',async () => {
  const admin_done = await postChecklistAdminDoneAPI();
 
  return admin_done;
}
);

// checkListSlice.js
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
    history:[],
    error: null,
    loading: false,
   
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
   
      .addCase(checklistData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checklistData.fulfilled, (state, action) => {
        state.loading = false;
        state.checklist=action.payload;
      })
      .addCase(checklistData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
         .addCase(updateChecklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChecklist.fulfilled, (state, action) => {
        state.loading = false;
        state.checklist=action.payload;
      })
      .addCase(updateChecklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
         .addCase(checklistHistoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checklistHistoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.history=action.payload;
      })
      .addCase(checklistHistoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checklistAdminDone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checklistAdminDone.fulfilled, (state, action) => {
        state.loading = false;
        state.history.push(action.payload);
      })
      .addCase(checklistAdminDone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
     
  },
});

export default checkListSlice.reducer;
