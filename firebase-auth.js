// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtjr1-AW8-sx0WgC2iJSkgRdD2Bj3DEVg",
  authDomain: "login-form-e4e35.firebaseapp.com",
  projectId: "login-form-e4e35",
  storageBucket: "login-form-e4e35.appspot.com",
  messagingSenderId: "907300024833",
  appId: "1:907300024833:web:d05fbb547448242f19c600"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Function to display messages
function showMessage(type, message) {
  const messageBox = document.getElementById("messageBox");
  messageBox.innerHTML = `<div class="alert alert-${type} fade show animated fadeIn" role="alert">${message}</div>`;

  // Auto-hide the message after 3 seconds
  setTimeout(() => {
    messageBox.innerHTML = "";
  }, 3000);
}

// Sign Up Function
document.getElementById("signUpForm").addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("Sign-up form submitted");

  const username = document.getElementById("signUpUsername").value;
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;

  console.log("Creating user...");
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User created successfully", userCredential);
      const user = userCredential.user;

      // Save user details to database
      return set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString()
      });
    })
    .then(() => {
      console.log("User data saved to database");
      showMessage("success", "✅ Successfully Registered! You can now sign in.");
      document.getElementById("signUpForm").reset();
    })
    .catch((error) => {
      console.error("Error during sign-up:", error);
      if (error.code === "auth/email-already-in-use") {
        showMessage("danger", "❌ This email is already in use(on first attempt of signup successful). Please use a different email or sign in.");
      } else {
        showMessage("danger", "❌ Sign-up failed: " + error.message);
      }
    });
});

// Sign In Function
document.getElementById("signInForm").addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("Sign-in form submitted");

  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;

  console.log("Signing in user...");
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("Sign-in successful");
      showMessage("success", "✅ Sign-in successful!");
      setTimeout(() => {
        window.location.href = "home.html"; // Redirect after success message
      }, 1500);
    })
    .catch((error) => {
      console.error("Sign-in failed:", error);
      showMessage("danger", "❌ Sign-in failed: " + error.message);
    });
});
