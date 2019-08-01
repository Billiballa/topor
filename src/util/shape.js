/**
 * @file 
 * @desc 图形相关的计算函数
 */

/**
 * @func
 * @desc 获取连线的起点终点坐标
 * @export
 * @param {object} sourceNode 起点节点
 * @param {number} sourceNode.x
 * @param {number} sourceNode.y
 * @param {number} sourceNode.width
 * @param {number} sourceNode.height
 * @param {object} targetNode 终点节点
 * @param {number} targetNode.x
 * @param {number} targetNode.y
 * @param {number} targetNode.width
 * @param {number} targetNode.height
 * @returns {object} position 连线的位置
 * @returns {object} position.source 连线起点
 * @returns {object} position.target 连线终点
 */
export function getEdgePosition(sourceNode, targetNode) {
  const sourceRect = getVertexOfNode(sourceNode);
  const targetRect = getVertexOfNode(targetNode);
  const source = getIntrOfRectAndLine(sourceRect.points, [sourceRect, targetRect]);
  const target = getIntrOfRectAndLine(targetRect.points, [sourceRect, targetRect]);

  if (source && target && (getLineLength(sourceRect, source) < getLineLength(sourceRect, target))) {
    return {
      source,
      target
    }
  }
}

/**
 * @func
 * @desc 获取节点的顶点
 * @export
 * @param {object} node 节点
 * @param {number} node.x
 * @param {number} node.y
 * @param {number} node.width
 * @param {number} node.height
 * @returns {object} rect 节点的包围盒对象
 * @returns {object[]} rect.points 由节点顶点组成的数组
 */
export function getVertexOfNode(node) {
  const { x, y, imageSize } = node
  const half = imageSize / 2
  return {
    x,
    y,
    width: imageSize,
    height: imageSize,
    points: [
      { x: x - half, y: y - half },
      { x: x + half, y: y - half },
      { x: x + half, y: y + half },
      { x: x - half, y: y + half }
    ]
  }
}

/**
 * @func
 * @desc 获取矩形和线段的交点 用于计算节点包围盒和两节点中心点连线的交点，这是连线的实际端点
 * @export
 * @param {object[]} rectPoints 由矩形顶点组成的数组
 * @param {object} rectPoints.x
 * @param {object} rectPoints.y
 * @param {object[]} linePoints 由连线端点组成的数组
 * @param {number} linePoints.x
 * @param {number} linePoints.y
 * @returns {object} point 交点
 */
export function getIntrOfRectAndLine(rectPoints, linePoints) {
  let point;

  for (let i = 0; i < rectPoints.length; i++) {
    point = getIntrOfTwoLine(
      rectPoints[i],
      rectPoints[(i + 1) === rectPoints.length ? 0 : (i + 1)],
      linePoints[0],
      linePoints[1],
    )
    if (point) {
      return point;
    }
  }
}

/**
 * @func
 * @desc 获取线段AB,CD的交点
 * @export
 * @param {object} a AB起点
 * @param {object} b AB终点
 * @param {object} c CD起点
 * @param {object} d CD终点
 * @returns {object} intr 交点
 * @returns {number} intr.x
 * @returns {number} intr.y
 */
export function getIntrOfTwoLine(a, b, c, d) {
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

/**
 * @func
 * @desc 获取线段AB长度
 * @export
 * @param {object} a 起点
 * @param {number} a.x
 * @param {number} a.y
 * @param {object} b 终点
 * @param {number} b.x
 * @param {number} b.y
 * @returns {number} 线段长度
 */
export function getLineLength(a, b) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
  );
}

/**
 * @func
 * @desc 计算折线最长线段，返回起点终点坐标及线段长度
 * @export
 * @param {object[]} points 由折线上的点组成的数组
 * @param {number} points.x x坐标
 * @param {number} points.y y坐标
 * @returns {object} line 折线的最长线段
 * @returns {object} line.source 起点 同point
 * @returns {object} line.target 终点 同point
 * @returns {number} line.length 长度
 */
export function getLongestLine(points) {
  let source, target, length = 0;

  points.reduce((newSource, newTarget) => {
    let newLength = getLineLength(newSource, newTarget);

    if (newLength > length) {
      source = newSource;
      target = newTarget;
      length = newLength;
    }
  });

  return {
    source,
    target,
    length,
  }
}

/**
 * @func
 * @desc 计算连线的文本的位置
 * @export
 * @param {object} edge 连线
 * @param {object} edge.source 起点
 * @param {object} edge.target 终点
 * @param {object} label 连线的文本相关信息
 * @param {number} label.x 连线相对于线的x偏移
 * @param {number} label.y 连线相对于线的y偏移
 * @returns {object} position 连线文本的位置
 * @returns {number} position.x
 * @returns {number} position.y
 * @returns {number} position.rotate 旋转角度
 */
export function getLabelPositionOfEdge(edge, label) {
  let source = edge.source;
  let target = edge.target;
  // 若连线是从右侧指向左侧 则交换起始点后计算
  if (source.x > target.x) {
    source = edge.target;
    target = edge.source;
  }
  // 旋转角度
  const rotate = Math.atan2(target.y - source.y, target.x - source.x);
  // 连线的中心点
  const midP = {
    x: (target.x + source.x) / 2,
    y: (target.y + source.y) / 2
  }
  // 比例
  const lpb = (label.x / 2) / edge.length;
  const x = (midP.x - (target.x - source.x) * lpb) + label.y * Math.sin(rotate);
  const y = (midP.y - (target.y - source.y) * lpb) - label.y * Math.cos(rotate);
  return { x, y, rotate: - rotate } // zrender的旋转方向和原声canvas相反
}

export default {
  getEdgePosition,
  getVertexOfNode,
  getIntrOfRectAndLine,
  getIntrOfTwoLine,
  getLineLength,
  getLongestLine,
  getLabelPositionOfEdge,
}
