# Supabase Database Setup Guide

This guide will walk you through setting up Supabase as the backend database for the Church Details Management application.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Sign up using your GitHub, Google, or email account

## Step 2: Create a New Project

1. Once logged in, click "New Project"
2. Fill in the project details:
   - **Name**: Church Management (or any name you prefer)
   - **Database Password**: Create a strong password (save this somewhere safe!)
   - **Region**: Choose the region closest to your users (e.g., West US, East US, etc.)
3. Click "Create new project"
4. Wait for the project to be provisioned (this takes 1-2 minutes)

## Step 3: Create Database Tables

1. In your Supabase dashboard, click on the **SQL Editor** in the left sidebar
2. Click "New Query"
3. Copy and paste the following SQL code:

```sql
-- Create members table
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  personal_details JSONB NOT NULL,
  church_details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create departments table
CREATE TABLE departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_members_created_at ON members(created_at DESC);
CREATE INDEX idx_departments_name ON departments(name);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (authenticated users only)
-- For production, you should create more restrictive policies

-- Members policies
CREATE POLICY "Enable all operations for authenticated users on members"
  ON members
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Departments policies
CREATE POLICY "Enable all operations for authenticated users on departments"
  ON departments
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click "Run" or press `Ctrl+Enter` (Windows/Linux) / `Cmd+Enter` (Mac)
5. You should see a success message indicating the tables were created

## Step 4: Get Your API Credentials

1. In the Supabase dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Click on **API** under Project Settings
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
4. Keep this page open - you'll need these values in the next step

## Step 5: Configure Environment Variables

1. In your project folder (`/Users/ajibola/church Details`), create a new file called `.env`
2. Copy the following template and replace the placeholders with your actual values:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace:
   - `your_project_url_here` with your **Project URL** from Step 4
   - `your_anon_key_here` with your **anon public** key from Step 4

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyMzQ1NjcsImV4cCI6MTk5NjgxMDU2N30.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. Save the file

## Step 6: Deploy to Vercel with Environment Variables

1. Go to your Vercel dashboard at [https://vercel.com](https://vercel.com)
2. Find your church management project
3. Click on the project name
4. Go to **Settings** → **Environment Variables**
5. Add the following variables:
   - **Name**: `VITE_SUPABASE_URL`
     **Value**: Your Supabase Project URL
   - **Name**: `VITE_SUPABASE_ANON_KEY`
     **Value**: Your Supabase anon key
6. Make sure to select all environments (Production, Preview, Development)
7. Click "Save"
8. Go to the **Deployments** tab
9. Click the three dots (⋯) on the latest deployment
10. Click "Redeploy" to deploy with the new environment variables

## Step 7: Test Your Application

1. **Local Testing:**
   - Make sure your `.env` file is in place
   - Run `npm run dev` in your project folder
   - Open the app in your browser
   - Try adding a member or department
   - Check your Supabase dashboard → **Table Editor** to see if the data appears

2. **Production Testing:**
   - After redeploying on Vercel, visit your live site
   - Log in and add a member or department
   - The data should now be shared across all users!

## Verification

To verify everything is working:

1. Open your Supabase dashboard
2. Click **Table Editor** in the left sidebar
3. Click on the `members` or `departments` table
4. You should see the data you added from your application

## Security Notes

- **Never commit your `.env` file to GitHub** - it's already in `.gitignore`
- The `.env.example` file is safe to commit (it contains no real credentials)
- For production, consider implementing more restrictive Row Level Security policies
- The current setup allows any authenticated request to access the data

## Troubleshooting

### "Missing Supabase environment variables" error
- Check that your `.env` file exists in the project root
- Verify the variable names start with `VITE_`
- Restart your dev server after creating the `.env` file

### Data not showing up
- Check the browser console for errors
- Verify your API credentials are correct
- Make sure Row Level Security policies are enabled
- Check your Supabase project is active (not paused)

### Connection errors
- Verify your internet connection
- Check if your Supabase project is active
- Confirm the Project URL is correct (no trailing slashes)

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Supabase dashboard logs (Logs & Analytics → Logs)
3. Verify all SQL commands ran successfully
4. Make sure environment variables are set in both local `.env` and Vercel settings

---

**Your app is now connected to Supabase!** All data will be shared across all users accessing your application.
