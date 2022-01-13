# Tenuous

Application theming through the prism of inversion of control.

# Problem

Let's assume you're developing a set of independent UI components that should share the same theming solution. For
example, `Button` and `Input` components are in separate packages and import a theme object from the shared dependency.
When using React, this may look something similar to this:

```ts
// ui-theme/index.ts

import {createContext, useContext} from 'react';

export const defaultTheme = {
  inputColor: 'pink',
  buttonColor: 'red',
};

export const ThemeContext = createContext(defaultTheme);

export function useTheme(): typeof defaultTheme {
  return useContext(ThemeContext);
}
```

```tsx
// ui-button/index.ts

import {FC, useContext} from 'react';
import {useTheme} from 'ui-theme';

export const Button: FC = (props) => {
  const theme = useTheme();

  return <button style={{color: theme.buttonColor}}>{props.children}</button>
};
```

```tsx
// ui-input/index.ts

import {VFC, useContext} from 'react';
import {useTheme} from 'ui-theme';

export const Input: VFC = () => {
  const theme = useTheme();

  return <input style={{color: theme.inputColor}}/>
};
```

Let's set up a new package for our app that only requires a `Button` and doesn't require `Input`.

```tsx
// app/index.ts

import {renderToString} from 'react-dom';
import {Button} from 'ui-button';
import {ThemeContext} from 'ui-theme';

renderToString(
    <ThemeContext.Provider value={{buttonColor: 'blue' /* Missing inputColor */}}>
      <Button>{'Ok'}</Button>
    </ThemeContext.Provider>
)
```

This would cause an error since `ThemeContext` value is missing the required `inputColor` property. This doesn't seem
yet to be an issue since we can add this property explicitly or use something like object spread.

```ts
const theme = {...defaultTheme, buttonColor: 'blue'};
```

But this reveals that by using a theme we introduced a coupling between components that don't depend on each other.

This coupling has side effects that may become a pain during maintenance and refactoring:

1. Deleting a UI component (for example, `Button`) would require modifications in the `defaultTheme` object;

2. Theme customization would require providing unused properties to the theme object. In the example above, this is done
   explicitly. In other cases, we could use the "default theme" as a fallback;

3. Default values are separated from the component that would rely on them. If we place the default values in the
   component module, the theme would depend on the component, which introduces even more coupling.

Let's review possible fixes:

1. Let each component have its own theme. While this may be a viable solution while there's a couple of components,
   things would really blow out of proportion when there are hundreds of components.

2. Give up theme typing and use it as a bag of properties. Using theme, refactoring components and maintenance won't
   come easy in this case. Who really wants to give up type checking anyway?

3. Make theme very abstract with as few typed component-specific parameters as possible. This can be a great solution
   and [Material UI](https://github.com/smikhalevski/tenuous) can be a good example of this approach.

# Solution

Tenuous is more of a concept than a library. It uses
[TypeScript declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) for theme typing
and plugin architecture to extend core functionality and provide defaults.

The idea is to make components extend theme types and provide defaults.

Let's revisit the example from the previous section and rewrite components using Tenuous approach
with `@tenuous/paint-bucket-plugin`.

```ts
// ui-theme/index.ts

import {createContext, useContext} from 'react';
import {Theme} from 'tenuous';
import '@tenuous/paint-bucket-plugin';

export const ThemeContext = createContext(new Theme({}));

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
```

```tsx
// ui-button/index.ts

import {FC, useContext} from 'react';
import {useTheme} from 'ui-theme';
import {Theme} from 'tenuous';
import {ColorLike} from 'paint-bucket';

declare module 'tenuous/Theme' {

  namespace Theme {

    interface Colors {
      buttonColor: ColorLike;
    }
  }
}

Theme.setDefaultColors({
  buttonColor: 'red',
});

export const Button: FC = (props) => {
  const theme = useTheme();

  return <button style={{color: theme.color('buttonColor')}}>{props.children}</button>
};
```

```tsx
// ui-input/index.ts

import {FC, useContext} from 'react';
import {useTheme} from 'ui-theme';
import {Theme} from 'tenuous';
import {ColorLike} from 'paint-bucket';

declare module 'tenuous/Theme' {

  namespace Theme {

    interface Colors {
      inputColor: ColorLike;
    }
  }
}

Theme.setDefaultColors({
  inputColor: 'pink',
});

export const Input: VFC = () => {
  const theme = useContext(ThemeContext);

  return <input style={{color: theme.color('inputColor')}}/>
};
```

We have moved theme typings and defaults to the component packages. Now if we import `Button` component only, `Theme`
won't know anything about the `Input` component.

```tsx
// app/index.ts

import {renderToString} from 'react-dom';
import {Button} from 'ui-button';
import {ThemeContext} from 'ui-theme';

renderToString(
    <ThemeContext.Provider value={{buttonColor: 'blue'}}>
      <Button>{'Ok'}</Button>
    </ThemeContext.Provider>
)
```
