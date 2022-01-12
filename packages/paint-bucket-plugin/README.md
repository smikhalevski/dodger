# @tenuous/paint-bucket-plugin

[Paint Bucket](https://github.com/smikhalevski/paint-bucket) color manipulation plugin for
[Tenuous](https://github.com/smikhalevski/tenuous).

# Usage

Declare colors and defaults for the component:

```ts
import {ColorLike} from '@paint-bucket/core';
import {Theme} from 'tenuous';
import '@paint-bucket/css-plugin';
import '@tenuous/paint-bucket-plugin';

declare module 'tenuous/Theme' {

  namespace Theme {

    interface Colors {
      buttonBackground: ColorLike;
      buttonText: ColorLike;
    }
  }
}

Theme.setDefaultColors({
  buttonBackground: '#d4d4d4',
  buttonText: '#121212',
});
```

Create the new `Theme` and provide color overrides:

```ts
import {Theme} from 'tenuous';

const theme = new Theme({
  colors: {
    buttonText: '#000',
  },
});

theme.color('buttonBackground'); // → Color(#d4d4d4)
theme.color('buttonText'); // → Color(#000)
```
