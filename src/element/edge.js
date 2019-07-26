import zrender from 'zrender'
import constants from '../common/constants'
import BaseElement from './base';

/**
 * 线元素
 * @extends BaseElement
 */
export default class EdgeElement extends BaseElement {
  constructor(graph, data) {
    super(graph, data);
  }

  static install() {}

  /**
   * 渲染
   * @return {TopoNodeElement}
   */
  render() {
    BaseElement.prototype.render.call(this);

    // TODO @芊翔 - 下面代码只是简单示例,需要重写

    let { styles, attrs } = this.data;
    let global = this.graph._globalOptions;

    let { src, target } = attrs;
    let srcAttrs = this.graph.findDataById(src).attrs;
    let targetAttrs = this.graph.findDataById(target).attrs;

    this.line = new zrender.Line({
      shape: {
        x1: srcAttrs.x + srcAttrs.width / 2,
        y1: srcAttrs.y + srcAttrs.height / 2,
        x2: targetAttrs.x + targetAttrs.width / 2,
        y2: targetAttrs.y + targetAttrs.height / 2
      },

      style: {
        lineWidth: global.styles.lineWidth || styles.lineWidth,
        stroke: global.styles.lineColor
      },

      zlevel: constants.ZINDEX_LINE
    });

    this.root.add(this.line);

    // 初始化事件，因为要监听元素节点的事件，所以这里延迟等节点创建后监听
    let srcElement = this.graph.findElementById(src);
    let targetElement = this.graph.findElementById(target);
    // console.log('srcElement:', src, srcElement);
    // console.log('targetElement:', target, targetElement);

    // 节点元素拖动的时候, 线跟着动
    srcElement.on('dragging', () => {
      this.line.attr({
        shape: {
          x1: srcAttrs.x + srcAttrs.width / 2,
          y1: srcAttrs.y + srcAttrs.height / 2,
        }
      })
    });

    targetElement.on('dragging', () => {
      this.line.attr({
        shape: {
          x2: targetAttrs.x + targetAttrs.width / 2,
          y2: targetAttrs.y + targetAttrs.height / 2
        }
      })
    });

    return this;
  }

  updateStatus() {
    return this;
  }

  update() {
    return this;
  }

  dispose() {
    BaseElement.prototype.dispose.apply(this);
    this.root.remove(this.line);
    return this;
  }
}
