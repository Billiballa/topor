import zrender from 'zrender'
import constants from '../common/constants'
import BaseElement from './base';
import util from '../util'

/**
 * @export
 * @class EdgeElement
 * @classdesc 连线元素
 * @extends {BaseElement}
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

    const { styles, attrs } = this.data;
    const global = this.graph._globalOptions;

    const { source, target } = attrs;

    const sourceElement = this.graph.findElementById(source);
    const targetElement = this.graph.findElementById(target);
    const sourceAttrs = this.graph.findDataById(source).attrs;
    const targetAttrs = this.graph.findDataById(target).attrs;

    this.line = new zrender.Line({
      shape: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      },

      style: {
        lineWidth: global.styles.lineWidth || styles.lineWidth,
        stroke: global.styles.lineColor
      },

      zlevel: constants.ZINDEX_LINE
    });

    this.refreshLine(sourceAttrs, targetAttrs);

    this.root.add(this.line);

    // 连线随节点移动
    sourceElement.on('dragging', () => {
      this.refreshLine(sourceAttrs, targetAttrs);
    });

    targetElement.on('dragging', () => {
      this.refreshLine(sourceAttrs, targetAttrs);
    });

    return this;
  }

  // 刷新连线位置
  refreshLine(source, target) {
    const linePoints = util.getEdgePosition(source, target);
    if (linePoints) {
      this.line.show();
      this.line.attr({
        shape: {
          x1: linePoints.source.x,
          y1: linePoints.source.y,
          x2: linePoints.target.x,
          y2: linePoints.target.y,
        }
      })
    } else {
      this.line.hide();
    }
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
