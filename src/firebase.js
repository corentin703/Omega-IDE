import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
    apiKey: "AIzaSyDVGEyNqgLCCerqbqGmUQ3mMxu8M4sYZvo",
    authDomain: "omega-numworks.firebaseapp.com",
    databaseURL: "https://omega-numworks.firebaseio.com",
    projectId: "omega-numworks",
    storageBucket: "omega-numworks.appspot.com",
    messagingSenderId: "172338146789",
    appId: "1:172338146789:web:3000e6cb87d21249c8530c",
    measurementId: "G-P9YFFF08LN"
};

initializeApp(firebaseConfig);

const initMessaging = () => {
    const messaging = getMessaging();

    if (!messaging.isSupported()) {
        return null;
    }

    messaging.getToken({
        vapidKey: 'BIUahBDHm8uSYVl3WGvEl4BS2v8X0yU8bkNjQiid_5x5RzlzDR2JY0uJeBzgBey1b1AvdI_Z2Bk5gwYOZpiup4g',
    });

    return messaging;
}

export const messaging = initMessaging();
