export default function PersonalDetailsForm({ register, errors, watch, setValue }) {
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Photo size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('personalDetails.photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const photo = watch('personalDetails.photo');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        Personal Details
      </h2>

      {/* Photo Upload Section */}
      <div className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
            {photo ? (
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No photo</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Passport Photograph
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200
              cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Upload a passport-sized photo (Max 2MB, JPG/PNG)
          </p>
          {photo && (
            <button
              type="button"
              onClick={() => setValue('personalDetails.photo', '')}
              className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
            >
              Remove Photo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('personalDetails.firstName')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.personalDetails?.firstName
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.personalDetails?.firstName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.personalDetails.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Middle Name
          </label>
          <input
            type="text"
            {...register('personalDetails.middleName')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('personalDetails.lastName')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.personalDetails?.lastName
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.personalDetails?.lastName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.personalDetails.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number (Primary) <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('personalDetails.phone')}
            placeholder="08012345678 or +2348012345678"
            maxLength={14}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.personalDetails?.phone
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.personalDetails?.phone && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {errors.personalDetails.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number (Secondary)
          </label>
          <input
            type="tel"
            {...register('personalDetails.phoneSecondary')}
            placeholder="08012345678 or +2348012345678"
            maxLength={14}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.personalDetails?.phoneSecondary
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.personalDetails?.phoneSecondary && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {errors.personalDetails.phoneSecondary.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Emergency Contact
          </label>
          <input
            type="tel"
            {...register('personalDetails.emergencyContact')}
            placeholder="08012345678 or +2348012345678"
            maxLength={14}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.personalDetails?.emergencyContact
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.personalDetails?.emergencyContact && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {errors.personalDetails.emergencyContact.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Marital Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register('personalDetails.maritalStatus')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.personalDetails?.maritalStatus
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
          {errors.personalDetails?.maritalStatus && (
            <p className="mt-1 text-sm text-red-500">
              {errors.personalDetails.maritalStatus.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('personalDetails.dateOfBirth')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.personalDetails?.dateOfBirth
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.personalDetails?.dateOfBirth && (
            <p className="mt-1 text-sm text-red-500">
              {errors.personalDetails.dateOfBirth.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              House Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('personalDetails.houseNumber')}
              placeholder="e.g., 12A"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.personalDetails?.houseNumber
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.personalDetails?.houseNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personalDetails.houseNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Street Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('personalDetails.streetName')}
              placeholder="e.g., Allen Avenue"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.personalDetails?.streetName
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.personalDetails?.streetName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personalDetails.streetName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Bus Stop
            </label>
            <input
              type="text"
              {...register('personalDetails.busStop')}
              placeholder="e.g., Ikeja Under Bridge"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('personalDetails.city')}
              placeholder="e.g., Lagos"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.personalDetails?.city
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.personalDetails?.city && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personalDetails.city.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('personalDetails.state')}
              placeholder="e.g., Lagos"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.personalDetails?.state
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.personalDetails?.state && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personalDetails.state.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
