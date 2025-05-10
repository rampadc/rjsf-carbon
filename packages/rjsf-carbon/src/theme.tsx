import React, { FormEvent, ReactElement } from 'react';
import {
  WidgetProps,
  FieldTemplateProps,
  ObjectFieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  RegistryWidgetsType,
  TemplatesType,
  IconButtonProps,
  SubmitButtonProps,
  ArrayFieldTemplateProps,
  ErrorListProps,
  BaseInputTemplateProps,
  ariaDescribedByIds,
  TitleFieldProps,
  DescriptionFieldProps,
  GridTemplateProps,
} from '@rjsf/utils';
import { FormProps, IChangeEvent, ThemeProps } from '@rjsf/core';
import {
  TextInput,
  Select,
  SelectItem,
  Checkbox,
  NumberInput,
  TextArea,
  DatePicker,
  DatePickerInput,
  Stack,
  ComboBox,
  Button,
  Tile,
  Slider,
  RadioButton,
  InlineNotification,
  Column,
  Grid,
} from '@carbon/react';
import { Add } from '@carbon/icons-react';

interface EnumOption {
  label: string;
  value: string;
}

interface ComboBoxItem {
  id: string;
  text: string;
}

// Match Carbon's ComboBox onChange type signature
type OnChangeData<T> = {
  selectedItem?: T | null;
  [key: string]: any;
};

function TextWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, required, label, value, onChange, disabled, readonly, placeholder, schema } = props;
  const displayLabel = label || schema.title || '';

  return (
    <TextInput
      id={id}
      labelText={displayLabel}
      value={value || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      required={required}
      disabled={disabled || readonly}
      placeholder={placeholder || schema?.default?.toString() || 'Enter value'}
      helperText={schema?.description?.toString()}
    />
  );
}

function SelectWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, required, label, value, onChange, options, disabled, readonly, schema, onBlur, onFocus } = props;
  const { enumOptions, emptyValue } = options;
  const displayLabel = label || schema.title || '';

  const handleChange = (nextValue: any) => onChange(nextValue === '' ? emptyValue : nextValue);
  const handleBlur = () => onBlur && onBlur(id, value);
  const handleFocus = () => onFocus && onFocus(id, value);

  if ((enumOptions as EnumOption[]).length > 10) {
    const items: ComboBoxItem[] = (enumOptions as EnumOption[]).map((option) => ({
      id: option.value,
      text: option.label,
    }));

    const selectedItem =
      items.find((item) => item.id === value) || (value ? { id: value.toString(), text: value.toString() } : null);

    return (
      <ComboBox
        id={id}
        titleText={displayLabel}
        placeholder={schema?.default?.toString() || 'Select or enter value'}
        items={items}
        selectedItem={selectedItem}
        itemToString={(item: ComboBoxItem | null) => (item ? item.text : '')}
        onChange={(data: OnChangeData<ComboBoxItem>) => {
          if (data.selectedItem) {
            handleChange(data.selectedItem.id);
          }
        }}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled || readonly}
        helperText={schema?.description?.toString()}
        aria-describedby={ariaDescribedByIds<T>(id)}
        allowCustomValue
      />
    );
  }

  return (
    <Select
      id={id}
      labelText={displayLabel}
      value={value || ''}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      required={required}
      disabled={disabled || readonly}
      helperText={schema?.description?.toString()}
      aria-describedby={ariaDescribedByIds<T>(id)}
    >
      <SelectItem value='' text='Choose an option' />
      {(enumOptions as EnumOption[]).map((option) => (
        <SelectItem key={option.value} value={option.value} text={option.label} />
      ))}
    </Select>
  );
}

function CheckboxWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, label, value, onChange, disabled, readonly, schema, onBlur, onFocus } = props;
  const displayLabel = label || schema.title || '';

  return (
    <div className='cds--form-item'>
      <Checkbox
        id={id}
        labelText={displayLabel}
        checked={value || false}
        onChange={(_: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean; id: string }) => {
          onChange(data.checked);
        }}
        onBlur={() => onBlur && onBlur(id, value)}
        onFocus={() => onFocus && onFocus(id, value)}
        disabled={disabled || readonly}
        aria-describedby={ariaDescribedByIds<T>(id)}
      />
      {schema?.description && <div className='cds--form__helper-text'>{schema.description.toString()}</div>}
    </div>
  );
}

function NumberWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const {
    id,
    required,
    label,
    value,
    onChange,
    disabled,
    readonly,
    schema,
    placeholder,
    rawErrors = [],
    onBlur,
    onFocus,
    options,
  } = props;
  const displayLabel = label || schema.title || '';

  const handleChange = (_event: React.MouseEvent<HTMLButtonElement>, state: { value: string | number }) => {
    if (state.value === '') {
      onChange(options.emptyValue);
      return;
    }
    const numericValue = typeof state.value === 'string' ? parseFloat(state.value) : state.value;
    onChange(numericValue);
  };

  return (
    <div className='cds--form-item'>
      <NumberInput
        id={id}
        label={displayLabel}
        value={value}
        onChange={handleChange}
        onBlur={() => onBlur && onBlur(id, value)}
        onFocus={() => onFocus && onFocus(id, value)}
        required={required}
        disabled={disabled || readonly}
        invalid={rawErrors.length > 0}
        invalidText={rawErrors.join('. ')}
        helperText={schema?.description?.toString()}
        placeholder={placeholder || schema?.default?.toString()}
        step={schema.multipleOf || 1}
        min={schema.minimum as number}
        max={schema.maximum as number}
        hideSteppers={false}
        aria-describedby={ariaDescribedByIds<T>(id)}
      />
    </div>
  );
}

function TextareaWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, required, label, value, onChange, disabled, readonly, schema, placeholder, onBlur, onFocus } = props;
  const displayLabel = label || schema.title || '';

  return (
    <TextArea
      id={id}
      labelText={displayLabel}
      value={value || ''}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      onBlur={() => onBlur && onBlur(id, value)}
      onFocus={() => onFocus && onFocus(id, value)}
      required={required}
      disabled={disabled || readonly}
      placeholder={placeholder || schema?.default?.toString() || 'Enter value'}
      helperText={schema?.description?.toString()}
      aria-describedby={ariaDescribedByIds<T>(id)}
    />
  );
}

function RangeWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, value, required, disabled, readonly, label, schema, onChange, onBlur, onFocus } = props;

  const displayLabel = label || schema.title || '';
  const min = schema.minimum || 0;
  const max = schema.maximum || 100;
  const step = schema.multipleOf || 1;

  return (
    <div className='cds--form-item'>
      <Slider
        id={id}
        labelText={displayLabel}
        min={min}
        max={max}
        step={step}
        value={value || min}
        onChange={(data: { value: number }) => onChange(data.value)}
        onBlur={() => onBlur && onBlur(id, value)}
        onFocus={() => onFocus && onFocus(id, value)}
        required={required}
        disabled={disabled || readonly}
        hideTextInput={false}
        aria-describedby={ariaDescribedByIds<T>(id)}
      />
      {schema.description && <div className='cds--form__helper-text'>{schema.description}</div>}
    </div>
  );
}

function DateWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, label, onChange, disabled, readonly, schema, onBlur, onFocus, value } = props;
  const displayLabel = label || schema.title || '';

  return (
    <DatePicker datePickerType='single' dateFormat='Y-m-d'>
      <DatePickerInput
        id={id}
        labelText={displayLabel}
        defaultValue={value ? value.toString() : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onBlur={() => onBlur && onBlur(id, value)}
        onFocus={() => onFocus && onFocus(id, value)}
        invalid={false}
        invalidText=''
        disabled={disabled || readonly}
        placeholder='yyyy-mm-dd'
        helperText={schema?.description?.toString()}
        aria-describedby={ariaDescribedByIds<T>(id)}
      />
    </DatePicker>
  );
}

function AltDateTimeWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, label, onChange, disabled, readonly, schema, value } = props;
  const displayLabel = label || schema.title || '';

  const handleDateChange = (dates: Date[]) => {
    if (dates && dates[0]) {
      const currentValue = value ? new Date(value) : new Date();
      const selectedDate = dates[0];
      currentValue.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      onChange(currentValue.toISOString());
    }
  };

  return (
    <Stack gap={3}>
      <DatePicker datePickerType='single' onChange={handleDateChange}>
        <DatePickerInput
          id={id}
          labelText={displayLabel}
          defaultValue={value ? new Date(value).toLocaleDateString() : ''}
          disabled={disabled || readonly}
          aria-describedby={ariaDescribedByIds<T>(id)}
        />
      </DatePicker>
      {/* ... rest of the component */}
    </Stack>
  );
}

// Custom Button renderer for form submit buttons
function SubmitButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: SubmitButtonProps<T, S, F>,
): ReactElement {
  const { uiSchema, ...otherProps } = props;

  return (
    <Button kind='primary' type='submit' {...otherProps} style={{ marginLeft: '1rem' }}>
      Submit
    </Button>
  );
}

function FieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: FieldTemplateProps<T, S, F>,
): ReactElement {
  // Just return children for most fields - the widgets handle their own labels
  const { children, errors, rawErrors } = props;

  // If there are errors, use Carbon's validation classes
  const hasErrors = (rawErrors && rawErrors.length > 0) || (Array.isArray(errors) && errors.length > 0);

  return (
    <div className={`${hasErrors ? 'cds--form-item--error' : ''}`} style={{ width: '100%' }}>
      {children}
      {hasErrors && <div className='cds--form-requirement'>{Array.isArray(errors) ? errors.join('. ') : errors}</div>}
    </div>
  );
}

const formStyle = {
  padding: '1rem 1rem 2rem 1rem', // Top: 16px, Right: 16px, Bottom: 32px, Left: 0px
};

function ObjectFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: ObjectFieldTemplateProps<T, S, F>,
): ReactElement {
  const { description, title, properties } = props;

  return (
    <div className='cds--form' style={{ ...formStyle, width: '100%' }}>
      {(title || description) && (
        <div style={{ marginBottom: '2.5rem', width: '100%' }}>
          {title && <h3 className='cds--heading-03'>{title}</h3>}
          {description && (
            <p className='cds--body-compact-01' style={{ marginTop: '0.5rem' }}>
              {description}
            </p>
          )}
        </div>
      )}
      <Stack gap={7} style={{ width: '100%' }}>
        {properties.map((element) => (
          <div key={element.name} className='cds--form-item' style={{ width: '100%' }}>
            {element.content}
          </div>
        ))}
      </Stack>
    </div>
  );
}

// Custom form template to ensure buttons are properly placed inside the form
function FormTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: FormProps<T, S, F>,
): ReactElement {
  const { children, onSubmit } = props;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e as unknown as IChangeEvent<T, S, F>, e);
    }
  };

  return (
    <form className='cds--form' style={formStyle} onSubmit={handleSubmit} noValidate={true}>
      {children}
    </form>
  );
}

function AddButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>,
): ReactElement {
  return (
    <Button kind='ghost' {...props}>
      Add
    </Button>
  );
}

function CopyButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>,
): ReactElement {
  return (
    <Button kind='ghost' {...props}>
      Copy
    </Button>
  );
}

function MoveDownButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>,
): ReactElement {
  return (
    <Button kind='ghost' {...props}>
      Move Down
    </Button>
  );
}

function MoveUpButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>,
): ReactElement {
  return (
    <Button kind='ghost' {...props}>
      Move Up
    </Button>
  );
}

function RemoveButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>,
): ReactElement {
  return (
    <Button kind='ghost' {...props}>
      Remove
    </Button>
  );
}

function RadioWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, options, value, disabled, readonly, label, onChange, schema } = props;
  const { enumOptions, enumDisabled } = options;
  const displayLabel = label || schema.title || '';

  return (
    <div className='cds--form-item'>
      <div className='cds--label'>{displayLabel}</div>
      <div className='cds--radio-button-group'>
        {Array.isArray(enumOptions) &&
          enumOptions.map((option, i) => {
            const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1;

            return (
              <RadioButton
                key={i}
                id={`${id}-${i}`}
                name={id}
                value={option.value}
                labelText={option.label}
                checked={option.value === value}
                disabled={disabled || itemDisabled || readonly}
                onChange={(value: string | number | undefined) => {
                  onChange(value);
                }}
              />
            );
          })}
      </div>
      {schema.description && <div className='cds--form__helper-text'>{schema.description}</div>}
    </div>
  );
}

function ArrayFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: ArrayFieldTemplateProps<T, S, F>,
): ReactElement {
  const { canAdd, disabled, idSchema, items, onAddClick, readonly, required, schema, title } = props;

  return (
    <Stack gap={5}>
      {title && (
        <div className='cds--form-item'>
          <label htmlFor={idSchema.$id} className='cds--label'>
            {title}
            {required && <span className='cds--label--required'>*</span>}
          </label>
          {schema.description && <div className='cds--form__helper-text'>{schema.description}</div>}
        </div>
      )}
      <div className='cds--form-item'>
        {items.map(({ key, ...itemProps }) => (
          <Tile key={key} className='cds--tile--array-item'>
            {itemProps.children}
          </Tile>
        ))}
      </div>
      {canAdd && (
        <Button
          kind='ghost'
          onClick={onAddClick}
          disabled={disabled || readonly}
          renderIcon={Add}
          iconDescription='Add item'
          size='sm'
        >
          Add Item
        </Button>
      )}
    </Stack>
  );
}

function ErrorList<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  errors,
}: ErrorListProps<T, S, F>): ReactElement {
  return (
    <Stack gap={3}>
      {errors.map((error, i) => (
        <InlineNotification key={i} kind='error' title='Error' subtitle={error.stack} hideCloseButton />
      ))}
    </Stack>
  );
}

function BaseInputTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: BaseInputTemplateProps<T, S, F>,
): ReactElement {
  const {
    id,
    placeholder,
    required,
    readonly,
    disabled,
    type,
    value,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    schema,
    rawErrors = [],
    label,
    hideLabel,
  } = props;

  return (
    <div className='cds--form-item'>
      <TextInput
        id={id}
        type={type || 'text'}
        required={required}
        disabled={disabled || readonly}
        value={value || value === 0 ? value : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => onBlur && onBlur(id, e.target.value)}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => onFocus && onFocus(id, e.target.value)}
        autoFocus={autofocus}
        placeholder={placeholder || schema?.default?.toString()}
        labelText={hideLabel ? undefined : label}
        invalid={rawErrors.length > 0}
        invalidText={rawErrors.join('. ')}
        helperText={schema?.description?.toString()}
      />
    </div>
  );
}

function TitleFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: TitleFieldProps<T, S, F>,
): ReactElement {
  const { id, required, title } = props;

  if (!title) {
    return <div />; // Return empty div instead of null
  }

  return (
    <div className='cds--form-item'>
      <label htmlFor={id} className='cds--label'>
        {title}
        {required && <span className='cds--label--required'>*</span>}
      </label>
    </div>
  );
}

function DescriptionFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: DescriptionFieldProps<T, S, F>,
): ReactElement {
  const { description, id } = props;

  if (!description) {
    return <div />; // Return empty div instead of null
  }

  return (
    <div id={id} className='cds--form__helper-text'>
      {description}
    </div>
  );
}

type ColumnSpanNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type ColumnSpanString = '25%' | '50%' | '75%' | '100%';
type ColumnSpanSimple = ColumnSpanNumber | ColumnSpanString;

interface ColumnSpanObject {
  span?: ColumnSpanSimple;
  offset?: number;
}

type ColumnSpan = ColumnSpanSimple | ColumnSpanObject;

interface GridOptions {
  columns?: number;
  narrow?: boolean;
  condensed?: boolean;
  sm?: ColumnSpan;
  md?: ColumnSpan;
  lg?: ColumnSpan;
  autoColumns?: boolean;
  offset?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

function GridTemplate(props: GridTemplateProps) {
  const { children, uiSchema = {} } = props;

  // Get grid options from uiSchema
  const gridOptions: GridOptions = uiSchema?.['ui:options']?.grid || {};
  const { columns = 1, narrow = false, condensed = false, sm, md, lg, autoColumns = false, offset } = gridOptions;

  // Helper function to process column sizes
  const processColumnSize = (size: ColumnSpan | undefined): ColumnSpan | undefined => {
    if (!size) {
      return undefined;
    }

    if (typeof size === 'object') {
      return size;
    }

    return { span: size };
  };

  // If column prop is true, render as a Column
  if (props.column) {
    const columnProps = {
      sm: processColumnSize(sm),
      md: processColumnSize(md),
      lg: processColumnSize(lg),
    };

    if (offset) {
      return (
        <Column
          {...columnProps}
          sm={{ ...(columnProps.sm as ColumnSpanObject), offset: offset.sm }}
          md={{ ...(columnProps.md as ColumnSpanObject), offset: offset.md }}
          lg={{ ...(columnProps.lg as ColumnSpanObject), offset: offset.lg }}
        >
          {children}
        </Column>
      );
    }

    return <Column {...columnProps}>{children}</Column>;
  }

  // For auto columns mode
  if (autoColumns) {
    return (
      <Grid narrow={narrow} condensed={condensed}>
        {React.Children.map(children, (child) => (
          <Column>{child}</Column>
        ))}
      </Grid>
    );
  }

  // For explicit column sizing
  return (
    <Grid narrow={narrow} condensed={condensed}>
      {React.Children.map(children, (child) => {
        // Default column spans
        const defaultSm: ColumnSpan = Math.min(Math.floor(4 / columns), 4) as ColumnSpanNumber;
        const defaultMd: ColumnSpan = Math.min(Math.floor(8 / columns), 8) as ColumnSpanNumber;
        const defaultLg: ColumnSpan = Math.min(Math.floor(16 / columns), 16) as ColumnSpanNumber;

        return (
          <Column
            sm={processColumnSize(sm) || defaultSm}
            md={processColumnSize(md) || defaultMd}
            lg={processColumnSize(lg) || defaultLg}
          >
            {child}
          </Column>
        );
      })}
    </Grid>
  );
}

export function generateWidgets<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): RegistryWidgetsType<T, S, F> {
  return {
    TextWidget,
    SelectWidget,
    CheckboxWidget,
    updown: NumberWidget,
    TextareaWidget,
    DateWidget,
    RadioWidget,
    RangeWidget,
    AltDateTimeWidget,
  };
}

export function generateTemplates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): Partial<TemplatesType<T, S, F>> {
  return {
    FieldTemplate,
    ObjectFieldTemplate,
    FormTemplate,
    ArrayFieldTemplate,
    ErrorListTemplate: ErrorList,
    BaseInputTemplate,
    TitleFieldTemplate,
    DescriptionFieldTemplate,
    GridTemplate,
    ButtonTemplates: {
      SubmitButton,
      AddButton,
      CopyButton,
      MoveDownButton,
      MoveUpButton,
      RemoveButton,
    },
  };
}

export function generateTheme<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): ThemeProps<T, S, F> {
  return {
    widgets: generateWidgets<T, S, F>(),
    templates: generateTemplates<T, S, F>(),
  };
}

export default generateTheme();
