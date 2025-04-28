# Mai Code Challenges

Mai Code Challenges simplifies coding interview prep by providing distraction-free, randomly generated coding challenges and feedback—mimicking real interview unpredictability without the clutter of traditional platforms. You can cheack out the site here: mai-code-challenges.vercel.app

## Project Proposal

### WireFrame:
<img width="500" src="https://github.com/user-attachments/assets/98c28272-2ba6-49ba-8674-7896c14d6173" alt="WireFrame of the Site" />

### UserFlow:
<img src="https://github.com/user-attachments/assets/2fa3074c-a838-4e19-831c-9e4bc8b833d2" width="500" alt="Diagram with UserFlow" />

### Full Proposal:
[Mai Code Challenge Proposal.pdf](https://github.com/user-attachments/files/19657790/Mai.Code.Challenge.Proposal.pdf)

## Tech Stack 🚀

### Frontend
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) **Framework**: [Next.js](https://nextjs.org/)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- ![Flowbite](https://img.shields.io/badge/Flowbite-38B2AC?style=for-the-badge&logo=flowbite&logoColor=white) **UI Components**: [Flowbite](https://flowbite.com/)
- ![Heroicons](https://img.shields.io/badge/Heroicons-4A5568?style=for-the-badge&logo=heroicons&logoColor=white) **Icons**: [Heroicons](https://heroicons.com/)

### Backend
- ![Python Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) **Framework**: [Python Flask](https://flask.palletsprojects.com/)
- ![Gunicorn](https://img.shields.io/badge/Gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white) **Server**: [Gunicorn](https://gunicorn.org/)

### Database
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) **Local Development**: PostgreSQL
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) **Production**: [Supabase](https://supabase.com/)

### Authentication
- ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) [Firebase Authentication](https://firebase.google.com/products/auth)

### Deployment
- ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) **Frontend**: [Vercel](https://vercel.com/)
- ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) **Backend**: [Vercel](https://vercel.com/)

### APIs
- ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) **GPT Integration**: [OpenAI API](https://platform.openai.com/)

### Editor
- ![Manco Editor](https://img.shields.io/badge/Manco_Editor-000000?style=for-the-badge&logo=code&logoColor=white) [Manco Editor](https://manco-editor.com/)

### Web Scraping
- ![Beautiful Soup](https://img.shields.io/badge/Beautiful_Soup-4B8BBE?style=for-the-badge&logo=python&logoColor=white) [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/)

### Anti-Bot Protection
- ![Google reCAPTCHA](https://img.shields.io/badge/Google_reCAPTCHA-4285F4?style=for-the-badge&logo=google&logoColor=white) [Google reCAPTCHA](https://www.google.com/recaptcha/)

### Testing
- ![Wave](https://img.shields.io/badge/Wave-000000?style=for-the-badge&logo=accessibility&logoColor=white) **Accessibility**: [Wave](https://wave.webaim.org/)
- ![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white) **End-to-End Testing**: [Cypress](https://www.cypress.io/)
- ![unittest](https://img.shields.io/badge/unittest-3776AB?style=for-the-badge&logo=python&logoColor=white) **Unit Testing**: [unittest](https://docs.python.org/3/library/unittest.html)

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
## Running the Application with Gunicorn

To run the Flask application in a production-ready environment, you can use **Gunicorn**, a WSGI HTTP server.

### Prerequisites
Ensure you have Gunicorn installed. If not, install it using:
```bash
pip install gunicorn
```
Use the following command to start the application with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5432 main:app
```

## Frontend Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```




