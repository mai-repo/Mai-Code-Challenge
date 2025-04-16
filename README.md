# Mai Code Challenges

Mai Code Challenges simplifies coding interview prep by providing distraction-free, randomly generated coding challenges and feedback—mimicking real interview unpredictability without the clutter of traditional platforms.

## Project Proposal

### WireFrame:
<img width="500" src="https://github.com/user-attachments/assets/98c28272-2ba6-49ba-8674-7896c14d6173" alt="WireFrame of the Site" />

### UserFlow:
<img src="https://github.com/user-attachments/assets/2fa3074c-a838-4e19-831c-9e4bc8b833d2" width="500" alt="Diagram with UserFlow" />

### Full Proposal:
[Mai Code Challenge Proposal.pdf](https://github.com/user-attachments/files/19657790/Mai.Code.Challenge.Proposal.pdf)

## Features

**1. Authentication & User Management**
- Sign In / Sign Up – Users can log in or register with an email and password.
- Forgot Password – Users can reset their password via email.
User Profile Management – Update profile details like username and email.

**2. Coding Challenge System**
- Random Challenge Generator – Provides a randomly selected problem to simulate real interviews.
- Code Editor – An embedded editor to write and test solutions.
Submit Solution – Submits the code and runs it against predefined test cases.

**3. Problem Status & Tracking**
- Completed Challenges – Stores problems that users have successfully solved.
- Rejected Challenges – Tracks failed attempts for future review.
- Favorite Challenges – Allows users to bookmark problems for later.
- Progress Tracking – Displays stats (e.g., total problems solved, success rate).

**4. UI & User Experience Enhancements**
- Navbar & Navigation – Provides quick access to challenges, profile, and history.
- Search Feature – Allows users to search for problems by keywords or tags..

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Mai-Code-Challenges.git
   cd server
    ```
2. Create and activate a virtual environment:
    ```
    python3 -m venv .venv
    source .venv/bin/activate
    ```

## Setup API Keys
1. Create a `.env` file in the server folder
2. Add your API Keys:
   ```
   OPENAI_API_KEY=your-api-key
   DATABASE_HOST=
   DATABASE_PORT=
   DATABASE_NAME=
   DATABASE_USER=
   DATABASE_PASSWORD=
   BACKEND_KEY=
   ```

## Set Up Google Applications and Keys

Follow the instructions to set up Google applications and obtain the necessary keys for authentication.

### Google Application Setup and `.env` Configuration

#### 1. Create a Google Cloud Project
- Go to the [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project and enable the following APIs:
  - Google Identity Services API
  - reCAPTCHA API

## Create Local Database

1. Log in to PostgreSQL and create the codeChallenge database:

   ```bash
   psql -h 127.0.0.1 -p {your-port} -U {your-username} -d postgres
   ```

2. Create the database:

   ```bash
   CREATE DATABASE codeChallenge;
   \q
   ```

3. Apply the Database Schema:

   ```bash
   \i database.sql
   ```

## Supabase Deployment

In addition to a local database, this project uses **Supabase** to deploy the SQL database for production. Supabase provides a fully managed PostgreSQL database with built-in authentication and API support.

### Steps to Set Up Supabase:

1. Go to the [Supabase Console](https://supabase.com/).
2. Create a new project and configure your database.
3. Import your database schema:
   - Navigate to the **SQL Editor** in the Supabase dashboard.
   - Upload and run your `database.sql` file to set up the schema.
4. Update your `.env` file with the Supabase connection details:
   ```
   DATABASE_HOST={your-supabase-host}
   DATABASE_PORT=5432
   DATABASE_NAME={your-database-name}
   DATABASE_USER={your-database-user}
   DATABASE_PASSWORD={your-database-password}
   ```

5. Use the Supabase API or client libraries to interact with your database in production.

## Firebase Setup Instructions

## Step 1: Obtain the Firebase JSON File
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Navigate to **Project Settings** (gear icon in the top left).
4. Under the **Service Accounts** tab, click **Generate new private key**.
5. Download the JSON file and save it as `firebase.json` in the `server` directory of your project.

## Step 2: Add Firebase Authentication
1. In the Firebase Console, go to the **Authentication** section.
2. Enable the desired sign-in methods (e.g., Email/Password).
3. Ensure the `firebase.json` file is correctly placed in the `server` directory.

## Step 3: Secure the Firebase JSON File
1. Add `firebase.json` to your `.gitignore` file to prevent it from being committed to version control:
   ```
   firebase.json
   ```
