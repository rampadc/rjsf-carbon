import { useCallback, useMemo } from 'react';
import Form, { IChangeEvent } from '@rjsf/core';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import localValidator from '@rjsf/validator-ajv8';
import { useFormTheme } from '../layout/Layout';

const uiSchema: UiSchema = {
  'ui:placeholder': 'Select subtheme',
};

interface SubthemeType {
  stylesheet?: string;
  dataTheme?: string;
}

export interface SubthemesType {
  [subtheme: string]: SubthemeType;
}

// Define Carbon theme options more explicitly
export type CarbonThemeType = 'white' | 'g10' | 'g90' | 'g100';

interface SubthemeSelectorProps {
  subtheme: string | null;
  subthemes: SubthemesType;
  select: (subthemeName: string, subtheme: SubthemeType) => void;
}

export default function SubthemeSelector({ subtheme, subthemes, select }: SubthemeSelectorProps) {
  const { setFormTheme } = useFormTheme();
  
  const schema: RJSFSchema = useMemo(
    () => ({
      type: 'string',
      title: 'Subtheme',
      enum: Object.keys(subthemes),
    }),
    [subthemes],
  );

  const handleChange = useCallback(
    ({ formData }: IChangeEvent) => {
      if (!formData) {
        return;
      }

      // Apply the Carbon theme only to the form container using data-carbon-theme
      document.querySelector('.playground-form-container')?.setAttribute('data-carbon-theme', formData);
      setFormTheme(formData as CarbonThemeType);
      return select(formData, subthemes[formData]);
    },
    [select, subthemes, setFormTheme],
  );

  return (
    <Form
      className='form_rjsf_subthemeSelector'
      idPrefix='rjsf_subthemeSelector'
      schema={schema}
      uiSchema={uiSchema}
      formData={subtheme}
      validator={localValidator}
      onChange={handleChange}
    >
      <div />
    </Form>
  );
}
