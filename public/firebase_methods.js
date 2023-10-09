// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";;
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiFWXyeXDdF2XUbVSSp1YJInOMi8zxVpw",
  authDomain: "resumeevaluator-98a8f.firebaseapp.com",
  projectId: "resumeevaluator-98a8f",
  storageBucket: "resumeevaluator-98a8f.appspot.com",
  messagingSenderId: "317845582074",
  appId: "1:317845582074:web:c41b5a4436a4c315e71943"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


window.onload = onAuthStateChanged(auth, (user) => {
  if (user == null && !window.location.pathname == '/index.html') {
    window.location.href = 'index.html'
  }
})




const authProvider = new GoogleAuthProvider();
const db = getFirestore(app);

const authButton = document.getElementById('auth-btn')

authButton.addEventListener('click', () => {
  signInWithPopup(auth, authProvider).then(async (result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;

    const docRef = await doc(db, 'users', user.uid)

    const document = await setDoc(docRef, {
      displayName: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
      uid: user.uid
    });

    window.location.replace('./upload_page.html')
    window.localStorage.setItem('uid', user.uid)

  }).catch((error) => {
    // Handle Errors here.
    alert(error)
    // ...
  });
});

export default app
