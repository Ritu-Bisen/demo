import supabase from "../../SupabaseClient";

// ==========================
// Fetch All Dashboard Data
// ==========================
export const fetchDashboardDataApi = async (dashboardType) => {
  try {
    console.log(dashboardType);
    const { data, error } = await supabase
      .from(dashboardType)
      .select('*');

    if (error) {
      console.error("Error when fetching data", error);
      return [];
    }

    console.log("Fetched successfully", data);
    return data;
  } catch (error) {
    console.error("Error from Supabase", error);
    return [];
  }
};

// ==========================
// Count Total Tasks
// ==========================
export const countTotalTaskApi = async (dashboardType) => {
  const today = new Date().toISOString().split('T')[0];
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('user-name');

  try {
    let query = supabase
      .from(dashboardType)
      .select('*', { count: 'exact', head: true });

    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error when fetching total tasks", error);
      return null;
    }

    console.log('Total checklist rows:', count);
    return count;
  } catch (error) {
    console.error("Error from Supabase", error);
    return null;
  }
};

// ==========================
// Count Completed Tasks
// ==========================
export const countCompleteTaskApi = async (dashboardType) => {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('user-name');

  try {
    let query;

    if (dashboardType === 'delegation') {
      query = supabase
        .from('delegation')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done')
        .eq('color_code_for', 1);
    } else {
      query = supabase
        .from('checklist')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Yes');
    }

    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Supabase error (complete count):', error);
      return null;
    }

    console.log(`Total ${dashboardType} complete count:`, count);
    return count;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

// ==========================
// Count Pending / Delayed Tasks
// ==========================
export const countPendingOrDelayTaskApi = async (dashboardType) => {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('user-name');
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  try {
    let query;

    if (dashboardType === 'delegation') {
      query = supabase
        .from('delegation')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done')
        .eq('color_code_for', 2);
    } else {
      query = supabase
        .from('checklist')
        .select('*', { count: 'exact', head: true })
        .is('status', null) // FIXED from .or()
        .lte('task_start_date', today); // safer date format
    }

    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Supabase error (pending/delay count):', error);
      return null;
    }

    console.log(`Total ${dashboardType} pending/delay count:`, count);
    return count;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

// ==========================
// Count Overdue / Extended Tasks
// ==========================
export const countOverDueORExtendedTaskApi = async (dashboardType) => {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('user-name');
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  try {
    let query;

    if (dashboardType === 'delegation') {
      query = supabase
        .from('delegation')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done')
        .gt('color_code_for', 2);
    } else {
      query = supabase
        .from('checklist')
        .select('*', { count: 'exact', head: true })
        .is('status', null)
        .lt('task_start_date', today); // exclude today
    }

    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Supabase error (overdue/extended count):', error);
      return null;
    }

    console.log(`Total ${dashboardType} overdue/extended count:`, count);
    return count;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};
