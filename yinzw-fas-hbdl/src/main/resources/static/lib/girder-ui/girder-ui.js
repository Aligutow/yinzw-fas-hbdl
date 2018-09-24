/**
 * girder-ui v1.1.0 ()
 * Copyright 2016 wyf
 * Licensed under MIT
 */
'use strict';

//项目文档编写参考
//https://github.com/nikhilmodak/gulp-ngdocs
//https://github.com/m7r/grunt-ngdocs-example
//https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation
/**
 * @ngdoc overview
 * @name girder
 *
 * @description
 * girder-ui-framework-1.0.1 框架组件构成:
 * <ul>
 * <li>框架配置(config)</li>
 * <li>安全组件(security)</li>
 * <li>日志输出(log)</li>
 * <li>界面组件(ui)</li>
 * </ul>
 *
 */

/**
 * girder-ui-framework-1.0.1
 * -------------------
 * 框架组件构成:
 * 框架配置(config)
 * 安全组件(security)
 * 交易等待(spinner)
 * 日志输出(log)
 * 弹出消息(messageBox)
 * 翻页支持(paginate)
 * 行政区划(selectAddress)
 * 下拉代码(selectCode)
 * Long日期支持(longDate)
 * 回车实现tab效果(enterkeydecorative)
 * 报表显示支持(report)-?
 *
 * @author wuyf
 * @date 2014-06-20
 */
angular.module('girder', ['ui.bootstrap', 'ngRoute', 'ngResource', 'ngCookies', 'girder.security', 'girder.config', 'girder.log', 'girder.ui']);
//define the modules and depends
/**
 * 定义框架当中使用的全局变量
 *
 * 变量配置方法参考
 * angular.module('girder').config(['girderConfigProvider', function (girderConfigProvider) {
 *     girderConfigProvider.baseUrl='/siagent';
 *     girderConfigProvider.logLevel='debug';
 * }]);
 *
 * 需要注意配置代码加载的顺序，建议放在应用之前
 *
 * @author wuyf
 * @date 2014-06-20
 */
'use strict';

angular.module('girder.config', []).constant('girder.version', {
  version: '1.1.0',
  releaseDate: '2015-12-02 10:17:00'
})
//提供可以配置的服务
.provider('girderConfig', {
  //可以配置的属性
  baseUrl: 'please config baseUrl before use this frameWork', //全局后台服务路径 示例 /sipub
  homeUrl: '/home', //首页路径
  loginUrl: '/login', //登录路径
  logoutSuccessUrl: '/login', //登出后转向路径
  logLevel: 'ALL', //日志级别 参考girder.log说明进行配置(配置可以不分大小写)
  divisionId: 'please config divisionId before use this frameWork', //配置行政区划范围，根节点ID
  leaf: '70', //配置行政区划叶子等级
  //--安全相关配置
  //配置安全认证服务(authServer)地址
  authServerUrl: 'please config authServer before use this frameWork',
  //配置登录服务(Login/Logout)实现名称,参考组件 girder.security.authorize.logon
  loginAndLogoutService: 'please config loginAndLogoutService before use this frameWork',
  //是否在portal当中登录
  isPortalLogin: false,
  //ssoAppId 为应用的集成SSO-APP-ID
  ssoAppId: 'defaultAppId',
  //加载业务用户详情配置
  userDetail: {
    url: 'please config userDetail.url before use this frameWork', //业务用户详情url
    paramName: 'please config userDetail.paramName before use this frameWork' //业务用户详情参数
  }, // 查询用户详情路径及buzzName
  //可以访问到的属性
  $get: [function () {
    var service = {
      baseUrl: this.baseUrl,
      homeUrl: this.homeUrl,
      loginUrl: this.loginUrl,
      logoutSuccessUrl: this.logoutSuccessUrl,
      logLevel: this.logLevel.toString().toUpperCase(),
      divisionId: this.divisionId,
      leaf: this.leaf,
      authServerUrl: this.authServerUrl,
      loginAndLogoutService: this.loginAndLogoutService,
      isPortalLogin: this.isPortalLogin,
      ssoAppId: this.ssoAppId,
      userDetail: this.userDetail
    };
    return service;
  }]
});
/**
 * 日志组件
 *
 * 支持多级系统日志输出，日志配置参考girderConfig
 *
 * OFF - 关闭日志输出
 * ALL - 打印所有日志
 *
 * ERROR- 错误级别
 * WARN - 警告
 * INFO(LOG) - 提示
 * DEBUG- Debug
 *
 * @author mofj
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

//日志配置
angular.module('girder.log', ['girder.config']).config(['$provide', function ($provide) {
  $provide.decorator('$log', ['$delegate', 'girderConfig', '$filter', function ($delegate, girderConfig, $filter) {
    /**
     * 获取有效日志范围
     * @returns {*}
     */
    function getEnableLogFunctions() {
      switch (girderConfig.logLevel) {
        case 'ERROR':
          return ['error'];
        case 'WARN':
          return ['warn', 'error'];
        case 'INFO':
          return ['log', 'info', 'warn', 'error'];
        case 'LOG':
          return ['log', 'info', 'warn', 'error'];
        case 'DEBUG':
          return ['debug', 'log', 'info', 'warn', 'error'];
        case 'ALL':
          return ['debug', 'log', 'info', 'warn', 'error'];
        default:
          return [];
      }
    }
    //日期格式化
    var standardDateFilter = $filter('date');
    //获取输出日志范围
    var enableLogFunctions = getEnableLogFunctions();
    //将所有日志方法都进行代理
    angular.forEach(['debug', 'log', 'info', 'warn', 'error'], function (o) {
      if (girderConfig.logLevel === 'OFF') {
        $delegate[o] = disableLogger();
      } else {
        //如果在输入范围内，则输出日志
        if (enableLogFunctions.indexOf(o) === -1) {
          $delegate[o] = disableLogger();
        } else {
          $delegate[o] = decoratorLogger($delegate[o], o);
        }
      }
    });
    /**
     * 代理日志方法
     * @param originalFn
     * @param context
     * @returns {Function}
     */
    function decoratorLogger(originalFn, context) {
      return function () {
        var args = [].slice.call(arguments);
        //加入时间输出
        args[0] = [standardDateFilter(new Date(), 'yyyy-MM-dd HH:mm:ss'), ' [', context, '] ', args[0]].join('');
        originalFn.apply(null, args);
      };
    }

    /**
     * 禁止日志输出
     * @returns {Function}
     */
    function disableLogger() {
      return function () {
        //do noting
      };
    }

    return $delegate;
  }]);
}]);
/**
 * 前台安全组件
 * 包括安全交易/安全签名/安全认证，
 * 登录UI留给应用实现,这里提供基本的用户安全以及权限检查服务
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

angular.module('girder.security', ['girder.security.authorize', //安全认证管理
'girder.security.account', //账户管理
'girder.security.dataSafe', //数据安全管理
'girder.security.captcha' //验证码
]);
/**
 * 前台可复用UI组件模块
 *
 * girder-ui模块组件构成:
 * <ul>
 * <li>交易等待(spinner)</li>
 * <li>菜单(menus)</li>
 * <li>弹出消息(messageBox)</li>
 * <li>翻页支持(paginate)</li>
 * <li>行政区划(selectAddress)</li>
 * <li>下拉代码(selectCode)</li>
 * <li>Long日期支持(longDate)</li>
 * <li>回车实现tab效果(enterKeyDecorative)</li>
 * <li>报表显示支持(report)</li>
 * </ul>
 * @author wuyf
 * @date 2015-10-15
 */
'use strict';

angular.module('girder.ui', ['girder.ui.spinner', //交易等待(spinner)
'girder.ui.menu', //菜单(menus)
'girder.ui.messageBoxModule', //弹出消息(messageBox)
'girder.ui.paginateModule', //翻页支持(paginate)
'girder.ui.selectCodeModule', //下拉代码(selectCode)
'girder.ui.longDateModule', //Long日期支持(longDate)
'girder.ui.selectAddress', //行政区划(selectAddress)
'girder.ui.enterKeyDecorative', //回车实现tab效果(enterKeyDecorative)
'girder.ui.imageModule' //图片处理
]);

//define the modules and depends
angular.module('girder.ui.spinner', []);
//angular.module('girder.ui.menu',[]);    //在menu模块定义
//angular.module('girder.ui.imageModule',[]);    //在imageModule模块定义
angular.module('girder.ui.messageBoxModule', ['ui.bootstrap']);
angular.module('girder.ui.paginateModule', ['ui.bootstrap']);
angular.module('girder.ui.selectCodeModule', []);
angular.module('girder.ui.longDateModule', []);
angular.module('girder.ui.selectAddress', []);
angular.module('girder.ui.enterKeyDecorative', []);
angular.module('girder.ui.imageModule', []);
/**
 * 账户中心管理组件
 * 包括用户密码修改/用户关联手机号修改/用户邮件修改/安全设置等组件
 *
 * @author wuyf
 * @date 2015-10-13
 */
'use strict';

angular.module('girder.security.account', ['girder.security.account.center', //账号中心组件
'girder.security.account.password', //密码管理组件
'girder.security.account.mobile' //手机号码管理组件
]);

angular.module('girder.security.account.center', []);
angular.module('girder.security.account.password', []);
angular.module('girder.security.account.mobile', []);
'use strict';
/**
 * 账户管理模块路由
 */
angular.module('girder.security.account').config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  //账户设置中心
  .when('/girder/security/account', {
    templateUrl: 'girder/security/account/center/accountCenter.html',
    module: 'girder.security.account',
    controller: 'AccountCenterController'
  })
  //密码修改
  .when('/girder/security/account/password', {
    templateUrl: 'girder/security/account/password/passwordchange.html',
    module: 'girder.security.account.password'
    //controller: 'girderPasswordServiceController'
  })
  //修改手机号码
  .when('/girder/security/account/mobile', {
    templateUrl: 'girder/security/account/mobile/mobileModify.html',
    module: 'girder.security.account.mobile',
    controller: 'inforModifyCtrl'
  });
}]);
/**
 * 用户安全认证管理
 *
 * 包括几个核心的对象
 * 1.核心常量定义
 * 2.用户安全Session管理
 * 3.认证服务-认证服务负责完成登录和登出操作，负责创建用户安全Session对象
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

angular.module('girder.security.authorize', ['girder.security.authorize.core', //安全认证核心常量
'girder.security.authorize.resource', //安全认证相关资源定义
'girder.security.authorize.userSession', //用户session
'girder.security.authorize.authService', //安全认证服务
'girder.security.authorize.logon' //各种登录方式实现
]);

//子模块以及依赖关系
angular.module('girder.security.authorize.core', []);
angular.module('girder.security.authorize.resource', []);
angular.module('girder.security.authorize.userSession', ['girder.security.authorize.core', 'girder.security.authorize.resource']);
angular.module('girder.security.authorize.authService', ['girder.security.authorize.core', 'girder.security.authorize.logon']);
angular.module('girder.security.authorize.logon', []);
/**
 * 默认安全认证服务
 *
 * 安全认证服务主要实现的方法是登录与登出
 *
 * 登录成功以后创建用户Session对象
 * 登出成功以后销毁用户Session对象
 *
 * 框架需要将变化的点和不变化的点分离出来，因此将AuthService作为一个facade暴露给客户端
 * 客户端只和AuthService打交道，更具体的 login/logout 逻辑封装到LoginAndLogoutXXXService当中提供
 * 然后在本地化程序当中进行配置选择
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

angular.module('girder.security.authorize.authService').factory('AuthService', ['$http', '$log', 'Session', 'girderConfig', '$injector', function ($http, $log, Session, appConfig, $injector) {

  //定义工厂对象
  var factory = {};
  var LoginAndLogoutService = $injector.get(appConfig.loginAndLogoutService);

  /**
   * 用户登录(实现建议)
   * 1.清除登录缓存
   * 2.发出登录请求
   *    2.1 成功 raiseUserLoginEvent
   *    2.2 失败 404 raiseUserLoginFailedEvent  or raiseUserLoginFailedEvent
   * 3.登录成功 返回 Session.user对象
   * @param credentials
   * @returns {*}
   */
  factory.login = function (credentials) {
    if (!appConfig.isPortalLogin) {
      //在portal内登录不清理登录缓存
      $log.debug('AuthService非portal内登录清除缓存..');
      localStorage.clear();
    }
    $log.debug('AuthService当前注入的服务名是', appConfig.loginAndLogoutService, '实例对象=', LoginAndLogoutService);
    return LoginAndLogoutService.login(credentials);
  };

  /**
   * 用户登出
   * @returns {*}
   */
  factory.logout = function () {
    $log.debug('当前注入的服务名是', appConfig.loginAndLogoutService);
    return LoginAndLogoutService.logout();
  };

  /**
   * 用户是否已经登录
   * @returns {boolean}
   */
  factory.isAuthenticated = function () {
    return Session.isAuthenticated();
  };

  /**
   * 获取用户菜单
   * @returns {*}
   */
  factory.getMenus = function () {
    return Session.getMenus();
  };

  /**
   * 判断用户是否有权限(根据后台传来的菜单权限判断)
   * @param url
   */
  factory.isAuthorized = function (url) {
    $log.log('authService验证传入的url是否可以访问', url);
    //var menus = Session.user.menus;
    return factory.isAuthenticated(); //&&menus.hasUrl(url));
    // authorizedRoles.indexOf(Session.userRole) !== -1);
  };

  return factory;
}]);
/**
 * 安全相关主要常量定义
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

angular.module('girder.security.authorize.core')
//客户端用户安全信息cookie
.constant('CLIENT_USER_COOKIE', {
  userCookie: 'girder-security-user-cookie'
}).constant('SECURITY_USER_CACHE', {
  menusCache: 'girder-security-menus-cache'
})
//认证事件
.constant('AUTH_EVENTS', {
  needLogin: 'auth-need-login', //需要登录认证
  loginSuccess: 'auth-login-success', //登录成功
  loginFailed: 'auth-login-failed', //登录错误
  logoutSuccess: 'auth-logout-success', //登出成功
  sessionTimeout: 'auth-session-timeout', //登录超时
  notAuthenticated: 'auth-not-authenticated', //未验证用户
  notAuthorized: 'auth-not-authorized', //未授权权限
  redirectToLogin: 'auth-redirect-to-login' //要求重定向到登录界面
});
/**
 * Created by wuyf on 2014/5/22.
 *
 * 访问安全验证器
 * 如果用户提交请求时没有访问权限，则转向登录页面
 *
 * @author wuyf
 * @date 2015-10-13
 */
'use strict';

angular.module('girder.security.authorize.authService')

// This http interceptor listens for authentication failures
.factory('GirderSecuritySessionInjector', ['$q', '$rootScope', '$log', 'GirderUserLoginEventService', function ($q, $rootScope, $log, userLoginEvent) {

  var interceptor = {
    //无权限访问时要求用户重新登录
    responseError: function responseError(rejection) {
      if (rejection.status === 401) {
        $log.debug('GirderSecuritySessionInjector 401 error:', rejection);
        //发布重定向到登录页面事件
        userLoginEvent.raiseRedirectToLoginEvent();
        return $q.reject({ data: '没有权限，请重新登录', status: 401 });
      }
      return $q.reject(rejection);
    }
  };
  return interceptor;
}])
//注入用户安全控制
.config(['$httpProvider', function ($httpProvider) {
  //注入用户安全session控制
  $httpProvider.interceptors.push('GirderSecuritySessionInjector');
}]);
/**
 * 获取用户详情信息
 *
 */
'use strict';

angular.module('girder.security.authorize.authService').constant('HRSS_APP_USER_DETAILS_CACHE', {
  appUserDetailCache: 'HRSS_APP_USER_DETAILS'
}).factory('GriderUserDetailService', ['$log', '$q', '$resource', 'girderConfig', 'HRSS_APP_USER_DETAILS_CACHE', function ($log, $q, $resource, appConfig, HRSS_APP_USER_DETAILS) {
  var UserDetail = $resource(appConfig.baseUrl + appConfig.userDetail.url + '/:Id', {
    Id: '@id'
  }, {
    queryUserDetail: {
      method: 'GET',
      params: { buzzNumber: '@buzzNumber' }
    }
  });

  var factory = {};

  /**
   * 从缓存中载入用户详情
   *
   */
  var restoreUserDetail = function restoreUserDetail(buzzNumber, userDetail) {
    userDetail = JSON.parse(userDetail);
    if (buzzNumber === undefined || buzzNumber === userDetail[appConfig.userDetail.paramName]) {
      var deferred = $q.defer(); // 生成Deferred对象
      $log.debug('从缓存载入用户详情');
      deferred.resolve(userDetail); // 改变Deferred对象的执行状态
      return deferred.promise;
    }
    return getUserDetail(buzzNumber);
  };

  /**
   * 从数据库载入用户详情
   * @param  buzzNumber
   * @return
   */
  var getUserDetail = function getUserDetail(buzzNumber) {
    var param = {};
    param[appConfig.userDetail.paramName] = buzzNumber;
    return UserDetail.queryUserDetail(param).$promise.then(function (data) {
      localStorage.setItem(HRSS_APP_USER_DETAILS.appUserDetailCache, JSON.stringify(data));
      return data;
    });
  };

  /**
   * 载入用户详情
   * @param  buzzNumber
   * @return
   */
  factory.loadUserDetail = function (buzzNumber) {
    var userDetail = localStorage.getItem(HRSS_APP_USER_DETAILS.appUserDetailCache);
    if (userDetail !== undefined && userDetail !== null) {
      return restoreUserDetail(buzzNumber, userDetail);
    }
    return getUserDetail(buzzNumber);
  };

  return factory;
}]);
/**
 * 验证码
 *
 * 这个包的核心职责是管理验证码的资源控制
 *
 * @author wuyf
 * @date 2015-10-13
 */
'use strict';

angular.module('girder.security.captcha', []);
/**
 * 图片验证码资源定义
 *
 * @author wuyf
 * @date 2015-03-16
 */
'use strict';

angular.module('girder.security.captcha')
//验证码服务类
.factory('GirderImageCaptchaService', ['$log', 'girderConfig', '$resource', function ($log, appConfig, $resource) {
  //验证码地址
  var url = appConfig.baseUrl + '/api/security/captcha';
  var Resource = $resource(url, {}, {
    getCaptcha: {
      method: 'GET',
      url: url,
      isArray: false
    }
  });
  Resource.prototype.getImageUrl = function () {
    return url + '/' + this.id;
  };
  //定义工厂对象
  var factory = {
    //
  };
  /**
   * 获取下一个验证码
   * 返回对象{id,url}
   */
  factory.getNextCaptcha = function () {
    return Resource.getCaptcha();
  };
  return factory;
}]);
/**
 * 手机验证码资源定义
 *
 * @author wuyf
 * @date 2015-10-14
 */
'use strict';

angular.module('girder.security.captcha')
//验证码服务类
.factory('GirderMobileCaptchaService', ['$log', 'girderConfig', '$resource', function ($log, appConfig, $resource) {
  //验证码地址
  var url = appConfig.baseUrl + '/auth/sm/captcha/:mobileNumber';
  var Resource = $resource(url, { mobileNumber: '@mobileNumber' }, {
    getCaptcha: {
      method: 'POST',
      url: url,
      param: { mobileNumber: 0 },
      isArray: true
    }
  });

  //定义工厂对象
  var factory = {
    //
  };
  /**
   * 获取下一个验证码
   * 返回对象{id,url}
   */
  factory.getNextCaptcha = function (mobileNumber) {
    return Resource.getCaptcha({ mobileNumber: mobileNumber });
  };
  return factory;
}]);
/**
 * 数据安全传输管理
 *
 * 这个包的核心职责是管理数据的安全传输，包括 传输数据加密/CSRF防御 等特性
 *
 * @author wuyf
 * @date 2015-10-13
 */
'use strict';

angular.module('girder.security.dataSafe', ['girder.security.dataSafe.signer']);

angular.module('girder.security.dataSafe.signer', []);
angular.module('girder.security.dataSafe.password', []);
/**
 * Created by wuyf on 2015/10/14.
 *
 * 用户密码安全自定义加密类
 *
 * 使用自定义的方式对前端用户密码进行加密传输，服务端还需要再次加密
 * 目前的方案是:
 *   SHA1(username + ':' +  MD5(password))
 * 这种方案不太好，加密方式有问题，暂时先记录下，此代码目前不使用
 *
 * 改造方向：动态密文+对称加密
 *
 * @author wuyf
 * @date 2015-10-14
 */
'use strict';

//--当前项目未使用
angular.module('girder.security.dataSafe.password').service('GirderPasswordEncryptorService', [function () {
  /*global CryptoJS */

  /**
   * 对用户密码进行加密
   * @param credentials
   * @returns {*}
   */
  this.encryptPassword = function (credentials) {
    var encriptedCredentials = angular.copy(credentials);
    var temp = credentials.username + ':' + CryptoJS.MD5(credentials.password);
    encriptedCredentials.password = CryptoJS.SHA1(temp).toString();
    return encriptedCredentials;
  };
}]);
/**
 * Created by wuyf on 2014/5/22.
 *
 * RestFul 安全应用加密签名控制类
 *
 * Authenticated requests
 * 登录验证以后每一个有效的请求必须提供如下三个header，并且都需要签名
 *
 * X-MICRO-TIME    -   current unix timestamp
 * X-SESSION-TOKEN -   the session token received by the server
 * X-USER     -        the user account
 *
 * 消息签名如下
 * hash = hmacSHA512(requestURL:data:microTime, secret)
 *
 * 服务端校验内容如下:
 * 1.X-MICRO-TIME 检查时间请求时间是否合理
 * 2.session token header 检查session token 存在
 * 3.X-HMAC-HASH 摘要没有变化，与客户端一致
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

//如果将来再有其他的singer,创建signer目录，进行重构
//--当前项目未使用
angular.module('girder.security.dataSafe.signer')
//restful singer 用于restful请求签名
.factory('RestFulSecuritySessionSigner', ['$log', 'Session', function ($log, Session) {
  /*global CryptoJS */
  var digestor = {};

  /**
   * 如果结果为null则返回''
   * @param val
   * @returns {string}
   */
  var getDataContent = function getDataContent(val) {
    if (angular.isUndefined(val) || val === null) {
      return '';
    }
    //判断是否需要转为String
    if (typeof val === 'object' && !!val || typeof val === 'function') {
      var data = filterDataContent(val);
      return JSON.stringify(data);
    } else {
      return val;
    }
  };

  /**
   * 去掉angularjs保留字(以$开头的属性)
   * @param val
   * @returns {*}
   */
  var filterDataContent = function filterDataContent(val) {
    var data = angular.copy(val);
    for (var item in data) {
      if (item.charAt(0) === '$') {
        data[item] = undefined;
      }
    }
    return data;
  };

  /**
   * 获取参数对象
   * @param val
   * @returns {string}
   */
  var getOrderedParamContent = function getOrderedParamContent(val) {
    var paramString = '';
    if (angular.isUndefined(val) || val === null) {
      return '';
    }
    //sort
    var paramList = sortParam(val);
    for (var item in paramList) {
      paramString = paramString + paramList[item] + ',';
    }
    //去掉最后的分隔符
    paramString = paramString.substring(0, paramString.length - 1);
    $log.debug('SessionSigner验证参数排序:', val, '参数=', paramString);
    return paramString;
  };

  /**
   * 按字母顺序排序请求参数
   * @param val
   */
  var sortParam = function sortParam(val) {
    var paramList = [];
    //解析对象属性
    for (var item in val) {
      //略过未定义属性
      if (angular.isUndefined(val[item]) || val[item] === null) {
        continue;
      }
      paramList.push(formatParam(item, val[item]));
    }
    //按字母顺序排序
    paramList.sort();
    return paramList;
  };

  /**
   * 格式化请求参数
   * @param key
   * @param val
   * @returns {string}
   */
  var formatParam = function formatParam(key, val) {
    return '\"' + key + '\":' + '\"' + val + '\"';
  };

  /**
   * 获取签名时间
   * @returns {number}
   */
  var getMicroTime = function getMicroTime() {
    return new Date().getTime();
  };

  /**
   * 获取用户账号
   * @returns {create.user.account|*|account}
   */
  var getUser = function getUser() {
    return Session.user.account;
  };

  /**
   * 生成签名
   * @returns {number}
   */
  var crtDigest = function crtDigest(url, method, params, data, microTime) {
    var orderedParams = getOrderedParamContent(params);
    var orderedData = getDataContent(data);
    var content = method + ':' + url + ':' + orderedParams + ':' + orderedData + ':' + microTime;
    var digest = CryptoJS.HmacSHA256(content, Session.id).toString(CryptoJS.enc.Hex);
    $log.debug('SessionSigner 创建签名=' + Session.id + ' 签名对象=', content, ' 签名结果=', digest);
    return digest;
  };

  /**
   * 获取http安全头
   * @param url
   * @param method
   * @param params
   * @param data
   */
  digestor.getHttpSecurityHead = function (url, method, params, data) {
    var head = {};
    var microTime = getMicroTime();
    head['X-MICRO-TIME'] = microTime;
    head['X-HMAC-HASH'] = crtDigest(url, method, params, data, microTime);
    head['X-USER'] = getUser();
    //$log.debug('返回http head对象:',head);
    return head;
  };

  return digestor;
}]);
/**
 * Created by mojf
 * 回车事件装饰
 */
'use strict';
angular.module('girder.ui.enterKeyDecorative').service('GirderEnterKeyDecorativeService', function () {
  var service = {};
  /**
   * 按回车键时实现TAB键的效果
   */
  service.dotab = function () {
    angular.element(document).on('keydown', function (event) {
      if (event.which === 13) {
        //$log.debug('回车');
        var inp = document.getElementsByClassName('form-control');
        var idxcur = -1;
        for (var idx = 0; idx < inp.length; idx++) {
          if (inp[idx] === event.target) {
            idxcur = idx;
            //$log.debug('idxcur', idxcur);
          } else {
              if (idxcur >= 0) {
                if (inp[idx] && inp[idx].type !== 'hidden' && !inp[idx].hasAttribute('readonly') && inp[idx].disabled !== true) {
                  //$log.debug('idx', idx);
                  inp[idx].focus();
                  return true;
                }
              }
            }
        }
        //document.getElementsByClassName('btn-success')[0].focus();
      }
      return true;
    });
  };
  return service;
});
/**
 * 图片相关支持组件
 *
 * @author wuyf
 * @date 2016-01-12
 */
'use strict';

angular.module('girder.ui.imageModule', ['girder.ui.imageModule.compress', //图片压缩组件
'girder.ui.imageModule.viewBox' //图像查看组件
]);
/**
 * Created by juan_wang on 2014/7/26.
 */

'use strict';
angular.module('girder.ui.longDateModule').directive('girderDateFormat', ['$filter', '$log', 'LongDateService', function ($filter, $log, LongDateService) {

  return {
    require: 'ngModel',
    restrict: 'A',
    link: function link(scope, elm, attrs, ctrl) {
      var format = attrs.girderDateFormat;
      $log.debug('传入girder-date-format格式为：' + format);
      //从$modelValue格式化到$viewValue
      function formatter(value) {
        switch (format) {
          case 'second':
            return LongDateService.secondLongToDate(value);
          case 'day':
            return LongDateService.longToDay(value);
          case 'month':
            return LongDateService.longToMonth(value);
          case 'year':
            return LongDateService.longToYear(value);
        }
      }

      //从$viewValue解析到$modelValue
      function parser(value) {
        switch (format) {
          case 'second':
            return LongDateService.secondToLong(value);
          case 'day':
            return LongDateService.dayToLong(value);
          case 'month':
            return LongDateService.monthToLong(value);
          case 'year':
            return LongDateService.yearToLong(value);
        }
      }

      ctrl.$formatters.push(formatter);
      ctrl.$parsers.push(parser);
    }
  };
}]).filter('SecondLongToDateFilter', ['LongDateService', function (LongDateService) {
  return function (input) {
    return LongDateService.secondLongToDate(input);
  };
}]).filter('LongToDayFilter', ['LongDateService', function (LongDateService) {
  return function (input) {
    return LongDateService.longToDay(input);
  };
}]).filter('LongToMonthFilter', ['LongDateService', function (LongDateService) {
  return function (input) {
    return LongDateService.longToMonth(input);
  };
}]).filter('LongToYearFilter', ['LongDateService', function (LongDateService) {
  return function (input) {
    return LongDateService.longToYear(input);
  };
}]).filter('SecondToLongFilter', ['LongDateService', function (LongDateService) {
  return function (input) {
    return LongDateService.secondToLong(input);
  };
}]).filter('DayToLongFilter', ['LongDateService', function (LongDateService) {
  return function (input) {
    return LongDateService.dayToLong(input);
  };
}]).filter('MonthToLongFilter', ['LongDateService', function (LongDateService) {
  return function (input) {
    return LongDateService.monthToLong(input);
  };
}]).filter('YearToLongFilter', ['LongDateService', function (LongDateService) {
  return function (input) {
    return LongDateService.yearToLong(input);
  };
}])

//时间对LongDate的转换类
.service('LongDateService', ['$log', '$filter', function ($log, $filter) {
  //补零
  var padString = function padString(i) {
    return i < 10 ? '0' + i : '' + i;
  };
  var standardDateFilter = $filter('date');

  var service = {};

  /**
   * SecondLong转换为时间
   * @param input
   * @returns {*}
   */
  service.secondLongToDate = function (input) {
    if (!input || input === undefined) {
      return input;
    }
    var temp = input.toString();
    if (temp.length !== 14) {
      return input;
    }
    var year = temp.substring(0, 4);
    var month = temp.substring(4, 6);
    var day = temp.substring(6, 8);
    var hour = temp.substring(8, 10);
    var minute = temp.substring(10, 12);
    var second = temp.substring(12, 14);
    var tempdate = new Date(year, parseInt(month, 10) - 1, day, hour, minute, second);
    return standardDateFilter(tempdate, 'yyyy-MM-dd');
  };

  /**
   * Long转换为日期
   * @param input
   * @returns {*}
   */
  service.longToDay = function (input) {
    if (!input || input === undefined) {
      return input;
    }
    var temp = input.toString();
    if (temp.length !== 8) {
      return input;
    }
    var year = temp.substring(0, 4);
    var month = temp.substring(4, 6);
    var day = temp.substring(6, 8);
    var tempdate = new Date(year, parseInt(month, 10) - 1, day);
    return standardDateFilter(tempdate, 'yyyy-MM-dd');
  };

  /**
   * Long转换为月份
   * @param input
   * @returns {*}
   */
  service.longToMonth = function (input) {
    if (!input || input === undefined) {
      return input;
    }
    var temp = input.toString();
    if (temp.length !== 6) {
      return input;
    }
    var year = temp.substring(0, 4);
    var month = temp.substring(4, 6);
    return new Date(year, parseInt(month, 10) - 1);
  };

  /**
   * Long转换为年份
   * @param input
   * @returns {*}
   */
  service.longToYear = function (input) {
    if (!input || input === undefined) {
      return input;
    }
    var temp = input.toString();
    if (temp.length !== 4) {
      return input;
    }
    var year = temp.substring(0, 4);
    return new Date(year);
  };

  /**
   * 时间转换为SecondLong
   * @param input
   * @returns {*}
   */
  service.secondToLong = function (input) {
    if (!input || input === undefined) {
      return input;
    }
    var dateStr = padString(input.getFullYear()) + padString(1 + input.getMonth()) + padString(input.getDate()) + padString(input.getHours()) + padString(input.getMinutes()) + padString(input.getSeconds());
    return Number(dateStr);
  };

  /**
   * 时间转换为Long
   * @param input
   * @returns {*}
   */
  service.dayToLong = function (input) {
    if (!input || input === undefined) {
      return input;
    }
    var dateStr = padString(input.getFullYear()) + padString(1 + input.getMonth()) + padString(input.getDate());
    return Number(dateStr);
  };

  /**
   * 月份转换为Long
   * @param input
   * @returns {*}
   */
  service.monthToLong = function (input) {
    if (!input || input === undefined) {
      return input;
    }
    var dateStr = padString(input.getFullYear()) + padString(1 + input.getMonth());
    return Number(dateStr);
  };

  /**
   * 年份转换为Long
   * @param input
   * @returns {*}
   */
  service.yearToLong = function (input) {
    if (!input || input === undefined) {
      return input;
    }
    var dateStr = padString(input.getFullYear());
    return Number(dateStr);
  };

  return service;
}]);
/**
 * 菜单组件
 *
 * 包括常见的topMenu与leftMenu组件
 * 两个组件使用一致的菜单模型，模型数据如下所示
 *
 *      $scope.menus = [
 *      {
 *        'label': '首页',
 *        'path': '/home'
 *      },
 *      {
 *        'label': '权限管理',
 *        'children': [
 *          {'label': '用户中心', 'path': '/girder/security/account'},
 *          {'label': '菜单维护', 'path': '/girder/security/menu'},
 *          {'label': '角色维护', 'path': '/girder/security/role'},
 *          {'label': '用户授权', 'path': '/girder/security/role_to_user'},
 *          {'label': '菜单授权', 'path': '/girder/security/menu_to_role'}
 *        ]
 *      },
 *      {
 *        'label': '通知管理',
 *        'path': '/girder/notice'
 *      },
 *      {
 *        'label': '系统监控',
 *        'path': '/submit',
 *        'children': [
 *          {'label': '系统信息', 'path': '/girder/monitor'},
 *          {'label': '参数配置', 'path': '/girder/monitor'},
 *          {'label': '日志管理', 'path': '/girder/monitor'}
 *        ]
 *      }
 *    ];
 *
 * @author wuyf
 * @date 2015-03-19
 */
'use strict';

angular.module('girder.ui.menu', ['girder.security', //依赖于security组件
'girder.ui.menu.top', 'girder.ui.menu.left', 'girder.ui.menu.loginToolBar']);
/**
 * Created by wuyf on 2014/7/4.
 *
 * messageBox组件
 * -------------
 */
'use strict';
// app/girder/ui/messagebox/messagebox.js

angular.module('girder.ui.messageBoxModule').service('messageService', ['$uibModal', function ($uibModal) {
  //默认参数配置
  var modalDefaults = {
    backdrop: true,
    keyboard: true,
    modalFade: true,
    templateUrl: 'girder/ui/messagebox/messageview.html'
  };

  //默认view参数配置
  var modalOptions = {
    closeButtonText: 'Close',
    actionButtonText: 'OK',
    headerText: 'Proceed?',
    bodyText: 'Perform this action?'
  };

  this.showModal = function (customModalDefaults, customModalOptions) {
    if (!customModalDefaults) {
      customModalDefaults = {};
    }
    customModalDefaults.backdrop = 'static';
    return this.show(customModalDefaults, customModalOptions);
  };

  this.show = function (customModalDefaults, customModalOptions) {
    //Create temp objects to work with since we're in a singleton service
    var tempModalDefaults = {};
    var tempModalOptions = {};

    //Map angular-ui modal custom defaults to modal defaults defined in service
    angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

    //Map modal.html $scope custom properties to defaults defined in service
    angular.extend(tempModalOptions, modalOptions, customModalOptions);

    if (!tempModalDefaults.controller) {
      tempModalDefaults.controller = 'messageServiceController';
    }

    tempModalDefaults.resolve = {
      modalOptions: function modalOptions() {
        return tempModalOptions;
      }
    };

    //显示模态对话框
    return $uibModal.open(tempModalDefaults).result;
  };
}]).controller('messageServiceController', ['$scope', '$modalInstance', 'modalOptions', function ($scope, $modalInstance, modalOptions) {
  $scope.modalOptions = modalOptions;
  //确定
  $scope.modalOptions.ok = function (result) {
    $modalInstance.close(result);
  };
  //取消
  $scope.modalOptions.close = function () {
    $modalInstance.dismiss('cancel');
  };
}])
//--------------------------
//显示提示信息组件
//
//messageBox.showError('真心保存失败!!').then(function (result) {
// $log.debug('messagebox then ',result);
//});
//--------------------------
.service('messageBox', ['messageService', function (messageService) {

  var _showMsg = function _showMsg(title, message) {
    var modalOptions = {
      closeButtonText: null,
      actionButtonText: '确定',
      headerText: title,
      bodyText: message
    };
    return messageService.showModal({}, modalOptions);
  };

  //显示 标题 / 提示消息
  this.showInfo = function (title, message) {
    var t = title === null ? '消息提示' : title;
    return _showMsg(t, message);
  };

  // 显示提示消息
  this.showInfo = function (message) {
    return _showMsg('消息提示', message);
  };

  // 显示 标题 / 错误详情
  this.showError = function (title, message) {
    var t = title === null ? '错误提示' : title;
    return _showMsg(t, message);
  };

  // 显示 错误信息
  this.showError = function (message) {
    return _showMsg('错误提示', message);
  };
}])
//--------------------------
//显示选择信息组件
//
//confirmBox.showInfo('这次要选择yes吗？').then(function (result) {
//  $log.debug('这次选了yes!');
//});
//
//--------------------------
.service('confirmBox', ['messageService', function (messageService) {

  var _showMsg = function _showMsg(title, message) {
    var modalOptions = {
      closeButtonText: '否',
      actionButtonText: '是',
      headerText: title,
      bodyText: message
    };
    return messageService.showModal({}, modalOptions);
  };

  //显示 标题 / 提示消息
  this.showInfo = function (title, message) {
    var t = title === null ? '消息提示' : title;
    return _showMsg(t, message);
  };

  // 显示提示消息
  this.showInfo = function (message) {
    return _showMsg('消息提示', message);
  };
}]);
/**
 * Created by wuyf on 2014/6/12.
 * 分页组件(扩展自http://angular-ui.github.io/bootstrap/ 当中的Pagination组件)
 * 扩展内容:
 * 1.增加了jumpLinks 快速跳转到某一个页面 默认为显示
 * 2.增加了rowCountLinks 显示总记录条数   默认为显示
 * 3.去掉了firstText/previousText/nextText/lastText的文字定制，替换为glyphicon图标
 * 使用方法主要参考http://angular-ui.github.io/bootstrap/ 当中Pagination部分说明
 * 建议:前台显示数据量限制在1000以内
 * --使用方法---------------------------------------------------------------------
 * --A.后台分页:适用场景:在服务端进行分页处理(不可能将数据全部抓到前台处理的场景)
 *              缺点:    开发时，如果页面当中有filter只能支持本页过滤
 * ------------
 * 1.在页面的controller当中需要有几个变量[每页条数],[当前页],[总页数],[页码变化时候的回调函数]，例如
 *        angular.module('TestApp')
 *                .controller('NoticeCtrl', function ($scope,DataService,$log) {
 *                    //定义每页大小
 *                    $scope.pageSize=3;
 *                    //当前页面（初始化为第一页）
 *                    $scope.currentPage = 1;
 *                    //获取第一页数据
 *                    $scope.pageObject = DataService.get($scope.currentPage,$scope.pageSize);
 *                    //总数据量
 *                    $scope.totalItems = $scope.pageObject.totalElements;
 *                    //页码变化时候的回调函数
 *                    $scope.pageChange = function(){
 *                        $log.debug('NoticeCtrl页面发生变换',$scope.currentPage);
 *                        //注意调用后台的时候，前台的页码从1开始，但是后台是从0开始，因此这里需要-1
 *                        $scope.pageObject = DataService.get($scope.currentPage-1,$scope.pageSize);
 *                    }
 *                });
 * 2.在视图中定义分页组件
 *<girder-pagination items-per-page="pageSize" total-items=totalItems ng-model="currentPage" ng-change="pageChange()"></girder-pagination>
 * -----------------------------------------------------------------------------------------------
 * --B.前台分页:适用场景:例如从后台获取2W数据，在前台进行分页显示, filter可以支持全量数据过滤
 *              缺点:    需要测试下获取过多的数据是否会占用过多的内存、获取时间是否合理
 * ----------------
 * 1.在页面的controller当中需要有几个变量[每页条数],[当前页]，[总页数]，例如
 *        angular.module('TestApp')
 *                .controller('NoticeCtrl', function ($scope,DataService,$log) {
 *                    //定义每页大小
 *                    $scope.pageSize=3;
 *                    //当前页面（初始化为第一页）
 *                    $scope.currentPage = 1;
 *                    //获取所有数据
 *                    $scope.pageObject = DataService.getAllData();
 *                    //总数据量
 *                    $scope.totalItems = $scope.pageObject.totalElements;
 *                });
 *
 *2.在视图中Table定义前端分页,使用paginateModule提供的过滤器startFrom以及angularjs内建的过滤器limitTo
 * <tr ng-repeat="item in pageObject.content|startFrom:currentPage:pageSize|limitTo:pageSize">
 *    <td>{{item.id}}</td>
 *    <td>{{item.name}}</td>
 *    <td>{{item.description}}</td>
 * </tr>
 *
 *3.定义分页组件,注意：因为都是前台分页，因此不需要ng-change="pageChange()回调
 * <girder-pagination items-per-page="pageSize" total-items=totalItems ng-model="currentPage"></girder-pagination>
 *
 */
'use strict';
// app/girder/ui/server-paginate-service.js
angular.module('girder.ui.paginateModule').filter('startFrom', function () {
  return function (input, currentPage, pageSize) {
    if (!input) {
      return input;
    }
    //客户端页码从1开始，实际数据从0开始
    return input.slice((currentPage - 1) * pageSize);
  };
}).controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop },
      // nullModelCtrl
  setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
  //初始化方法
  this.init = function (ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function () {
      self.render();
    };
    //如果设置了itemsPerPage，否则用默认的
    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }
  };
  //计算总页数
  this.calculateTotalPages = function () {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function () {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  //选中页面
  $scope.selectPage = function (page) {
    if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  //当前页面数据量
  $scope.getPageRowCount = function () {
    if (self.itemsPerPage * $scope.page > $scope.totalItems) {
      return $scope.totalItems - self.itemsPerPage * ($scope.page - 1);
    } else {
      return self.itemsPerPage;
    }
  };

  $scope.getText = function (key) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };

  $scope.noPrevious = function () {
    return $scope.page === 1;
  };
  $scope.noNext = function () {
    return $scope.page === $scope.totalPages;
  };

  $scope.$watch('totalItems', function () {
    $scope.totalPages = self.calculateTotalPages();
  });

  $scope.$watch('totalPages', function (value) {
    setNumPages($scope.$parent, value); // Readonly variable

    if ($scope.page > value) {
      $scope.selectPage(value);
    } else {
      ngModelCtrl.$render();
    }
  });
}])
//常量定义
.constant('paginationConfig', {
  itemsPerPage: 10, //默认每页条数
  boundaryLinks: true, //快速首页/末页
  directionLinks: true, //前一页/后一页
  jumpLinks: true, //快速跳转
  rowCountLinks: true, //显示记录条数
  rotate: true, //是否滚动分页索引
  maxSize: 7 //最大page显示分页索引数
})
//视图组件
.directive('girderPagination', ['$parse', 'paginationConfig', function ($parse, paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '='
    },
    require: ['girderPagination', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'girder/ui/paginate/pagination.html',
    replace: true,
    link: function link(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
        return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;
      scope.jumpLinks = angular.isDefined(attrs.jumpLinks) ? scope.$parent.$eval(attrs.jumpLinks) : paginationConfig.jumpLinks;
      scope.rowCountLinks = angular.isDefined(attrs.rowCountLinks) ? scope.$parent.$eval(attrs.rowCountLinks) : paginationConfig.rowCountLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function (value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1,
            endPage = totalPages;
        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

        // recompute if maxSize
        if (isMaxSized) {
          if (rotate) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
            endPage = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && !rotate) {
          if (startPage > 1) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if (endPage < totalPages) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function () {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}]);
/**
 * Created by liang_jian on 2015/3/10.
 *
 * 报表打印辅助组件
 * -------------
 */
'use strict';
angular.module('girder.ui.messageBoxModule')
//angular.module('girder.ui.reportHelper')
.service('reportService', ['$uibModal', function ($uibModal) {
  //默认参数配置
  var modalDefaults = {
    backdrop: true,
    keyboard: true,
    modalFade: true,
    templateUrl: 'girder/ui/reporthelper/reporthelper.html'
  };
  //默认view参数配置
  var modalOptions = {
    closeButtonText: 'Close',
    actionButtonText: 'OK',
    headerText: 'Proceed?',
    bodyText: 'Perform this action?'
  };
  this.showModal = function (customModalDefaults, customModalOptions) {
    if (!customModalDefaults) {
      customModalDefaults = {};
    }
    customModalDefaults.backdrop = 'static';
    return this.show(customModalDefaults, customModalOptions);
  };
  this.show = function (customModalDefaults, customModalOptions) {
    //Create temp objects to work with since we're in a singleton service
    var tempModalDefaults = {};
    var tempModalOptions = {};
    //Map angular-ui modal custom defaults to modal defaults defined in service
    angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
    //Map modal.html $scope custom properties to defaults defined in service
    angular.extend(tempModalOptions, modalOptions, customModalOptions);
    if (!tempModalDefaults.controller) {
      tempModalDefaults.controller = 'reportController';
    }
    tempModalDefaults.resolve = {
      modalOptions: function modalOptions() {
        return tempModalOptions;
      }
    };
    tempModalDefaults.size = 'lg';
    //显示模态对话框
    return $uibModal.open(tempModalDefaults).result;
  };
}]).controller('reportController', ['$scope', '$modalInstance', 'modalOptions', '$http', '$log', '$sce', function ($scope, $modalInstance, modalOptions, $http, $log, $sce) {
  $scope.loading = true;
  $scope.message = '正在生成报表，请耐心等待。。。';
  $scope.modalOptions = modalOptions;
  // 初始调用(直接调用后台报表接口)
  $scope.init = function () {
    var httpOptions = {
      method: modalOptions.method,
      url: modalOptions.url,
      params: modalOptions.params,
      data: modalOptions.data,
      headers: { Accept: '*/*' },
      //            xsrfHeaderName: modalOptions.xsrfHeaderName,
      //            xsrfCookieName: modalOptions.xsrfCookieName,
      //            transformRequest: modalOptions.transformRequest,
      //            transformResponse: modalOptions.transformResponse,
      //            cache: modalOptions.cache,
      //            timeout: modalOptions.timeout,
      //            withCredentials: modalOptions.withCredentials,
      responseType: 'arraybuffer' //modalOptions.responseType
    };

    //          $log.log('httpOptions-----' + JSON.stringify(httpOptions));
    //          $http(httpOptions).success(function (data, status) {
    //              $scope.trustedHtml = $sce.trustAsHtml(data);
    //          }).error(function(data, status) {
    //              $scope.trustedHtml = $sce.trustAsHtml(data);
    //          });
    $http(httpOptions).success(function (response) {
      $scope.loading = false;
      var file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      $scope.content = $sce.trustAsResourceUrl(fileURL);
    }).error(function () {
      $scope.message = '报表生成错误！';
    });
  };
  //确定
  $scope.modalOptions.ok = function (result) {
    $modalInstance.close(result);
  };
  //取消
  $scope.modalOptions.close = function () {
    $modalInstance.dismiss('cancel');
  };
}]).service('reportHelper', ['reportService', '$log', function (reportService, $log) {
  var _showModal = function _showModal(modalOptions) {
    modalOptions.closeButtonText = '关闭';
    modalOptions.actionButtonText = null;
    return reportService.showModal({}, modalOptions);
  };
  // 显示打印画面
  this.showReport = function (modalOptions) {
    $log.log('窗口内容-----' + JSON.stringify(modalOptions));
    return _showModal(modalOptions);
  };
}]);
/**
 * Created by wuyf on 2014/6/12.
 * 下拉选择服务组件,在用户登录以后获取下拉数据列表(selectCodeMap)
 * --使用方法---------------------------------------------------------------------
 * 1. controller注入依赖,定义绑定的codeList
 * personModule.controller('myCtrl',['selectCodeService',function (selectCodeService) {
 *    //通过selectCodeService服务获取代码定义
 *    $scope.codeList = selectCodeService.getCodeList();
 * }
 * 2. 视图编写方式
 * 2.1设置二级代码:m.value as  m.name for m in codeList|selectCodeType:'AAC005' (注意'AAC005'需要有单引号)
 * <select name = "nation" ng-model="person.nation" ng-options="m.value as  m.name for m in codeList|selectCodeType:'AAC005'" class="form-control">
 *  <option value="">-- 请选择 --</option>
 * </select>
 *
 * ---获取代码值
 * <div>当前业务类型选择{{ curApplyType|selectCodeName:'APPLY_TYPE'}}<div>
 *
 */
'use strict';
//app/girder/ui/selectcode/selectcode.js
angular.module('girder.ui.selectCodeModule').constant('GIRDER_UI_SELECT_CODE', {
  codeListCache: 'girder_ui_select_code'
})
//过滤器，获取代码list
.filter('selectCodeType', function () {
  return function (input, code) {
    if (!input || input.codeList === undefined) {
      return input;
    }
    //返回代码List
    return input.codeList[code];
  };
})
//过滤器，获取代码名称
.filter('selectCodeName', ['selectCodeService', function (selectCodeService) {
  return function (input, code) {
    if (!input) {
      return input;
    }
    //返回代码名称
    return selectCodeService.getCodeName(code, input);
  };
}])
//下拉代码服务类
.service('selectCodeService', ['$log', '$resource', 'GIRDER_UI_SELECT_CODE', function ($log, $resource, GIRDER_UI_SELECT_CODE) {
  //分隔符定义
  var SPLIT = ',';
  var service = {
    selectCodeMap: null
  };
  /**
   * 获取单个代码
   * @param code
   * @param value
   */
  var getSingleCodeName = function getSingleCodeName(code, value) {
    //从缓存当中加载代码
    loadCodeMap();
    $log.debug('获取单个代码名称', code, value);
    var list = service.selectCodeMap.codeList[code];
    for (var item in list) {
      if (list[item].value === value) {
        return list[item].name;
      }
    }
    //如果没有找到返回value
    return value;
  };

  /**
   * 获取逗号分隔代码名称
   * @param code
   * @param value
   * @returns {string}
   */
  var getSplitStringCodeName = function getSplitStringCodeName(code, value) {
    $log.debug('获取逗号分隔代码名称', code, value);
    var codeName = '';
    var codeArr = value.split(SPLIT);
    angular.forEach(codeArr, function (item) {
      codeName += SPLIT + getSingleCodeName(code, item);
    });
    //去掉最后一个分隔符
    codeName = codeName.substring(1);
    return codeName;
  };

  /**
   * 从缓存当中加载代码
   */
  var loadCodeMap = function loadCodeMap() {
    if (service.selectCodeMap === null) {
      var codelist = localStorage.getItem(GIRDER_UI_SELECT_CODE.codeListCache);
      service.selectCodeMap = JSON.parse(codelist);
    }
  };
  //根据代码值获取代码名称
  service.getCodeName = function (code, value) {
    if (value.indexOf(SPLIT) !== -1) {
      //获取逗号分隔代码
      return getSplitStringCodeName(code, value);
    } else {
      //获取单个代码
      return getSingleCodeName(code, value);
    }
  };
  return service;
}])
//下拉代码加载对象
.service('selectCodeLoader', ['$log', '$resource', 'GIRDER_UI_SELECT_CODE', 'girderConfig', '$q', 'SelectCodeLoaderConfig', function ($log, $resource, GIRDER_UI_SELECT_CODE, appConfig, $q, selectCodeLoaderConfig) {
  var SelectCode = $resource(appConfig.baseUrl + selectCodeLoaderConfig.url, { Id: '@id' }, {
    loadAll: { method: 'Get' }, //加载
    refresh: { method: 'Put' } //刷新
  });
  var factory = {};
  factory.loadCodeList = function () {
    var deferred = $q.defer(); // 生成Deferred对象
    //加载代码表
    var codeList = localStorage.getItem(GIRDER_UI_SELECT_CODE.codeListCache);
    if (codeList !== undefined && codeList !== null) {
      codeList = JSON.parse(codeList);
      $log.debug('从缓存加载代码:', codeList);
      deferred.resolve(codeList); // 改变Deferred对象的执行状态
      return deferred.promise;
    } else {
      return SelectCode.loadAll().$promise.then(function (data) {
        $log.debug('首次加载代码:', data);
        //保存在localStorage当中
        localStorage.setItem(GIRDER_UI_SELECT_CODE.codeListCache, JSON.stringify(data));
        return data;
      });
    }
  };
  return factory;
}])
//提供可以配置的服务
.provider('SelectCodeLoaderConfig', {
  //可以配置的属性
  url: '/api/selectcodes/:Id',
  //可以访问到的属性
  $get: [function () {
    var service = {
      url: this.url
    };
    return service;
  }]
});
//多级选择控件
//使用方法，如：
//data表示数据源，ng-model对应行政区划编码，has-add指定是否包含详细地址，add对应详细地址。
//<input ng-model="person.residentAddressState" type="text" select-address data="addressData" col-option="{{colOption}}" has-add=true add="person.residentAddress"/>
//colOption，列定义，例如：
//{value:'value',name:'name',child:'child'}
//变量说明：
//selectNames
// 用于展现选中节点和他的历代节点的名称，用于展现节点的全中文名。
// 是已选择的各代节点的名称数组，数组最后一项是最终选择的节点的名称，前几项依次是该节点的上一代节点、上上一代节点等的名称。
// 选中节点时，先确定选中节点的层级，将他的下级节点都清除掉，更新当前节点
// 需要根据value回显，并在点确定按钮后更新给selectItemName
//candidates
// 用于展现节点树的分层展开结构
// 数组每一项又是一个数组，最后一项是待选择的节点集，或者是最后选中的节点和他的兄弟节点的集合，前几项依次是该节点的上一代节点和上一代节点的兄弟节点们、上上一代节点和上上一代节点的兄弟节点们。
// 选中节点时，先确定选中节点的层级，将他的下级节点都清除掉，更新当前节点
// 初始化数组的第0个元素是data
// 需要根据value回显
// modify by mojf 20150422
// 新增回调方法，返回：
//     selectedItem 选中的对象
//     selectNames 选中的汉字数组
'use strict';
angular.module('girder.ui.selectAddress').directive('selectAddress', ['$log', '$compile', '$http', '$templateCache', function ($log, $compile, $http, $templateCache) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      data: '=',
      hasAdd: '=',
      add: '=',
      colOption: '@',
      selectCallback: '&' //回调方法
    },
    link: function link(scope, element, attrs, ngModel) {
      //$log.debug('link selectAddress..');
      //////////////////列定义
      var cols = scope.$eval(scope.colOption);
      var valueCol = cols.value;
      var nameCol = cols.name;
      var childCol = cols.child;
      //////////////////替换模板，生成html
      var templateURL = 'girder/ui/selectState/stateCodeView.html';
      var templateHtml = $templateCache.get(templateURL);
      var $template;
      //编译控件
      var compileView = function compileView(template) {
        $template = $compile(template)(scope);
        $template.on('click', function (event) {
          //$log.debug('click selectAddress..');
          var eve = event.srcElement ? event.srcElement : event.target;
          if (!eve.classList.contains('btn-success')) {
            scope.resize();
          }
          return false;
        });
        element.parent().append($template);
        scope.resize();
      };
      ////////////////绑定事件
      element.on('click keydown', function () {
        //$log.debug('keydown selectAddress..');
        if (scope.data !== null && scope.data !== undefined) {
          if (scope.candidates.length === 0) {
            bindValue(ngModel.$modelValue);
            setTimeout((function () {
              scope.show();
            })(element), 500);
          } else {
            scope.show();
          }
        }
        return false;
      });
      //用于点及其它区域时隐藏
      angular.element(window).on('click', function () {
        return scope.hide();
      });
      //////////////方法
      scope.show = function () {
        if ($template !== null && $template !== undefined) {
          //$log.debug('selectAddress 激活显示');
          return $template.addClass('active');
        }
      };
      scope.hide = function () {
        if ($template !== null && $template !== undefined) {
          $template.removeClass('active');
        }
      };
      scope.resize = function () {
        if ($template !== null && $template !== undefined) {
          //根据候选数组的长度确定
          var num = scope.candidates.length ? scope.candidates.length : 1;
          $template.css({
            'margin-left': -(num * 300) / 2
          });
          return false;
        }
      };
      //选中某项
      scope.select = function (item, candidate) {
        //层级
        var level = scope.candidates.indexOf(candidate);
        //替换选中的name，需要先清除数据
        if (scope.selectNames.length > level) {
          scope.selectNames.splice(level, scope.selectNames.length - level);
        }
        scope.selectNames[scope.selectNames.length] = item[nameCol];
        //替换下一层候选集合，需要先清除数据
        if (scope.candidates.length > level + 1) {
          scope.candidates.splice(level + 1, scope.candidates.length - level - 1);
        }
        if (item.hasOwnProperty(childCol) && item[childCol].length > 0) {
          scope.candidates[scope.candidates.length] = item[childCol];
        }
      };
      //确定
      scope.submit = function () {
        var nameTemp = '';
        var valueTemp = '';
        var itemTemp = '';
        var selectedAddNames = [];
        var lengthTemp = scope.selectNames.length;
        //根据选中的中文名，找选中的代码
        if (lengthTemp > 0) {
          nameTemp = scope.selectNames[lengthTemp - 1];
          if (nameTemp !== null && nameTemp !== '' && nameTemp !== undefined) {
            for (var iTem = 0; iTem < scope.candidates[lengthTemp - 1].length; iTem++) {
              if (scope.candidates[lengthTemp - 1][iTem][nameCol] === nameTemp) {
                valueTemp = scope.candidates[lengthTemp - 1][iTem][valueCol];
                itemTemp = scope.candidates[lengthTemp - 1][iTem];
                selectedAddNames = scope.selectNames;
                break;
              }
            }
          }
        }
        scope.value = valueTemp;
        scope.selectCallback({ item: itemTemp, names: selectedAddNames });
        ngModel.$setViewValue(buildFullAdd());
        ngModel.$render();
        scope.hide();
      };
      //清除
      scope.clear = function () {
        scope.candidates = [];
        scope.candidates[0] = scope.data;
        scope.selectNames = [];
        scope.value = '';
        scope.add = '';
      };
      //监视数据变化
      scope.$watch('data', function (newV) {
        if (newV !== null && newV !== undefined) {
          bindValue(ngModel.$modelValue);
        }
      });
      scope.$watch('add', function () {
        ngModel.$setViewValue(buildFullAdd());
        ngModel.$render();
      });
      //model和view数据转换
      //从$modelValue格式化到$viewValue
      function formatter(value) {
        scope.value = value;
        bindValue(value);
        setTimeout((function () {
          scope.resize();
        })(element), 1000);
        return buildFullAdd();
      }

      //从$viewValue解析到$modelValue
      function parser() {
        return scope.value;
      }

      ngModel.$formatters.push(formatter);
      ngModel.$parsers.unshift(parser);
      /////////////方法
      //回显用
      function bindValue(value) {
        //$log.debug('selectAddress绑定候选数据',value,scope.data);
        //候选数据
        scope.selectNames = [];
        scope.candidates = [];
        if (scope.data !== null && scope.data !== '' && scope.data !== undefined) {
          scope.candidates[0] = scope.data;
          //选中的数据
          if (value !== null && value !== '' && value !== undefined) {
            for (var i = 0; i < scope.data.length; i++) {
              var item = scope.data[i];
              scope.selectNames[0] = item[nameCol];

              if (item[valueCol] !== value) {
                scope.candidates[1] = item[childCol];
                //递归
                if (findSelectItem(item, value)) {
                  return true;
                }
              } else {
                return true;
              }
              scope.candidates.pop();
              scope.selectNames = [];
            }
          }
        }
        return false;
      }

      //查找节点
      function findSelectItem(item, value) {
        var namesLength = scope.selectNames.length;
        var candidatesLength = scope.candidates.length;
        if (item.hasOwnProperty(childCol)) {
          for (var i = 0; i < item[childCol].length; i++) {
            var cItem = item[childCol][i];
            scope.selectNames[namesLength] = cItem[nameCol];
            if (cItem[valueCol] !== value) {
              if (cItem.hasOwnProperty(childCol)) {
                scope.candidates[candidatesLength] = cItem[childCol];
              }
              //递归
              if (findSelectItem(cItem, value)) {
                return true;
              }
            } else {
              return true;
            }
            if (cItem.hasOwnProperty(childCol)) {
              scope.candidates.pop();
            }
            scope.selectNames.pop();
          }
          return false;
        }
      }

      //显示汉字
      function buildFullAdd() {
        var selectItemName = '';
        for (var i = 0; i < scope.selectNames.length; i++) {
          selectItemName += scope.selectNames[i];
        }
        if (scope.hasAdd && scope.add !== null && scope.add !== '' && scope.add !== undefined) {
          selectItemName += scope.add;
        }
        return selectItemName;
      }

      //编译显示控件
      scope.clear();
      compileView(templateHtml);
    }
  };
}]);
/**
 * Created by juan_wang on 2015/3/13.
 */
'use strict';
angular.module('girder.ui.selectAddress').constant('GIRDER_UI_SELECT_STATE', {
  stateListCache: 'girder_ui_select_state'
}).service('selectStateLoader', ['$log', '$http', '$resource', 'girderConfig', 'GIRDER_UI_SELECT_STATE', '$q', 'SelectStateLoaderConfig', function ($log, $http, $resource, appConfig, GIRDER_UI_SELECT_STATE, $q, selectStateLoaderConfig) {
  var SelectState = $resource(appConfig.baseUrl + selectStateLoaderConfig.url, {
    divisionId: '@divisionId',
    leaf: '@leaf'
  }, {
    loadAll: { method: 'Get', isArray: true }
  });
  var factory = {};
  factory.loadStateList = function () {
    var deferred = $q.defer(); // 生成Deferred对象
    //加载行政区划
    var stateList = localStorage.getItem(GIRDER_UI_SELECT_STATE.stateListCache);
    if (stateList !== undefined && stateList !== null) {
      stateList = JSON.parse(stateList);
      $log.debug('加载缓存行政区划:', stateList);
      deferred.resolve(stateList); // 改变Deferred对象的执行状态
      return deferred.promise;
    } else {
      var param = { divisionId: appConfig.divisionId, leaf: appConfig.leaf };
      return SelectState.loadAll(param).$promise.then(function (data) {
        $log.debug('首次加载行政区划:', data);
        //保存在localStorage当中
        localStorage.setItem(GIRDER_UI_SELECT_STATE.stateListCache, JSON.stringify(data));
        return data;
      });
    }
  };
  return factory;
}])
//提供可以配置的服务
.provider('SelectStateLoaderConfig', {
  //可以配置的属性
  url: '/api/areacode/:divisionId/:leaf',
  //可以访问到的属性
  $get: [function () {
    var service = {
      url: this.url
    };
    return service;
  }]
});
/**
 * spinner组件就是交易等待图标
 *
 * 在前后台交换数据的时候，需要显示一个正在加载的图标
 *
 * 使用方式:在框架页面当中插入如下代码
 * <div id="spinner" class="loader_container">
 *  <img ng-src="images/girder/common/spinning.gif">
 * </div>
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

angular.module('girder.ui.spinner').config(['$httpProvider', function ($httpProvider) {

  //loading spinner---------------------------------------
  var spinnerFunction = function spinnerFunction(data) {
    angular.element('#spinner').show();
    return data;
  };
  $httpProvider.defaults.transformRequest.push(spinnerFunction);

  var spinnerHttpInterceptor = function spinnerHttpInterceptor($q) {
    // fix https://github.com/angular/angular.js/issues/7266
    return {
      response: function response(_response) {
        // do something on success
        angular.element('#spinner').hide();
        return _response;
      },
      responseError: function responseError(response) {
        // do something on error
        angular.element('#spinner').hide();
        //if (canRecover(response)) {
        //   return responseOrNewPromise
        //}
        return $q.reject(response);
      }
    };
  };
  spinnerHttpInterceptor.$inject = ['$q', '$window'];
  $httpProvider.interceptors.push(spinnerHttpInterceptor);
}]);
/**
 * Created by y_zhang.neu on 2015/9/24.
 * function：海南项目权限管理，信息修改控制器与服务
 */
'use strict';
angular.module('girder.security.account.mobile').controller('inforModifyCtrl', ['$scope', '$log', 'inforModifyService', 'GirderMobileCaptchaService', function ($scope, $log, inforModifyService, GirderMobileCaptchaService) {
  var InterValObj; //timer变量，控制时间
  var count = 60; //间隔函数，1秒执行
  var curCount; //当前剩余秒数
  //信息修改json
  $scope.mobileDetails = { oldMobileNumber: '', newMobileNumber: '' };
  //http header  验证码captcha是针对于旧手机号码
  $scope.mobileHttpHeader = { mobilenumber: '', captcha: '' };
  //调用服务，进行手机号码修改
  $scope.mobileModify = function () {
    //将信息修改的json的oldMobileNumber传递给http header的mobilenumber
    $scope.mobileHttpHeader.mobilenumber = $scope.mobileDetails.oldMobileNumber;
    $log.info('infoModifyController http header', $scope.mobileHttpHeader);
    $log.info('infoModifyController mobileDetails', $scope.mobileDetails);
    inforModifyService.infoModify($scope.mobileDetails, $scope.mobileHttpHeader).then(function () {
      $scope.messageBox.showInfo('手机号码修改成功');
    }, function (err) {
      $log.error('infoModifyController手机号码修改失败', err);
      $scope.messageBox.showInfo('手机号码修改失败');
    });
  };
  //btnSendMessage
  $scope.sendMessage = function () {
    curCount = count;
    //设置button效果，开始计时
    angular.element('#btnSendCode').attr("disabled", "true");
    angular.element('#btnSendCode').val(curCount + '秒后重发');
    InterValObj = window.setInterval(function () {
      if (curCount === 0) {
        window.clearInterval(InterValObj); //停止计时器
        angular.element('#btnSendCode').removeAttr("disabled"); //启用按钮
        angular.element('#btnSendCode').val('重新发送');
        angular.element('#oldMobileNumber').removeAttr("disabled");
      } else {
        curCount--;
        angular.element('#btnSendCode').val(curCount + '秒后重发');
        angular.element('#oldMobileNumber').attr('disabled', 'true');
      }
    }, 1000); //启动计时器，1秒执行一次
    //向后台发送处理数据
    GirderMobileCaptchaService.getNextCaptcha($scope.mobileDetails.oldMobileNumber).$promise.then(function () {
      $log.info('信息修改（修改电话）的验证码已经发送');
    }, function () {
      $log.info('信息修改（修改电话）的验证码发送失败');
    });
  };
}]).factory('inforModifyService', ['$http', '$log', function ($http, $log) {
  var factory = [];
  //信息修改URL
  var mobileURL = '/ws/user/person/mobilenumber';
  //创建服务，进行修改
  factory.infoModify = function (mobileDetails, mobileHttpHeader) {
    $log.info('inforModifyService手机号码修改', mobileDetails);
    //http header 添加信息
    return $http({ method: 'PUT', url: mobileURL, headers: mobileHttpHeader, data: mobileDetails });
  };
  return factory;
}]);
/**
 * 账户中心控制器
 * Created by wuyf on 2015/10/13.
 */
'use strict';

angular.module('girder.security.account.center')
//用户中心控制器
.controller('AccountCenterController', ['$scope', 'Session', '$log', function ($scope, Session, $log) {
  $scope.user = Session.getUser();
  $log.info('账户管理从Session中得到的用户getUser()', $scope.user);
}]);
/**
 * Created by y_zhang.neu on 2015/9/24
 * function：
 * 1.password modify controller
 * 2.password modify service
 */
'use strict';
angular.module('girder.security.account.password', []).directive('girderValidPassword', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            reference: '=girderValidPassword' //双向绑定
        },
        link: function link(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue === '') {
                    ctrl.$setValidity('_required', false);
                } else {
                    ctrl.$setValidity('_required', true);
                }
                var noMatch = viewValue !== scope.reference;
                ctrl.$setValidity('notEqual', !noMatch);
            });
            //监听
            scope.$watch('reference', function (value) {
                ctrl.$setValidity('notEqual', value === ctrl.$viewValue);
            });
        }
    };
}).controller('passwordModifyCtrl', ['$scope', 'passwordService', '$log', function ($scope, passwordService, $log) {
    $scope.pwdChangeDetails = { oldPassword: null, newPassword: null };
    /**
     *密码修改确认
     */
    $scope.confirmChangePassword = function () {
        passwordService.changePassword($scope.pwdChangeDetails).then(function () {
            $scope.messageBox.showInfo('密码修改成功');
        }, function (err) {
            $log.error('girderPasswordServiceController', err);
            $scope.messageBox.showError('密码修改失败' + err.data.developerMessage);
        });
    };
}]).factory('passwordService', ['$log', '$http', 'girderConfig', function ($log, $http, girderConfig) {
    var factory = {};
    var passwordURL = girderConfig.baseUrl + '/api/security/password';
    factory.changePassword = function (pwdChangeDetails) {
        $log.info('passwordModify密码修改', pwdChangeDetails);
        return $http.put(passwordURL, pwdChangeDetails);
    };
    return factory;
}]);
/**
 * 用户密码服务
 *
 * 客户端用户密码修改服务对象
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';
angular.module('girder.security.account.password', ['girder.security.authorize.authService'])
//验证两次录入密码是否相同
//使用示例
//<input type="password" id="confirm_password" name="pwdConfirm" ng-model="pwdChangeDetails.passwordConfirm"
//  girder-valid-password="pwdChangeDetails.newPassword" required placeholder="请再次输入新密码"/>
//<span ng-show="changePasswordForm.pwdConfirm.$dirty
//          && (changePasswordForm.pwdConfirm.$error._required||changePasswordForm.pwdConfirm.$error.notEqual)">
//  新密码不匹配，请重新录入密码
//</span>
.directive('girderValidPassword', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      reference: '=girderValidPassword' //双向绑定
    },
    link: function link(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        if (viewValue === '') {
          ctrl.$setValidity('_required', false);
        } else {
          ctrl.$setValidity('_required', true);
        }
        var noMatch = viewValue !== scope.reference;
        ctrl.$setValidity('notEqual', !noMatch);
      });
      //监听
      scope.$watch('reference', function (value) {
        ctrl.$setValidity('notEqual', value === ctrl.$viewValue);
      });
    }
  };
})
//安全验证
.factory('girderPasswordService', ['$log', '$uibModal', 'Session', 'girderConfig', '$http', function ($log, $uibModal, Session, appConfig, $http) {
  var factory = {};
  var passwordURL = appConfig.baseUrl + '/api/security/password';
  //显示修改密码界面
  factory.showPasswordChangeForm = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'girder/security/account/password/passwordchange.html',
      controller: 'girderPasswordServiceController'
    });
    modalInstance.result.then(function () {
      $log.info('return: ' + new Date());
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  /**
   * 修改密码
   * @param pwdChangeDetails
   */
  factory.changePassword = function (pwdChangeDetails) {
    return $http.put(passwordURL, pwdChangeDetails);
  };
  return factory;
}])
//用户密码修改控制器
.controller('girderPasswordServiceController', ['$scope', '$modalInstance', 'Session', '$log', 'girderPasswordService', 'messageBox', function ($scope, $modalInstance, Session, $log, girderPasswordService, messageBox) {
  $scope.loginUser = Session.user;
  $scope.showTip = true;
  $scope.pwdChangeDetails = { oldPassword: null, newPassword: null };

  /**
   * 确定修改密码
   */
  $scope.confirmChangePassword = function () {
    //调用服务
    girderPasswordService.changePassword($scope.pwdChangeDetails).then(function () {
      messageBox.showInfo('密码修改成功，请重新登录以验证！');
      $modalInstance.close(true);
    }, function (err) {
      $log.error('girderPasswordServiceController密码修改失败', err);
      messageBox.showError('密码修改失败！' + err.data.developerMessage);
    });
  };

  /**
   * 取消修改密码
   */
  $scope.cancel = function () {
    $modalInstance.dismiss();
  };

  //关闭提示警告
  $scope.closeTip = function () {
    $scope.showTip = false;
  };
}]);
/**
 * 用户安全信息控制资源服务模块
 *
 * @author wuyf
 * @date 2015-03-16
 */
'use strict';

angular.module('girder.security.authorize.resource.organization', []); //组织机构资源
angular.module('girder.security.authorize.resource.authServer', []); //安全认证服务器资源
/**
 * 安全认证服务资源控制服务
 *
 * 注意：安全认证服务需要跨域调用
 *
 * @author wuyf
 * @date 2015-10-14
 */
'use strict';
angular.module('girder.security.authorize.resource')
//安全认证服务
.factory('GirderAuthServerService', ['$http', '$log', 'girderConfig', function ($http, $log, girderConfig) {
  //定义工厂对象
  var factory = {};

  /**获取远程session*/
  var getSessionUrl = function getSessionUrl() {
    return girderConfig.authServerUrl + '/uaa/ssoSessionId?callback=JSON_CALLBACK';
  };

  /**获取logout url*/
  var getLogoutUrl = function getLogoutUrl() {
    return '/logout?callback=JSON_CALLBACK&redirect=' + girderConfig.authServerUrl + '/uaa/logout;jsessionid=';
  };

  var sessionUrl = getSessionUrl();
  var logoutUrl = getLogoutUrl();

  /**
   * 获取远程session
   * @returns {HttpPromise}
   */
  factory.getSSoSession = function () {
    $log.debug('GirderAuthServerService调用ssoSession url=', sessionUrl);
    return $http.jsonp(sessionUrl, {});
  };

  /**
   * 退出远程session
   * @param ssoSessionId
   * @returns {HttpPromise}
   */
  factory.logoutSSO = function (ssoSessionId) {
    var url = logoutUrl + ssoSessionId;
    $log.debug('GirderAuthServerService退出调用 ' + url);
    return $http.jsonp(url, {});
  };
  return factory;
}]);
/**
 * 组织机构信息服务模块
 *
 * @author wuyf
 * @date 2015-03-16
 */
'use strict';
angular.module('girder.security.authorize.resource')
//菜单查询服务对象
.factory('GirderMenusService', ['$log', 'girderConfig', '$resource', function ($log, appConfig, $resource) {
  //菜单资源
  var Resource = $resource('/api/security/user/:appId/menus', {}, {
    getMenusByApp: {
      method: 'GET',
      isArray: true
    }
  });

  //定义工厂对象
  var factory = {
    //
  };

  /*用户菜单*/
  factory.getUserMenusByApp = function () {
    // 返回查询结果
    return Resource.getMenusByApp({ appId: appConfig.ssoAppId }, function (data) {
      $log.debug('根据app获取用户菜单appId=', appConfig.ssoAppId, data);
      return data;
    });
  };
  return factory;
}]);
/**
 * 组织机构信息服务模块
 *
 * @author wuyf
 * @date 2015-03-16
 */
'use strict';
angular.module('girder.security.authorize.resource')
//组织机构查询服务对象
.factory('GirderOrgService', ['$log', 'girderConfig', '$resource', function ($log, appConfig, $resource) {
  //组织机构服务
  var Resource = $resource(appConfig.baseUrl + '/api/security/', {}, {
    getChildren: {
      method: 'GET',
      url: appConfig.baseUrl + '/api/security/organization/:id/children',
      isArray: true
    }
  });

  //定义工厂对象
  var factory = {
    //
  };

  /*获取组织机构下级经办机构*/
  factory.getChildren = function (orgId) {
    // 返回查询结果
    return Resource.getChildren({ id: orgId }, function (data) {
      $log.debug('获取组织机构下级经办节点:', data);
      return data;
    });
  };
  return factory;
}]);
/**
 * 用户安全对象实体定义
 *
 * @author wuyf
 * @date 2015-10-15
 */
'use strict';
angular.module('girder.security.authorize.resource')
//用户信息查询服务对象
.factory('GirderUserService', ['$log', 'girderConfig', '$resource', function ($log, appConfig, $resource) {
  //用户资源对象
  var userResource = $resource('/api/security/user', {}, {
    getUser: { method: 'GET', isArray: false }
  });

  //定义工厂对象
  var factory = {
    //
  };

  /*获取当前登录的用户信息*/
  factory.getUser = function () {
    // 返回查询结果
    return userResource.getUser(function (data) {
      $log.debug('获取当前登录的用户信息:', data);
      return data;
    });
  };
  return factory;
}]);
/**
 * Session 对象表示客户端管理的用户安全Session
 * 它由几个部分构成
 * 1. sessionID 安全token
 * 2. user 对象 (account, name,userType) 对象模型 应该重构出去
 *    { account  - 账户名
 *      name     - 用户名
 *      userType - 用户类型
 *      organization - 用户所属组织机构(可空)
 *     }
 * 3. menu (客户可访问资源对象resource)
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

angular.module('girder.security.authorize.userSession').service('Session', ['$cookies', 'CLIENT_USER_COOKIE', '$log', 'SECURITY_USER_CACHE', 'userWrapperService', 'girderConfig', function ($cookies, CLIENT_USER_COOKIE, $log, SECURITY_USER_CACHE, userWrapper, appConfig) {

  /**
   * 获取cookie名称
   * @returns {string}
   */
  var getCookieName = function getCookieName() {
    return CLIENT_USER_COOKIE.userCookie + '-' + appConfig.ssoAppId;
  };

  /**
   * 是否已经登录
   * @returns {boolean}
   */
  this.isAuthenticated = function () {
    return !!this.user;
  };

  /**
   * 获取用户账号
   * @returns {*|account}
   */
  this.getUserAccount = function () {
    return this.user.account;
  };

  /**
   * 获取当前登录用户
   * @returns {*}
   */
  this.getUser = function () {
    return this.user;
  };

  /**
   * 获取用户菜单
   * @returns {*|menus}
   */
  this.getMenus = function () {
    return this.menus;
  };

  /**
   * 获取安全sessionId
   * @returns {*}
   */
  this.getSessionId = function () {
    return this.id;
  };

  /**
   * 创建用户Session
   * @param sessionId
   * @param account
   * @param userName
   * @param menus
   * @param userType
   */
  //      this.create = function (sessionId, user, menus) {
  //        this.id = sessionId;
  //        this.user = userWrapper._wrapperUser(user);
  //        this.menus = menus;
  //        //put session into cookie
  //        var secureToken = {sessionId: this.id, user: this.user};
  //        //cookie 4k限制,因此放置安全性要求最高的secureToken
  //        $cookies.put(CLIENT_USER_COOKIE.userCookie, secureToken);
  //        //菜单放到缓存当中
  //        localStorage.setItem(SECURITY_USER_CACHE.menusCache, JSON.stringify(menus));
  //      };
  this.create = function (sessionId, user, menus) {
    this.id = sessionId;
    this.user = userWrapper._wrapperUser(user);
    this.menus = menus;
    //put session into cookie
    var secureToken = { sessionId: this.id, user: this.user };
    //cookie 4k限制,因此放置安全性要求最高的secureToken
    $cookies.putObject(getCookieName(), secureToken);

    //菜单放到缓存当中
    localStorage.setItem(SECURITY_USER_CACHE.menusCache, JSON.stringify(menus));
  };

  /**
   * 销毁用户session
   */
  this.destroySession = function () {
    this.id = null;
    this.user = null;
    //清除用户cookie
    $cookies.remove(getCookieName());
    var portalCookies = $cookies.getAll();
    angular.forEach(portalCookies, function (value, key) {
      $log.debug('清除cookie key=', key);
      //清除用户cookie
      $cookies.remove(key);
    });
    //清除用户缓存
    localStorage.clear();
  };
  /**
   * 从cookie当中恢复session
   * @returns {boolean}
   */
  this.restoreFromCookie = function () {
    var storedSession = $cookies.getObject(getCookieName());
    if (storedSession !== null && storedSession !== undefined) {
      this.id = storedSession.sessionId;
      this.user = userWrapper._wrapperUser(storedSession.user);
      //加载菜单
      var menusTree = localStorage.getItem(SECURITY_USER_CACHE.menusCache);
      this.menus = JSON.parse(menusTree);
      return true;
    }
    return false;
  };

  return this;
}]);
/**
 * @ngdoc service
 * @name userWrapperService
 *
 * @description
 * userWrapperService 对象封装了User相关的所有对外业务逻辑
 *
 * **注意** 之所以放在这里封装，而没有放到Resource上的原因是:Resource刷新以后就没有了，
 * 而User信息是需要长期保存并且可以重新载入的。
 *
 * 将来如果需要为不同的user封装不同的行为，可以考虑将userWrapperService作为可本地化自行扩展的服务
 *
 * @author wuyf
 * @date 2015-10-15
 */

'use strict';

angular.module('girder.security.authorize.userSession').service('userWrapperService', ['GirderOrgService', function (GirderOrgService) {

  /**
   * @property 账户名
   * @type {string}
   */
  this.account = null;
  /**
   * @property 用户名
   * @type {string}
   */
  this.name = null;
  /**
   * @property 电子邮箱
   * @type {string}
   */
  this.email = null;
  /**
   * @property 手机号码
   * @type {string}
   */
  this.mobile = null;
  /**
   * @property 关联单位
   * @type {Object|Array}
   */
  this.associatedCompanys = [];
  /**
   * @property 关联个人
   * @type {Object|Array}
   */
  this.associatedPersons = [];
  /**
   * @property 角色
   * @type {Object|Array}
   */
  this.roles = [];
  /**
   * @property 可访问系统
   * @type {Object|Array}
   */
  this.apps = [];
  /**
   * @property 用户类型
   * @type {string}
   */
  this.userType = null;
  /**
   * @property 头像URL
   * @type {string}
   */
  this.headImgUrl = null;
  /**
   * @property 实名认证状态
   * @type {boolean}
   */
  this.hasRealNameAuth = false;

  /**
   * @property 用户所属组织机构
   * @type {Object}
   */
  this.organization = null;

  /**
   * 包装函数-框架内部使用
   * @param user
   */
  this._wrapperUser = function (user) {
    angular.extend(this, user);
    return this;
  };
  //----------------Begin------get functions---------------
  /**
   * 获取操作员姓名
   * @returns {*}
   */
  this.getName = function () {
    return this.name;
  };
  /**
   * 获取操作员账户
   * @returns {*|string}
   */
  this.getAccount = function () {
    return this.account;
  };
  /**
   * 获取Email
   * @returns {*|string}
   */
  this.getEmail = function () {
    return this.email;
  };
  /**
   * 获取手机号码
   * @returns {*|string}
   */
  this.getMobile = function () {
    return this.mobile;
  };
  /**
   * 获取关联单位
   * @returns {*}
   */
  this.getAssociatedCompanys = function () {
    return this.associatedCompanys;
  };
  /**
   * 获取关联个人
   * @returns {*}
   */
  this.getAssociatedPersons = function () {
    return this.associatedPersons;
  };
  /**
   * 获取关联角色
   * @returns {*}
   */
  this.getRoles = function () {
    return this.roles;
  };
  /**
   * 获取可访问系统
   * @returns {Object|Array}
   */
  this.getApps = function () {
    return this.apps;
  };
  /**
   * 获取用户类型
   * @returns {*}
   */
  this.getUserType = function () {
    return this.userType;
  };
  /**
   * 获取头像URL
   * @returns {*}
   */
  this.getHeadImgUrl = function () {
    return this.headImgUrl;
  };
  /**
   * 获取实名认证状态
   * @returns {*}
   */
  this.isRealNameAuth = function () {
    return this.hasRealNameAuth;
  };
  /**
   * 用户所属组织机构
   * @returns {*}
   */
  this.getOrganization = function () {
    return this.organization;
  };
  //----------------End------get functions---------------

  //----------------Begin Business functions-------------
  //--关联个人--
  /**
   * 是否关联多个个人
   * @returns {boolean}
   */
  this.isMultiAssociatedPersons = function () {
    return this.associatedPersons.length > 1;
  };

  /**
   * 获取第一个关联的人
   * @returns {*}
   */
  this.getFirstAssociatedPerson = function () {
    return this.associatedPersons[0];
  };

  //--关联单位--
  /**
   * 是否关联多个单位
   * @returns {boolean}
   */
  this.isMultiAssociatedCompanys = function () {
    return this.associatedCompanys.length > 1;
  };

  /**
   * 获取第一个关联的单位
   * @returns {*}
   */
  this.getFirstAssociatedCompany = function () {
    return this.associatedCompanys[0];
  };

  /**
   * 是否包含某一个角色
   * @param roleName
   * @returns {boolean}
   */
  this.hasRole = function (roleName) {
    return this.roles.indexOf(roleName) >= 0;
  };

  //----经办机构相关----
  /**
   * 获取操作员经办机构
   * @returns {*}
   */
  this.getOrgNumber = function () {
    if (null === this.organization) {
      return null;
    } else {
      return this.organization.orgNumber;
    }
  };

  /**
   * 获取操作员行政区划
   * @returns {*}
   */
  this.getStateCode = function () {
    if (null === this.organization) {
      return null;
    } else {
      return this.organization.stateCode;
    }
  };

  /**
   * 获取经办机构名称
   * @returns {*}
   */
  this.getOrgName = function () {
    if (null === this.organization) {
      return null;
    } else {
      return this.organization.name;
    }
  };

  /**
   * 获取经办机构信息
   * @returns {*}
   */
  this.getOrganization = function () {
    if (null === this.organization) {
      return null;
    } else {
      return this.organization;
    }
  };

  /**
   * 获取经办机构所有子孙节点
   */
  this.getOrgAllPosterity = function () {
    //这里因为有循环注入的问题，因此改用$injector服务注入
    //var girderOrgService = $injector.get('GirderOrgService');
    if (null === this.organization) {
      return null;
    } else {
      return GirderOrgService.getChildren(this.organization.id);
    }
  };

  //----------------End Business functions---------------
}]);
/**
 * 在Form当中输入用户名与密码登录的场景
 *
 * @author wuyf
 * @date 2015-10-14
 */
'use strict';

angular.module('girder.security.authorize.logon').service('GirderFormLoginService', ['$log', '$q', 'girderConfig', '$http', 'GirderUserService', 'GirderMenusService', 'GirderUserLoginEventService', 'Session', function ($log, $q, appConfig, $http, userService, menusService, loginEvent, Session) {

  //登录地址
  var loginUrl = appConfig.baseUrl + '/api/login';
  var logoutUrl = appConfig.baseUrl + '/api/logout';

  //转为form data
  var transform = function transform(data) {
    /*jshint jquery: true */
    return $.param(data);
  };

  //创建用户session
  var createUserSession = function createUserSession() {
    $q.all([userService.getUser().$promise, //获取用户信息
    menusService.getUserMenusByApp().$promise //根据应用获取用户菜单
    ]).then(function (result) {
      $log.debug('GirderFormLoginService 集成调用', result);
      var user = result[0];
      var menus = result[1];
      $log.debug('GirderFormLoginService 集成调用结果 user=', user, 'menus', menus);
      Session.create(null, user, menus);
      $log.log('获取用户登录信息成功', Session);
      loginEvent.raiseUserLoginEvent(Session.user);
      return Session.user;
    }, function (err) {
      $log.error('GirderFormLoginService获取用户登录信息失败', err);
    });
  };

  /**
   * 用户登录逻辑
   * @param credentials
   */
  this.login = function (credentials) {
    $log.debug('用户登录实现-GirderFormLoginService');
    $log.log('authService向服务端发起请求', credentials, 'url=', loginUrl);
    return $http.post(loginUrl, credentials, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      transformRequest: transform
    }).then(function () {
      $log.log('登录验证成功');
      return createUserSession();
    }, function (err) {
      $log.error('登录验证失败', err);
      if (err.status === 400) {
        loginEvent.raiseUserLoginFailedEvent('登录失败:' + err.data.message);
        return;
      }
      //其他未知错误
      loginEvent.raiseUserLoginFailedEvent('系统正在维护，请稍后再试..');
    });
  };

  this.logout = function () {
    $log.debug('用户登录实现-GirderFormLoginService');
    //var account = Session.getUserAccount();
    //$log.log('向服务端发起退出请求..', account);
    //注销前台session
    Session.destroySession();
    return $http.post(logoutUrl).then(function () {
      $log.log('成功登出');
      loginEvent.raiseUserLogOutEvent();
    }, function (err) {
      $log.error('登录验证失败', err);
    });
  };
}]);
/**
 * 用户登录实现
 *
 * 各种场景下用户登录的实现方案，实现的原理类似java接口和实现的方式，实现对象必须实现
 * login(credentials) return Session.user 和 logout()方法
 *
 * @author wuyf
 * @date 2015-03-03
 */
'use strict';

angular.module('girder.security.authorize.logon', ['girder.security.authorize.authService' //安全认证服务
]);
/**
 * 离线开发模式登录服务
 * [在开发模式下使用离线开发登录服务]
 *
 * @author wuyf
 * @date 2015-10-14
 */
'use strict';

/**
 * 开发环境当中模拟登录，并且读取开发菜单
 */
angular.module('girder.security.authorize.logon').service('OffLineDevLoginService', ['$log', '$q', 'GirderAuthServerService', 'userWrapperService', 'GirderUserLoginEventService', 'Session', 'girderConfig', '$http', 'OffLineDevLoginServiceConfig', function ($log, $q, authServer, userWrapperService, loginEvent, Session, appConfig, $http, OffLineDevLoginServiceConfig) {

  /**获取模拟用户*/
  var getMockUser = function getMockUser() {
    return $http.get(appConfig.baseUrl + OffLineDevLoginServiceConfig.mockUserUrl);
  };

  /**获取模拟菜单*/
  var getMockMenus = function getMockMenus() {
    return $http.get(appConfig.baseUrl + OffLineDevLoginServiceConfig.mockMenusUrl);
  };

  /**
   * Portal用户虚拟登录
   * 成功返回用户信息
   */
  this.login = function () {
    $log.debug('Portal用户登录实现-OffLineDevLoginService[只允许开发环境]');
    return $q.all([getMockUser(), //获取用户信息
    getMockMenus() //根据应用获取用户菜单
    ]).then(function (result) {
      $log.debug('OffLineDevLoginService 集成调用', result);
      var token = 'test-ssoSessionId';
      var user = result[0].data;
      var menus = result[1].data;
      $log.debug('session=' + token, 'user=', user, 'menus', menus);
      Session.create(token, user, menus);
      $log.log('登录验证成功', Session);
      loginEvent.raiseUserLoginEvent(Session.user);
      return Session.user;
    }, function (err) {
      $log.error('OffLineDevLoginService获取用户登录信息失败', err);
      if (err.status === 400) {
        loginEvent.raiseUserLoginFailedEvent('获取用户登录信息失败:' + err.data.message);
        return;
      }
      //其他未知错误
      loginEvent.raiseUserLoginFailedEvent('系统正在维护，请稍后再试..');
    });
  };

  /**
   * 用户登出
   * @returns {*}
   */
  this.logout = function () {
    $log.log('向服务端发起退出请求..');
    //注销前台session
    Session.destroySession();
    loginEvent.raiseUserLogOutEvent();
  };
}])
//提供可以配置的服务
.provider('OffLineDevLoginServiceConfig', {
  //可以配置的属性
  mockUserUrl: '/debug/mockUser.json', //模拟用户json路径
  mockMenusUrl: '/debug/mockMenus.json', //模拟菜单路径
  //可以访问到的属性
  $get: [function () {
    var service = {
      mockUserUrl: this.mockUserUrl,
      mockMenusUrl: this.mockMenusUrl
    };
    return service;
  }]
});
/**
 * Portal用户登录实现(虚拟登录)
 *
 * 用于在边界服务(GatWay)直接转发的场景下处理登录
 *
 * @author wuyf
 * @date 2015-10-14
 */
'use strict';

angular.module('girder.security.authorize.logon').service('GirderPortalLoginService', ['$log', '$q', 'GirderAuthServerService', 'GirderUserService', 'GirderMenusService', 'GirderUserLoginEventService', 'Session', function ($log, $q, authServer, userService, menusService, loginEvent, Session) {

  /**
   * Portal用户虚拟登录
   * 成功返回用户信息
   */
  this.login = function () {
    $log.debug('Portal用户登录实现-GirderPortalLoginService');
    return $q.all([authServer.getSSoSession(), //获取session
    userService.getUser().$promise, //获取用户信息
    menusService.getUserMenusByApp().$promise //根据应用获取用户菜单
    ]).then(function (result) {
      $log.debug('GirderPortalLoginService 集成调用', result);
      var token = result[0].data.ssoSessionId;
      var user = result[1];
      var menus = result[2];
      $log.debug('session=' + token, 'user=', user, 'menus', menus);
      Session.create(token, user, menus);
      $log.log('登录验证成功', Session);
      loginEvent.raiseUserLoginEvent(Session.user);
      return Session.user;
    }, function (err) {
      $log.error('GirderPortalLoginService获取用户登录信息失败', err);
      if (err.status === 400) {
        loginEvent.raiseUserLoginFailedEvent('获取用户登录信息失败:' + err.data.message);
        return;
      }
      //其他未知错误
      loginEvent.raiseUserLoginFailedEvent('系统正在维护，请稍后再试..');
    });
  };

  /**
   * 用户登出
   * @returns {*}
   */
  this.logout = function () {
    var account = Session.getUserAccount();
    $log.log('向服务端发起退出请求..', account);
    var sessionId = Session.getSessionId();
    //注销前台session
    Session.destroySession();
    return authServer.logoutSSO(sessionId).then(function () {
      $log.log('退出登录成功');
      loginEvent.raiseUserLogOutEvent();
    }, function (err) {
      loginEvent.raiseUserLogOutEvent();
    });
  };
}]);
/**
 * 登录控制事件服务
 *
 * 登录权限相关事件服务对象
 *
 * @author wuyf
 * @date 2015-10-14
 */
'use strict';
angular.module('girder.security.authorize.logon')
//安全认证服务
.service('GirderUserLoginEventService', ['$rootScope', '$log', 'AUTH_EVENTS', function ($rootScope, $log, AUTH_EVENTS) {

  /**
   * 广播用户登录事件
   * @param user
   */
  this.raiseUserLoginEvent = function (user) {
    $log.log('广播用户登录事件', user);
    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
  };

  /**
   * 广播用户登录错误事件
   * @param message
   */
  this.raiseUserLoginFailedEvent = function (message) {
    $log.log('广播用户登录系统错误事件', message);
    $rootScope.$broadcast(AUTH_EVENTS.loginFailed, message);
  };

  /**
   * 广播用户退出登录事件
   */
  this.raiseUserLogOutEvent = function () {
    $log.log('广播用户退出登录事件');
    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
  };

  /**
   * 当用户没有访问权限时，发布重定向请求，将用户重定向到登录界面
   */
  this.raiseRedirectToLoginEvent = function () {
    //注销前台session
    $log.log('广播用户登录重定向事件');
    //Session.destroySession();
    //重定向
    $rootScope.$broadcast(AUTH_EVENTS.redirectToLogin, null);
  };
}]);
/*
 *  组件名称：图片上传压缩
 *  功能说明：上传图片后，可以将压缩后的图片显示在界面上，并且可以设置图片压缩质量、压缩后的图片尺寸以及图片格式。
 *  使用方法：分为两部分
 *            1.文件选择部分：<input  girder-image-compress id="inputImage" type="file" accept="image/*" image="image1" resize-max-height="800"
 *              resize-max-width="800" resize-quality="0.9" resize-type="image/jpg"/>
 *            2.图片显示：<img ng-src="{{image1.compressed.dataURL}}" class="thumbnail"  ng-click="imgShow('image1')"/>
 *  参数说明： resize-max-height 保留图片最大高度，超过部分会被等比例缩放
 *             resize-max-width  保留图片最大宽度，超过部分会被等比例缩放
 *             resize-quality 参数的范围为0.1-1.0 不要使用1.0，速度很慢
 *             resize-type    参数默认image/jpeg 可选 image/png
 * 原地址:https://github.com/sammychl/ng-image-compress
 * @author yuanmz
 * @date 2016-01-12
 */
'use strict';

angular.module('girder.ui.imageModule.compress', []).directive('girderImageCompress', ['$q', function ($q) {
  var directive = {
    restrict: 'A',
    scope: {
      image: '=',
      resizeMaxHeight: '@?',
      resizeMaxWidth: '@?',
      resizeQuality: '@?',
      resizeType: '@?'
    },
    link: function postLink(scope, element, attrs) {
      var doResizing = function doResizing(imageResult, callback) {
        createImage(imageResult.url, function (image) {
          var dataURLcompressed = jicCompress(image, scope);
          imageResult.compressed = {
            dataURL: dataURLcompressed,
            type: dataURLcompressed.match(/:(.+\/.+);/)[1],
            getBlob: function getBlob() {
              return dataURItoBlob(this.dataURL);
            }
          };
          callback(imageResult);
        });
      };

      var applyScope = function applyScope(imageResult) {
        scope.$apply(function () {
          //console.log(imageResult);
          if (attrs.multiple) {
            scope.image.push(imageResult);
          } else {
            scope.image = imageResult;
          }
        });
      };

      element.bind('change', function (evt) {
        //when multiple always return an array of images
        if (attrs.multiple) {
          scope.image = [];
        }

        var files = evt.target.files;
        for (var i = 0; i < files.length; i++) {
          //create a result object for each file in files
          var imageResult = {
            file: files[i],
            url: URL.createObjectURL(files[i])
          };

          fileToDataURL(files[i]).then(function (dataURL) {
            imageResult.dataURL = dataURL;
          });

          if (scope.resizeMaxHeight || scope.resizeMaxWidth) {
            //resize image
            doResizing(imageResult, function (imageResult) {
              applyScope(imageResult);
            });
          } else {
            //no resizing
            applyScope(imageResult);
          }
        }
      });
    }
  };

  var URL = window.URL || window.webkitURL;

  var getResizeArea = function getResizeArea() {
    var resizeAreaId = 'fileupload-resize-area';

    var resizeArea = document.getElementById(resizeAreaId);

    if (!resizeArea) {
      resizeArea = document.createElement('canvas');
      resizeArea.id = resizeAreaId;
      resizeArea.style.visibility = 'hidden';
      document.body.appendChild(resizeArea);
    }

    return resizeArea;
  };

  //将base64转换为Blob
  var dataURItoBlob = function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  };

  /**
   * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
   * @param {Image} sourceImgObj The source Image Object
   * @param {Integer} quality The output quality of Image Object
   * @return {Image} result_image_obj The compressed Image Object
   */

  var jicCompress = function jicCompress(sourceImgObj, options) {
    var outputFormat = options.resizeType;
    var quality = options.resizeQuality * 100 || 70;
    var mimeType = 'image/jpeg';
    if (outputFormat !== undefined && outputFormat === 'png') {
      mimeType = 'image/png';
    }

    var maxHeight = options.resizeMaxHeight || 300;
    var maxWidth = options.resizeMaxWidth || 250;

    var height = sourceImgObj.height;
    var width = sourceImgObj.width;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round(height *= maxWidth / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round(width *= maxHeight / height);
        height = maxHeight;
      }
    }

    var cvs = document.createElement('canvas');
    cvs.width = width; //sourceImgObj.naturalWidth;
    cvs.height = height; //sourceImgObj.naturalHeight;
    var ctx = cvs.getContext('2d').drawImage(sourceImgObj, 0, 0, width, height);
    var newImageData = cvs.toDataURL(mimeType, quality / 100);
    var resultImageObj = new Image();
    resultImageObj.src = newImageData;
    return resultImageObj.src;
  };

  var resizeImage = function resizeImage(origImage, options) {
    var maxHeight = options.resizeMaxHeight || 300;
    var maxWidth = options.resizeMaxWidth || 250;
    var quality = options.resizeQuality || 0.7;
    var type = options.resizeType || 'image/jpg';

    var canvas = getResizeArea();

    var height = origImage.height;
    var width = origImage.width;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round(height *= maxWidth / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round(width *= maxHeight / height);
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;

    //draw image on canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage(origImage, 0, 0, width, height);

    // get the data from canvas as 70% jpg (or specified type).
    return canvas.toDataURL(type, quality);
  };

  var createImage = function createImage(url, callback) {
    var image = new Image();
    image.onload = function () {
      callback(image);
    };
    image.src = url;
  };

  var fileToDataURL = function fileToDataURL(file) {
    var deferred = $q.defer();
    var reader = new FileReader();
    reader.onload = function (e) {
      deferred.resolve(e.target.result);
    };
    reader.readAsDataURL(file);
    return deferred.promise;
  };

  return directive;
}]);
/*
 *  组件名称：图像查看
 * @author wuyf
 * @date 2016-01-12
 */
'use strict';

angular.module('girder.ui.imageModule.viewBox', []).service('imageViewBox', ['messageService', function (messageService) {

  /**
   * 显示图片
   * @param title     标题信息 可以为空
   * @param imageData 图片数据 支持url/data
   */
  this.showImage = function (title, imageData) {
    var modalDefaults = {
      keyboard: true,
      backdrop: true,
      modalFade: true,
      // size:'lg',
      templateUrl: 'girder/ui/image/imageViewBox/imageView.html'
    };

    var modalOptions = {
      headerText: title,
      imageData: imageData
    };
    return messageService.show(modalDefaults, modalOptions);
  };
}]);
/**
 * 左侧折叠导航(LeftNavMenu)菜单组件支持3级菜单导航
 *
 * @author wuyf
 * @date 2015-03-19
 */
'use strict';

angular.module('girder.ui.menu.left', []).directive('girderLeftNavMenu', ['$log', 'AuthService', function ($log, authService) {
  var directive = {
    templateUrl: 'girder/ui/menu/left/leftNavMenu.html', //left-nav-menu.html
    restrict: 'E',
    scope: {
      //在本地scope属性与parent scope属性之间设置双向的绑定
      menus: '=',
      autoExpandFirstMenus: '='
    },
    controller: 'girderLeftMenuController',
    //F5以后重新载入菜单
    link: function link(scope) {
      if (authService.isAuthenticated()) {
        //scope.isAuthenticated()) {
        scope.menus = authService.getMenus();
      }
    }
  };
  return directive;
}])
//菜单控制动作
.controller('girderLeftMenuController', ['$scope', '$log', '$location', 'AUTH_EVENTS', 'AuthService', function ($scope, $log, $location, AUTH_EVENTS, authService) {
  /**菜单激活Css*/
  var MENU_ITEM_ACTIVE_CSS = 'girderLeftNavMenu-foucs';

  /**栏目菜单激活状态*/
  $scope.status = {
    isItemOpen: []
  };

  /**
   * 自动监控菜单变化
   * @type {*|function()}
   */
  var autoExpandFirstMenusWatch = $scope.$watch('menus', function (newValue, oldValue) {
    $log.debug('girderLeftMenuController监控菜单变化 new=', newValue, 'old=', oldValue);
    if (angular.isDefined(newValue) && newValue !== null) {
      $scope.status.isItemOpen = new Array($scope.menus.length);
      setTimeout(function () {
        $log.debug('girderLeftMenuController自动展开一级菜单...');
        $scope.status.isItemOpen[0] = true;
        $scope.$apply();
      }, 50);
    } else {
      $scope.status.isItemOpen = [];
    }
  });

  //点击菜单时导航到指定菜单
  $scope.navigate = function (path) {
    if (path !== null && "" !== path && !angular.isUndefined(path)) {
      $log.debug('navigating to ' + path);
      $location.path(path);
    }
  };

  /**
   * 关闭监听
   */
  if ($scope.autoExpandFirstMenus !== true) {
    $log.debug('girderLeftMenuController不需要自动展开第一级菜单..');
    autoExpandFirstMenusWatch();
  }

  //响应用户成功登录事件
  $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
    $log.debug('girderLeftMenuController接收到loginSuccess事件', user);
    $scope.menus = authService.getMenus();
  });

  /**
   * 点击以后激活Item样式
   * @param event
   */
  $scope.active = function (event) {
    var target = event.target;
    $log.debug('获取target..', target);
    angular.element('#girderLeftMenus').find('.' + MENU_ITEM_ACTIVE_CSS).removeClass(MENU_ITEM_ACTIVE_CSS);
    angular.element(target).addClass(MENU_ITEM_ACTIVE_CSS);
  };
}]);
/**
 * 登录菜单组件-可以参考这里的实现进行本地化处理
 *
 * 控制应用登录以后转向/home 和 /login页面均由此控制
 *
 * @author wuyf
 * @date 2015-03-19
 */
'use strict';

angular.module('girder.ui.menu.loginToolBar', ['girder.security.account']).directive('girderLoginToolBar', [function () {
  var directive = {
    templateUrl: 'girder/ui/menu/logintoolbar/logintoolbar.html',
    restrict: 'E',
    controller: 'girderLoginToolBarController'
  };
  return directive;
}])
//登录相关动作控制
.controller('girderLoginToolBarController', ['$scope', '$log', '$location', 'AuthService', 'AUTH_EVENTS', 'girderPasswordService', function ($scope, $log, $location, authService, AUTH_EVENTS, passwordService) {
  //退出登录
  $scope.logout = function () {
    //不管后台是否提交成功，前台都退出
    authService.logout();
    //重定向到登录界面
    redirectToLogin();
  };

  //用户是否已经登录
  $scope.isLogon = function () {
    return authService.isAuthenticated();
  };

  //转向重新登录
  function redirectToLogin() {
    $log.debug('重定向到登录界面', $location.$$path);
    var path = '/login';
    $location.replace();
    $location.path(path);
  }

  //监听要求用户重新登录消息
  $scope.$on(AUTH_EVENTS.redirectToLogin, function () {
    $log.debug('接收到要求用户重新登录通知');
    redirectToLogin();
  });

  //显示用户中心
  $scope.showUserCenter = function () {
    var path = '/girder/security/account';
    $log.debug('转向到用户中心', path);
    $location.replace();
    $location.path(path);
  };
  //显示密码修改窗口
  $scope.showPasswordForm = function () {
    passwordService.showPasswordChangeForm();
  };
  /**
   * 响应用户成功登录事件
   */
  $scope.$on(AUTH_EVENTS.loginSuccess, function () {
    $log.debug('girderLoginToolBarController接收到loginSuccess事件,发起转向/home');
    var path = '/home';
    $location.path(path);
  });
}]);
/**
 * 页面顶端(TopMenu)菜单组件
 *
 * @author wuyf
 * @date 2015-03-19
 */
'use strict';

angular.module('girder.ui.menu.top', []).directive('girderTopMenu', ['AuthService', function (authService) {
  var directive = {
    templateUrl: 'girder/ui/menu/top/top-menu.html',
    restrict: 'E',
    scope: true,
    controller: 'girderTopMenuController',
    //F5以后重新载入菜单
    link: function link(scope) {
      if (authService.isAuthenticated()) {
        //scope.isAuthenticated()) {
        scope.menus = authService.getMenus();
      }
    }
  };
  return directive;
}])
//菜单控制动作
.controller('girderTopMenuController', ['$scope', '$log', 'AuthService', '$location', 'AUTH_EVENTS', function ($scope, $log, authService, $location, AUTH_EVENTS) {
  //初始化菜单
  $scope.menus = null;

  //点击菜单时导航到指定菜单
  $scope.navigate = function (path) {
    if (path !== null) {
      $log.debug('navigating to ' + path);
      $location.path(path);
    }
  };

  //响应用户成功登录事件
  $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
    $log.debug('girderTopMenuController接收到loginSuccess事件', user);
    $scope.menus = authService.getMenus();
  });
}]);