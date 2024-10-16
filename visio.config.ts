import blocks from './src/components/blocks';
const visioConfig = {
  blocks,
  allowImageTransformation: false,
  supportedLanguages: [
    {
      language: 'English',
      locale: 'en',
    },
    {
      language: 'German',
      locale: 'de',
    },
  ],
  defaultLanguage: {
    language: 'English',
    locale: 'en',
  },
  emailSender: 'Visio Cms <norepy@visiocms.com>',
  projectId: 'eyarizmdzidmibcnfmmx',
  supabaseProjectUrl: 'https://eyarizmdzidmibcnfmmx.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YXJpem1kemlkbWliY25mbW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwNTk3MzMsImV4cCI6MjA0MTYzNTczM30.bM7YysJKmQUp38J-ywwttBHL3AHxhOTzvH_P4_qTApQ',
  unsplashAccessKey: 'Rw6b_NBqAXZV4wTUOF7A2QtagLtB9apC2dQYZco1RUU',
};

export default visioConfig;
