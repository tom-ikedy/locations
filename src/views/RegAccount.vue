<template>
  <div class="reg-account">
    <h1>新規アカウント登録</h1>
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
        @click='onClickRegAccount'
      >
        登録
      </button>
    </p>
  </div>
</template>

<script>
import { addAccount } from '@/services/firebaseService';

export default {
  data() {
    return {
      usermail: '',
      userpass: '',
    };
  },

  methods: {
    async onClickRegAccount() {
      const userid = await addAccount(this.usermail, this.userpass);

      if (userid !== '') {
        // アカウント登録成功
        this.$router.push({ path: `/user/${userid}` });
      } else {
        // アカウント登録失敗
        this.usermail = '';
        this.userpass = '';
      }
    },
  },
};
</script>
