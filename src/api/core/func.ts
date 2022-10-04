export const
  trim = (s) => {
    if (typeof s == "string")
      return s.replace(/(^\s*)|(\s*$)/g, "");
    else
      return s;
  },
  // 无感知模块增加前缀:PC ',0,'  手机 ',1,'(平板统一判断为非手机)
  getTermType = () => {
    // 访问设备:0-其他；1-PC；2-手机；3-平
    return 1;
  },
  obj2Param = (obj) => {
    let s = "";
    if (typeof obj == "object") {
      for (let k in obj) {
        if (typeof obj[k] == "number" || (typeof obj[k] == "string" && trim(obj[k]) != "")) {
          s += k + "=" + trim(obj[k]) + "&";
        }
      }
      if (s.substring(s.length - 1) == "&") {
        s = s.substring(0, s.length - 1);
      }
    }
    return s;
  },
  getUrlParams = (str, params: string[]) => {
    let Queen = [];
    let param = str.split("?")[1];

    for(let i in params) {
      let reg = new RegExp("(^|&)" + params[i] + "=([^&]*)(&|$)", "i");
      let r = param.match(reg);
      if (r != null) {
        Queen[params[i]] = decodeURI(r[2]);
      } else {
        Queen[params[i]] = "";
      }
    }

    return Queen;
  },
  getISPSuffix = (n: number): string => {
    switch (n) {
      case 0:
        return "";
      case 1:
        return "@cmcc";
      case 2:
        return "@njxy";
      default:
        return "";
    }
  }
