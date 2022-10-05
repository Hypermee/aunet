<template>
  <Transition name="down">
    <div class="message" :style="style[type]" v-show="visible">
      <!-- 上面绑定的是样式 -->
      <!-- 不同提示图标会变 -->
      <i class="iconfont" :class="[style[type].icon]"></i>
      <span class="text">{{ text }}</span>
    </div>
  </Transition>
</template>

<script>
import { onMounted, ref } from "vue";
export default {
  name: "message",
  props: {
    text: {
      type: String,
      default: "",
    },
    type: {
      type: String,
// warn 警告  error 错误  success 成功
      default: "warn",
    },
  },
  setup() {
// 定义一个对象，包含三种情况的样式，对象key就是类型字符串
    const style = {
      warn: {
        icon: "icon-error",
        color: "#fff",
        backgroundColor: "rgb(255, 126, 14)",
        borderColor: "rgb(250, 236, 216)",
      },
      error: {
        icon: "icon-error-",
        color: "#fff",
        backgroundColor: "#d13131",
        borderColor: "rgb(253, 226, 226)",
      },
      success: {
        icon: "icon-successed",
        color: "#fff",
        backgroundColor: "#03cda9",
        borderColor: "rgb(225, 243, 216)",
      },
    };
    const visible = ref(false);
    onMounted(() => {
      visible.value = true;
      setTimeout(() => {
      // visible.value = false
      }, 2000);
    });
    return { style, visible };
  },
};
</script>

<style lang="scss" scoped>
.message {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 10px 20px;
  border-radius: 30px;
  color: #fff;
  .iconfont {
    font-size: 20px;
  }
  .text {
    padding: 0 15px;
  }
}

/* 动画进入开始时状态 */
.down-enter {
  opacity: 0;
  transform: translate(-50%, -100%);
}
.down-enter-to {
  transform: translate(-50%, 0%);
}
/* 动画进入过程动画效果 */
.down-enter-active {
  transition: all 0.4s ease;
}
/* 动画离开开始时状态 */
.down-leave {
  transform: translateY(0%);
}
/* 动画结束时动画 */
.down-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
/* 动画离开过程动画效果 */
.down-leave-active {
  transition: all 0.4s ease;
}
</style>
