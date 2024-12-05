import { initializeApp } from "firebase/app";
import {getFirestore, addDoc, collection} from "firebase/firestore/lite"

const firebaseConfig = {
  apiKey: "AIzaSyBtDXIZHZqqR30o7dcbuLE-bVFKNy73sAQ",
  authDomain: "litexsupport-3ad68.firebaseapp.com",
  projectId: "litexsupport-3ad68",
  storageBucket: "litexsupport-3ad68.firebasestorage.app",
  messagingSenderId: "266680635239",
  appId: "1:266680635239:web:af1de24ebf1590e81fa9c2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export async function createTicket(threadId: string, text: string) {
    try {
        await addDoc(collection(db, 'tickets'), {
            threadId,
            text,
            openedAt: Date()
        })
    }catch(e){
        console.error("Error adding document: ", e)
    }
}