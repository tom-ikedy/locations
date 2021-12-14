<template>
  <div class="home">
    <div id="catch-copy">
      あなただけの<br>
      お気に入りのお店リストを<br>
      作りませんか？
    </div>
    <div id="overview">
      <p>
        『LocationS』はお気に入りのお店を登録し<br>
        あなただけの写真やメモを残すことができるサイトです。
      </p>
    </div>
    <button @click='onClickGuestLogin'>試してみる（ゲストログイン）</button>
    <button @click='onClickRegAccount'>新規アカウント登録</button>
    <button @click='onClickLogin'>ログイン</button>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  props: {
    userId: null,
  },

  methods: {
    async onClickGuestLogin() {
      let user = firebase.auth().currentUser;
      if (user) {
        console.log('ログインしました', user.uid);
        this.$router.push({ path: `/user/${user.uid}` });
      } else {
        console.log('匿名ログインします');

        await firebase.auth().signInAnonymously() // 匿名ログインの実行
          .catch((error) => {
            // ログインに失敗したときの処理
            console.error('ログインエラー', error);
          });
        user = firebase.auth().currentUser;
        this.$router.push({ path: `/user/${user.uid}` });
      }
    },

    onClickRegAccount() {
      this.$router.push('/regaccount');
    },

    onClickLogin() {
      this.$router.push('/login');
    },
  },
};
</script>

<style>
#catch-copy {
  margin: 10px 0px;
  font-size: 28px;
  text-align: center;
  background-color: #dff;
}

#overview {
  text-align: center;
}

.home button {
  display: flex;
  margin: 10px auto;
  text-align: center;
}
</style>
