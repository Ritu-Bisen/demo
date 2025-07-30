import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChecklistData, fetchDelegationData } from "../api/quickTaskApi";

export const uniqueChecklistTaskData = createAsyncThunk( 'fetch/checklistTask',async () => {
    const Task = await fetchChecklistData();
   
    return Task;
  }
);
export const uniqueDelegationTaskData = createAsyncThunk( 'fetch/delegationTask',async () => {
    const Task = await fetchDelegationData();
   
    return Task;
  }
);




const quickTaskSlice = createSlice({
  name: 'quickTask',
 
  initialState: {
    quickTask: [],
    delegationTasks:[],
    error: null,
    loading: false,
    
   
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uniqueChecklistTaskData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uniqueChecklistTaskData.fulfilled, (state, action) => {
        state.loading = false;
        state.quickTask = action.payload;
      })
      .addCase(uniqueChecklistTaskData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
         .addCase(uniqueDelegationTaskData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uniqueDelegationTaskData.fulfilled, (state, action) => {
        state.loading = false;
        state.delegationTasks = action.payload;
      })
      .addCase(uniqueDelegationTaskData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      
  },
});

export default quickTaskSlice.reducer;
