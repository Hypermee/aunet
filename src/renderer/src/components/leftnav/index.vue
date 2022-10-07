<template>
  <aside id="left-nav">
    <div class="user">
      <p>你好，<i
        v-show="userStore.username"
        class="iconfont icon-refresh"
        @click="refreshAccount"
      /></p>
      <p
        class="username"
        v-if="!userStore.JSESSIONID"
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
import {ref, defineComponent, onBeforeMount, reactive} from "vue";

let t = ref(null);

const navTo = useRouter();
const isLogin = ref(false);
const active = ref<string>("home");
const userStore: ReturnType<typeof useUserStore>[1] = useUserStore();


const onNavTo = (e) => {
  if(typeof e === 'string') {
    active.value = e;
    navTo.push({ name: e })
  } else {
    // let url = e.currentTarget.value.url;
    // ...
  }
}

const refreshAccount = () => {
  userStore.userdata = { };
  userStore.JSESSIONID = '';
  onHelperLogin();
}

const onHelperLogin = () => {
  if(isLogin.value) return;

  isLogin.value = true;

  let { account = '', password = '', JSESSIONID = '' } = userStore;

  if (
    (account.length < 9 && account.length > 11) &&
    (password.length < 8 && password.length > 20)
  ) return isLogin.value = false;

  window.electron.ipcRenderer.once('renderer-username', function (e, res) {
    isLogin.value = false;
    if(res) {
      userStore.userdata = res.userdata;
      userStore.username = res.username;
      userStore.JSESSIONID = res.JSESSIONID;
      if(t.value != null) {
        clearInterval(t.value);
        t.value = null;
      }
      t = setInterval(() => {
        window.electron.ipcRenderer.once('renderer-refresh', function (e, res) {
          if(res) {
            userStore.userdata = res.userdata;
            userStore.username = res.username;
            userStore.JSESSIONID = res.JSESSIONID;
          } else {
            userStore.username = '';
            userStore.JSESSIONID = '';
            userStore.userdata = { };
            if(t.value != null) {
              clearInterval(t.value);
              t.value = null;
            }
          }
        })

        window.electron.ipcRenderer.once('refresh-account', res.JSESSIONID)
      }, 1000 * 60 * 20)
    } else {
      t.value = null;
      userStore.userdata = { };
      userStore.username = '';
      userStore.JSESSIONID = '';
    }
  })

  window.electron.ipcRenderer.send('username', {
    account,
    password,
    JSESSIONID
  })
}


onBeforeMount(() => {
  let { account = '', password = '', JSESSIONID = '' } = userStore;

  if (
    (account.length < 9 && account.length > 13) &&
    (password.length < 8 && password.length > 20) &&
    JSESSIONID != ''
  ) return;

  if(JSESSIONID != '') {
    window.electron.ipcRenderer.once('renderer-refresh', function (e, res) {
      if(res) {
        userStore.userdata = res.userdata;
        userStore.username = res.username;
        userStore.JSESSIONID = res.JSESSIONID;
      } else {
        onHelperLogin()
      }
    })

    window.electron.ipcRenderer.send('refresh-account', JSESSIONID)
  } else {
    window.electron.ipcRenderer.once('renderer-username', function (e, res) {
      if(res) {
        userStore.userdata = res.userdata;
        userStore.username = res.username;
        userStore.JSESSIONID = res.JSESSIONID;
        if(t.value != null) {
          clearInterval(t.value);
          t.value = null;
        }
        t = setInterval(() => {
          window.electron.ipcRenderer.once('renderer-refresh', function (e, res) {
            if(res) {
              userStore.userdata = res.userdata;
              userStore.username = res.username;
              userStore.JSESSIONID = res.JSESSIONID;
            } else {
              userStore.userdata = { };
              userStore.username = '';
              userStore.JSESSIONID = '';
              if(t.value != null) {
                clearInterval(t.value);
                t.value = null;
              }
            }
          })

          window.electron.ipcRenderer.send('refresh-account', res.JSESSIONID)
        }, 1000 * 60 * 20)
      } else {
        t.value = null;
        userStore.userdata = { };
        userStore.username = '';
        userStore.JSESSIONID = '';
      }
    })
    window.electron.ipcRenderer.send('username', {
      account,
      password,
      JSESSIONID
    })
  }
})

defineComponent({
  name: "left-nav"
})
</script>

<style lang="scss">
@import "./index.scss";
</style>
