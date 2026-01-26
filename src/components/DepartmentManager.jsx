import { useState } from 'react';
import { Plus, Edit2, Building2, RefreshCw } from 'lucide-react';

export default function DepartmentManager({ departments, onAdd, onUpdate, onRenumber }) {
  const [newDeptName, setNewDeptName] = useState('');
  const [editingDept, setEditingDept] = useState(null);
  const [editName, setEditName] = useState('');
  const [isRenumbering, setIsRenumbering] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newDeptName.trim()) {
      onAdd(newDeptName);
      setNewDeptName('');
    }
  };

  const handleEditClick = (dept) => {
    setEditingDept(dept.id);
    setEditName(dept.name);
  };

  const handleSaveEdit = (id) => {
    if (editName.trim()) {
      onUpdate(id, editName.trim());
    }
    setEditingDept(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingDept(null);
    setEditName('');
  };

  const handleRenumber = async () => {
    if (confirm('This will renumber all departments sequentially (001, 002, 003...) based on creation date. Continue?')) {
      setIsRenumbering(true);
      try {
        await onRenumber();
        alert('Departments renumbered successfully!');
      } catch (error) {
        alert('Error renumbering departments. Please try again.');
      } finally {
        setIsRenumbering(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="text-primary-600 dark:text-primary-400" size={24} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Departments
          </h2>
        </div>
        {/* Commented out - Use only when needed to fix department numbering sequence
        {departments.length > 0 && (
          <button
            onClick={handleRenumber}
            disabled={isRenumbering}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Renumber all departments sequentially"
          >
            <RefreshCw size={16} className={isRenumbering ? 'animate-spin' : ''} />
            {isRenumbering ? 'Renumbering...' : 'Fix Numbering'}
          </button>
        )}
        */}
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
              {editingDept === dept.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    autoFocus
                  />
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleSaveEdit(dept.id)}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {dept.name}
                    </span>
                    <span className="text-sm font-mono text-blue-600 dark:text-blue-400 mt-1">
                      {dept.id}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEditClick(dept)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    aria-label="Edit department"
                  >
                    <Edit2 size={18} />
                  </button>
                </>
              )}
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
