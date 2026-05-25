importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB0mV_A1hLN0t5e6OryoR8agOZMGBk7k-I",
  authDomain: "leanlingo-0629.firebaseapp.com",
  projectId: "leanlingo-0629",
  storageBucket: "leanlingo-0629.firebasestorage.app",
  messagingSenderId: "807869123123",
  appId: "1:807869123123:web:9419d6d61b61e21ded3146",
  measurementId: "G-3BWYDXYQ8S"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
 