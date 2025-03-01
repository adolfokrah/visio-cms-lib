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
  projectId: 'tafbogvekofwoodsvxzl',
  supabaseProjectUrl: 'https://tafbogvekofwoodsvxzl.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhZmJvZ3Zla29md29vZHN2eHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjI3NzQsImV4cCI6MjA1NjM5ODc3NH0.b0-GrmVkqcLigCC3s96-FctV9R1oGAHNtvjpHPUsZl4',
  unsplashAccessKey: 'Rw6b_NBqAXZV4wTUOF7A2QtagLtB9apC2dQYZco1RUU',
  
};

export default visioConfig;
