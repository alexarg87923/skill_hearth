# Skill_hearth

[description]

## Clone the repo

Clone the project at https://github.com/alexarg87923/skill_hearth and cd into the root folder e.g cd skill_hearth

## Installing dependancies

Run `npm install` to install project dependancies.

## Configuring Firebase options

## **IMPORTANT**

    1. Create a `.env` file:
       Under the `back-end/` directory, create a new file named `.env`.

    2. Copy the example configuration:
       Copy and paste the contents from `.env.EXAMPLE` into your newly created `.env` file.

    3. Fill in Firebase credentials:
       - Go to [Firebase Console](https://console.firebase.google.com/)
       - Log in with the provided account (e.g., "business@alex-arguelles.com")
       - Click **Project Settings** (top-left menu)
       - Under the **General** tab, scroll down to find your project’s Firebase config details
       - Replace the placeholder values in the `.env` file with your actual Firebase credentials.

## Running the project

Run `npm start` for a dev server. Navigate to `http://localhost:3000/` for frontend and `http://localhost:3001` for backend. The application will automatically reload if you change any of the source files.