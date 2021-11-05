<template>
  <div class="ShopData">
    <h1>{{shopData.name}}</h1>
    <div class="shop-detail">
      <div class="shop-detail-name">
        メモ：
      </div>
      <div class="shop-detail-contents">
        {{shopData.memo}}
      </div>
    </div>
    <div class="shop-detail">
      <div class="shop-detail-name">
        写真：
      </div>
      <div class="shop-detail-contents">
        <img
          :src='shopData.imageURL'
          style='width: 128px; height: 128px;'
        />
      </div>
    </div>
    <p>
      <button
        type='button'
        @click='onClickEditShop'
      >
        編集する
      </button>
    </p>
  </div>
</template>

<script>
import { getShopData } from '@/services/firebaseService';

export default {
  data() {
    return {
      shopData: '',
    };
  },

  async created() {
    const userid = this.$route.params.userId;
    const shopid = this.$route.params.shopId;
    this.shopData = await getShopData(userid, shopid).catch((err) => {
      console.error(err.message);
    });
  },

  methods: {
    onClickEditShop() {
      const userid = this.$route.params.userId;
      const shopid = this.$route.params.shopId;
      this.$router.push({ path: `/user/${userid}/editShop/${shopid}` });
    },
  },
};
</script>

<style>
.shop-detail {
  margin: 0px 0px 0px 10px;
  padding: 5px 10px 0px 0px;

  display: flex;
  justify-content: flex-start;
}

.shop-detail-name {
  width: 50px;
  padding: 10px 0px 0px 5px;
}

.shop-detail-contents {
  padding: 10px 0px 0px 5px;

  white-space: pre-line;
  word-wrap: break-word;
}
</style>
