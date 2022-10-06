import { defineStore } from "pinia";

export const useSetupStore = defineStore('setup', {
  state: () => {
    return {
      basic: {
        auto: {
          start: false
        }
      }
    }
  }
})

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      ISP: '0',
      account: '',
      password: '',
      username: '',
      userdata: { },
      JSESSIONID: '',
    }
  }
})


