import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, CheckCircle, LogOut } from 'lucide-react';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import ChurchDetailsForm from './components/ChurchDetailsForm';
import MembersList from './components/MembersList';
import MemberCard from './components/MemberCard';
import DepartmentManager from './components/DepartmentManager';
import DarkModeToggle from './components/DarkModeToggle';
import Login from './components/Login';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { storageService } from './services/storageService';
import { departmentService } from './services/departmentService';
import { personalDetailsSchema, churchDetailsSchema } from './schemas';

const formSchema = z.object({
  personalDetails: personalDetailsSchema,
  churchDetails: churchDetailsSchema,
});

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewMode, setViewMode] = useState('form'); // 'form', 'list', or 'departments'
  const [selectedMemberCard, setSelectedMemberCard] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      personalDetails: {
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        phoneSecondary: '',
        emergencyContact: '',
        photo: '',
        houseNumber: '',
        streetName: '',
        busStop: '',
        city: '',
        state: '',
        maritalStatus: '',
        dateOfBirth: '',
      },
      churchDetails: {
        memberType: 'Worker',
        departments: [],
      },
    },
  });

  useEffect(() => {
    const loadData = async () => {
      const [membersData, departmentsData] = await Promise.all([
        storageService.getMembers(),
        departmentService.getDepartments(),
      ]);
      setMembers(membersData);
      setDepartments(departmentsData);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (editingMember) {
      reset({
        personalDetails: editingMember.personalDetails,
        churchDetails: editingMember.churchDetails,
      });
      setViewMode('form');
    }
  }, [editingMember, reset]);

  const onSubmit = async (data) => {
    try {
      const memberToSave = editingMember
        ? { ...data, id: editingMember.id }
        : data;
      
      await storageService.saveMember(memberToSave);
      const updatedMembers = await storageService.getMembers();
      setMembers(updatedMembers);
      
      // Clear form and show success
      reset({
        personalDetails: {
          firstName: '',
          middleName: '',
          lastName: '',
          phone: '',
          phoneSecondary: '',
          emergencyContact: '',
          photo: '',
          houseNumber: '',
          streetName: '',
          busStop: '',
          city: '',
          state: '',
          maritalStatus: '',
          dateOfBirth: '',
        },
        churchDetails: {
          memberType: 'Worker',
          departments: [],
        },
      });
      setEditingMember(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Keep on form view for easy consecutive additions
      setViewMode('form');
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Failed to save member. Please try again.');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCard = (member) => {
    setSelectedMemberCard(member);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this member?')) {
      await storageService.deleteMember(id);
      const updatedMembers = await storageService.getMembers();
      setMembers(updatedMembers);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Member ID',
      'First Name',
      'Middle Name',
      'Last Name',
      'Primary Phone',
      'Secondary Phone',
      'Emergency Contact',
      'House Number',
      'Street Name',
      'Bus Stop',
      'City',
      'State',
      'Marital Status',
      'Date of Birth',
      'Member Type',
      'Departments',
    ];

    const rows = members.map((member) => [
      member.id,
      member.personalDetails.firstName,
      member.personalDetails.middleName || '',
      member.personalDetails.lastName,
      member.personalDetails.phone,
      member.personalDetails.phoneSecondary || '',
      member.personalDetails.emergencyContact || '',
      member.personalDetails.houseNumber,
      member.personalDetails.streetName,
      member.personalDetails.busStop || '',
      member.personalDetails.city,
      member.personalDetails.state,
      member.personalDetails.maritalStatus,
      member.personalDetails.dateOfBirth,
      member.churchDetails.memberType,
      member.churchDetails.departments
        ?.map((d) => `${d.name} (${d.role})`)
        .join('; ') || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `church_members_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleCancel = () => {
    reset();
    setEditingMember(null);
  };

  const handleAddDepartment = async (name) => {
    await departmentService.saveDepartment(name);
    const updatedDepartments = await departmentService.getDepartments();
    setDepartments(updatedDepartments);
  };

  const handleDeleteDepartment = async (id) => {
    if (confirm('Are you sure you want to delete this department?')) {
      await departmentService.deleteDepartment(id);
      const updatedDepartments = await departmentService.getDepartments();
      setDepartments(updatedDepartments);
    }
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <img 
              src="/logo/jubilee-logo-red.8e7808b6.png" 
              alt="Church Logo" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                JCC Worker's Directory
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage member information and church worker details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
            <span className="text-green-800 dark:text-green-200">
              Member {editingMember ? 'updated' : 'added'} successfully!
            </span>
          </div>
        )}

        {/* View Toggle */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setViewMode('form')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${
              viewMode === 'form'
                ? 'bg-blue-600 text-white shadow-blue-600/30 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
            }`}
          >
            {editingMember ? '✏️ Edit Member' : '➕ Add New Member'}
          </button>
          <button
            onClick={() => {
              setViewMode('list');
              handleCancel();
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-blue-600/30 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
            }`}
          >
            👥 View Members ({members.length})
          </button>
          <button
            onClick={() => {
              setViewMode('departments');
              handleCancel();
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${
              viewMode === 'departments'
                ? 'bg-blue-600 text-white shadow-blue-600/30 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
            }`}
          >
            🏢 Manage Departments ({departments.length})
          </button>
        </div>

        {/* Form View */}
        {viewMode === 'form' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PersonalDetailsForm 
              register={register} 
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
            <ChurchDetailsForm 
              watch={watch} 
              setValue={setValue} 
              errors={errors}
              availableDepartments={departments}
            />

            <div className="flex gap-4 justify-end">
              {editingMember && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all shadow-md border-2 border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!isValid}
                className={`px-8 py-3 rounded-lg font-bold transition-all shadow-lg text-lg ${
                  isValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed opacity-60'
                }`}
              >
                {editingMember ? '💾 Update Member' : '✅ Add Member'}
              </button>
            </div>
          </form>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <MembersList
            members={members}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExportCSV}
            onViewCard={handleViewCard}
          />
        )}

        {/* Member Card Modal */}
        {selectedMemberCard && (
          <MemberCard
            member={selectedMemberCard}
            onClose={() => setSelectedMemberCard(null)}
          />
        )}

        {/* Departments View */}
        {viewMode === 'departments' && (
          <DepartmentManager
            departments={departments}
            onAdd={handleAddDepartment}
            onDelete={handleDeleteDepartment}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <AppContent />
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;

