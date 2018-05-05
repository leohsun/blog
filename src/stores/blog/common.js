import { observable, action } from 'mobx'

class CommonStore{
  @observable scrollTop = 0


  @action setScrollTop(num){
    this.scrollTop = num
  }
}


export default new CommonStore()