import Taro from "@tarojs/taro";
/**
 * 提示与加载工具类
 */
export default class Tips {
  public static isLoading = false;

  /**
   * 信息提示
   */
  public static toast(title: string, onHide?: () => void) {
    Taro.showToast({
      duration: 1500,
      icon: "none",
      mask: true,
      title,
    });
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 500);
    }
  }
  /**
   * 弹出加载提示
   * @param title
   * @param force
   */
  public static loading(title = "加载中", force = false) {
    if (this.isLoading && !force) {
      return;
    }
    this.isLoading = true;
    if (Taro.showLoading) {
      Taro.showLoading({
        mask: true,
        title,
      });
    } else {
      Taro.showNavigationBarLoading();
    }
  }

  /**
   * 加载完毕
   */
  public static loaded() {
    let duration = 0;
    if (this.isLoading) {
      this.isLoading = false;
      if (Taro.hideLoading) {
        Taro.hideLoading();
      } else {
        Taro.hideNavigationBarLoading();
      }
      duration = 500;
    }
    // 隐藏动画大约500ms，避免后面直接toast时的显示bug
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  /**
   * 弹出提示框
   */
  public static success(title, duration = 1500) {
    Taro.showToast({
      duration,
      icon: "success",
      mask: true,
      title,
    });
    if (duration > 0) {
      return new Promise((resolve) => setTimeout(resolve, duration));
    }
  }
}
