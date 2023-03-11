export class Keep<T> {
  private isMounted: boolean;

  private controller: T;
  public useController(sb: () => T, cb: (c: T) => void) {
    if (!this.isMounted) {
      this.controller = sb();
      this.isMounted = true;
    }
    cb(this.controller);

    return this.controller;
  }
}
