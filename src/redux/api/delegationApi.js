// delegationApiSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../SupabaseClient';

export const insertDelegationDoneAndUpdate = createAsyncThunk(
  'delegation/insertDelegationDoneAndUpdate',
  async ({ selectedDataArray, uploadedImages }, { rejectWithValue }) => {
    const userName = localStorage.getItem('user-name');
    console.log(selectedDataArray.next_target_date);
    

    const formatDate = (val) => {
  if (!val || val === '') return null;
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date.toISOString();
};


    try {
      for (const item of selectedDataArray) {
        let imageUrl = null;
        const imageFile = uploadedImages[item.task_id];

        // Step 1: Upload image if exists
        if (imageFile) {
          const filePath = `${item.task_id}/${crypto.randomUUID()}_${imageFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('delegation') // Ensure this bucket exists
            .upload(filePath, imageFile, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
          }

          const { data: publicUrlData } = supabase.storage
            .from('delegation')
            .getPublicUrl(uploadData.path);

          imageUrl = publicUrlData?.publicUrl || null;
          console.log(imageUrl);
          
        }

        // Step 2: Insert into delegation_done table
    const { error: upsertError } = await supabase
  .from('delegation_done')
  .upsert([
    {
      task_id: item.task_id,
      next_extend_date: item.status === 'Done' ? null : formatDate(item.next_target_date),
      status: item.status === 'Done' ? 'done' : 'extend',
      reason: item.remarks,
      task_description: item.task_description,
      given_by: item.given_by,
      name: userName,
      image_url: imageUrl,
    },
  ], {
    onConflict: 'task_id', // Ensure it targets the unique constraint
  });

if (upsertError) {
  console.error('Upsert Error:', upsertError);
  throw upsertError;
}


        // Step 3: Update delegation table
       const updateFields = {
          status: item.status === 'Done' ? 'done' : 'extend',
          submission_date: item.status === 'Done' ? new Date().toISOString() : null,
          remarks: item.remarks,
          image: imageUrl,
        };

        if (item.status !== 'Done') {
           updateFields.planned_date = formatDate(item.next_target_date);
        }

        // Step 4: Update delegation table
        const { error: updateError } = await supabase
          .from('delegation')
          .update(updateFields)
          .eq('task_id', item.task_id);

        if (updateError) {
          console.error('Update Error:', updateError);
          throw updateError;
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Insert/Update Error:', error);
      return rejectWithValue(error.message || 'Failed to process delegation data');
    }
  }
);


export const fetchDelegationDataSortByDate = async () => {
  const role=localStorage.getItem("role");
   const username=localStorage.getItem("user-name");
  try {
    let query = supabase
      .from('delegation')
      .select('*')
      .order('task_start_date', { ascending: true })
      .or('status.is.null,status.eq.extend');

    // Apply role-based filter
    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { data, error } = await query;

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



export const fetchDelegation_DoneDataSortByDate = async () => {
   const role=localStorage.getItem("role");
   const username=localStorage.getItem("user-name");
  try {
    let query = supabase
      .from('delegation_done')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by user if role is 'user'
    if (role === 'user' && username) {
      query = query.eq('name', username);
    }

    const { data, error } = await query;

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


