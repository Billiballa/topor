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
        let key = `${el.src}~${el.target}`;
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
    let ZRW, ZRH, GRect, GX, GY, GW, GH;

    this.zrender.on('mousedown', e => {
      //没有点击到任何图形 则开始整体拖拽
      if (!e.target) {
        moveStatus = true;
        lastPosition = [e.event.zrX, e.event.zrY];

        [ZRW, ZRH] = [this.zrender.getWidth(), this.zrender.getHeight()]
        GRect = this.root.getBoundingRect();
        [GX, GY, GW, GH] = [GRect.x, GRect.y, GRect.width, GRect.height];
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
        let [newPX, newPY] = [
          this.root.position[0] + e.event.zrX - lastPosition[0],
          this.root.position[1] + e.event.zrY - lastPosition[1]
        ];

        // 防止整体移出画布
        // 最大
        if (GX + newPX > ZRW) { newPX = ZRW - GX - 10 }
        if (GY + newPY > ZRH) { newPY = ZRH - GY - 10 }
        // 最小
        if (GX + GW + newPX < 0) { newPX = 0 - (GX + GW) + 10 }
        if (GY + GH + newPY < 0) { newPY = 0 - (GY + GH) + 10 }

        this.root.attr('position', [newPX, newPY]);

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
        position: [
          ex + ((px - ex) * (scale / sx)),
          ey + ((py - ey) * (scale / sy))
        ]
      }, 180)
    });
  }
}
