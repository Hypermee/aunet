<script setup lang="ts">
import Header from './components/header/index.vue';
import Aside from './components/leftnav/index.vue';
</script>

<template>
  <Header />
  <Aside />
  <main id="page">
    <router-view />
  </main>
</template>


<style lang="scss">
#app {
  width: 720px;
  height: 512px;
  border-radius: 10px;
  background-color: #fff;

  display: flex;
  user-select: none;

  font-family: "微软雅黑", serif;

  #page {
    width: 445px;
    height: 422px;
    padding: 40px 50px;
  }
}
</style>
