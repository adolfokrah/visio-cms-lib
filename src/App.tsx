import { Cms } from './components';
import blocks from './components/blocks';
import './styles/tailwind.css';
import TestLivePage from './TestLivePage';

function App() {
  const path = window.location.pathname;
  if (path.includes('cms')) {
    return (
      <Cms
        path={path}
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
        unsplashAccessKey="Rw6b_NBqAXZV4wTUOF7A2QtagLtB9apC2dQYZco1RUU"
      />
    );
  }
  return <TestLivePage />;
}

export default App;
