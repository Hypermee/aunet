export let enAdvert = 0; // 是否显示广告(0-不显示；1-显示)

export let queryACIP = 0; // 多AC认证是否存储参数(0-不存储，1-存储)

export let accountPrefix = 1; // 是否添加账号前缀(0-不添加；1-添加)

export let apiUrl = "http://p.njupt.edu.cn:801/eportal/?" // 请求api地址;

export let RadiusErrorAry = new Array(57);

RadiusErrorAry[0]="1|Rpost=2;ret='no errcode'|AC认证失败|AC authentication failure";
RadiusErrorAry[1]="2|Rpost=2;ret=''|SESSION已过期,请重新登录|The SESSION has been expired, please log in again";
RadiusErrorAry[2]="3|Rpost=2;ret='Authentication Fail ErrCode=04'|上网时长/流量已到上限|Online time / flow rate has been to the limit";
RadiusErrorAry[3]="4|Rpost=2;ret='Authentication Fail ErrCode=05'|您的账号已停机，造成停机的可能原因：<br/>1、用户欠费停机<br/>2、用户报停<br/>需要了解具体原因，请访问自助服务系统。|Your account has been shut down";
RadiusErrorAry[4]="5|Authentication Fail ErrCode=09|本账号费用超支，禁止使用|Online time / flow rate has been to the limit";
RadiusErrorAry[5]="6|Rpost=2;ret='Authentication Fail ErrCode=11'|不允许Radius登录|Not allow radius login";
RadiusErrorAry[6]="7|Rpost=2;ret='Authentication Fail ErrCode=80'|接入服务器不存在|Access to the server does not exist";
RadiusErrorAry[7]="8|Rpost=2;ret='Authentication Fail ErrCode=81'|LDAP认证失败|LDAP Authentication Failure";
RadiusErrorAry[8]="9|Rpost=2;ret='Authentication Fail ErrCode=85'|账号正在使用|Accounts are in use";
RadiusErrorAry[9]="10|Rpost=2;ret='Authentication Fail ErrCode=86'|绑定IP或MAC失败|IP or MAC Binding Fail";
RadiusErrorAry[10]="11|Rpost=2;ret='Authentication Fail ErrCode=88'|IP地址冲突|IP address conflict";
RadiusErrorAry[11]="12|Rpost=2;ret='Authentication Fail ErrCode=94'|接入服务器并发超限|Concurrent access to the server overrun";
RadiusErrorAry[12]="13|err(2)|请在指定的登录源地址范围内登录|Please Login in at the specified source address range";
RadiusErrorAry[13]="14|err(3)|请在指定的IP登录|Please login at the specified IP";
RadiusErrorAry[14]="15|err(7)|请在指定的登录源VLAN范围登录|Please login in at specified Vlan scope";
RadiusErrorAry[15]="16|err(10)|请在指定的Vlan登录|Please login at the specified Vlan";
RadiusErrorAry[16]="17|err(11)|请在指定的MAC登录|Please login at the specified MAC";
RadiusErrorAry[17]="18|err(17)|请在指定的设备端口登录|Please login with the specified equipment port";
RadiusErrorAry[18]="19|userid error1|账号不存在或未绑定运营商账号！|Account does not exist or not bind isp account.";
RadiusErrorAry[19]="20|userid error2|校园网密码错误|Password Error";
RadiusErrorAry[20]="21|userid error3|密码错误|Password Error";
RadiusErrorAry[21]="22|auth error4|用户使用量超出限制|Users to use more than limit";
RadiusErrorAry[22]="23|auth error5|账号已停机|This account has been shut down";
RadiusErrorAry[23]="24|auth error9|时长流量超支|Time length or flow overruns";
RadiusErrorAry[24]="25|auth error80|本时段禁止上网|This time on the Internet is prohibited";
RadiusErrorAry[25]="26|auth error99|用户名或密码错误|The user name or password mistake";
RadiusErrorAry[26]="27|auth error198|用户名或密码错误|The user name or password mistake";
RadiusErrorAry[27]="28|auth error199|用户名或密码错误|The user name or password mistake";
RadiusErrorAry[28]="29|auth error258|账号只能在指定区域使用|This account can only be used in designated areas";
RadiusErrorAry[29]="30|auth error|用户验证失败|Failed to authenticate user";
RadiusErrorAry[30]="31|set_onlinet error|用户数超过限制|Users more than limit";
RadiusErrorAry[31]="32|In use|终端超限，请至<a href='http://10.10.244.240:8080/Self'>自服务</a>选择终端强制离线后重试|Log in more than limit";
RadiusErrorAry[32]="33|port err|上课时间不允许上网|Class time is not allowed to access to the Internet";
RadiusErrorAry[33]="34|can not use static ip|不允许使用静态IP|Can not use static ip";
RadiusErrorAry[34]="35|[01], 本帐号只能在指定VLANID使用(0.4095)|本帐号只能在指定VLANID使用|This account can only be used in the specified VLANID";
RadiusErrorAry[35]="36|Mac, IP, NASip, PORT err(6)|本帐号只能在指定VLANID使用|This account can only be used in the specified VLANID";
RadiusErrorAry[36]="37|Rpost=2;ret='wuxian OLno|VLAN范围控制账号的接入数量超出限制|VLAN range control account access limit exceeded";
RadiusErrorAry[37]="38|Oppp error: 1|运营商账号密码错误，错误码为：1|Operator account password error, error code: 1";
RadiusErrorAry[38]="39|Oppp error: 5|运营商账号在线，错误码为：5|Operator account online, error code: 5";
RadiusErrorAry[39]="40|Oppp error: 18|运营商账号密码错误，错误码为：18|Operator account password error, error code: 18";
RadiusErrorAry[40]="41|Oppp error: 21|运营商账号在线，错误码为：21|Operator account online, error code: 21";
RadiusErrorAry[41]="42|Oppp error: 26|运营商账号被绑定，错误码为：26|Operator account online, error code: 21";
RadiusErrorAry[42]="43|Oppp error: 29|运营商账号锁定的用户端口NAS-Port-Id错误，错误码为：29|Operator account online, error code: 21";
RadiusErrorAry[43]="44|Oppp error: userid inuse|运营商账号已被使用|Operator account has been used";
RadiusErrorAry[44]="45|Oppp error: can't find user|运营商账号无法获取或不存在|Operator account could not be obtained or does not exist";
RadiusErrorAry[45]="46|bind userid error|绑定运营商账号失败|Bind operator account failed";
RadiusErrorAry[46]="47|Oppp error: TOO MANY CONNECTIONS|运营商账号在线|Operator account online";
RadiusErrorAry[47]="48|Oppp error: Timeout|运营商账号状态异常(欠费等)|Operator account status abnormal(arrears, etc.)";
RadiusErrorAry[48]="49|Oppp error: User dial-in so soon|运营商账号刚下线|Operator account just off the assembly line";
RadiusErrorAry[49]="50|Rad:UserName_Err|所绑定的运营商账号不存在，请咨询运营商！|";
RadiusErrorAry[50]="51|Rad:Passwd_Err|所绑定的运营商密码错误，请咨询运营商！|";
RadiusErrorAry[51]="52|Rad:Status_Err|运营商账号已停机！|";
RadiusErrorAry[52]="53|Rad:Group_Bind_Err|运营商绑定组信息错误，请至营业厅解决。|";
RadiusErrorAry[53]="54|Rad:Limit Users Err|运营商终端数量超限!|";
RadiusErrorAry[54]="55|Rad:Date Invalid|运营商账号过期！|";
RadiusErrorAry[55]="56|Rad:UserName invalid|绑定的运营商账号有非法字段，请在自服务确认绑定的运营商账号密码信息。|";
RadiusErrorAry[56]="57|Rad:BindAttr_Err|运营商绑定校验错误，请联系对应运营商解决。|";

// @ts-ignore
let checkScanIP: string;
checkScanIP = apiUrl + "c=ACSetting&a=checkScanIP&wlanuserip=";

// @ts-ignore
let ipPageAry: string[];
ipPageAry = [
  "默认模版|1.1.1.1|255.255.255.254|000||1|0",
  "njupt-仙林办公|10.164.0.1|10.164.223.254|||1|1",
  "njupt-guest-仙林|10.164.224.1|10.164.255.254|||1|1",
  "njupt-三牌楼宿舍|10.131.0.1|10.132.223.254|||1|1",
  "njupt-chinanet-仙林|10.165.0.1|10.165.255.254|000njxy||1|1",
  "njupt-cmcc-仙林|10.163.0.1|10.163.255.254|000cmcc||1|1",
  "宿舍区有线-仙林|10.161.0.1|10.161.255.254|||1|1",
  "njupt-cmcc-三牌楼|10.133.0.1|10.133.255.254|000cmcc||1|1",
  "有线网关认证地址段1|10.0.0.1|10.130.255.254|||1|1",
  "njupt-仙林宿舍|10.162.0.1|10.162.255.254|||1|1",
  "njupt-guest-三牌楼|10.132.224.1|10.132.255.254|||1|1",
  "njupt-chinanet-三牌楼|10.136.0.1|10.136.255.254|000njxy||1|1",
  "有线网关认证地址段2|10.137.0.1|10.161.255.254|||1|1",
  "有线网关认证地址段3|10.166.0.1|10.255.255.254|||1|1"
];
