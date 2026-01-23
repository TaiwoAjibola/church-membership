import { z } from 'zod';

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string()
    .regex(/^(0[789][01]\d{8}|\+234[789][01]\d{8})$/, 'Phone number must be 11 digits (e.g., 08012345678) or start with +234'),
  phoneSecondary: z.string()
    .regex(/^(0[789][01]\d{8}|\+234[789][01]\d{8})?$/, 'Phone number must be 11 digits (e.g., 08012345678) or start with +234')
    .optional()
    .or(z.literal('')),
  emergencyContact: z.string()
    .regex(/^(0[789][01]\d{8}|\+234[789][01]\d{8})?$/, 'Phone number must be 11 digits (e.g., 08012345678) or start with +234')
    .optional()
    .or(z.literal('')),
  photo: z.string().optional(),
  houseNumber: z.string().min(1, 'House number is required'),
  streetName: z.string().min(1, 'Street name is required'),
  busStop: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed'], {
    required_error: 'Please select a marital status',
  }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

export const departmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Department name is required'),
  role: z.enum(['Member', 'Assistant HoD', 'HoD'], {
    required_error: 'Please select a role',
  }),
});

export const churchDetailsSchema = z.object({
  memberType: z.enum(['Worker', 'Volunteer'], {
    required_error: 'Please select a member type',
  }),
  departments: z.array(departmentSchema).optional(),
});

export const memberSchema = z.object({
  id: z.string(),
  personalDetails: personalDetailsSchema,
  churchDetails: churchDetailsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

