import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDAdlZNMU_OCfINzNq7Npl8nDmoEgmQ5_Q',
  authDomain: 'tsukamoto-locations.firebaseapp.com',
  projectId: 'tsukamoto-locations',
  storageBucket: 'tsukamoto-locations.appspot.com',
  messagingSenderId: '988568958924',
  appId: '1:988568958924:web:1835e93338a980967e4f69',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
