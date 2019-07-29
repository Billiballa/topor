/**
 * @file 
 * @desc 通用函数
 */

import zrender from 'zrender'
import shape from './shape'

export default {
  ...zrender.util,

  ...shape,

  /**
   * @func
   * @desc Mixin模式
   * @param {object} mixins 要合并的类
   * @returns {object} 合并后的类
   * @example class A extends mix(B, C) {}
   */
  mix(...mixins) {
    function copyProperties(target, source) {
      for (let key of Reflect.ownKeys(source)) {
        if ( key !== 'constructor'
          && key !== 'prototype'
          && key !== 'name'
        ) {
          let desc = Object.getOwnPropertyDescriptor(source, key)
          Object.defineProperty(target, key, desc)
        }
      }
    }

    class Mix {
      constructor() {
        for (let mixin of mixins) {
          copyProperties(this, new mixin()) // 拷贝实例属性
        }
      }
    }

    for (let mixin of mixins) {
      copyProperties(Mix, mixin) // 拷贝静态属性
      copyProperties(Mix.prototype, mixin.prototype) // 拷贝原型属性
    }

    return Mix;
  }
}