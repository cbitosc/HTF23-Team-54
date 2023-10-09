import { getFirestore, collection, addDoc, setDoc, doc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDiFWXyeXDdF2XUbVSSp1YJInOMi8zxVpw",
    authDomain: "resumeevaluator-98a8f.firebaseapp.com",
    projectId: "resumeevaluator-98a8f",
    storageBucket: "resumeevaluator-98a8f.appspot.com",
    messagingSenderId: "317845582074",
    appId: "1:317845582074:web:c41b5a4436a4c315e71943"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const collectionRef = await query(collection(firestore, "users", window.localStorage.getItem('uid'), "previous"), orderBy("date", "desc"));

try {
    const snapShot = await getDocs(collectionRef)
    snapShot.forEach(element => {
        console.log(element.id)
        result.innerHTML += "<div class='card'><h2>" + element.data().fileName + "</h2><h3>" + element.data().field + "</h3><h3>" + (element.data().probabilty_list * 100) + "%</h3></div>"
    });
} catch (error) {
    alert(error)
}