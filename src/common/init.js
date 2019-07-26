import zrender from 'zrender'
import initElement from '../element'
import initPlugin from '../plugins'

export default class InitMixin {
  _init() {
    this.$zr = zrender.init(this._el, this._option);

    this.createGlobalGroup()
    initElement(this)
    initPlugin(this)
  }

  // 整体group 用于整体拖拽缩放等
  createGlobalGroup() {
    this._global = new zrender.Group();
    this.$zr.add(this._global);

    this.addDragEvent();
    this.addZoomEvent();
  }

  // 添加整体拖拽
  addDragEvent() {
    let moveStatus = false; // 是否可以拖动
    let lastPosition; // 初始点击位置
    // let ZRW, ZRH, GRect, GX, GY, GW, GH;

    this.$zr.on('mousedown', e => {
      //没有点击到任何图形 则开始整体拖拽
      if (!e.target) {
        moveStatus = true;
        lastPosition = [e.event.zrX, e.event.zrY];

        // [ZRW, ZRH] = [this.$zr.getWidth(), this.$zr.getHeight()]
        // GRect = this._global.getBoundingRect();
        // [GX, GY, GW, GH] = [GRect.x, GRect.y, GRect.width, GRect.height];
      }
    });

    this.$zr.on('mouseup', () => {
      moveStatus = false;
    });

    // 防止鼠标移出画布后依然可以拖拽
    this.$zr.on('mouseout', () => {
      moveStatus = false;
    });

    this.$zr.on('mousemove', e => {
      if (moveStatus) {
        let [newPX, newPY] = [
          this._global.position[0] + e.event.zrX - lastPosition[0],
          this._global.position[1] + e.event.zrY - lastPosition[1]
        ];

        // // 防止整体移出画布
        // // 最大
        // if (GX + newPX > ZRW) { newPX = ZRW - GX - 10 }
        // if (GY + newPY > ZRH) { newPY = ZRH - GY - 10 }
        // // 最小
        // if (GX + GW + newPX < 0) { newPX = 0 - (GX + GW) + 10 }
        // if (GY + GH + newPY < 0) { newPY = 0 - (GY + GH) + 10 }

        this._global.attr('position', [newPX, newPY]);

        lastPosition = [e.event.zrX, e.event.zrY];

        this.$zr.refresh();
      }
    });
  }
  
  // 添加整体缩放
  addZoomEvent() {
    let scale = 1.0;

    this.$zr.on('mousewheel', e => {
      const [ex, ey] = [e.event.zrX, e.event.zrY]
      const [px, py] = this._global.position;
      const [sx, sy] = this._global.scale;
      const newScale = scale + e.wheelDelta / 10.0;

      // 控制缩放范围
      if (newScale < 0.2 || newScale > 5) return;

      scale = newScale;

      this._global.animateTo({
        scale: [scale, scale],
        position: [
          ex + ((px - ex) * (scale / sx)),
          ey + ((py - ey) * (scale / sy))
        ]
      }, 180)

      this.$zr.refresh();
    });
  }
}