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

  render(){
    return this;
  }

  /**
   * 更新元素数据
   * @param  {Object} data
   * @return {BaseElement}
   */
  update(data){
    util.defaults(this.data, data)
    return this;
  }

  /**
   * 更新节点状态
   * @param  {Object} status
   * @return {BaseElement}
   */
  updateStatus(status){
    console.log(status)
    return this;
  }

  /**
   * 销毁元素
   */
  dispose(){
    EventMixin.prototype.dispose.apply(this);
    return this;
  }
}
