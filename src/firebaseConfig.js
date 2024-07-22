import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "BPyUlRdB6y_1RBhecfMharW_f49y4FcbLzZu3B0g45G4E7",
    authDomain: "time-tracker-c0019.firebaseapp.com",
    projectId: "time-tracker-c0019",
    storageBucket: "time-tracker-c0019.appspot.com",
    messagingSenderId: "422114033117",
    appId: "2912449784bcf940e36cef7b2ab5ae0954f0e378"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };