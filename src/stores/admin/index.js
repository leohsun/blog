import { observable ,action ,} from 'mobx'

class adminStore {
  @observable loading = false

  @action setLoading = (val)=>{
    this.loading = val
  }
}

export default new adminStore