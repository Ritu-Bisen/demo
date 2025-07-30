import supabase from "../../SupabaseClient";

export const fetchChecklistData = async () => {
  try {
    const { data, error } = await supabase
      .from('checklist')
      .select('*');

    if (error) {
      console.log("Error when fetching data", error);
      return [];
    }

    const seen = new Set();
    const uniqueRows = data.filter(row => {
      if (seen.has(row.task_description)) return false;
      seen.add(row.task_description);
      return true;
    });

    console.log("Fetched successfully", uniqueRows);
    return uniqueRows;

  } catch (error) {
    console.log("Error from Supabase", error);
    return [];
  }
};



export const fetchDelegationData = async () => {
  try {
    const { data, error } = await supabase
      .from('delegation')
      .select('*')
      .order('task_id', { ascending: true });
      

    if (error) {
      console.log("Error when fetching data", error);
      return [];
    }

    const seen = new Set();
    const uniqueRows = data.filter(row => {
      if (seen.has(row.task_description)) return false;
      seen.add(row.task_description);
      return true;
    });

    console.log("Fetched successfully", uniqueRows);
    return uniqueRows;

  } catch (error) {
    console.log("Error from Supabase", error);
    return [];
  }
};

