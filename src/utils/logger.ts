import {
  formatTime,
} from "./common";

const defaults = {
  colors: {
    error: "#F20404",
    req: "#9E9E9E",
    res: "#4CAF50",
    title: "inherit",
  },
  level: "log",
  logErrors: true,
  logger: console,
};

function printBuffer(logEntry, options) {
  const {
    logger,
    colors,
  } = options;

  const {
    title,
    started,
    req,
    res,
  } = logEntry;

  // Message
  const headerCSS = ["color: gray; font-weight: lighter;"];
  const styles = (s) => `color: ${s}; font-weight: bold`;

  // render
  logger.group(`%c ${title} @${formatTime(started)}`, ...headerCSS);
  logger.log("%c req", styles(colors.req), req);
  logger.log("%c res", styles(colors.res), res);
  logger.groupEnd();
}

/**
 * ILogEntry 日志条目
 */
interface ILogEntry {
  started?: object; // 触发时间
}

/**
 * 创建日志条目
 * @param options ILogEntry
 */
function createLogger(options: ILogEntry = {}) {
  const loggerOptions = Object.assign({}, defaults, options);
  const logEntry = options;
  logEntry.started = new Date();
  printBuffer(logEntry, Object.assign({}, loggerOptions));
}

export {
  defaults,
  createLogger,
};
