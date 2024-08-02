export type Language = {
  language: string;
  locale: string;
};

export type ProjectConfiguration = {
  supabaseProjectUrl: string;
  supabaseAnonKey: string;
  supportedLanguages: Language[];
};
export type OsTypes = 'mac' | 'windows' | 'unknown';
