import supabase from "../../SupabaseClient";

export const fetchDashboardDataApi = async (dashboardType) => {
  try {
    console.log(dashboardType)
    const { data, error } = await supabase
      .from(dashboardType)
      .select('*');

    if (error) {
      console.log("Error when fetching data", error);
      return [];
    }

   

    console.log("Fetched successfully", data);
    return data;

  } catch (error) {
    console.log("Error from Supabase", error);
    return [];
  }
};


export const countTotalTaskApi = async (dashboardType) => {
   const role=localStorage.getItem('role');
   const username=localStorage.getItem('user-name');
  try {
    let query = supabase
      .from(dashboardType)
      .select('*', { count: 'exact', head: true });

    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { count, error } = await query;

    if (!error) {
      console.log('Total checklist rows:', count);
    } else {
      console.log("Error when fetching data", error);
    }

    return count;
  } catch (error) {
    console.log("Error from Supabase", error);
    return null;
  }
};


export const countCompleteTaskApi = async (dashboardType) => {
   const role=localStorage.getItem('role');
   const username=localStorage.getItem('user-name');
  try {
    let query;

    if (dashboardType === 'delegation') {
      query = supabase
        .from('delegation')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done')
        .eq('color_code_for', 1);

      if (role === 'user' && username) {
        query = query.eq('name', username);
      }
    } else {
      query = supabase
        .from('checklist')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Yes');

      if (role === 'user' && username) {
        query = query.eq('name', username);
      }
    }

    const { count, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    console.log(`Total ${dashboardType} complete count:`, count);
    return count;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};



export const countPendingOrDelayTaskApi = async (dashboardType) => {
   const role=localStorage.getItem('role');
   const username=localStorage.getItem('user-name');
  try {
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    let query;

    if (dashboardType === 'delegation') {
      query = supabase
        .from('delegation')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done')
        .eq('color_code_for', 2);

      if (role === 'user' && username) {
        query = query.eq('name', username);
      }
    } else {
      query = supabase
        .from('checklist')
        .select('*', { count: 'exact', head: true })
        .or('status.is.null')
        .lte('task_start_date', `${today}T23:59:59`);

      if (role === 'user' && username) {
        query = query.eq('name', username);
      }
    }

    const { count, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    console.log(`Total ${dashboardType} pending/delay count:`, count);
    return count;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};


export const countOverDueORExtendedTaskApi = async (dashboardType) => {
  const role=localStorage.getItem('role');
   const username=localStorage.getItem('user-name');
  try {
    let query;
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    if (dashboardType === 'delegation') {
      // From 'delegation' table where status = 'done' AND color_code_for > 2
      query = supabase
        .from('delegation')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done')
        .gt('color_code_for', 2);

      // Apply user-based filter if role is user
      if (role === 'user' && username) {
        query = query.eq('name', username);
      }
    } else {
      // From 'checklist' table where status is null AND task_start_date < today
      query = supabase
        .from('checklist')
        .select('*', { count: 'exact', head: true })
        .is('status', null)
        .lt('task_start_date', today); // exclude today

      if (role === 'user' && username) {
        query = query.eq('name', username);
      }
    }

    const { count, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    console.log(`Total ${dashboardType} count:`, count);
    return count;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

