import zrender from 'zrender'
// import _ from 'lodash'

export default {
  install (topo) {
    const MapScale = 0.25;
    const glabelGroup = topo._global;
    
    const mapEl = document.createElement('div');
  
    const mStyle = mapEl.style;
    mStyle.position = 'absolute';
    mStyle.bottom = '10px';
    mStyle.right = '10px';
    mStyle.border = '1px solid #ccc';
    mStyle.background = '#fff';
  
    topo._el.appendChild(mapEl);
  
    const mapZr = zrender.init(mapEl, {
      renderer: 'canvas',
      width: topo.$zr.getWidth() * MapScale,
      height: topo.$zr.getHeight() * MapScale,
    });
  
    const mapGroup = new zrender.Group();
  
    mapGroup.silent = true;
    
    mapZr.add(mapGroup);
  
    glabelGroup.afterUpdate = _.debounce(updateMap, 300)
  
    function updateMap() {
      mapGroup.removeAll()
  
      glabelGroup.eachChild(child => {
        // 用自带克隆会堆栈溢出
        // mapGroup.add(zrender.util.clone(child));
        // mapGroup.add( _.cloneDeep(child));
        // 还可以用原始数据重新创建新的shape, 再加入到新group中
        // 可通过隐藏部分不需要在miniMap渲染的shape来提高性能
      });
  
      const { x, y, width, height } = mapGroup.getBoundingRect();
  
      mapZr.resize({ width: width * MapScale, height: height * MapScale });
      mapGroup.attr('scale', [MapScale, MapScale])
      mapGroup.attr('position', [-x * MapScale, -y * MapScale])
  
      mapZr.flush()
  
      // mapZr.painter
      //   .getRenderedCanvas()
      //   .toBlob(
      //     blob => window.open(window.URL.createObjectURL(blob)),
      //     'image/png'
      //   );
    }
  }
}