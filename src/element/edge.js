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

  refreshLine(source, target) {
    const linePoints = this.getEdgePosition(source, target);
    if (linePoints) {
      this.line.show();
      this.line.attr({
        shape: {
          x1: linePoints.x1,
          y1: linePoints.y1,
          x2: linePoints.x2,
          y2: linePoints.y2,
        }
      })
    } else {
      this.line.hide();
    }
  }
  
  // 获取连线的起点终点坐标
  getEdgePosition(source, target) {
    const startR = this.getVertexOfNode(source)
    const endR = this.getVertexOfNode(target)
    const startP = this.getIntrOfRectAndLine(startR, [startR, endR]);
    const endP = this.getIntrOfRectAndLine(endR, [startR, endR]);
    if (startP && endP && (this.getEdgeLength(startR, startP) < this.getEdgeLength(startR, endP))) {
      return {
        x1: startP.x,
        y1: startP.y,
        x2: endP.x,
        y2: endP.y
      }
    }
  }

  // 获取节点的顶点
  getVertexOfNode(node) {
    const { x, y, width, height } = node
    return {
      x,
      y,
      width,
      height,
      points: [
        { x: x - width / 2, y: y - height / 2 },
        { x: x + width / 2, y: y - height / 2 },
        { x: x + width / 2, y: y + height / 2 },
        { x: x - width / 2, y: y + height / 2 }
      ]
    }
  }

  // 获取矩形和线段的交点
  getIntrOfRectAndLine(rect, line) {
    let point;

    for (let i = 0; i < rect.points.length; i++) {
      point = this.getIntrOfTwoLine(
        rect.points[i],
        rect.points[(i + 1) === rect.points.length ? 0 : (i + 1)],
        line[0],
        line[1],
      )
      if (point) {
        return point;
      }
    }
  }

  // 获取线段AB,CD的交点
  getIntrOfTwoLine(a, b, c, d) {
    // 三角形abc 面积的2倍 
    const area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
    // 三角形abd 面积的2倍 
    const area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
    // 面积符号相同则两点在线段同侧,不相交; 
    if (area_abc * area_abd > 0) {
      return false;
    }
    // 三角形cda 面积的2倍 
    const area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
    // 三角形cdb 面积的2倍（通过另外三个加减即可得出）
    const area_cdb = area_cda + area_abc - area_abd;
    if (area_cda * area_cdb > 0) {
      return false;
    }
    //计算交点坐标 
    const t = area_cda / (area_abd - area_abc);
    const dx = t * (b.x - a.x),
      dy = t * (b.y - a.y);
    return { x: a.x + dx, y: a.y + dy };
  }

  // 获取线段AB长度
  getEdgeLength(a, b) {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
    );
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
