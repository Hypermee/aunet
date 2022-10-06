<template>
 <main class="main-wrap">
   <div class="show-wrap">
     <div class="show">
       <p class="title"><span class="num">{{ userStore.userdata?.useTime || '0' }}{{' '}}</span>分钟</p>
       <p class="sub-title">已用时长</p>
     </div>
     <div class="show">
       <p class="title"><span class="num">{{ userStore.userdata?.leftTime || '0' }}{{' '}}</span>分钟</p>
       <p class="sub-title">可用时长</p>
     </div>
     <div class="show">
       <p class="title"><span class="num">{{ userStore.userdata?.installmentFlag || '0' }}{{' '}}</span>元</p>
       <p class="sub-title">消费保护</p>
     </div>
     <div class="show">
       <p class="title"><span class="num">{{ userStore.userdata?.leftMoney || '0.00' }}{{' '}}</span>元</p>
       <p class="sub-title">账户余额</p>
     </div>
   </div>

 </main>
</template>

<script lang="ts" setup>
import {defineComponent} from "vue";
import { useUserStore } from "../../store";

const userStore = useUserStore();

defineComponent({
  name: 'home'
})
</script>

<style lang="scss" scoped>
  .main-wrap {
    padding: 15px 0;
    .show-wrap {
      display: grid;
      grid-gap: 10px 10px;
      justify-content: center;
      grid-template-rows: 60px 60px;
      grid-template-columns: 210px 210px;
      .show {
        padding: 0 5px;
        color: #80898e;
        text-align: right;
        background-color: #f5f5f5;

        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;

        .title {
          font-size: 13px;

          .num {
            color: #578EBE;
            font-size: 20px;
            font-weight: bold;
          }
        }

        .sub-title {
          font-size: 14px;
        }
      }
    }
  }
</style>
