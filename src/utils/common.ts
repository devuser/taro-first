export const repeat = (str = "0", times) => (new Array(times + 1)).join(str);
// 时间前面 +0
export const pad = (num, maxLength = 2) => repeat("0", maxLength - num.toString().length) + num;
/** 时间格式的转换 */
// tslint:disable-next-line: max-line-length
export const formatTime = (time) => `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}.${pad(time.getMilliseconds(), 3)}`;

// @todo: 之前是var类型
export const globalData: any = {}; // 全局公共变量

/**
 * 校验手机号是否正确
 * @param phone 手机号
 */

export const verifyPhone = (phone) => {
  const reg = /^1[34578][0-9]{9}$/;
  // tslint:disable-next-line:variable-name
  const _phone = phone.toString().trim();
  const toastStr = _phone === "" ? "手机号不能为空~" : !reg.test(_phone) && "请输入正确手机号~";
  return {
    done: !toastStr,
    errMsg: toastStr,
    value: _phone,
  };
};

export const verifyStr = (str, text) => {
  // tslint:disable-next-line:variable-name
  const _str = str.toString().trim();
  const toastStr = _str.length ? false : `请填写${text}～`;
  return {
    done: !toastStr,
    errMsg: toastStr,
    value: _str,
  };
};

// 截取字符串

export const sliceStr = (str, sliceLen) => {
  if (!str) { return ""; }
  let realLength = 0;
  const len = str.length;
  let charCode = -1;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
    if (realLength > sliceLen) {
      return `${str.slice(0, i)}...`;
    }
  }

  return str;
};

/**
 * JSON 克隆
 * @param {Object | Json} jsonObj json对象
 * @return {Object | Json} 新的json对象
 */
export function objClone(jsonObj) {
  let buf;
  if (jsonObj instanceof Array) {
    buf = [];
    let i = jsonObj.length;
    while (i--) {
      buf[i] = objClone(jsonObj[i]);
    }
    return buf;
  } else if (jsonObj instanceof Object) {
    buf = {};
    // tslint:disable-next-line:forin
    for (const k in jsonObj) {
      buf[k] = objClone(jsonObj[k]);
    }
    return buf;
  } else {
    return jsonObj;
  }
}
