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

  renumberDepartments: async () => {
    try {
      // 1. Get all departments sorted by creation date
      const { data: departments, error: fetchError } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      if (!departments || departments.length === 0) {
        return { success: true, message: 'No departments to renumber' };
      }

      // 2. Create mapping of old IDs to new IDs
      const idMapping = {};
      departments.forEach((dept, index) => {
        const newId = `JCC-DEPT-${String(index + 1).padStart(3, '0')}`;
        idMapping[dept.id] = newId;
      });

      // 3. Get all members to update their department references
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*');
      
      if (membersError) throw membersError;

      // 4. Update all departments with new IDs
      for (const dept of departments) {
        const newId = idMapping[dept.id];
        if (dept.id !== newId) {
          // Delete old record
          await supabase.from('departments').delete().eq('id', dept.id);
          
          // Insert with new ID
          await supabase.from('departments').insert({
            id: newId,
            name: dept.name,
            created_at: dept.created_at,
          });
        }
      }

      // 5. Update member records that reference these departments
      if (members && members.length > 0) {
        for (const member of members) {
          if (member.church_details?.departments && Array.isArray(member.church_details.departments)) {
            let updated = false;
            const updatedDepartments = member.church_details.departments.map(dept => {
              if (idMapping[dept.id] && dept.id !== idMapping[dept.id]) {
                updated = true;
                return { ...dept, id: idMapping[dept.id] };
              }
              return dept;
            });

            if (updated) {
              await supabase
                .from('members')
                .update({
                  church_details: {
                    ...member.church_details,
                    departments: updatedDepartments
                  }
                })
                .eq('id', member.id);
            }
          }
        }
      }

      return { 
        success: true, 
        message: `Successfully renumbered ${departments.length} departments`,
        count: departments.length 
      };
    } catch (error) {
      console.error('Error renumbering departments:', error);
      throw error;
    }
  },
};
