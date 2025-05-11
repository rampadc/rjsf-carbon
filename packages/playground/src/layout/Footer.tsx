import { Grid, Column, Link } from '@carbon/react';

export default function Footer() {
  return (
    <div className="playground-footer">
      <p style={{ textAlign: 'center' }}>
        Powered by <Link href='https://github.com/rjsf-team/react-jsonschema-form'>react-jsonschema-form</Link>
        {import.meta.env.VITE_SHOW_NETLIFY_BADGE === 'true' && (
          <span style={{ float: 'right' }}>
            <Link href='https://www.netlify.com'>
              <img src='https://www.netlify.com/img/global/badges/netlify-color-accent.svg' alt="Netlify" />
            </Link>
          </span>
        )}
      </p>
    </div>
  );
}
