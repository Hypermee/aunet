<template>
  <header id="top-header">
    <div class="left">
      <i class="favicon" />
      <span class="title">AuNet</span>
    </div>
    <div class="right">
      <i class="iconfont icon-minus" @click="minus" />
      <i class="iconfont icon-close" @click="close" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";

const minus = () => {
  window.electron.ipcRenderer.send('minimize')
}

const close = () => {
  window.electron.ipcRenderer.send('close')
}

defineComponent({
  name: "header"
});
</script>

<style lang="scss">
@import "./index.scss";
</style>
