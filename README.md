# 📘 LEANLINGO

Leanlingo is an interactive, gamified learning platform designed to help users master **Lean 4**—a functional programming language and theorem prover—and learn mathematical proofs in a fun and engaging way.

## 🎯 Core Features

### 🔐 1. Authentication & Recovery (Firebase Auth)
*   **Secure Sign Up & Login:** Real-time user registration and login database tracking.
*   **Password Recovery:** Fully implemented recovery flow sending a password reset link to the user's corresponding Gmail.
*   **Settings Management:** Easily change passwords, reset profiles, toggle notifications, or delete accounts.

### 📝 2. Interactive Proof Editor & Validation
*   **Online Code Editor:** Write Lean proofs using tactics like reflexivity (`rfl`), simplification (`simp`), mathematical induction (`induction`), and more.
*   **Flexible Solution Engine:** Supports **multiple valid proof solutions** for the same problem, reflecting the open-ended nature of real math proofs.
*   **Auto-Save & Resume Progress:** Automatically backs up your current editor code, scroll position, and unlocked hints every 5 seconds. If you navigate away or refresh, you can resume exactly where you left off.

### 💡 3. Progressive Hints & Community Resources
*   **Sequential Hints:** Get stuck? Unlock a 3-level progressive hint system step-by-step.
*   **Resource Center:** Share and browse helpful documentation, articles, and video tutorials categorized for each question.
*   **Community Voting:** Upvote helpful resources to make them visible to other learners.

### 🏆 4. Gamification & Community Feed
*   **Global Leaderboard:** Compete with other users worldwide. Gain points and levels as you complete proofs.
*   **Interactive Home Dashboard:** Track your points, level progress, success rate, and active streaks.
*   **Activity Feed:** Keep up with newly uploaded questions and community submissions.
*   **Push Notifications (Capacitor/FCM):** Push alert system for native mobile platforms and supported browsers.

---

## 🛠️ Technology Stack

*   **Frontend Library:** React (TypeScript)
*   **Styling:** Tailwind CSS & Vanilla CSS (with shadcn/ui components)
*   **Build Tool:** Vite
*   **Backend & DB:** Firebase Authentication & Cloud Firestore (Real-time database)
*   **Notifications:** Firebase Cloud Messaging (FCM)
*   **Mobile App wrapper:** Capacitor (configured for Android and iOS builds)
*   **Icons & Toasts:** Lucide React & Sonner Toast Notifications

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your computer.

### Installation
1.  Unzip the project folder.
2.  Open your terminal inside the project directory.
3.  Install dependencies:
    ```bash
    npm install
    # or
    pnpm install
    ```

### Run the App Locally
Start the local development server:
```bash
npm run dev
# or
pnpm dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser to view the app.