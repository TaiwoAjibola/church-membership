import { Edit2, Trash2, Download, Eye } from 'lucide-react';
import { useState } from 'react';

export default function MembersList({ members, onEdit, onDelete, onExport, onViewCard }) {
  const [columnSearch, setColumnSearch] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    memberType: '',
    status: '',
    departments: ''
  });
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleColumnSearchChange = (column, value) => {
    setColumnSearch(prev => ({ ...prev, [column]: value }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMembers(filteredMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleExportSelected = () => {
    const membersToExport = members.filter(m => selectedMembers.includes(m.id));
    onExport(membersToExport);
  };

  const filteredMembers = members.filter((member) => {
    // Column-specific search only
    const normalizedStatus = (member.churchDetails.status || 'Active').trim().toLowerCase();
    const normalizedStatusQuery = columnSearch.status.trim().toLowerCase();

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
      (columnSearch.status.trim() === '' || normalizedStatus.includes(normalizedStatusQuery)) &&
      (columnSearch.departments === '' || 
        member.churchDetails.departments?.some((d) => d.name.toLowerCase().includes(columnSearch.departments.toLowerCase()) || d.role.toLowerCase().includes(columnSearch.departments.toLowerCase())));

    return matchesColumnSearch;
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
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Members List ({filteredMembers.length} of {members.length})
            {selectedMembers.length > 0 && (
              <span className="ml-3 text-sm font-normal text-blue-600 dark:text-blue-400">
                ({selectedMembers.length} selected)
              </span>
            )}
          </h2>
          <div className="flex gap-2">
            {selectedMembers.length > 0 && (
              <button
                onClick={handleExportSelected}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={18} />
                Export Selected ({selectedMembers.length})
              </button>
            )}
            <button
              onClick={() => onExport(members)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              Export All
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px] table-auto">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-900 dark:to-blue-800">
              <th
                rowSpan={2}
                className="w-[60px] px-4 py-4 text-center align-middle"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-white/60 text-blue-600 focus:ring-white/60"
                />
              </th>
              <th className="min-w-[160px] px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Member ID
              </th>
              <th className="min-w-[260px] px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Name
              </th>
              <th className="min-w-[170px] px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Phone
              </th>
              <th className="min-w-[420px] px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Address
              </th>
              <th className="min-w-[170px] px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Member Type
              </th>
              <th className="min-w-[140px] px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="min-w-[380px] px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Departments
              </th>
              <th
                rowSpan={2}
                className="w-[160px] px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap align-middle"
              >
                Actions
              </th>
            </tr>

            <tr className="bg-blue-50 dark:bg-gray-900 border-b border-blue-100 dark:border-gray-700">
              <th className="px-6 py-3">
                <input
                  type="text"
                  placeholder="Search ID"
                  value={columnSearch.id}
                  onChange={(e) => handleColumnSearchChange('id', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                />
              </th>
              <th className="px-6 py-3">
                <input
                  type="text"
                  placeholder="Search name"
                  value={columnSearch.name}
                  onChange={(e) => handleColumnSearchChange('name', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                />
              </th>
              <th className="px-6 py-3">
                <input
                  type="text"
                  placeholder="Search phone"
                  value={columnSearch.phone}
                  onChange={(e) => handleColumnSearchChange('phone', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                />
              </th>
              <th className="px-6 py-3">
                <input
                  type="text"
                  placeholder="Search address"
                  value={columnSearch.address}
                  onChange={(e) => handleColumnSearchChange('address', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                />
              </th>
              <th className="px-6 py-3">
                <input
                  type="text"
                  placeholder="Search type"
                  value={columnSearch.memberType}
                  onChange={(e) => handleColumnSearchChange('memberType', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                />
              </th>
              <th className="px-6 py-3">
                <input
                  type="text"
                  placeholder="Search status"
                  value={columnSearch.status}
                  onChange={(e) => handleColumnSearchChange('status', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                />
              </th>
              <th className="px-6 py-3">
                <input
                  type="text"
                  placeholder="Search dept / role"
                  value={columnSearch.departments}
                  onChange={(e) => handleColumnSearchChange('departments', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No members found matching your search criteria.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member, index) => (
                <tr 
                  key={member.id} 
                  className={`transition-colors hover:bg-blue-50 dark:hover:bg-gray-700 ${
                    index !== filteredMembers.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                  }`}
                >
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {member.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {member.personalDetails.photo && (
                        <img
                          src={member.personalDetails.photo}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.personalDetails.firstName} {member.personalDetails.middleName}{' '}
                        {member.personalDetails.lastName}
                      </div>
                    </div>
                  </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    {member.personalDetails.phone}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div
                    className="text-sm text-gray-700 dark:text-gray-300"
                    title={`${member.personalDetails.houseNumber} ${member.personalDetails.streetName}${member.personalDetails.busStop ? `, ${member.personalDetails.busStop}` : ''}, ${member.personalDetails.city}, ${member.personalDetails.state}`}
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                      {member.personalDetails.houseNumber} {member.personalDetails.streetName}
                      {member.personalDetails.busStop && `, ${member.personalDetails.busStop}`}
                      {member.personalDetails.city && `, ${member.personalDetails.city}`}
                      {member.personalDetails.state && `, ${member.personalDetails.state}`}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1.5 inline-flex text-xs leading-4 font-semibold rounded-lg ${
                      member.churchDetails.memberType === 'Worker'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : member.churchDetails.memberType === 'Volunteer'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300'
                    }`}
                  >
                    {member.churchDetails.memberType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1.5 inline-flex text-xs leading-4 font-semibold rounded-lg ${
                      (member.churchDetails.status || 'Active').trim().toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                    }`}
                  >
                    {member.churchDetails.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {member.churchDetails.departments?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {member.churchDetails.departments.map((dept, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {dept.name}
                            <span className="ml-1 text-gray-500 dark:text-gray-400">({dept.role})</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewCard(member)}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      aria-label="View member card"
                      title="View Card"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(member)}
                      className="p-2 text-amber-600 hover:text-amber-900 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                      aria-label="Edit member"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      aria-label="Delete member"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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
