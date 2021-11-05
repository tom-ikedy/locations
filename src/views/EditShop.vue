<template>
  <div class="edit-shop">
    <template v-if='this.$route.params.shopId == "register"'>
      <h1>お店の新規登録</h1>
    </template>
    <template v-else>
      <h1>{{shopData.name}}の編集</h1>
    </template>

    <div class="edit-shop-detail">
      <div class="edit-shop-detail-name">
        名前：
      </div>
      <div class="edit-shop-detail-contents">
        <input
          id='shopname'
          v-model='shopname'
          required
          type='text'
        >
      </div>
    </div>

    <div class="edit-shop-detail">
      <div class="edit-shop-detail-name">
        メモ：
      </div>
      <div class="edit-shop-detail-contents">
        <textarea
          id='shopmemo'
          v-model='shopmemo'
          required
          type='text'
          rows='8'
          cols='32'
        ></textarea>
      </div>
    </div>

    <div class="edit-shop-detail">
      <div class="edit-shop-detail-name">
        写真：
      </div>
      <div class="edit-shop-detail-contents">
        <input type='file'
          accept='.jpg,.jpeg,.png,.gif, image/jpeg,image/png,image/gif'
          v-on:change='uploadImage'
        >
      </div>
    </div>
    <div class="edit-shop-detail">
      <div class="edit-shop-detail-name">
      </div>
      <div class="edit-shop-detail-contents-image">
        選択した写真：<br>
        <img
          :src='fileURL'
          v-show='fileURL !== ""'
          width='128' height='128'
        />
      </div>
      <template v-if='this.$route.params.shopId !== "register"'>
        <div class="edit-shop-detail-contents-image">
          現在の写真：<br>
          <img
            :src='shopData.imageURL'
            width='128' height='128'
          />
        </div>
      </template>
    </div>

    <template v-if='this.$route.params.shopId === "register"'>
      <p>
        <button type='button' @click='onClickAddShop'>
          登録する
        </button>
      </p>
    </template>
    <template v-else>
      <p>
        <button class='button-edit' type='button' @click='onClickUpdateShop'>
          更新する
        </button>
      </p>
      <p>
        <button class='button-delete' type='button' @click='onClickDeleteShop'>
          {{shopData.name}}を削除する
        </button>
      </p>
    </template>
  </div>
</template>

<script>
import {
  addShopData,
  delShopData,
  getShopData,
  updateShopData,
} from '@/services/firebaseService';

export default {
  data() {
    return {
      shopname: '',
      shopmemo: '',
      fileData: '',
      fileURL: '',

      shopData: '',
    };
  },

  async created() {
    if (this.$route.params.shopId !== 'register') {
      // 新規登録でない（編集の）場合、登録済みのデータを取得する
      const userid = this.$route.params.userId;
      const shopid = this.$route.params.shopId;
      this.shopData = await getShopData(userid, shopid)
        .catch((err) => {
          console.error(err.message);
        });

      this.shopname = this.shopData.name;
      this.shopmemo = this.shopData.memo;
    }
  },

  methods: {
    uploadImage(e) {
      // イベント（e）から画像ファイルを取得する
      if (e.target.files.length === 0) {
        // ファイルが選択されていないなら何もしない
        this.fileData = '';
        this.fileURL = '';
        return;
      }
      const file = e.target.files[0];
      this.fileData = file;

      // 選択されたファイルをプレビュー表示する
      this.fileURL = URL.createObjectURL(file);
    },

    async onClickAddShop() {
      const userid = this.$route.params.userId;

      // お店情報を新規登録する
      if (this.shopname === '') {
        console.error('お店の名前が入力されていません。');
        return;
      }

      // お店情報オブジェクトを作成する
      const tmpShopData = {};
      tmpShopData.name = this.shopname;
      tmpShopData.memo = this.shopmemo;
      tmpShopData.fileData = this.fileData;

      // Firestoreにお店情報をアップロード＋Storageに写真をアップロード
      await addShopData(userid, tmpShopData);

      // マイページに遷移する
      this.$router.push({ path: `/user/${this.$route.params.userId}` });
    },

    async onClickUpdateShop() {
      // お店情報を更新する
      const userid = this.$route.params.userId;
      const shopid = this.$route.params.shopId;

      if (this.shopname === '') {
        console.error('お店の名前が入力されていません。');
        return;
      }

      // お店情報オブジェクトを作成する
      const tmpShopData = {};
      tmpShopData.name = this.shopname;
      tmpShopData.memo = this.shopmemo;
      tmpShopData.fileData = this.fileData;
      tmpShopData.imageURL = this.shopData.imageURL;

      // Firestoreのデータを更新する＋Storageの写真を更新する
      await updateShopData(userid, shopid, tmpShopData);

      // お店ページに遷移する
      this.$router.push({ path: `/user/${userid}/shop/${shopid}` });
    },

    async onClickDeleteShop() {
      // お店情報を削除する
      const userid = this.$route.params.userId;
      const shopid = this.$route.params.shopId;
      const confirmMessage = this.shopname.concat('を削除してもよろしいですか？');

      // ダイアログでキャンセルされた場合は削除しない
      const ans = window.confirm(confirmMessage);
      if (ans === false) {
        return;
      }

      // Firestoreのデータを削除する＋Storageの写真を削除する
      await delShopData(userid, shopid);

      // マイページに遷移する
      this.$router.push({ path: `/user/${this.$route.params.userId}` });
    },
  },
};
</script>

<style>
.edit-shop-detail {
  margin: 0px 0px 0px 10px;
  padding: 5px 10px 0px 0px;

  display: flex;
  justify-content: flex-start;
}

.edit-shop-detail-name {
  width: 50px;
  padding: 0px 0px 0px 5px;
}

.edit-shop-detail-contents {
  padding: 0px 0px 0px 5px;
}

.edit-shop-detail-contents-image {
  width: 175px;
  margin: 5px;
  padding: 0px 0px 0px 5px;

  border: 1px solid #ccc;
}

.button-edit {
  font-size: 16px;
}
</style>
