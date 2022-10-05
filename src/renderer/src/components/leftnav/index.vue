<template>
  <aside id="left-nav">
    <div class="user">
      <p>你好，</p>
      <p
        class="username"
        v-if="!userStore.username"
        @click="onHelperLogin"
      >{{ isLogin ? '正在登录中...' : '请先点击登录' }}</p>
      <p v-else>{{ userStore.username }}</p>
    </div>
    <nav class="navs">
      <div
        class="item"
        @click="onNavTo('home')"
        :class="{ active: active === 'home' }"
      >
        <i class="iconfont icon-home"></i>
        <span>在线信息</span>
      </div>
      <div
        class="item"
        @click="onNavTo('show')"
        :class="{ active: active === 'show' }"
      >
        <i class="iconfont icon-users"></i>
        <span>远程共享</span>
      </div>
      <div
        class="item"
        @click="onNavTo('more')"
        :class="{ active: active === 'more' }"
      >
        <i class="iconfont icon-grid"></i>
        <span>更多功能</span>
      </div>
      <div
        class="item"
        @click="onNavTo('setup')"
        :class="{ active: active === 'setup' }"
      >
        <i class="iconfont icon-cog"></i>
        <span>高级设置</span>
      </div>
    </nav>
    <div class="version">
      <span>版本号 v1.0.0</span>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../../store";
import { ref, defineComponent, onBeforeMount } from "vue";

const navTo = useRouter();
const isLogin = ref(false);
const active = ref<string>("home");
const userStore: ReturnType<typeof useUserStore> = useUserStore();

const onNavTo = (e) => {
  if(typeof e === 'string') {
    active.value = e;
    navTo.push({ name: e })
  } else {
    // let url = e.currentTarget.value.url;
    // ...
  }
}

const onHelperLogin = () => {
  if(isLogin.value) return;

  isLogin.value = true;

  let { account = '', password = '' } = userStore;
  window.electron.ipcRenderer.once('renderer-username', function (e, res) {
    if(res) {
      userStore.username = res.username;
      userStore.JSESSIONID = res.JSESSIONID;
    } else {
      userStore.username = '';
      userStore.JSESSIONID = '';

      isLogin.value = false;
    }
  })

  window.electron.ipcRenderer.send('username', {
    account,
    password
  })
}

onBeforeMount(() => {
  let { account = '', password = '' } = userStore;
  window.electron.ipcRenderer.once('renderer-username', function (e, res) {
    if(res) {
      userStore.username = res.username;
      userStore.JSESSIONID = res.JSESSIONID
    } else {
      userStore.username = '';
      userStore.JSESSIONID = '';
    }
  })

  window.electron.ipcRenderer.send('username', {
    account,
    password
  })
})

defineComponent({
  name: "left-nav"
})
</script>

<style lang="scss">
@import "./index.scss";
</style>
