import { defineStore } from "pinia";

const useSetupStore = defineStore('setup', {
  state: () => {
    return {
      basic: {
        auto: {
          start: false
        }
      },
      network: {
        card: {
          ISP: '0',
          account: '',
          password: ''
        }
      }
    }
  }
})

export const
  setupStore: ReturnType<typeof useSetupStore> = useSetupStore();

