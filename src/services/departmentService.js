import { supabase } from '../lib/supabase';

const generateDepartmentId = async () => {
  // Get all departments and find the highest number
  const { data, error } = await supabase
    .from('departments')
    .select('id')
    .like('id', 'JCC-DEPT-%');
  
  if (error) {
    console.error('Error fetching departments:', error);
    return 'JCC-DEPT-001';
  }
  
  if (!data || data.length === 0) {
    return 'JCC-DEPT-001';
  }
  
  // Extract numbers from IDs and find the maximum
  const numbers = data.map(dept => {
    const match = dept.id.match(/JCC-DEPT-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  
  const maxNumber = Math.max(...numbers, 0);
  const nextNumber = maxNumber + 1;
  
  return `JCC-DEPT-${String(nextNumber).padStart(3, '0')}`;
};

export const departmentService = {
  getDepartments: async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data?.map(dept => ({
        id: dept.id,
        name: dept.name,
        createdAt: dept.created_at,
      })) || [];
    } catch (error) {
      console.error('Error reading departments from Supabase:', error);
      return [];
    }
  },

  saveDepartment: async (departmentName) => {
    try {
      const normalized = departmentName.trim();
      if (!normalized) return null;
      
      // Check for duplicates efficiently
      const { data: existing, error: checkError } = await supabase
        .from('departments')
        .select('id')
        .ilike('name', normalized)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (existing && existing.length > 0) {
        return null; // Already exists
      }
      
      const newDeptId = await generateDepartmentId();
      const { error } = await supabase
        .from('departments')
        .insert({
          id: newDeptId,
          name: normalized,
          created_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      return null;
    } catch (error) {
      console.error('Error saving department:', error);
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return null;
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  },

  updateDepartment: async (id, newName) => {
    try {
      const { error } = await supabase
        .from('departments')
        .update({ name: newName.trim() })
        .eq('id', id);
      
      if (error) throw error;
      return null;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },
};
