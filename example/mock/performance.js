const w = 800;
const h = 600;

const padding = 0.05;

const nodeData = Array(240).fill(1).map((item, i, arr) => ({
  id: `node-${i}`,
  type: 'node',
  styles: {
    textWidth: 300,
    textSize: 12
  },
  attrs: {
    x: w * (1 - 2 * padding) * ((i % 20) / 20) + w * padding,
    y: h * (1 - 2 * padding) * (parseInt(i / 20) / parseInt(arr.length / 20)) + h * padding,
    width: 24,
    height: 24,
    image: '/assets/logo.png',
    labelPosition: 'bottom',
    label: `node ${i + 1}`,
    CNLabel: "",
    labelWidth: '',
    fontSize: 12,
    remark: '',
  },
}))

const edgeData = nodeData.reduce((all, item, i) => all.concat({
  id: `edge-${i}`,
  type: 'edge',
  styles: {
    lineWidth: 2,
    lineStyle: 'dashed', // dashed, solid
    arrow: 'none'
  },
  attrs: {
    label: `edge ${i + 1}`,
    source: nodeData[i != 0 ? (i - 1) : (nodeData.length - 1)].id,
    sourcePort: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/Interface17765',
    sourceLabel: '端口(高级)',
    target: item.id,
    targetPort: './ResRoot/ResGroup1980/ciscoDevice11552/IndGroup11558/InterfaceBase11610',
    targetLabel: 'FastEthernet0/38',
    flowDependPath: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/InterfaceBase17763',
    dependPath: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/InterfaceBase17763',
  },
}), [])

/**
 * 随机生成简单自动拓扑数据
 * @type {Object}
 */
export default {
  data() {
    return {
      styles: {
        backgroundColor: '#666',
        backgroundImage: '',
        backgroundRepeat: true,
        backgroundSize: 100,
        textWidth: 300,
        textSize: 10,
        textColor: '#878787',
        lineColor: '#6EADE5'
      },

      attrs: {
        labelVisible: true,
        tooltip: true,
        border: true,
        hostVisible: true,
        virtualIdVisible: true,
        virtualLabelVisible: true,
        labelType: 'label', // label, cnlabel
      },

      els: [].concat(nodeData, edgeData)
    }
  }
}
