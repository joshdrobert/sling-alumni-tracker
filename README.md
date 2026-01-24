# Sling Alumni Tracker

The **Sling Alumni Tracker** is a modern Single Page Application (SPA) designed to connect alumni of the Sling Health network.

**Tech Stack**:
-   **Frontend**: React + Vite
-   **Backend**: Supabase (PostgreSQL + Auth)
-   **Styling**: Vanilla CSS (Glassmorphism UI)
-   **Hosting**: Vercel

---

## 🚀 Setup & Installation

### 1. Supabase (Backend)
1.  Create a project at [supabase.com](https://supabase.com).
2.  Go to the **SQL Editor** in your dashboard.
3.  Copy/Paste the contents of `setup.sql` from this repository and click **Run**.
4.  Copy your **Project URL** and **Anon Key** from `Project Settings > API`.

### 2. Local Development
1.  Clone the repo:
    ```bash
    git clone https://github.com/joshdrobert/sling-alumni-tracker.git
    cd sling-alumni-tracker
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create environment variables:
    ```bash
    cp .env.example .env
    ```
    *Fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.*

4.  Start dev server:
    ```bash
    npm run dev
    ```

---

## 🔑 Admin Access

To grant Admin privileges:
1.  The user must first sign in to the app (this creates their profile).
2.  Run this SQL in your Supabase SQL Editor:
    ```sql
    update public.profiles
    set role = 'admin'
    where email in ('joshdrobert@tamu.edu', 'megan.guy@tamu.edu');
    ```

---

## 🛠 Features

*   **Directory**: Publicly viewable list of alumni with search.
*   **Profiles**: Validated users can edit their own bio, company, and contact info.
*   **Admin Dashboard**: Admins can manage user roles and edit any profile.
*   **Auth**: Passwordless "Magic Link" login via Email.
