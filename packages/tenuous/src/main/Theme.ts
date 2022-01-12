export namespace Theme {

  /**
   * The callback that returns the initial state of the plugin.
   */
  export type Plugin<S = void> = (this: Theme, options: Options) => S;

  /**
   * Options that are passed to the {@link Theme} constructor.
   */
  export interface Options {
  }
}

export class Theme {

  /**
   * The defaults that plugins may use to resolve missing options.
   */
  public static defaults = {} as unknown as Theme.Options;

  /**
   * Options that were provided to the {@link Theme} constructor.
   */
  protected options;

  /**
   * Internal state used by plugins.
   */
  private _stateMap: Map<Theme.Plugin, unknown> | undefined;

  /**
   * Creates the new {@link Theme} instance.
   *
   * @param options The theme options.
   */
  public constructor(options: Theme.Options) {
    this.options = options;
  }

  /**
   * Returns the cached state for the plugin.
   *
   * @param plugin The plugin to get state for.
   * @return The cached plugin state.
   */
  protected getState<S>(plugin: Theme.Plugin<S>): S {
    const stateMap = this._stateMap ||= new Map<Theme.Plugin, unknown>();

    if (stateMap.has(plugin)) {
      return stateMap.get(plugin) as S;
    }

    const state = plugin.call(this, this.options);
    stateMap.set(plugin, state);

    return state;
  }
}
