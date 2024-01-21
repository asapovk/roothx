/* eslint-disable @typescript-eslint/no-var-requires */
export class LoadStore {
  static getStore() {
    if (LoadStore.store) {
      return this.store;
    } else {
      return new LoadStore();
    }
  }
  private isLoading: boolean = false;
  static store: LoadStore;

  public loadedStore: any;
  constructor() {
    this.isLoading = true;
    //this.loadedStore = require('../_redux/index').default;
    import(/*w Store*/ '../_redux/index').then((s) => {
      //@ts-ignore
      console.log(s.default);
      //@ts-ignore
      this.loadedStore = s.default;
      this.isLoading = false;
    });
  }
}
