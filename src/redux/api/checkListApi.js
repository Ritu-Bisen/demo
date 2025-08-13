import supabase from "../../SupabaseClient";

// checkListApi.js
export const fetchChechListDataSortByDate = async (page = 1, limit = 10, searchTerm = '') => {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  
  try {
    const today = new Date();
    const endOfTomorrow = new Date();
    endOfTomorrow.setDate(today.getDate() + 1);
    endOfTomorrow.setHours(23, 59, 59, 999);
    const endOfTomorrowISO = endOfTomorrow.toISOString();

    // Base query with only necessary filters
    let query = supabase
      .from('checklist')
      .select('task_id, department, given_by, name, task_description, task_start_date, frequency, enable_reminder, require_attachment, submission_date, status, remark, image, admin_done')
      .range((page - 1) * limit, (page * limit) - 1)
      .lte('task_start_date', endOfTomorrowISO)
      .order('task_start_date', { ascending: true })
      .or('submission_date.is.null,status.is.null');

    // Add search filter if provided
    if (searchTerm) {
      query = query.ilike('task_description', `%${searchTerm}%`);
    }

    // Add user filter if needed
    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      hasMore: data?.length === limit
    };
  } catch (error) {
    console.error("Error fetching checklist data:", error);
    throw error;
  }
};

export const fetchChechListDataForHistory = async () => {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  
  try {
    // Only select completed tasks (where submission_date is not null)
    let query = supabase
      .from('checklist')
      .select('task_id, department, given_by, name, task_description, task_start_date, frequency, enable_reminder, require_attachment, submission_date, status, remark, image, admin_done')
      .not('submission_date', 'is', null)
      .not('status', 'is', null)
      .order('task_start_date', { ascending: false });

    // Add user filter if needed
    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching history data:", error);
    throw error;
  }
};



export const updateChecklistData = async (submissionData) => {
  try {
    // Validate input data
    if (!Array.isArray(submissionData) || submissionData.length === 0) {
      throw new Error('Invalid submission data');
    }

    const updates = await Promise.all(submissionData.map(async (item) => {
      let imageUrl = null;

      // Handle image upload if it exists
      if (item.image && item.image.previewUrl) {
        try {
          // 1. Convert blob URL to actual file
          const response = await fetch(item.image.previewUrl);
          const blob = await response.blob();
          const file = new File([blob], item.image.name, { type: item.image.type });

          // 2. Generate unique file path
          const fileExt = item.image.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const filePath = `task-${item.taskId}/${fileName}`;

          // 3. Upload to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('checklist')
            .upload(filePath, file, {
              cacheControl: '3600',
              contentType: item.image.type,
              upsert: false
            });

          if (uploadError) throw uploadError;

          // 4. Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('checklist')
            .getPublicUrl(filePath);

          if (!publicUrl) throw new Error('Failed to generate public URL');
          
          imageUrl = publicUrl;
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      // Prepare update object
      return {
        task_id: item.taskId,
        status: item.status , // Convert to boolean if needed
        remark: item.remarks,
        submission_date: new Date().toISOString(),
        image: imageUrl,
        // // Add other fields as needed
        // department: item.department,
        // task_description: item.taskDescription,
        // given_by: item.givenBy
      };
    }));

    // 5. Update checklist table
    const { data, error } = await supabase
      .from('checklist')
      .upsert(updates, { onConflict: ['task_id'] });

    if (error) throw error;

    console.log('Checklist updated successfully:', data);
    return data;

  } catch (error) {
    console.error('Error in updateChecklistData:', error);
    throw new Error(`Failed to update checklist: ${error.message}`);
  }
};


export const postChecklistAdminDoneAPI = async (selectedHistoryItems) => {
  try {
    if (!selectedHistoryItems || selectedHistoryItems.length === 0) {
      console.log("No items selected for marking as done");
      return { error: "No items selected" };
    }

    // Get current timestamp for admin_done column
    // const currentDate = new Date();
    // const formattedDate = currentDate.toISOString(); // Or format as needed

    // Prepare the updates
    const updates = selectedHistoryItems.map(item => ({
      task_id: item.task_id, // Assuming each item has an 'id' field
      admin_done: "Done",
      // You can add other fields to update if needed
    }));

    // Perform the update in Supabase
    const { data, error } = await supabase
      .from('checklist')
      .upsert(updates) // Using upsert to update existing records
      .select();

    if (error) {
      console.error("Error updating checklist items:", error);
      return { error };
    }

    console.log("Successfully updated items:", data);
    return { data };
    
  } catch (error) {
    console.error("Error in supabase operation:", error);
    return { error };
  }
};