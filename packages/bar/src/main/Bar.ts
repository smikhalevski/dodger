import {Theme} from '@tenuous/theme';

declare module '@tenuous/theme/lib/Theme' {

  namespace Theme {

    interface Breakpoints {
      md: number;
      lg: number;
    }

    interface Colors {
      buttonPrimaryBg: string;
    }
  }
}

const theme = new Theme({
  breakpoints: {
    md: 123,
    lg: 123,
  },
  colors: {
    buttonPrimaryBg: '123',
  },
  grid: {
    step: 123,
  },
});

theme.color('buttonPrimaryBg')
theme.__colors.buttonPrimaryBg
