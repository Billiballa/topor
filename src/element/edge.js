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

    this.group = new zrender.Group();
    this.root.add(this.group)

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

    this.label = new zrender.Text({
      style: {
        text: attrs.sourceLabel || attrs.targetLabel,
        x: 0,
        y: 0,
        fontSize: attrs.textSize || global.styles.textSize,
        textFill: styles.textColor || global.styles.textColor,
        textAlign: 'center'
      }
    });

    this.refreshEdgePosition(sourceAttrs, targetAttrs);

    this.group.add(this.line);
    this.group.add(this.label);

    this.group.toporEl = this;
    this.group.toporId = this.id;
    this.group.toporType = 'edge';
    this.line.toporType = 'edge-line'
    this.label.toporType = 'edge-label'

    // 连线随节点移动
    sourceElement.on('dragging', () => {
      this.refreshEdgePosition(sourceAttrs, targetAttrs);
    });

    targetElement.on('dragging', () => {
      this.refreshEdgePosition(sourceAttrs, targetAttrs);
    });

    return this;
  }

  // 刷新连线位置
  refreshEdgePosition(sourceNode, targetNode) {
    const linePoints = util.getEdgePosition(sourceNode, targetNode);
    if (linePoints) {
      const { source, target } = linePoints;
      const line = util.getLongestLine([sourceNode, targetNode])
      const labelPosition = util.getLabelPositionOfEdge(
        { 
          sourcePoint: line.source,
          targetPoint: line.target,
          length: line.length
        },
        {
          width: 0,
          height: 20
        }
      );
      this.line.attr({
        shape: {
          x1: source.x,
          y1: source.y,
          x2: target.x,
          y2: target.y,
        }
      })
      this.label.attr({
        style: {
          x: labelPosition.x,
          y: labelPosition.y,
        }
      })
      
      this.label.attr('origin', [labelPosition.x, labelPosition.y]);
      this.label.attr('rotation', labelPosition.rotate);


      this.line.show();
      this.label.show();
    } else {
      this.line.hide();
      this.label.hide();
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
    this.group.removeAll();
    this.root.remove(this.group);
    this.group = null;
    this.image = null;
    this.label = null;

    return this;
  }
}
