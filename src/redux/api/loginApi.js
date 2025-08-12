

import supabase from "../../SupabaseClient";

export const LoginCredentialsApi = async (formData) => {
  const { data, error } = await supabase
    .from('master')
    .select('*')
    .eq("user_name", formData.username)
    .eq('password', formData.password)
   // .eq('status', 'active')
    .single(); // get a single user

  if (error || !data) {
    return { error: 'Invalid username or password' };
  }

  return { data };
};
