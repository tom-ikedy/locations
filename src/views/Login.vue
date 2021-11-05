<template>
  <div class="login">
    <h1>ログイン</h1>
    <p>
      アカウント：
      <input
        id='email'
        v-model='usermail'
        required
        type='email'
      >
    </p>
    <p>
      パスワード：
      <input
        id='userpass'
        v-model='userpass'
        required
        type='password'
      >
    </p>
    <p>
      <button
        type='button'
        @click='onClickLogIn'
      >
        ログイン
      </button>
    </p>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      usermail: '',
      userpass: '',
    };
  },

  methods: {
    onClickLogIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.usermail, this.userpass)
        .then((userCredential) => {
          // ログインに成功したときの処理
          console.log('ログインしました');
          this.userpass = '';

          // マイページに画面遷移する
          const userId = userCredential.user.uid;
          this.$router.push({ path: `/user/${userId}` });
        })
        .catch((error) => {
          // ログインに失敗したときの処理
          console.error('ログインエラー', error);
          alert('アカウント名またはパスワードが違います。');
          this.userpass = '';
        });
    },
  },
};
</script>
