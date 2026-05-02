import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// TODO: Replace this with your app's Firebase project configuration
// 1. Go to console.firebase.google.com
// 2. Open your project settings
// 3. Scroll down to "Your apps" and select the Web app (</>) icon
// 4. Copy the firebaseConfig object and paste it here:
const firebaseConfig = {
  apiKey: "AIzaSyB0mV_A1hLN0t5e6OryoR8agOZMGBk7k-I",
  authDomain: "leanlingo-0629.firebaseapp.com",
  projectId: "leanlingo-0629",
  storageBucket: "leanlingo-0629.firebasestorage.app",
  messagingSenderId: "807869123123",
  appId: "1:807869123123:web:9419d6d61b61e21ded3146",
  measurementId: "G-3BWYDXYQ8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Messaging conditionally (only works in supported browsers)
export const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

// The VAPID key you generated in the Firebase Console
const VAPID_KEY = "BJzvnuoDW1t9Dn1jI3Y18SC1xjK0JqHaTd4KyS7mJQxYip1defA3pM6ndges1pYm1EM9-45z6SQ7zVEcaZVX2JY";

export const requestNotificationPermission = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('User denied native push permissions!');
        return null;
      }

      await PushNotifications.register();
      console.log('Native push notification registered!');
      
      // Native token is handled via listeners in native code, 
      // but returning a status here for the UI to know it succeeded
      return "native-token-requested";
    } else {
      const msg = await messaging();
      if (!msg) {
        console.log("Push messaging is not supported in this browser.");
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(msg, { vapidKey: VAPID_KEY });
        console.log('Notification permission granted. Token:', token);
        return token;
      } else {
        console.log('Notification permission denied.');
        return null;
      }
    }
  } catch (error) {
    console.error('An error occurred while requesting notification permission:', error);
    return null;
  }
};
