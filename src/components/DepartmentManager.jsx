import { useState } from 'react';
import { Plus, Trash2, Building2 } from 'lucide-react';

export default function DepartmentManager({ departments, onAdd, onDelete }) {
  const [newDeptName, setNewDeptName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newDeptName.trim()) {
      onAdd(newDeptName);
      setNewDeptName('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
        <Building2 className="text-primary-600 dark:text-primary-400" size={24} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Departments
        </h2>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newDeptName}
          onChange={(e) => setNewDeptName(e.target.value)}
          placeholder="Enter new department name"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Add
        </button>
      </form>

      {departments.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-650 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-gray-900 dark:text-white font-medium">
                  {dept.name}
                </span>
                <span className="text-sm font-mono text-blue-600 dark:text-blue-400 mt-1">
                  {dept.id}
                </span>
              </div>
              <button
                onClick={() => onDelete(dept.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                aria-label="Delete department"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No departments created yet. Add your first department above.
        </p>
      )}
    </div>
  );
}
