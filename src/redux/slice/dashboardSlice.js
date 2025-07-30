import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { countCompleteTaskApi, countOverDueORExtendedTaskApi, countPendingOrDelayTaskApi, countTotalTaskApi, fetchDashboardDataApi } from "../api/dashboardApi";

export const dashboardData = createAsyncThunk( 'fetch/dashboard',async (dashboardType) => {
    const Task = await fetchDashboardDataApi(dashboardType);
   
    return Task;
  }
);

export const totalTaskInTable = createAsyncThunk( 'fetch/totaltask',async (dashboardType) => {
    const totalTask = await countTotalTaskApi(dashboardType);
   
    return totalTask;
  }
);

export const completeTaskInTable = createAsyncThunk( 'fetch/completeTask',async (dashboardType) => {
    const completeTask = await countCompleteTaskApi(dashboardType);
   
    return completeTask;
  }
);

export const pendingTaskInTable = createAsyncThunk( 'fetch/pendingTask',async (dashboardType) => {
    const pendingTask = await countPendingOrDelayTaskApi(dashboardType);
   
    return pendingTask;
  }
);

export const overdueTaskInTable = createAsyncThunk( 'fetch/overdueTask',async (dashboardType) => {
    const overdueTask = await countOverDueORExtendedTaskApi(dashboardType);
   
    return overdueTask;
  }
);


const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboard:[],
    totalTask:[],
    completeTask:[],
    pendingTask:[],
     overdueTask:[],
    error: null,
    loading: false,
    
   
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(dashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(totalTaskInTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(totalTaskInTable.fulfilled, (state, action) => {
        state.loading = false;
        state.totalTask = action.payload;
      })
      .addCase(totalTaskInTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(completeTaskInTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTaskInTable.fulfilled, (state, action) => {
        state.loading = false;
        state.completeTask = action.payload;
      })
      .addCase(completeTaskInTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
         .addCase(pendingTaskInTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pendingTaskInTable.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTask = action.payload;
      })
      .addCase(pendingTaskInTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(overdueTaskInTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(overdueTaskInTable.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueTask = action.payload;
      })
      .addCase(overdueTaskInTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export default dashboardSlice.reducer;
