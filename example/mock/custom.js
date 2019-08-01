let id = 0

function getId () {
  return ++id
}

function random(n, m) {
  let random = Math.floor(Math.random() * (m - n + 1) + n);
  return random;
}

export default function mock() {
  const [aId, bId, cId] = ['NODE_' + getId(), 'NODE_' + getId(), 'EDGE_' + getId()]
  return {
    node: {
      attr: {
        imageSize: 36,
        labelHide: false,
        labelPosition: 'bottom',
        labelOffset: 6,
        labelFontSize: 12,
        labelColor: '#878787',
      },
      data: [
        {
          id: aId,
          attr: {
            x: random(0, 600),
            y: random(0, 400),
      
            image: '/assets/logo.png',
      
            label: aId,
          },
          mode: {
            normal: {}
          },
          prop: {
            mode: 'normal'
          }
        },
        {
          id: bId,
          attr: {
            x: random(0, 600),
            y: random(0, 400),
      
            image: '/assets/logo.png',
      
            label: bId,
          },
          mode: {
            normal: {}
          },
          prop: {
            mode: 'normal'
          }
        }
      ]
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
      data: [
        {
          id: cId,
          attr: {
            source: aId,
            target: bId,
      
            label: cId,
            sourceLabel: aId,
            targetLabel: bId,
          },
          mode: {
            normal: {}
          },
          prop: {
            mode: 'normal'
          }
        }
      ]
    }
  }
}
