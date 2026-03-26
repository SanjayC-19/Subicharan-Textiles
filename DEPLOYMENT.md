# Subicharan Tex E-Commerce Deployment Instructions

This project is a complete React + Vite application tailored for the Subicharan Tex brand. It utilizes Firebase for database management (Firestore) and Tailwind CSS for styling.

## 1. Local Development

To run the application locally on your machine:

1. Open a terminal and navigate to the project directory:
   `cd d:/Cons-Textiles`
2. Install dependencies (if you haven't already):
   `npm install`
3. Start the Vite development server:
   `npm run dev`
4. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

## 2. Firebase Configuration (Action Required)

Currently, the application uses dummy data to ensure it runs immediately without errors. To connect it to your actual Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Add a "Web App" to your Firebase project.
4. Copy the Firebase configuration object provided.
5. Open `src/services/firebase.js` in your code editor.
6. Replace the placeholder `firebaseConfig` object with your actual credentials.
7. Enable **Firestore Database** in your Firebase console. Start in test mode for initial development.

## 3. Production Build

To create an optimized production build:

1. Run the build command:
   `npm run build`
2. This will generate a `dist` folder containing the compiled HTML, CSS, and JS files.

## 4. Deployment Options

You can deploy the `dist` folder to various static hosting providers. Here are two popular options:

### Option A: Firebase Hosting (Recommended)

Since you are already using Firebase for the backend, Firebase Hosting is a natural fit.

1. Install the Firebase CLI globally:
   `npm install -g firebase-tools`
2. Login to your Firebase account:
   `firebase login`
3. Initialize Firebase in your project root:
   `firebase init hosting`
   * Select your Firebase project.
   * Set the public directory to `dist`.
   * Configure as a single-page app (rewrite all urls to /index.html): **Yes**
   * Set up automatic builds and deploys with GitHub: **No** (optional)
4. Build the project:
   `npm run build`
5. Deploy to Firebase:
   `firebase deploy --only hosting`

### Option B: Vercel

Vercel provides seamless integration with Vite and React applications.

1. Install Vercel CLI:
   `npm i -g vercel`
2. Run Vercel deployment:
   `vercel`
3. Follow the CLI prompts to link your project. Vercel automatically detects Vite and configures the build settings.

### Option C: Netlify

1. Create an account on [Netlify](https://www.netlify.com/).
2. Drag and drop your `dist` folder into the Netlify dashboard, or connect your GitHub repository and set the build command to `npm run build` and publish directory to `dist`.

## 5. Admin Usage

Navigate to `/admin/add-product` (e.g., `http://localhost:5173/admin/add-product`) to access the mock admin dashboard where you can upload products directly to your configured Firestore database.
