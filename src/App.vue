<template>
  <div id="app">
    <div id="header">
      <div id="logo" :url="url">
        <template v-if='currentUID === null'>
          <router-link to="/">
            <img :src="url" width="186" height="95">
          </router-link>
        </template>
        <template v-else>
          <router-link :to="{ name: 'User', params: { userId: currentUID }}">
            <img :src="url" width="186" height="95">
          </router-link>
        </template>
      </div>
      <div id="nav">
        <template v-if='$route.path !== "/"'>
          <template v-if='currentUID === null'>
            <ul>
              <li><router-link to="/login">ログイン</router-link></li>
              <li><router-link to="/RegAccount">新規アカウント登録</router-link></li>
            </ul>
          </template>
          <template v-else>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'User', params: { userId: currentUID }}"
                >
                  マイページ
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'UserSetting', params: {userId: currentUID }}"
                >
                  アカウント設定
                </router-link>
              </li>
              <li><a href="/logout" @click='onClickLogOut'>ログアウト</a></li>
            </ul>
          </template>
        </template>
      </div>
    </div>
    <div id="header-space"></div>
    <router-view/>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      currentUID: null,
      url: 'https://firebasestorage.googleapis.com/v0/b/tsukamoto-locations.appspot.com/o/Locations-Logo.png?alt=media&token=0743dbd4-3b8b-466f-af63-6e4b6abb5fc2',
    };
  },

  created() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.currentUID = user.uid;
    } else {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.currentUID = user.uid;
        } else {
          this.currentUID = null;
        }
      });
    }
    /*
    */
  },

  methods: {
    async onClickLogOut(e) {
      e.preventDefault();
      await firebase
        .auth()
        .signOut()
        .then(() => {
          // ログアウトに成功した時の処理
          this.currentUID = null;
          console.log('ログアウトしました');
          // Loginにページ遷移する
          this.$router.push('/login');
        })
        .catch((error) => {
          // ログアウトに失敗した時の処理
          console.error('ログアウトエラー', error);
        });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #dddddd
}

#header-space {
  top: 0;
  height: 130px;
}

#logo {
  height: 95px;
}

#nav {
  width: 100%;
}

#nav ul {
  font-size: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

#nav ul li {
  font-size: 16px;
  display: inline-block;
  width: 163px;
  margin-right: 1px;
  background-color: #cff;
  text-align: center;
}

#nav ul li a {
  display: block;
  padding: 5px 5px;
  color: #000;
  text-decoration: none;
  transition: background-color .2s linear;
}

#nav a {
  color: #2c3e50;
  text-decoration: none;
}

#nav a:hover {
  font-weight: 500;
  text-decoration: underline;
  background-color: #aff;
}

#nav a.router-link-exact-active {
  color: #000;
  font-weight: 700;
  text-decoration: underline;
  background-color: #8ff;
}

h1 {
  font-size: 32px;
  background-color: #dff;
  margin: 5px 0px 5px 0px;
  padding: 0px 0px 0px 5px;
}

h2 {
  font-size: 24px;
  background-color: #eff;
  margin: 5px 0px 5px 0px;
  padding: 0px 0px 0px 10px;
}
</style>
