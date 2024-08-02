export type Language = {
  language: string;
  locale: string;
};

export type ProjectConfiguration = {
  supabaseProjectUrl: string;
  supabaseAnonKey: string;
  supportedLanguages: Language[];
  defaultLanguage: Language;
};
export type OsTypes = 'mac' | 'windows' | 'unknown';

export type PageGroup = {
  id: string;
  name: string;
  active: boolean;
  children: PageGroup[];
  slug: string;
  parentPage?: string;
};
