import { Cms } from './components';
import blocks from './components/blocks';
import './styles/tailwind.css';

function App() {
  return (
    <Cms
      allowImageTransformation={false}
      blocks={blocks}
      defaultLanguage={{
        language: 'English',
        locale: 'en-us',
      }}
      supportedLanguages={[
        {
          language: 'English',
          locale: 'en-us',
        },
        {
          language: 'Spanish',
          locale: 'es',
        },
        {
          language: 'French',
          locale: 'fr',
        },
        {
          language: 'German',
          locale: 'de',
        },
        {
          language: 'Finish',
          locale: 'fi',
        },
      ]}
      emailSender="Visio cms <noreply@visiocms.com>"
      projectId="urhvrfatpmdbwttotlwc"
      supabaseProjectUrl="https://urhvrfatpmdbwttotlwc.supabase.co"
      supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyaHZyZmF0cG1kYnd0dG90bHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MTIyNDAsImV4cCI6MjAzNzk4ODI0MH0.6oTSoUtEAVdSxUa4ws9PgXEnHCiFCsgXTawwbtOBDh8"
    />
  );
}

export default App;
