import {Theme} from 'tenuous';

declare module 'tenuous/Theme' {

  namespace Theme {

    interface Grid {
      step: number;
    }

    interface Breakpoints {}

    interface Colors {}

    interface Options {
      grid?: Grid;
      breakpoints: Breakpoints;
      colors: Colors;
    }
  }

  interface Theme {

    __colors: Theme.Colors;

    color(k: keyof Theme.Colors): string;

    breakpoint(k: keyof Theme.Breakpoints): number;

    mediaUp(k: keyof Theme.Breakpoints): string;

    mediaDown(k: keyof Theme.Breakpoints): string;

    mediaOnly(k: keyof Theme.Breakpoints): string;
  }
}

Theme.registerConstructor(function (this: Theme, options: Theme.Options) {
  this.__colors = options.colors;
});
