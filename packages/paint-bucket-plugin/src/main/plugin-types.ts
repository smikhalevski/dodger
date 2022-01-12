import {Color} from '@paint-bucket/core';
import {Theme} from 'tenuous';

declare module 'tenuous/Theme' {

  namespace Theme {

    interface Options {
      colors?: Partial<Colors>;
    }

    interface Colors {
    }

    function setDefaultColors(colors: Partial<Colors>): void;
  }

  interface Theme {

    /**
     * Returns the color by its name.
     */
    color(name: keyof Theme.Colors): Color;
  }
}
