import React from 'react';
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
  blocks: BlockList[];
  globalBlocks: {
    name: string;
    id: string;
    blockId: string;
    inputs: { [key: string]: any };
  }[];
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

export type SideEditingPropsType = 'text' | 'select';

export interface SideEditingProps {
  propName: string;
  label: string;
  type: SideEditingPropsType;
}

export type BlockSchema<T = Record<string, any>> = {
  name: string;
  id: string;
  group?: string;
  defaultPropValues: T;
  sideEditingProps: SideEditingProps[];
};

export type Block<T = Record<string, any>> = React.FC<T> & { Schema: BlockSchema<T> };

export type BlockList = Block | Block<Record<string, any>>;

export type GroupedBlock = {
  [group: string]: BlockList[];
};

export interface Message {
  type: string;
  content: string;
}

export type EditorControlTypes =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'underline'
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'bullet-list'
  | 'ordered-list'
  | 'blockquote'
  | 'code'
  | 'link'
  | 'image'
  | 'image'
  | 'text-color'
  | 'background-color'
  | 'align-center'
  | 'align-right'
  | 'align-left'
  | 'align-justify';
export type MenuControlsType = {
  name: EditorControlTypes;
  icon: React.ReactNode;
  title: string;
};
