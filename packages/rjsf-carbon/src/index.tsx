import React, { ReactElement } from 'react';
import { WidgetProps, FieldTemplateProps, ObjectFieldTemplateProps, FormContextType } from '@rjsf/utils';
import { ThemeProps } from '@rjsf/core';
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
} from '@carbon/react';
import { RJSFSchema } from '@rjsf/utils';

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

type FormProps = Record<string, unknown>;
type UiSchema = Record<string, unknown>;

const TextWidget = (props: WidgetProps): ReactElement => {
  const { id, required, label, value, onChange, disabled, readonly, placeholder, schema } = props;

  // Use schema title as label if present
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
};

const SelectWidget = (props: WidgetProps): ReactElement => {
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
};

const CheckboxWidget = (props: WidgetProps): ReactElement => {
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
};

const NumberWidget = (props: WidgetProps): ReactElement => {
  const { id, required, label, value, onChange, disabled, readonly, schema, placeholder } = props;
  const displayLabel = label || schema.title || '';

  return (
    <NumberInput
      id={id}
      label={displayLabel}
      value={(value as number) || 0}
      onChange={(_event: React.MouseEvent<HTMLButtonElement>, state: { value: string | number; direction: string }) => {
        const numericValue = typeof state.value === 'string' ? parseFloat(state.value) : state.value;
        onChange(numericValue);
      }}
      required={required}
      disabled={disabled || readonly}
      helperText={schema?.description?.toString()}
      placeholder={placeholder || schema?.default?.toString() || 'Enter value'}
      step={(schema?.multipleOf as number) || 1}
      min={schema?.minimum as number}
      max={schema?.maximum as number}
    />
  );
};

const TextareaWidget = (props: WidgetProps): ReactElement => {
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
};

const DateWidget = (props: WidgetProps): ReactElement => {
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
};

// Custom Button renderer for form submit buttons
const SubmitButton = (props: any) => {
  const { ...otherProps } = props;

  return (
    <Button kind='primary' type='submit' {...otherProps}>
      {props.children || 'Submit'}
    </Button>
  );
};

// This is a simpler FieldTemplate that doesn't add additional fieldset/legend
const FieldTemplate = (props: FieldTemplateProps): ReactElement => {
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
};

const formStyle = {
  padding: '1rem 1rem 2rem 1rem', // Top: 16px, Right: 16px, Bottom: 32px, Left: 16px
};

const ObjectFieldTemplate = (props: ObjectFieldTemplateProps<FormProps, RJSFSchema, FormContextType>): ReactElement => {
  const { properties, title, description } = props;

  return (
    // Use a div with cds--form class to style like a Carbon form
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
};

// Custom form template to ensure buttons are properly placed inside the form
const FormTemplate = (props: any) => {
  const { children, onSubmit, schema } = props;

  return (
    <form className='cds--form' style={formStyle} onSubmit={onSubmit} noValidate={true}>
      {children}

      {/* Submit button with proper spacing */}
      <div style={{ marginTop: '3rem', marginLeft: '1rem' }}>
        {' '}
        {/* spacing-09 (48px) */}
        <Button kind='primary' type='submit'>
          {schema.submitButtonText || 'Submit'}
        </Button>
      </div>
    </form>
  );
};

const CarbonTheme: ThemeProps<FormProps, RJSFSchema, UiSchema> = {
  widgets: {
    TextWidget,
    SelectWidget,
    CheckboxWidget,
    NumberWidget,
    TextareaWidget,
    DateWidget,
  },

  templates: {
    FieldTemplate,
    ObjectFieldTemplate,
    ButtonTemplates: {
      SubmitButton,
    },
    FormTemplate, // Add the custom form template
  },
};

export default CarbonTheme;
