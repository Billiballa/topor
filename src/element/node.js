import zrender from 'zrender'
import constants from '../common/constants'
import BaseElement from './base';

/**
 * 图片类型元素
 * @extends BaseElement
 */
export default class NodeElement extends BaseElement {
  constructor(graph, data) {
    super(graph, data);
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

        moveNode.attr('position', [newPX, newPY]);

        // 同步修改 标准数据结构的数据
        moveNode.toporEl.data.attrs.x = newPX;
        moveNode.toporEl.data.attrs.y = newPY;
  
        // 对外发布移动事件 - 如果“线组件”监听了事件会同步修改
        moveNode.toporEl.emit('dragging', [e.event.zrX - lastPosition[0], e.event.zrY - lastPosition[1]]);

        lastPosition = [e.event.zrX, e.event.zrY];
      }
    });
  }

  render() {
    BaseElement.prototype.render.call(this);

    // TODO @芊翔 - 下面代码只是简单示例,需要重写

    this.group = new zrender.Group();
    this.root.add(this.group)

    let { styles, attrs } = this.data;
    let global = this.graph._globalOptions;

    this.image = new zrender.Image({
      // draggable: true,
      style: {
        x: 0,
        y: 0,
        width: attrs.width,
        height: attrs.height,
        image: attrs.image
      },

      zlevel: constants.ZINDEX_NODE
    });
    this.group.add(this.image);

    this.label = new zrender.Text({
      style: {
        text: attrs.label,
        x: attrs.width / 2,
        y: attrs.height,
        fontSize: attrs.textSize || global.styles.textSize,
        textFill: styles.textColor || global.styles.textColor,
        textAlign: 'center'
      }
    });
    this.group.add(this.label);

    this.group.attr('position', [attrs.x, attrs.y]);

    this.group.toporEl = this;
    this.group.toporId = this.id;
    this.group.toporType = 'node';
    this.image.toporType = 'node-image'
    this.label.toporType = 'node-label'

    // 上次移动的鼠标位置
    // let lastPos = null;

    // let mousedown = (e) => {
    //   lastPos = [e.event.clientX, e.event.clientY];

    //   window.addEventListener('mousemove', mousemove);
    //   window.addEventListener('mouseup', mouseup);
    // }

    // let mousemove = (e) => {
    //   // 计算鼠标位置变化
    //   let currPos = [e.clientX, e.clientY];
    //   let posDiff = [currPos[0] - lastPos[0], currPos[1] - lastPos[1]];

    //   // 同步修改分组下所有元素的坐标
    //   this.group.eachChild(function (item) {
    //     item.attr({
    //       style: {
    //         x: item.style.x + posDiff[0],
    //         y: item.style.y + posDiff[1]
    //       }
    //     })
    //   });

    //   lastPos = currPos;

    //   // 同步修改 标准数据结构的数据
    //   this.data.attrs.x = this.image.style.x;
    //   this.data.attrs.y = this.image.style.y;

    //   // 对外发布移动事件 - 如果“线组件”监听了事件会同步修改
    //   this.emit('dragging', posDiff);
    // };

    // // mouseup 释放所有事件
    // let mouseup = () => {
    //   window.removeEventListener('mousemove', mousemove);
    //   window.removeEventListener('mouseup', mouseup);
    // };

    // this.image.on('mousedown', mousedown);
  }

  /**
   * 更新状态
   * @param  {Object} status
   * @return {TopoNodeElement}
   */
  updateStatus(status) {
    // TODO 待实现
    console.log(status)
    return this;
  }

  /**
   * 更新数据
   * @return {TopoNodeElement}
   */
  update(data) {
    // TODO 待实现
    console.log(data)
    return this;
  }

  /**
   * 元素销毁
   * @return {TopoNodeElement}
   */
  dispose() {
    BaseElement.prototype.dispose.apply(this);
    this.group.removeAll();
    this.root.remove(this.group);
    this.group = null;
    this.image = null;

    return this;
  }
}
