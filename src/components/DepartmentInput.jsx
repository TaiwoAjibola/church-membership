import { X } from 'lucide-react';

export default function DepartmentInput({ memberDepartments, availableDepartments, onChange }) {
  const handleAddDepartment = (e) => {
    const selectedDeptId = e.target.value;
    if (!selectedDeptId) return;

    const dept = availableDepartments.find(d => d.id === selectedDeptId);
    if (dept && !memberDepartments.some(d => d.id === selectedDeptId)) {
      onChange([...memberDepartments, { id: dept.id, name: dept.name, role: 'Member' }]);
    }
    e.target.value = '';
  };

  const handleRemoveDepartment = (deptId) => {
    onChange(memberDepartments.filter(d => d.id !== deptId));
  };

  const handleRoleChange = (deptId, role) => {
    const updated = memberDepartments.map(d =>
      d.id === deptId ? { ...d, role } : d
    );
    onChange(updated);
  };

  const unselectedDepts = availableDepartments.filter(
    d => !memberDepartments.some(md => md.id === d.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          onChange={handleAddDepartment}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          defaultValue=""
        >
          <option value="" disabled>Select a department</option>
          {unselectedDepts.map(dept => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {availableDepartments.length === 0 && (
        <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          No departments available. Please create departments first in the "Manage Departments" section.
        </p>
      )}

      {memberDepartments.length > 0 && (
        <div className="space-y-3">
          {memberDepartments.map((dept) => (
            <div
              key={dept.id}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {dept.name}
                </h4>
                <button
                  type="button"
                  onClick={() => handleRemoveDepartment(dept.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Remove department"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex gap-4">
                {['Member', 'Assistant HoD', 'HoD'].map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`role-${dept.id}`}
                      value={role}
                      checked={dept.role === role}
                      onChange={() => handleRoleChange(dept.id, role)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
