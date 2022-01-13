// @ts-nocheck
import * as util from "util";

function getLineNum() {
  var lines = Array.from(new Error().stack.matchAll(/.*\((.*)\)/g));
  return lines[2][1];
}

export function logger(obj: any) {
  return new Proxy(obj, {
    construct(clz, args, newTarget) {
      console.log(`INIT [${getLineNum()} ${obj.name}`);
      const constructed = Reflect.construct(clz, args, newTarget);
      return new Proxy(constructed, {
        get(target: any, propKey: any, receiver: any) {
          const targetValue = Reflect.get(target, propKey, receiver);
          if (typeof targetValue === "function") {
            const fn = function (...args2: any) {
              if (typeof propKey !== "symbol") {
                console.log(
                  `CALL [${getLineNum()}] ${
                    constructed.constructor.name
                  }.${propKey}(${util.inspect(args2, { depth: 0 })})`
                );
              }
              return Reflect.apply(targetValue, this, args2);
            };
            Object.defineProperty(fn, "name", {
              value: targetValue.name,
              configurable: true,
            });
            return fn;
          } else {
            return targetValue;
          }
        },
        set(target: any, propKey: any, val: any, receiver: any) {
          if (typeof propKey !== "symbol") {
            var lines = Array.from(new Error().stack.matchAll(/.*\((.*)\)/g));
            console.log(
              `SET [${getLineNum()}] ${
                constructed.constructor.name
              }.${propKey.toString()} = ${util.inspect(val, { depth: 0 })}`
            );
          }
          return Reflect.set(target, propKey, val, receiver);
        },
      });
    },
  });
}
