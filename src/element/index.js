import NodeElement from './node'
import EdgeElement from './edge'

export default function initElements (topo) {
  topo.registerElement('node', NodeElement)
  topo.registerElement('edge', EdgeElement)
}