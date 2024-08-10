import { Page } from './states/usePagesState';

export type Language = {
  language: string;
  locale: string;
};

export type ProjectConfiguration = {
  emailSender: string;
  supabaseProjectUrl: string;
  supabaseAnonKey: string;
  supportedLanguages: Language[];
  defaultLanguage: Language;
  projectId: string;
  bucketName: string;
  theme: {
    colorScheme: {
      colorHex: string;
      colorName: string;
    }[];
  };
};
export type OsTypes = 'mac' | 'windows' | 'unknown';

export type Folder = {
  id: string;
  name: string;
  children: PageTreeItem[];
  isExpanded?: boolean;
  type: 'Folder';
};

export type PageT = Page & {
  type: 'Page';
};

export type PageTreeItem = Folder | PageT;

export type MediaFile = {
  mediaHash: string | undefined;
  altText: string;
  width: number;
  height: number;
};

export interface InvitedUser {
  id: string; // UUID for the user
  email: string; // User's email address
  first_name: string; // User's first name
  last_name: string; // User's last name
  role: string; // User's role
  photo: string | null; // URL to the user's photo, or null if not available
}
