export class State<T> {
  private state: T;
  private contextFunction: Function;

  private setState = (value: T) => {
    this.state = value;
    this.contextFunction();
  };
  private isMounted: boolean;
  public useState(initialState: T, context: Function) {
    if (!this.isMounted) {
      this.isMounted = true;
      this.state = initialState;
      this.contextFunction = context;
    }

    return {
      state: this.state,
      setState: this.setState,
    };
  }
}
