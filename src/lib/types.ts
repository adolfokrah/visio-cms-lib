import React from 'react';
import { Page } from './states/usePagesState';
import { RepeaterSchema } from './states/useRepeaterState';

export type Language = {
  language: string;
  locale: string;
};

export type Color = {
  colorHex: string;
  colorName: string;
  id: string;
};

export type GlobalBlock = {
  name: string;
  id: string;
  blockId: string;
  inputs: { [key: string]: any };
  active?: boolean;
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
    colorScheme: Color[];
  };
  blocks: BlockList[];
  globalBlocks: GlobalBlock[];
  allowImageTransformation: boolean;
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
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  photo: string | null;
}

type BasePropSchema = {
  propName: string;
  label: string;
  group?: string;
};

type SwitchEditingProp = BasePropSchema & {
  type: 'switch';
  onLabel?: string;
  offLabel?: string;
};

type RadioGroupEditingProp = BasePropSchema & {
  type: 'radio-group';
  options: { label: string; value: string }[];
};

type SelectEditingProp = BasePropSchema & {
  type: 'select';
  options: { label: string; value: string }[];
  placeholder?: string;
};

type CustomEditingProp = BasePropSchema & {
  type: 'custom';
  component: React.FC<any>;
  componentProps?: Record<string, any>;
};

type BaseEditingProps = BasePropSchema & {
  type: 'text' | 'color' | 'link' | 'image' | 'number';
};

export type SideEditingProps =
  | SwitchEditingProp
  | RadioGroupEditingProp
  | SelectEditingProp
  | BaseEditingProps
  | CustomEditingProp;

export type BlockSchema<T = Record<string, any>> = {
  name: string;
  id: string;
  group?: string;
  defaultPropValues: T;
  sideEditingProps: SideEditingProps[];
  repeaters?: Omit<RepeaterSchema, 'propName'>[];
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
