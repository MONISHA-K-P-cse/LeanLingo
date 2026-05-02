# LEANLINGO Project Export

This directory contains a complete export of the LEANLINGO platform in JSON format.

## Files

- **project-export.json** - Complete project with all 78 files and their contents (272KB)
- **import-from-json.ts** - Script to recreate the project from the JSON export
- **export-project.sh** - Script used to generate the export (for reference)

## What's Included

Your LEANLINGO platform includes:

### Features
- ✅ 7 complete screens (Splash, Login/Signup, Home, Questions, Upload, Leaderboard, Profile)
- ✅ Professional "L" logo design
- ✅ Forgot password recovery
- ✅ Enhanced profile dropdown (logout, switch account, edit profile)
- ✅ Level-based progression (10 questions per level)
- ✅ Authentication with AuthContext
- ✅ Mock data with localStorage persistence
- ✅ React Router navigation
- ✅ Tailwind CSS styling
- ✅ UI components library (shadcn/ui)

### Pages
1. **SplashScreen** - Welcome screen with LEANLINGO branding
2. **LoginSignup** - Authentication with login/signup toggle
3. **ForgotPassword** - Password recovery flow
4. **Home** - Dashboard with stats (points, level, completed, uploaded)
5. **Questions** - Browse and solve Lean coding problems by level
6. **Question** - Individual question solving interface
7. **UploadQuestion** - Community question contribution
8. **Leaderboard** - Global rankings
9. **Profile** - User profile and settings
10. **EditProfile** - Profile customization

## How to Use This Export

### Option 1: Import to Replit

1. Create a new Replit project (React TypeScript + Vite)
2. Upload `project-export.json` to the root directory
3. In the Replit shell, run:
   ```bash
   # Compile and run the import script
   npx tsx import-from-json.ts
   
   # Install dependencies
   pnpm install
   
   # Start the dev server
   pnpm dev
   ```

### Option 2: Import to Local Machine

1. Create a new directory for your project
2. Copy `project-export.json` and `import-from-json.ts` to this directory
3. Run:
   ```bash
   # Import all files
   npx tsx import-from-json.ts
   
   # Install dependencies
   pnpm install
   
   # Start development server
   pnpm dev
   ```

### Option 3: Manual Import

1. Open `project-export.json` in a text editor
2. The JSON structure is:
   ```json
   {
     "name": "LEANLINGO",
     "description": "...",
     "files": {
       "path/to/file.tsx": "file contents...",
       "path/to/another.ts": "file contents..."
     }
   }
   ```
3. Manually recreate each file from the `files` object

## Project Structure

```
LEANLINGO/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Main app component
│   │   ├── routes.tsx              # React Router setup
│   │   ├── components/
│   │   │   ├── Layout.tsx          # App shell with navigation
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   └── figma/              # Figma integration components
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # Authentication state
│   │   ├── data/
│   │   │   └── mockData.ts        # Sample questions and users
│   │   └── pages/
│   │       ├── SplashScreen.tsx
│   │       ├── LoginSignup.tsx
│   │       ├── ForgotPassword.tsx
│   │       ├── Home.tsx
│   │       ├── Questions.tsx
│   │       ├── Question.tsx
│   │       ├── UploadQuestion.tsx
│   │       ├── Leaderboard.tsx
│   │       ├── Profile.tsx
│   │       └── EditProfile.tsx
│   └── styles/
│       ├── index.css
│       ├── tailwind.css
│       ├── theme.css
│       └── fonts.css
├── package.json
├── vite.config.ts
├── postcss.config.mjs
└── pnpm-workspace.yaml
```

## After Import

Once you've imported the project:

1. **Install dependencies**: `pnpm install`
2. **Start dev server**: `pnpm dev`
3. **Test the app**: All features use mock data stored in localStorage
4. **Customize**: Update branding, colors, add real backend integration

## Next Steps: Adding a Real Backend

The current app uses mock data. To add a real backend:

1. **Option A: Supabase** (recommended)
   - Set up Supabase project
   - Create tables for users, questions, progress, leaderboard
   - Replace localStorage calls with Supabase client calls

2. **Option B: Custom API**
   - Build REST API (Node.js/Express, Python/Flask, etc.)
   - Update AuthContext to call your API
   - Replace mock data with real API endpoints

3. **Option C: Firebase**
   - Set up Firebase project
   - Add Firebase SDK
   - Migrate from localStorage to Firestore

## Support

For questions or issues with the export/import process, refer to:
- Replit documentation: https://docs.replit.com/
- Vite documentation: https://vitejs.dev/
- React Router documentation: https://reactrouter.com/

## License

This project structure and code are provided as-is for the LEANLINGO platform.
