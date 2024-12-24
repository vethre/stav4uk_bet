import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set, get, child } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCgsq0LoqN-VEGhmKWK_iDQZ0GALlSMXVc",
    authDomain: "stav4uk-6e77d.firebaseapp.com",
    databaseURL: "https://stav4uk-6e77d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "stav4uk-6e77d",
    storageBucket: "stav4uk-6e77d.firebasestorage.app",
    messagingSenderId: "431550164866",
    appId: "1:431550164866:web:2055820a593eaf113e699b"
  };
  
  // Ініціалізація Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const auth = getAuth(app);
  
  // Глобальні змінні
  let currentUser = null;
  
  // Реєстрація користувача
  function registerUser() {
    const username = document.getElementById("username").value;
    if (!username) {
      alert("Введіть ім'я!");
      return;
    }
    const userId = `user_${Date.now()}`;
    firebase.database().ref(`users/${userId}`).set({ name: username, balance: 1000 });
    currentUser = userId;
    document.getElementById("user-section").style.display = "none";
    document.getElementById("main-section").style.display = "block";
    loadUserData();
  }
  
  // Завантаження даних користувача
  function loadUserData() {
    if (!currentUser) return;
    firebase.database().ref(`users/${currentUser}`).on("value", (snapshot) => {
      const data = snapshot.val();
      document.getElementById("balance").innerText = data.balance;
    });
  }
  
  // Додати ставку
  function placeBet(team) {
    const betAmount = parseInt(document.getElementById("betAmount").value);
    firebase.database().ref(`users/${currentUser}`).once("value").then((snapshot) => {
      const userData = snapshot.val();
      if (betAmount > userData.balance) {
        alert("Недостатньо балів!");
        return;
      }
      const newBalance = userData.balance - betAmount;
      firebase.database().ref(`users/${currentUser}`).update({ balance: newBalance });
      firebase.database().ref("bets").push({ userId: currentUser, team, amount: betAmount });
    });
  }
  
  // Показати лідерборд
  function showLeaderboard() {
    document.getElementById("main-section").style.display = "none";
    document.getElementById("leaderboard").style.display = "block";
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "";
    firebase.database().ref("users").orderByChild("balance").once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        const li = document.createElement("li");
        li.innerText = `${user.name}: ${user.balance} балів`;
        leaderboardList.appendChild(li);
      });
    });
  }
  
  function hideLeaderboard() {
    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("main-section").style.display = "block";
  }
  