import Taro, {Component} from "@tarojs/taro";
import {BOYOCOMSHOST, ISMOCK, MAINHOST} from "../config/index";
import {commonParame, requestConfig} from "../config/requestConfig";
import Tips from "./tips";

// import { createLogger } from './logger'

declare type Methods = "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
// tslint:disable-next-line: interface-name
declare interface Headers {
  [key: string]: string;
}
// export const postMethods:Methods = 'POST' export const
// defaultPostHeaders:Headers ={'content-type':'application/json'}
const postMethods: Methods = "POST";
const postHeaders: Headers = {
  "content-type": "application/json",
};
export const defaultPostOpts = {
  header: postHeaders,
  method: postMethods,
};

// tslint:disable-next-line: interface-name
declare interface Datas {
  method: Methods;
  [key: string]: any;
}

// tslint:disable-next-line: interface-name
interface Options {
  data?: Datas;
  header?: Headers;
  host?: string;
  method?: Methods;
  url: string;
}

export class Request {
  // 登陆的promise
  public static loginReadyPromise: Promise < any > = Promise.resolve();
  // 正在登陆
  public static isLogining: boolean = false;
  // 导出的api对象
  public static apiLists: {
    [key: string]: () => any;
  } = {};
  // token
  public static token: string = "";

  // constructor(setting) { }
  /**
   * @static 处理options
   * @param {Options | string} opts
   * @param {Datas} data
   * @returns {Options}
   * @memberof Request
   */
  public static conbineOptions(opts, data: Datas, method: Methods): Options {
    // tslint:disable-next-line: no-unused-expression
    typeof opts === "string" && (opts = {
      url: opts,
    });

    let baseUrl = MAINHOST;
    console.log("..." + opts.url);
    if (opts.url === "/japi/toh") {
      baseUrl = MAINHOST;
    } else {
      baseUrl = BOYOCOMSHOST;
    }
    console.log(`baseUrl: ${baseUrl}`);

    return {
      data: {
        ...commonParame,
        ...opts.data,
        ...data,
      },
      header: opts.header,
      method: opts.method || data.method || method || "GET",
      url: `${opts.host || baseUrl}${opts.url}`,
    };
  }

  public static getToken() {
    // tslint:disable-next-line: no-unused-expression
    !this.token && (this.token = Taro.getStorageSync("token"));
    return this.token;
  }

  /**
   *
   * @static request请求 基于 Taro.request
   * @param {Options} opts
   */
  public static async request(opts: Options) {
    // token不存在 if (!this.getToken()) { await this.login() } token存在 let options =
    // Object.assign(opts, { header: { 'token': this.getToken() } })  Taro.request
    // 请求
    const res = await Taro.request(opts);
    // ----------------------------------------
    console.log(`opts: ${opts}`);
    console.log(opts);
    console.log(res);
    console.log(res.data.code);
    console.log(res.data.data);
    console.log(`res: ${res}`);
    console.log(`res: ${res.data.code}`);
    console.log(`banner: ${res.data.data}`);
    // ---------------------------------------- 是否mock
    if (ISMOCK) {
      return res.data;
    }

    // 登陆失效
    if (res.data.code === 99999) {
      await this.login();
      return this.request(opts);
    }

    // 请求成功 if (res.data && res.data.code === 0 || res.data.succ === 0) { return
    // res.data }
    if (res.data) {
      console.log("成功返回");
      console.log(res.data);
      return res.data;
    }

    // 请求错误
    const d = {
      ...res.data,
      err: (res.data && res.data.msg) || `网络错误～`,
    };
    Tips.toast(d.err);
    throw new Error(d.err);
  }

  /**
   *
   * @static 登陆
   * @returns  promise
   * @memberof Request
   */
  public static login() {
    if (!this.isLogining) {
      this.loginReadyPromise = this.onLogining();
    }
    return this.loginReadyPromise;
  }

  /**
   *
   * @static 登陆的具体方法
   * @returns
   * @memberof Request
   */
  public static onLogining() {
    this.isLogining = true;
    return new Promise(async (resolve, reject) => {
      // 获取code
      const {code} = await Taro.login();

      // 请求登录
      const {data} = await Taro.request({
        data: {
          code,
        },
        url: `${MAINHOST}${requestConfig.loginUrl}`,
      });

      if (data.code !== 0 || !data.data || !data.data.token) {
        reject(new Error("something bad happened"));
        return;
      }

      Taro.setStorageSync("token", data.data.token);
      this.isLogining = false;
      resolve();
    });
  }

  /**
   *
   * @static  创建请求函数
   * @param {(Options | string)} opts
   * @returns
   * @memberof Request
   */
  public static creatRequests(opts: Options | string): () => {} {
    console.log(opts);
    return async (data = {}, method: Methods = "GET") => {
      // tslint:disable-next-line: variable-name
      const _opts = this.conbineOptions(opts, data, method);
      console.log(JSON.stringify(_opts));
      const res = await this.request(_opts);
      // createLogger({ title: 'request', req: _opts, res: res })
      return res;
    };
  }

  /**
   *
   * @static 抛出整个项目的api方法
   * @returns
   * @memberof Request
   */
  /* eslint-disable no-shadow */
  // tslint:disable-next-line: variable-name
  public static getApiList(_requestConfig: any): any {
    if (!Object.keys(_requestConfig).length) {
      return {};
    }

    Object
      .keys(_requestConfig)
      .forEach((key) => {
        console.log(`getApiList:${key}`);
        const opts = _requestConfig[key];
        console.log(`getApiList.opts:${opts}`);
        console.log(`getApiList.opts.method:${opts.method}`);
        this.apiLists[key] = this.creatRequests(_requestConfig[key]);
      });

    return this.apiLists;
  }
}
/* eslint-enable no-shadow */
export function request(params: any) {
  return Taro
    .request(params)
    .then((res) => {
      if (res.statusCode === 200) {
        return res.data;
      } else {
        return Promise.reject(res);
      }
    });
}
// 导出
const Api = Request.getApiList(requestConfig);
Component.prototype.$api = Api;
export default Api as any;
