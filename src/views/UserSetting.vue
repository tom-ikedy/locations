<template>
  <div class='user'>
    <h1>アカウント設定</h1>
    <button
      type='button'
      @click='onClickDeleteAccount'
    >
      アカウント削除
    </button>
  </div>
</template>

<script>
import { deleteAccount } from '@/services/firebaseService';

export default {
  data() {
    return {
      shops: [],
    };
  },

  methods: {
    onClickDeleteAccount() {
      const userid = this.$route.params.userId;
      const confirmMessage = 'アカウントを削除してもよろしいですか？';

      // ダイアログでキャンセルされた場合は削除しない
      const ans = window.confirm(confirmMessage);
      if (ans === false) {
        return;
      }

      deleteAccount(userid);

      // トップページに遷移する
      this.$router.push('/');
    },
  },
};
</script>

<style>
.add-button {
  margin: 10px;
}

.shoplist ul {
  list-style: none;
  padding-left: 15px;
}

.shoplist li {
  margin: 5px;
  padding: 5px;
  text-align: top;
  border-radius: 1px;
  border: 1px solid #ccc;
  white-space: pre-line;
  word-wrap: break-word;
}

.shop-name {
  font-size: 18px;
}

.shop-detail {
  display: flex;
  justify-content: flex-start;
}

.shop-image {
  padding: 0px 5px 0px 10px;
}

.shop-memo {
  font-size: 15px;
  padding: 0px 0px 0px 5px;
}
</style>
