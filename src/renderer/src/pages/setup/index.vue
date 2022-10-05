<template>
  <nav class="top-nav">
    <div
      class="item"
      @click="onSwitch('base')"
      :class="{ active: active === 'base' }"
    >基本设置</div>
    <div
      class="item"
      @click="onSwitch('network')"
      :class="{ active: active === 'network' }"
    >上网设置</div>
  </nav>
  <main class="main-wrap">
    <div class="tabs" v-show="active === 'base'">
      <div class="tab card">
        <span class="title">开机启动</span>
        <div class="content">
          <div class="item">
            <label class="checkout" for="autostart">
              <input
                id="autostart"
                name="autostart"
                type="checkbox"
                @change="onAutoStart"
                v-model.lazy="setupStore.basic.auto.start"
              />
              开机自动启动
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs" v-show="active === 'network'">
      <div class="tab card">
        <span class="title">一卡通号</span>
        <div class="content">
          <div class="item">
            <label for="account">账号</label>
            <input
              id="account"
              name="account"
              type="text"
              v-model.lazy="setupStore.network.card.account"
            />
          </div>
          <div class="item">
            <label for="password">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              v-model.lazy="setupStore.network.card.password"
            />
          </div>
          <div class="item">
            <label for="ISP">服务商</label>
            <select
              name="ISP"
              v-model="setupStore.network.card.ISP"
            >
              <option value="0" selected>校园网</option>
              <option value="1">中国移动</option>
              <option value="2">中国电信</option>
            </select>
          </div>
          <div class="item">
            <label for="ISP"></label>
            <button type="primary" @click="connect" :disabled="btnActive">连接测试</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { setupStore } from "../../store";
import { defineComponent, ref } from "vue";
import Message from '../../components/message';

const active = ref('base');
const btnActive = ref(false);

const onSwitch = (e) => {
  if(typeof e === 'string') {
    active.value = e;
  }
}

const onAutoStart = () => {
  let cmd = setupStore.basic.auto.start ? 'openAutoStart' : 'closeAutoStart';

  window.electron.ipcRenderer.send(cmd);
}

const onChange = (key) => {

}

const connect = () => {
  if(btnActive.value) return;
  btnActive.value = true
  const { account, password, ISP } = setupStore.network.card;
  if(
    (ISP == 0 || ISP == 1 || ISP == 2) &&
    (account.length > 8 && account.length < 12) &&
    (password.length > 7 && password.length < 21)
  ) {
    window.electron.ipcRenderer.once('renderer-connect', function () {
      setTimeout(() => {
        btnActive.value = false;
      }, 2000)
    })
    window.electron.ipcRenderer.send('connect', {
      ISP,
      account,
      password
    })

  } else {
    btnActive.value = false;
    Message({ type: "error", text: "请输入正确的账号密码" });
  }
}

defineComponent({
  name: "setup"
})
</script>

<style lang="scss" scoped>
#page {
  display: flex;
  flex-direction: column;

  .top-nav {
    display: flex;
    align-items: center;

    .item {
      margin: 0 15px;
      cursor: pointer;

      &.active {
        font-size: 18px;
        font-weight: 600;
      }

      &:first-of-type {
        margin-left: 10px;
      }
    }
  }

  .main-wrap {
    padding: 25px 15px;

    .tabs {

      .tab {

        .title {
          color: #434343;
          font-size: 15px;
          font-weight: 600;
        }

        .content {
          font-size: 15px;
          padding: 10px 0;

          .item {
            margin: 10px 0;
            display: flex;
            align-items: center;

            button {
              margin-right: 20px;
            }

            .checkout {
              color: #434343;
              font-size: 13px;
              display: flex;
              align-items: center;
            }
          }
        }

        &.card > .content {
          width: 300px;

          .item {
            justify-content: space-between;
          }
        }
      }

    }
  }
}

</style>
