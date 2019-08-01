import zrender from 'zrender'
import BaseElement from './base';

/**
 * 图片类型元素
 * @extends BaseElement
 */
export default class NodeElement extends BaseElement {
  constructor(graph, data) {
    super(graph, data);
    this.type = 'node';
  }

  // 注册时调用
  static install(graph) {
    this.addEvent(graph);
  }

  static addEvent(graph) {
    let lastPosition; // 初始点击位置
    let moveNode = null // 被点击的节点

    graph.zrender.on('mousedown', e => {
      // 点击到节点 则开始拖拽
      if (
        e.target
        && e.target.parent
        && e.target.parent.toporType === 'node'
        && e.target.toporType !== "node-label"
      ) {
        moveNode = e.target.parent;
        lastPosition = [e.event.zrX, e.event.zrY];
      }
    });

    graph.zrender.on('mouseup', () => {
      moveNode = null;
    });

    // 防止鼠标移出画布后依然可以拖拽
    // graph.zrender.on('mouseout', () => {
    //   moveNode = null;
    // });

    graph.zrender.on('mousemove', e => {
      if (moveNode) {
        const scale = graph.root.scale[0];
        const [newPX, newPY] = [
          moveNode.position[0] + (e.event.zrX - lastPosition[0]) / scale,
          moveNode.position[1] + (e.event.zrY - lastPosition[1]) / scale
        ];

        // 触发更新
        moveNode.toporEl.setAttr({ x: newPX, y: newPY })
  
        // 对外发布移动事件 - 如果“线组件”监听了事件会同步修改
        moveNode.toporEl.emit('dragging', [e.event.zrX - lastPosition[0], e.event.zrY - lastPosition[1]]);

        lastPosition = [e.event.zrX, e.event.zrY];
      }
    });
  }

  init() {
    this.image = new zrender.Image();

    this.label = new zrender.Text({
      silent: true
    });

    this.group = new zrender.Group();

    this.group.add(this.image);
    this.group.add(this.label);

    this.root.add(this.group)

    this.group.toporEl = this;
    this.group.toporId = this.id;
    this.group.toporType = 'node';
    this.image.toporType = 'node-image'
    this.label.toporType = 'node-label'

    this.render();
  }

  render() {
    this.getFinalAttr();
    
    this.image.attr({
      style: {
        x: - this.finalAttr.imageSize / 2,
        y: - this.finalAttr.imageSize / 2,
        width: this.finalAttr.imageSize,
        height: this.finalAttr.imageSize,
        image: this.finalAttr.image
      },
      zlevel: 10
    });

    this.label.attr({
      style: {
        text: this.finalAttr.label,
        x: 0,
        y: (() => {
          switch(this.finalAttr.labelPosition) {
            case 'top':
              return - (this.finalAttr.imageSize / 2 + this.finalAttr.labelFontSize * 2)
            case 'middle':
              return - this.finalAttr.labelFontSize
            case 'bottom':
            default:
              return this.finalAttr.imageSize / 2
          }
        })() + this.finalAttr.labelOffset,
        fontSize: this.finalAttr.labelFontSize,
        textFill: this.finalAttr.labelColor,
        textAlign: 'center'
      },
      zlevel: 11
    })

    this.finalAttr.labelHide ? this.label.hide() : this.label.show();

    this.group.attr('position', [this.finalAttr.x, this.finalAttr.y]);
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
