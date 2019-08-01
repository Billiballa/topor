function random(n, m) {
  let random = Math.floor(Math.random() * (m - n + 1) + n);
  return random;
}

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

      els: [
        {
          type: 'node',
          id: './TopoRoot/CustViews0001/TopoElement002',
          styles: {
            textWidth: 300,
            textSize: 12
          },

          attrs: {
            x: random(0, 600),
            y: random(0, 400),
            width: 35,
            height: 35,
            image: '/assets/logo.png',
            labelPosition: 'bottom',
            label: "LC_SW_2960_304",
            CNLabel: "",
            labelWidth: '',
            fontSize: 12,
            remark: '',

          },

          // $status: {
          //     severity: 0
          // }
        },

        {
          type: 'node',
          id: './TopoRoot/CustViews0001/TopoElement001',
          styles: {
            textWidth: 300,
            textSize: 12
          },

          attrs: {
            x: random(0, 600),
            y: random(0, 600),
            width: 35,
            height: 35,
            image: '/assets/logo.png',
            labelPosition: 'bottom',
            label: "LC_SW_2960_304",
            CNLabel: "",
            labelWidth: '',
            fontSize: 12,
            remark: '',
          },

          // $status: {
          //     severity: 0
          // }
        },

        {
          type: 'edge',
          id: './TopoRoot/CustViews0001/TopoElement003',

          styles: {
            lineWidth: 2,
            lineStyle: 'dashed', // dashed, solid
            arrow: 'none'
          },

          attrs: {
            source: './TopoRoot/CustViews0001/TopoElement001',
            sourcePort: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/Interface17765',
            sourceLabel: '端口(高级)',
            target: './TopoRoot/CustViews0001/TopoElement002',
            targetPort: './ResRoot/ResGroup1980/ciscoDevice11552/IndGroup11558/InterfaceBase11610',
            targetLabel: 'FastEthernet0/38',
            flowDependPath: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/InterfaceBase17763',
            dependPath: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/InterfaceBase17763',

          },

          // $status: {
          //     severity: 0
          // },
          //
          // $position: {
          //     index: 0,
          //     count: 3
          // },
        },

        {
          type: 'edge',
          id: './TopoRoot/CustViews0001/TopoElement004',

          styles: {
            lineWidth: 2,
            lineStyle: 'dashed', // dashed, solid
            arrow: 'start'
          },

          attrs: {
            source: './TopoRoot/CustViews0001/TopoElement001',
            sourcePort: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/Interface17765',
            sourceLabel: '端口(高级)',
            target: './TopoRoot/CustViews0001/TopoElement002',
            targetPort: './ResRoot/ResGroup1980/ciscoDevice11552/IndGroup11558/InterfaceBase11610',
            targetLabel: 'FastEthernet0/38',
            flowDependPath: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/InterfaceBase17763',
            dependPath: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/InterfaceBase17763',


          },

          // $status: {
          //     severity: 0
          // },
          //
          // $position: {
          //     index: 1,
          //     count: 3
          // },
        },

        {
          type: 'edge',
          id: './TopoRoot/CustViews0001/TopoElement005',

          styles: {
            lineWidth: 2,
            lineStyle: 'dashed', // dashed, solid
            arrow: 'both'
          },

          attrs: {
            source: './TopoRoot/CustViews0001/TopoElement001',
            sourcePort: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/Interface17765',
            sourceLabel: '端口(高级)',
            target: './TopoRoot/CustViews0001/TopoElement002',
            targetPort: './ResRoot/ResGroup1980/ciscoDevice11552/IndGroup11558/InterfaceBase11610',
            targetLabel: 'FastEthernet0/38',
            flowDependPath: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/InterfaceBase17763',
            dependPath: './ResRoot/ResGroup1980/ResGroup3041/ResGroup3042/RadwareDevice17758/InterfaceBase17763',
          },

          // $status: {
          //     severity: 0
          // },
          //
          // $position: {
          //     index: 2,
          //     count: 3
          // },
        }

      ]
    }
  }
}
