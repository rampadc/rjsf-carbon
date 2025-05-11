import { useCallback, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { ErrorSchema, RJSFSchema, UiSchema } from '@rjsf/utils';
import isEqualWith from 'lodash/isEqualWith';
import { Tile } from '@carbon/react';

const monacoEditorOptions = {
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
};

type EditorProps = {
  title: string;
  code: string;
  onChange: (data: any) => void;
};

function Editor({ title, code, onChange }: EditorProps) {
  const [valid, setValid] = useState(true);

  const onCodeChange = useCallback(
    (code: string | undefined) => {
      if (!code) {
        return;
      }

      try {
        const parsedCode = JSON.parse(code);
        setValid(true);
        onChange(parsedCode);
      } catch {
        setValid(false);
      }
    },
    [setValid, onChange],
  );

  const validityIndicator = valid ? '✓' : '✗';
  const validityClass = valid ? 'carbon-editor-valid' : 'carbon-editor-invalid';

  return (
    <Tile>
      <div className='carbon-editor-heading'>
        <span className={validityClass}>{validityIndicator}</span>
        {' ' + title}
      </div>
      <MonacoEditor
        language='json'
        value={code}
        theme='vs-light'
        onChange={onCodeChange}
        height={400}
        options={monacoEditorOptions}
      />
    </Tile>
  );
}

const toJson = (val: unknown) => JSON.stringify(val, null, 2);

type EditorsProps = {
  schema: RJSFSchema;
  setSchema: React.Dispatch<React.SetStateAction<RJSFSchema>>;
  uiSchema: UiSchema;
  setUiSchema: React.Dispatch<React.SetStateAction<UiSchema>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  extraErrors: ErrorSchema | undefined;
  setExtraErrors: React.Dispatch<React.SetStateAction<ErrorSchema | undefined>>;
  setShareURL: React.Dispatch<React.SetStateAction<string | null>>;
  hasUiSchemaGenerator: boolean;
};

export default function Editors({
  extraErrors,
  formData,
  schema,
  uiSchema,
  setExtraErrors,
  setFormData,
  setSchema,
  setShareURL,
  setUiSchema,
  hasUiSchemaGenerator,
}: EditorsProps) {
  const onSchemaEdited = useCallback(
    (newSchema: any) => {
      setSchema(newSchema);
      setShareURL(null);
    },
    [setSchema, setShareURL],
  );

  const onUISchemaEdited = useCallback(
    (newUiSchema: any) => {
      setUiSchema(newUiSchema);
      setShareURL(null);
    },
    [setUiSchema, setShareURL],
  );

  const onFormDataEdited = useCallback(
    (newFormData: any) => {
      if (
        !isEqualWith(newFormData, formData, (newValue, oldValue) => {
          // Since this is coming from the editor which uses JSON.stringify to trim undefined values compare the values
          // using JSON.stringify to see if the trimmed formData is the same as the untrimmed state
          // Sometimes passing the trimmed value back into the Form causes the defaults to be improperly assigned
          return JSON.stringify(oldValue) === JSON.stringify(newValue);
        })
      ) {
        setFormData(newFormData);
        setShareURL(null);
      }
    },
    [formData, setFormData, setShareURL],
  );

  const onExtraErrorsEdited = useCallback(
    (newExtraErrors: any) => {
      setExtraErrors(newExtraErrors);
      setShareURL(null);
    },
    [setExtraErrors, setShareURL],
  );
  const uiSchemaTitle = hasUiSchemaGenerator ? 'UISchema (regenerated on theme change)' : 'UiSchema';

  return (
    <div className='playground-editors'>
      <Editor title='JSONSchema' code={toJson(schema)} onChange={onSchemaEdited} />
      <div className='playground-editors-row'>
        <div className='playground-editors-column'>
          <Editor title={uiSchemaTitle} code={toJson(uiSchema)} onChange={onUISchemaEdited} />
        </div>
        <div className='playground-editors-column'>
          <Editor title='formData' code={toJson(formData)} onChange={onFormDataEdited} />
        </div>
      </div>
      {extraErrors && <Editor title='extraErrors' code={toJson(extraErrors)} onChange={onExtraErrorsEdited} />}
    </div>
  );
}
