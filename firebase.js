// ═══════════════════════════════════════════════════════════
//  TAKE AWAY — Taste of Malaysia
//  firebase.js  |  Firebase init + contact form submit
//  This is an ES module — keep type="module" on its <script> tag
// ═══════════════════════════════════════════════════════════

import { initializeApp }  from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics }   from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDU8agHhOlCLnmG9EyxxXRjsSGpF21MWXA",
  authDomain:        "restaurant-website-8d46b.firebaseapp.com",
  projectId:         "restaurant-website-8d46b",
  storageBucket:     "restaurant-website-8d46b.firebasestorage.app",
  messagingSenderId: "473108303794",
  appId:             "1:473108303794:web:f556610076fce04a4f5eab",
  measurementId:     "G-925KKZ37SL"
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db        = getFirestore(app);

// ── CONTACT FORM → FIREBASE ──────────────────────────────────
// Exposed on window because the HTML button uses onclick="handleFormSubmit(this)"
window.handleFormSubmit = async function (btn) {
  const name     = document.getElementById('name').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const category = document.getElementById('category').value;
  const message  = document.getElementById('message').value.trim();

  if (!name || !phone || !category || !message) {
    alert('Please fill all fields');
    return;
  }

  try {
    btn.disabled  = true;
    btn.innerHTML = 'Sending...';

    await addDoc(collection(db, 'contacts'), {
      name, phone, category, message,
      createdAt: serverTimestamp()
    });

    alert('Message Sent Successfully!');

    document.getElementById('name').value     = '';
    document.getElementById('phone').value    = '';
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('message').value  = '';

  } catch (error) {
    console.error(error);
    alert('Failed to send message');
  } finally {
    btn.disabled  = false;
    btn.innerHTML = 'Send Message <i class="fas fa-arrow-right ms-2"></i>';
  }
};
