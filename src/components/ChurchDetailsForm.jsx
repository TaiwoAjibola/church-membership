import DepartmentInput from './DepartmentInput';

export default function ChurchDetailsForm({ watch, setValue, errors, availableDepartments }) {
  const memberType = watch('churchDetails.memberType');
  const status = watch('churchDetails.status') || 'Active';
  const departments = watch('churchDetails.departments') || [];

  const handleDepartmentsChange = (newDepartments) => {
    setValue('churchDetails.departments', newDepartments, { shouldValidate: true });
  };

  const requiresDepartments = memberType === 'Worker' || memberType === 'Volunteer';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        Church Details
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Member Type <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Worker"
              checked={memberType === 'Worker'}
              onChange={() => setValue('churchDetails.memberType', 'Worker')}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Worker</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Volunteer"
              checked={memberType === 'Volunteer'}
              onChange={() => setValue('churchDetails.memberType', 'Volunteer')}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Volunteer</span>
          </label>
        </div>
        {errors.churchDetails?.memberType && (
          <p className="mt-2 text-sm text-red-500">
            {errors.churchDetails.memberType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Status <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Active"
              checked={status === 'Active'}
              onChange={() => setValue('churchDetails.status', 'Active')}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Inactive"
              checked={status === 'Inactive'}
              onChange={() => setValue('churchDetails.status', 'Inactive')}
              className="w-4 h-4 text-red-600 focus:ring-red-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Inactive</span>
          </label>
        </div>
      </div>

      {requiresDepartments && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Departments
          </label>
          <DepartmentInput
            memberDepartments={departments}
            availableDepartments={availableDepartments}
            onChange={handleDepartmentsChange}
          />
          {errors.churchDetails?.departments && (
            <p className="mt-2 text-sm text-red-500">
              {errors.churchDetails.departments.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
