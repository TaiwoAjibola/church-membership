# Church Details Management Application

A modern, production-ready web application for collecting, validating, and managing personal and church worker details with secure admin authentication.

## ✨ Features

### Core Functionality
- **🔐 Admin Authentication** - Secure login system for admin access
- **Personal Details Form**: Collect first name, middle name, last name, phone, address, marital status, and date of birth
- **Church Details Form**: Track worker/volunteer status and department assignments
- **Dynamic Department Management**: Create and manage departments with unique IDs (JCC-DEPT-001, etc.)
- **Member ID System**: Auto-generated IDs for each member type (JCC-WRK-001, JCC-VOL-001, JCC-MBR-001)
- **Form Validation**: Real-time validation using Zod schemas with Nigerian phone number format
- **Data Persistence**: Supabase PostgreSQL database for shared data across all users

### Optional Features
- **Edit & Delete**: Modify or remove member records
- **Table View**: View all members with IDs in a sortable table
- **CSV Export**: Export member data including IDs to CSV format
- **Dark Mode**: Toggle between light and dark themes with persistence
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Multi-Department Assignment**: Members can belong to multiple departments

## 🔐 Authentication

Default admin credentials:
- **Username**: `admin`
- **Password**: `church2026`

⚠️ **Important**: For production use, change these credentials in [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx) or implement environment variables.

## 🎨 UI/UX Highlights

- Clean, modern card-based layout
- Smooth transitions and micro-interactions
- Professional color scheme with primary blues
- Clear error messages and validation feedback
- Mobile-responsive by default
- Accessible form controls

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite (with Rolldown experimental)
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom context-based auth
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── components/
│   ├── ChurchDetailsForm.jsx    # Church worker details form
│   ├── PersonalDetailsForm.jsx  # Personal information form
│   ├── DepartmentInput.jsx      # Dynamic department input component
│   ├── MembersList.jsx          # Table view of all members
│   └── DarkModeToggle.jsx       # Dark mode switch
├── contexts/
│   └── DarkModeContext.jsx      # Dark mode state management
├── services/
│   └── storageService.js        # LocalStorage CRUD operations
├── schemas.js                   # Zod validation schemas
├── App.jsx                      # Main application component
├── index.css                    # Tailwind base styles
└── main.jsx                     # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TaiwoAjibola/church-membership.git
cd "church Details"
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Follow the detailed instructions in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
   - Create a `.env` file with your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📋 Data Structure

Each member record follows this structure:

```javascript
{
  "id": "JCC-WRK-001",  // Auto-generated based on member type
  "personalDetails": {
    "firstName": "John",
    "middleName": "Paul",
    "lastName": "Doe",
    "phone": "08012345678",  // Nigerian format
    "houseNumber": "15",
    "streetName": "Church Street",
    "busStop": "Central",
    "city": "Lagos",
    "state": "Lagos",
    "maritalStatus": "Married",
    "dateOfBirth": "1990-01-01"
  },
  "churchDetails": {
    "memberType": "Worker",  // Worker, Volunteer, or Church Member
    "departments": [
      {
        "id": "JCC-DEPT-001",
        "name": "Media",
        "role": "HoD"
      },
      {
        "id": "JCC-DEPT-002",
        "name": "Choir",
        "role": "Member"
      }
    ]
  },
  "createdAt": "2026-01-14T16:00:00.000Z",
  "updatedAt": "2026-01-14T16:00:00.000Z"
}
```

### Member ID Formats
- Workers: `JCC-WRK-001`, `JCC-WRK-002`, etc.
- Volunteers: `JCC-VOL-001`, `JCC-VOL-002`, etc.
- Church Members: `JCC-MBR-001`, `JCC-MBR-002`, etc.
- Departments: `JCC-DEPT-001`, `JCC-DEPT-002`, etc.

## 🎯 Usage

### Adding a New Member
1. Fill in all required fields (marked with *)
2. Select member type (Worker, Volunteer, or Church Member)
3. If Worker or Volunteer, add departments and assign roles (can add multiple)
4. Click "Add Member" (button is disabled until form is valid)
5. Member will be assigned an auto-generated ID based on type

### Managing Departments
1. Switch to "Manage Departments" tab
2. Enter department name and click "Add"
3. Each department gets a unique ID (JCC-DEPT-001, etc.)
4. Delete departments by clicking the trash icon

### Editing a Member
1. Switch to "View Members" tab
2. Click the edit icon next to a member
3. Update the form
4. Click "Update Member"

### Exporting Data
1. Go to "View Members" tab
2. Click "Export CSV" button
3. CSV file includes all member details and IDs

### Dark Mode
Click the moon/sun icon in the top-right corner to toggle themes.

## 🔒 Data Storage

Data is stored in **Supabase PostgreSQL database**. This provides:
- **Shared data across all users** - Everyone sees the same information
- Real-time data synchronization
- Reliable cloud storage with automatic backups
- Row Level Security for data protection
- Scalable for growing church membership

**Important**: Unlike localStorage, all users accessing the application share the same database, making it perfect for church administration teams.

## 🚀 Deployment

### Deploy to Vercel

**See detailed deployment instructions in [DEPLOYMENT.md](DEPLOYMENT.md)**

Quick steps:
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add Supabase environment variables in Vercel settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Important: Environment Variables on Vercel

After deploying to Vercel, you MUST add your Supabase credentials as environment variables:

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Redeploy the application

Without these, the app will not connect to your database.

## 🚧 Future Enhancements

Potential features for extension:
- Advanced search and filter functionality
- Bulk import from CSV
- Print member cards/ID badges
- Email notifications for birthdays
- Advanced reporting and analytics
- Multi-user authentication with roles (Admin, Viewer, Editor)
- Attendance tracking system
- SMS integration for announcements

## 📝 License

This project is open source and available under the MIT License.

---

Built with ❤️ using React and Tailwind CSS

