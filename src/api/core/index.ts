import qs from 'qs';
import http from '../http';
import { enAdvert, queryACIP, apiUrl, accountPrefix } from './data';
import { getTermType, obj2Param } from './func';

const termType = getTermType();

class Core {
  public accountPrefix;

  constructor() {
    this.accountPrefix = accountPrefix === 1 ? (termType !== 2 ? ",0," : ",1,") : "";
  }

  // PORTAL协议认证
  async default_login(account, password, AccountSuffix,  options) {
    const { wlanacip = "", wlanuserip = "", wlanacname = "" } = options;

    let DDDDD = this.accountPrefix + account + AccountSuffix;
    let upass = password;

    let dataObj = {
      c: 				"ACSetting",
      a: 				"Login",
      protocol: 		"http:",
      hostname: 		"p.njupt.edu.cn",
      iTermType: 		getTermType(),
      wlanuserip: 	wlanuserip,
      wlanacip: 		wlanacip,
      wlanacname: 	wlanacname,
      mac: 			"00-00-00-00-00-00",
      ip: 			wlanuserip,
      enAdvert:       enAdvert,
      queryACIP:      queryACIP,
      loginMethod: 	1,
    };


    try {
      return await http.post(apiUrl + obj2Param(dataObj), { }, qs.stringify({
        DDDDD,
        upass,
      }))
    } catch (e) {
      return false;
    }
  }
}

export default new Core() ;
