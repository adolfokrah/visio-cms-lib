import blocks from './src/components/blocks';
import {  ProjectConfig } from './src/lib/types';
const visioConfig:ProjectConfig = {
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
  emailSender: 'Visio Cms <norepy@okuafpa.com>',
  projectId: 'oexsxdsfiwezwhunafsc',
  supabaseProjectUrl: 'https://oexsxdsfiwezwhunafsc.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leHN4ZHNmaXdlendodW5hZnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0Mzc5ODIsImV4cCI6MjA1NTAxMzk4Mn0.R6Kk8nMl39IcMKSgpgG0EaGnuxECEOufFTE-vC-BegE',
  unsplashAccessKey: 'Rw6b_NBqAXZV4wTUOF7A2QtagLtB9apC2dQYZco1RUU',
  
};

export default visioConfig;
