import util from '../util'
import EventMixin from '../common/event'

/**
 * 元素基类，主要用于声明 元素的共同的属性和方法
 * 共同属性：
 * graph:  容器实例
 * root: 根节点
 * data: 元素数据
 * id: 元素id
 * @extends EventMixin
 */
export default class BaseElement extends EventMixin{
  constructor(graph, data){
    super();
    this.graph = graph;
    this.root = graph.root;
    this.data = data;
    this.id = data.id;
  }

  init() {
    this.render()
  }

  render() {}

  getFinalAttr () {
    this.finalAttr = this.graph.getElAttr(this.type);
    util.merge(this.finalAttr, this.data.attr, true);
  }

  setAttr(newAttr) {
    util.merge(this.data.attr, newAttr, true);
    this.render();
  }

  setMode(mode) {
    console.log(mode)
  }

  dispose(){
    EventMixin.prototype.dispose.apply(this);
    return this;
  }
}
