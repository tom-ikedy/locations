<template>
  <div class='user'>
    <h1>マイページ</h1>
    <h2>お店一覧</h2>
    <div class='add-button'>
      <button
        type='button'
        @click='onClickEditShop'
      >
        お店の新規登録
      </button>
    </div>
    <div class='shoplist'>
      <ul>
        <li
          v-for='{shopid, name, memo, imageURL} in shops'
          :key='shopid'
        >
          <div class='shop-name'>
            <router-link :to="{ name: 'Shop', params: { shopId: shopid }}">
              {{name}}
            </router-link>
          </div>
          <div class='shop-detail'>
            <div class='shop-image'>
              <router-link :to="{ name: 'Shop', params: { shopId: shopid }}">
                <img :src='imageURL' width='128' height='128'>
              </router-link>
            </div>
            <aside class='shop-memo'>
              {{memo}}
            </aside>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getShops } from '@/services/firebaseService';

export default {
  data() {
    return {
      shops: [],
    };
  },

  async created() {
    const userid = this.$route.params.userId;
    this.shops = await getShops(userid).catch((err) => {
      console.error(err.message);
    });
  },

  methods: {
    onClickEditShop() {
      const userid = this.$route.params.userId;
      this.$router.push({ path: `/user/${userid}/editShop/register` });
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
