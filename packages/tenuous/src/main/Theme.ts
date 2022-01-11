export namespace Theme {

  export interface Options {
  }
}

export class Theme {

  protected options;

  private static _constructors: Array<(options: Theme.Options) => void> = [];

  public static registerConstructor(constructor: (this: Theme, options: Theme.Options) => void): void {
    this._constructors.push(constructor);
  }

  public constructor(options: Theme.Options) {
    this.options = options;

    for (const constructor of Theme._constructors) {
      constructor.call(this, options);
    }
  }
}
