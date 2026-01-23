import { supabase } from '../lib/supabase';

const generateMemberId = (members, memberType) => {
  // Filter members by type to get correct count
  const typePrefix = memberType === 'Worker' ? 'WRK' : 
                     memberType === 'Volunteer' ? 'VOL' : 'MBR';
  const sameTypeMembers = members.filter(m => {
    const prefix = m.id.split('-')[1];
    return prefix === typePrefix;
  });
  const count = sameTypeMembers.length + 1;
  return `JCC-${typePrefix}-${String(count).padStart(3, '0')}`;
};

export const storageService = {
  getMembers: async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database format to app format
      return data.map(member => ({
        id: member.id,
        personalDetails: member.personal_details,
        churchDetails: member.church_details,
        createdAt: member.created_at,
        updatedAt: member.updated_at,
      }));
    } catch (error) {
      console.error('Error reading from Supabase:', error);
      return [];
    }
  },

  saveMember: async (member) => {
    try {
      const members = await storageService.getMembers();
      const existingMember = members.find(m => m.id === member.id);
      
      if (existingMember) {
        // Update existing member
        const { data, error } = await supabase
          .from('members')
          .update({
            personal_details: member.personalDetails,
            church_details: member.churchDetails,
            updated_at: new Date().toISOString(),
          })
          .eq('id', member.id)
          .select();
        
        if (error) throw error;
        return await storageService.getMembers();
      } else {
        // Create new member with generated ID
        const memberId = generateMemberId(members, member.churchDetails.memberType);
        const { data, error } = await supabase
          .from('members')
          .insert({
            id: memberId,
            personal_details: member.personalDetails,
            church_details: member.churchDetails,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();
        
        if (error) throw error;
        return await storageService.getMembers();
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
  },

  deleteMember: async (id) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return await storageService.getMembers();
    } catch (error) {
      console.error('Error deleting from Supabase:', error);
      throw error;
    }
  },

  getMemberById: async (id) => {
    const members = await storageService.getMembers();
    return members.find(m => m.id === id);
  },
};
