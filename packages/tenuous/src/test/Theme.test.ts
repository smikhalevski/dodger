import {Theme} from '../main';

describe('Theme', () => {

  test('computes extension state only once', () => {
    const state = {};
    const options: any = {};
    const extensionMock = jest.fn(() => state);

    (function(this: Theme) {

      expect(this.getState(extensionMock)).toBe(state);
      expect(this.getState(extensionMock)).toBe(state);

      expect(extensionMock).toHaveBeenCalledTimes(1);
      expect(extensionMock).toHaveBeenCalledWith(options);

    }).call(new Theme(options));
  });
});
