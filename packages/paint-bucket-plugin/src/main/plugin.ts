import {Color} from '@paint-bucket/core';
import {Theme} from 'tenuous';

const colorPlugin = () => new Map<keyof Theme.Colors, Color>();

Theme.setDefaultColors = (colors) => {
  Object.assign(Theme.defaults.colors ||= {}, colors);
};

Theme.prototype.color = function (this: Theme, name) {
  const state = this.getState(colorPlugin);

  let color = state.get(name);

  if (!color) {
    color = Color.parser(this.options.colors?.[name] ?? Theme.defaults.colors?.[name]);
    state.set(name, color);
  }

  return color.clone();
};
