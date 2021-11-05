import Vue from 'vue';
import firebase from 'firebase/app';
import App from './App.vue';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import router from './router';

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: 'AIzaSyDAdlZNMU_OCfINzNq7Npl8nDmoEgmQ5_Q',
  authDomain: 'tsukamoto-locations.firebaseapp.com',
  projectId: 'tsukamoto-locations',
  storageBucket: 'tsukamoto-locations.appspot.com',
  messagingSenderId: '988568958924',
  appId: '1:988568958924:web:1835e93338a980967e4f69',
};

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
