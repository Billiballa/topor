const w = 800;
const h = 600;

const padding = 0.05;

const nodeData = Array(240).fill(1).map((item, i, arr) => ({
  id: `NODE_${i}`,
  attr: {
    x: w * (1 - 2 * padding) * ((i % 20) / 20) + w * padding,
    y: h * (1 - 2 * padding) * (parseInt(i / 20) / parseInt(arr.length / 20)) + h * padding,

    image: '/assets/logo.png',
    label: `node ${i + 1}`,
  },
  mode: {
    normal: {}
  },
  prop: {
    mode: 'normal'
  }
}))

const edgeData = nodeData.reduce((all, item, i) => all.concat({
  id: `EDGE_${i}`,
  type: 'edge',
  attr: {
    source: nodeData[i != 0 ? (i - 1) : (nodeData.length - 1)].id,
    target: item.id,

    label: `edge ${i + 1}`,
  },
  mode: {
    normal: {}
  },
  prop: {
    mode: 'normal'
  }
}), [])

export const data = {
  node: {
    attr: {
      imageSize: 24,
      labelHide: false,
      labelPosition: 'bottom',
      labelOffset: 0,
      labelFontSize: 12,
      labelColor: '#878787',
    },
    data: nodeData
  },
  edge: {
    attr: {
      lineWidth: 2,
      lineStyle: 'dashed',
      lineColor: '#6EADE5',
      arrow: 'none',
      labelHide: false,
      labelColor: '#878787',
    },
    data: edgeData
  }
}