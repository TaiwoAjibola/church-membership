import { Edit2, Trash2, Download, Search, Eye } from 'lucide-react';
import { useState } from 'react';

export default function MembersList({ members, onEdit, onDelete, onExport, onViewCard }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [columnSearch, setColumnSearch] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    memberType: '',
    departments: ''
  });

  const handleColumnSearchChange = (column, value) => {
    setColumnSearch(prev => ({ ...prev, [column]: value }));
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchTerm === '' ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${member.personalDetails.firstName} ${member.personalDetails.middleName} ${member.personalDetails.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.personalDetails.phone.includes(searchTerm) ||
      member.churchDetails.departments?.some((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === 'all' || member.churchDetails.memberType === filterType;

    // Column-specific search
    const matchesColumnSearch = 
      (columnSearch.id === '' || member.id.toLowerCase().includes(columnSearch.id.toLowerCase())) &&
      (columnSearch.name === '' || 
        `${member.personalDetails.firstName} ${member.personalDetails.middleName} ${member.personalDetails.lastName}`
          .toLowerCase()
          .includes(columnSearch.name.toLowerCase())) &&
      (columnSearch.phone === '' || member.personalDetails.phone.includes(columnSearch.phone)) &&
      (columnSearch.address === '' || 
        `${member.personalDetails.houseNumber} ${member.personalDetails.streetName} ${member.personalDetails.busStop} ${member.personalDetails.city} ${member.personalDetails.state}`
          .toLowerCase()
          .includes(columnSearch.address.toLowerCase())) &&
      (columnSearch.memberType === '' || member.churchDetails.memberType.toLowerCase().includes(columnSearch.memberType.toLowerCase())) &&
      (columnSearch.departments === '' || 
        member.churchDetails.departments?.some((d) => d.name.toLowerCase().includes(columnSearch.departments.toLowerCase()) || d.role.toLowerCase().includes(columnSearch.departments.toLowerCase())));

    return matchesSearch && matchesType && matchesColumnSearch;
  });

  if (members.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No members added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Members List ({filteredMembers.length} of {members.length})
          </h2>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, ID, phone, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Members</option>
            <option value="Worker">Workers</option>
            <option value="Volunteer">Volunteers</option>
            <option value="Church Member">Church Members</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="mb-2">Member ID</div>
                <input
                  type="text"
                  placeholder="Search ID..."
                  value={columnSearch.id}
                  onChange={(e) => handleColumnSearchChange('id', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="mb-2">Name</div>
                <input
                  type="text"
                  placeholder="Search name..."
                  value={columnSearch.name}
                  onChange={(e) => handleColumnSearchChange('name', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="mb-2">Phone</div>
                <input
                  type="text"
                  placeholder="Search phone..."
                  value={columnSearch.phone}
                  onChange={(e) => handleColumnSearchChange('phone', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="mb-2">Address</div>
                <input
                  type="text"
                  placeholder="Search address..."
                  value={columnSearch.address}
                  onChange={(e) => handleColumnSearchChange('address', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="mb-2">Member Type</div>
                <input
                  type="text"
                  placeholder="Search type..."
                  value={columnSearch.memberType}
                  onChange={(e) => handleColumnSearchChange('memberType', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="mb-2">Departments</div>
                <input
                  type="text"
                  placeholder="Search dept..."
                  value={columnSearch.departments}
                  onChange={(e) => handleColumnSearchChange('departments', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No members found matching your search criteria.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {member.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {member.personalDetails.photo && (
                        <img
                          src={member.personalDetails.photo}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.personalDetails.firstName} {member.personalDetails.middleName}{' '}
                        {member.personalDetails.lastName}
                      </div>
                    </div>
                  </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {member.personalDetails.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {member.personalDetails.houseNumber} {member.personalDetails.streetName}
                    {member.personalDetails.busStop && `, ${member.personalDetails.busStop}`}
                    <br />
                    {member.personalDetails.city}, {member.personalDetails.state}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.churchDetails.memberType === 'Worker'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : member.churchDetails.memberType === 'Volunteer'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {member.churchDetails.memberType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {member.churchDetails.departments?.length > 0 ? (
                      <div className="space-y-1">
                        {member.churchDetails.departments.map((dept, idx) => (
                          <div key={idx}>
                            {dept.name} ({dept.role})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewCard(member)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    aria-label="View member card"
                    title="View Card"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(member)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                    aria-label="Edit member"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(member.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete member"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
