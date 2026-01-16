import { supabase } from '../lib/supabase';

const generateDepartmentId = (departments) => {
  const count = departments.length + 1;
  return `JCC-DEPT-${String(count).padStart(3, '0')}`;
};

export const departmentService = {
  getDepartments: async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map(dept => ({
        id: dept.id,
        name: dept.name,
        createdAt: dept.created_at,
      }));
    } catch (error) {
      console.error('Error reading departments from Supabase:', error);
      return [];
    }
  },

  saveDepartment: async (departmentName) => {
    try {
      const departments = await departmentService.getDepartments();
      const normalized = departmentName.trim();
      
      if (normalized && !departments.some(d => d.name.toLowerCase() === normalized.toLowerCase())) {
        const newDeptId = generateDepartmentId(departments);
        const { data, error } = await supabase
          .from('departments')
          .insert({
            id: newDeptId,
            name: normalized,
            created_at: new Date().toISOString(),
          })
          .select();
        
        if (error) throw error;
        return await departmentService.getDepartments();
      }
      return departments;
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
      return await departmentService.getDepartments();
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
      return await departmentService.getDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },
};
