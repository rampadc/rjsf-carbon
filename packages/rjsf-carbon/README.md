# @rjsf/carbon

[![License][license-shield]][license-url]
[![NPM][npm-shield]][npm-url]

Carbon Design System theme, fields and widgets for react-jsonschema-form.

## Features

- Full integration with Carbon Design System components
- Support for common widgets and fields
- Support for array fields and nested objects
- Responsive styling

## Installation

```bash
npm install @rjsf/carbon @carbon/react sass@1.72.0
```

or

```bash
yarn add @rjsf/carbon @carbon/react sass@1.72.0
```

## Usage

```tsx
import { withTheme } from '@rjsf/core';
import { CarbonTheme } from '@rjsf/carbon';
import '@rjsf/carbon/style.css'; // Optional: Import default styles

const Form = withTheme(CarbonTheme);

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name'
    },
    age: {
      type: 'number',
      title: 'Age'
    }
  }
};

const MyForm = () => (
  <Form 
    schema={schema}
    onSubmit={console.log}
  />
);
```

## Supported Widgets

- Text (`TextWidget`)
- Select (`SelectWidget`)
- Checkbox (`CheckboxWidget`)
- Number (`NumberWidget`)
- Textarea (`TextareaWidget`)
- Date (`DateWidget`)

## Customization

You can customize the theme by:

1. Importing individual widgets/fields:
```tsx
import { TextWidget, NumberWidget } from '@rjsf/carbon';
```

2. Extending templates:
```tsx
import { ObjectFieldTemplate } from '@rjsf/carbon';
```

3. Using the Carbon theme props:
```tsx
const theme = {
  ...CarbonTheme,
  widgets: {
    ...CarbonTheme.widgets,
    CustomWidget: MyCustomWidget
  }
};

const Form = withTheme(theme);
```

## Dependencies

- React ≥ 17
- @carbon/react ≥ 1.0.0
- @rjsf/core ≥ 5.0.0
- @rjsf/utils ≥ 5.0.0
- sass ≥ 1.72.0

## Contributing

Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

Apache 2.0

[license-shield]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[license-url]: https://opensource.org/licenses/Apache-2.0
[npm-shield]: https://img.shields.io/npm/v/@rjsf/carbon
[npm-url]: https://www.npmjs.com/package/@rjsf/carbon