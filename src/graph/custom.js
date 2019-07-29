import BaseGraph from './base'


export default class CustomGraph extends BaseGraph {
  constructor(dom, options) {
    super(dom, options)

    this.addDragEvent();
    this.addZoomEvent();
  }

  update(data) {
    return BaseGraph.prototype.data.call(this, data);
  }

  render(data) {
    // 自定义拓扑，计算连线的索引和总数
    this.refreshLineIndexs(data.els);

    // 转化成标准数据后，通过基类渲染
    return BaseGraph.prototype.render.call(this, data);
  }

  // 更新连线索引 - 两个节点之间要是有多条连线，需要根据索引和总数来确定当前连线的曲线位置
  // 计算 $position 属性
  refreshLineIndexs(els) {
    let countMap = {};
    for (let el of els) {
      if (el.type === 'line') {
        let key = `${el.source}~${el.target}`;
        if (!countMap[key]) {
          countMap[key] = [];
        }
        countMap[key].push(el);
      }
    }

    for (let key in countMap) {
      let lines = countMap[key];
      for (let i = 0; i < lines.length; i++) {
        lines[i].$position = {
          index: i,
          count: lines.length
        }
      }
    }
  }

  // 添加整体拖拽
  addDragEvent() {
    let moveStatus = false; // 是否可以拖动
    let lastPosition; // 初始点击位置

    this.zrender.on('mousedown', e => {
      //没有点击到任何图形 则开始整体拖拽
      if (!e.target) {
        moveStatus = true;
        lastPosition = [e.event.zrX, e.event.zrY];
      }
    });

    this.zrender.on('mouseup', () => {
      moveStatus = false;
    });

    // 防止鼠标移出画布后依然可以拖拽
    this.zrender.on('mouseout', () => {
      moveStatus = false;
    });

    this.zrender.on('mousemove', e => {
      if (moveStatus) {
        let [PX, PY] = [
          this.root.position[0] + e.event.zrX - lastPosition[0],
          this.root.position[1] + e.event.zrY - lastPosition[1]
        ];

        this.root.attr('position', this.filterMoveBoundary(this, [PX, PY]));

        lastPosition = [e.event.zrX, e.event.zrY];
      }
    });
  }
  
  // 添加整体缩放
  addZoomEvent() {
    let scale = 1.0;

    this.zrender.on('mousewheel', e => {
      const [ex, ey] = [e.event.zrX, e.event.zrY]
      const [px, py] = this.root.position;
      const [sx, sy] = this.root.scale;
      const newScale = scale + e.wheelDelta / 10.0;

      // 控制缩放范围
      if (newScale < 0.2 || newScale > 5) return;

      scale = newScale;

      this.root.animateTo({
        scale: [scale, scale],
        position: this.filterMoveBoundary (this, [
          ex + ((px - ex) * (scale / sx)),
          ey + ((py - ey) * (scale / sy))
        ])
      }, 180)
    });
  }

  // 根据移动边界，计算新的position，防止内容移动到离画布过远的位置
  filterMoveBoundary (graph, [PX, PY]) {
    const MOVE_PADDING = 100; // 边界大小
    const [ZRW, ZRH] = [graph.zrender.getWidth(), graph.zrender.getHeight()] // 画布大小
    const RRect = graph.root.getBoundingRect(); // root盒
    const [RX, RY, RW, RH] = [RRect.x, RRect.y, RRect.width, RRect.height];
    const RS = graph.root.scale[0]; // root缩放
    let [safePX, safePY] = [PX, PY];
    // 最大
    if (RX * RS + PX > ZRW - MOVE_PADDING) { safePX = ZRW - MOVE_PADDING - (RX * RS) }
    if (RY * RS + PY > ZRH - MOVE_PADDING) { safePY = ZRH - MOVE_PADDING - (RY * RS) }
    // 最小
    if ((RX + RW) * RS + PX < MOVE_PADDING) { safePX = MOVE_PADDING - ((RX + RW) * RS) }
    if ((RY + RH) * RS + PY < MOVE_PADDING) { safePY = MOVE_PADDING - ((RY + RH) * RS) }
    return [safePX, safePY];
  }
}
