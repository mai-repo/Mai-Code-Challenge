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

## Setup OpenAI API Key
1. Create a `.env` file in the server folder
2. Add your OpenAI API Key:
   ```
   OPENAI_API_KEY=your-api-key
   DATABASE_HOST=
   DATABASE_PORT=
   DATABASE_NAME=
   DATABASE_USER=
   DATABASE_PASSWORD=
   ```

## Create local Database

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
