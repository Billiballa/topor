import zrender from 'zrender'
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
    this.type = 'edge';
  }

  static install() {}
  
  init () {
    this.line = new zrender.Line();
    this.label = new zrender.Text({
      silent: true
    });

    this.group = new zrender.Group();

    this.group.add(this.line);
    this.group.add(this.label);

    this.root.add(this.group)

    this.group.toporEl = this;
    this.group.toporId = this.id;
    this.group.toporType = 'edge';
    this.line.toporType = 'edge-line'
    this.label.toporType = 'edge-label'

    this.render()
  }

  render() {
    this.getFinalAttr();

    this.line.attr({
      style: {
        lineWidth: this.finalAttr.lineWidth,
        stroke: this.finalAttr.lineColor,
        lineDash: this.finalAttr.lineStyle === 'dashed' ? [5, 5] : null
      },
      zlevel: 1
    });

    this.label.attr({
      style: {
        text: this.finalAttr.label,
        fontSize: this.finalAttr.textSize,
        textFill: this.finalAttr.labelColor,
        textAlign: 'center',
        textVerticalAlign: 'middle'
      },
      zlevel: 2
    });

    const sourceElement = this.graph.findElementById(this.finalAttr.source);
    const targetElement = this.graph.findElementById(this.finalAttr.target);

    const handleRefresh = () => {
      const sourceAttrs = sourceElement.finalAttr;
      const targetAttrs = targetElement.finalAttr;

      this.refreshEdgePosition(sourceAttrs, targetAttrs);
    }

    // 连线随节点移动
    sourceElement.on('dragging', handleRefresh);

    targetElement.on('dragging', handleRefresh);

    handleRefresh();
  }

  // 刷新连线位置
  refreshEdgePosition(sourceNode, targetNode) {
    const linePoints = util.getEdgePosition(sourceNode, targetNode);
    if (linePoints) {
      const { source, target } = linePoints;
      this.line.attr({
        shape: {
          x1: source.x,
          y1: source.y,
          x2: target.x,
          y2: target.y,
        }
      })
      this.line.show();
      if (!this.finalAttr.labelHide) {
        const labelPosition = util.getLabelPositionOfEdge(
          util.getLongestLine([source, target]),
          { x: 0, y: 10 }
        );

        this.label.attr({
          style: {
            x: labelPosition.x,
            y: labelPosition.y,
          }
        });
  
        this.label.attr('origin', [labelPosition.x, labelPosition.y]);
        this.label.attr('rotation', labelPosition.rotate);
        this.label.show();
      } else {
        this.label.hide();
      }

    } else {
      this.line.hide();
      this.label.hide();
    }
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
