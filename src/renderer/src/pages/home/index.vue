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
   <div class="card">
     <span class="title">在线设备</span>
     <div class="content">
        <table>
          <thead>
            <tr>
              <th>
                上线时间
              </th>
              <th>
                IP地址
              </th>
              <th>
                使用时长
              </th>
              <th>
                使用流量
              </th>
              <th>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in onlineList" :key="item.sessionId">
              <td>
                {{ item.loginTime }}
              </td>
              <td>
                {{ item.ip }}
              </td>
              <td>
                {{ item.useTime }}
              </td>
              <td>
                {{ item.useFlow }}
              </td>
              <td>
                <a href="javascript:" @click="logout(item.sessionId, index)">注销</a>
              </td>
            </tr>
          </tbody>
        </table>
     </div>
   </div>

 </main>
</template>

<script lang="ts" setup>
import { defineComponent, onBeforeMount, reactive } from "vue";
import { useUserStore } from "../../store";
import Message from "../../components/message";


let onlineList: any[] = reactive([])
const userStore: ReturnType<typeof useUserStore>[1] = useUserStore();

const logout = (id, index) => {
  const { JSESSIONID = '' } = userStore;
  window.electron.ipcRenderer.send('online-logout', {
    id,
    JSESSIONID
  });

  window.electron.ipcRenderer.once('renderer-onlineLogout', (e, res) => {
    if(res) return onlineList.splice(index, 1);

    Message({ type: "error", text: 'IP：' + onlineList[index].ip + " 下线失败" });
  })
}

onBeforeMount(() => {
  const { JSESSIONID = '' } = userStore;

  window.electron.ipcRenderer.once('renderer-getOnlineList', function (e, res) {
    if(!res) {
      userStore.username = '';
      userStore.JSESSIONID = '';
      userStore.userdata = { };
    } else {
      onlineList.length = 0;
      res.forEach((item) => {
        let { downFlow, ip, loginTime, sessionId, upFlow, useTime } = item;

        let flow = ((parseInt(downFlow) + parseInt(upFlow)) / 1024).toFixed(2);
        let time = (useTime / 60).toFixed(2);

        onlineList.push({
          ip,
          sessionId,
          loginTime,
          useTime: time,
          useFlow: flow,
        })
      })
    }
  })

  window.electron.ipcRenderer.send('getOnlineList', JSESSIONID);
})

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

    .card {
      margin-top: 25px;

      .title {
        color: #333333;
        font-size: 16px;
        font-weight: 400;
      }

      .content {
        font-size: 14px;
        font-weight: 400;
        margin-top: 10px;

        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;

          thead {
            tr {
              text-align: center;
              th {
                vertical-align: bottom;
                line-height: 24px;
                overflow: hidden;
                white-space: nowrap;
                border-bottom: 1px solid #ddd;
              }
            }
          }
          tbody {
            tr {
              height: 30px;
              text-align: center;
              td {

                a {
                  color: #337ab7;
                  cursor: pointer;
                  text-decoration: none;
                  background-color: transparent;

                  &:focus, &:hover {
                    color: #23527c;
                  }
                }
              }

              &:nth-of-type(odd) {
                background-color: #f9f9f9;
              }
            }
          }
        }
      }
    }
  }
</style>
