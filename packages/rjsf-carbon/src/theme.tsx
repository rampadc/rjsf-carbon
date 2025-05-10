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
  const { id, required, label, value, onChange, options, disabled, readonly, schema } = props;
  const enumOptions = (options.enumOptions as EnumOption[]) || [];
  const displayLabel = label || schema.title || '';

  // If there are many options, use ComboBox instead of Select for better UX
  if (enumOptions.length > 10) {
    const items: ComboBoxItem[] = enumOptions.map((option) => ({
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
            onChange(data.selectedItem.id);
          }
        }}
        disabled={disabled || readonly}
        helperText={schema?.description?.toString()}
        allowCustomValue
      />
    );
  }

  return (
    <Select
      id={id}
      labelText={displayLabel}
      value={value || ''}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      required={required}
      disabled={disabled || readonly}
      helperText={schema?.description?.toString()}
    >
      <SelectItem value='' text='Choose an option' />
      {enumOptions.map((option) => (
        <SelectItem key={option.value} value={option.value} text={option.label} />
      ))}
    </Select>
  );
}

function CheckboxWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, label, value, onChange, disabled, readonly, schema } = props;
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
        disabled={disabled || readonly}
      />
      {schema?.description && <div className='cds--form__helper-text'>{schema.description.toString()}</div>}
    </div>
  );
}

function NumberWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, required, label, value, onChange, disabled, readonly, schema, placeholder, rawErrors = [] } = props;
  const displayLabel = label || schema.title || '';

  // Handle both number inputs and sliders
  if (props.options.widget === 'range') {
    return (
      <div className='cds--form-item'>
        <Slider
          id={id}
          labelText={displayLabel}
          value={value || schema.minimum || 0}
          min={schema.minimum as number}
          max={schema.maximum as number}
          step={schema.multipleOf || 1}
          onChange={(data: { value: number }) => onChange(data.value)}
          disabled={disabled || readonly}
        />
        <span className='cds--slider-value'>{value}</span>
      </div>
    );
  }

  return (
    <div className='cds--form-item'>
      <NumberInput
        id={id}
        label={displayLabel}
        value={value}
        onChange={(_event: React.MouseEvent<HTMLButtonElement>, state: { value: string | number }) => {
          const numericValue = typeof state.value === 'string' ? parseFloat(state.value) : state.value;
          onChange(numericValue);
        }}
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
      />
    </div>
  );
}

function TextareaWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, required, label, value, onChange, disabled, readonly, schema, placeholder } = props;
  const displayLabel = label || schema.title || '';

  return (
    <TextArea
      id={id}
      labelText={displayLabel}
      value={value || ''}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      required={required}
      disabled={disabled || readonly}
      placeholder={placeholder || schema?.default?.toString() || 'Enter value'}
      helperText={schema?.description?.toString()}
    />
  );
}

function DateWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
): ReactElement {
  const { id, label, onChange, disabled, readonly, schema } = props;
  // DatePickerInput doesn't accept a value prop, it uses defaultValue
  const defaultValue = props.value ? props.value.toString() : '';
  const displayLabel = label || schema.title || '';

  return (
    <DatePicker datePickerType='single' dateFormat='Y-m-d'>
      <DatePickerInput
        id={id}
        labelText={displayLabel}
        defaultValue={defaultValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        invalid={false}
        invalidText=''
        disabled={disabled || readonly}
        placeholder='yyyy-mm-dd'
        helperText={schema?.description?.toString()}
      />
    </DatePicker>
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
    <div className={hasErrors ? 'cds--form-item--error' : ''}>
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
    <div className='cds--form' style={formStyle}>
      {(title || description) && (
        <div style={{ marginBottom: '2.5rem' }}>
          {' '}
          {/* spacing-08 (40px) */}
          {title && <h3 className='cds--heading-03'>{title}</h3>}
          {description && (
            <p className='cds--body-compact-01' style={{ marginTop: '0.5rem' }}>
              {description}
            </p>
          )}
        </div>
      )}
      <Stack gap={7}>
        {properties.map((element) => (
          <div key={element.name} className='cds--form-item'>
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

export function generateWidgets<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): RegistryWidgetsType<T, S, F> {
  return {
    TextWidget,
    SelectWidget,
    CheckboxWidget,
    NumberWidget,
    TextareaWidget,
    DateWidget,
    RadioWidget,
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
