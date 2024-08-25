import React from 'react';
import { Page, ResponsiveView } from './states/usePagesState';

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
  history?: { currentIndex: number; inputs: { [key: string]: any }[] };
  selectedView: ResponsiveView;
};

export type ProjectConfiguration = {
  emailSender: string;
  supabaseProjectUrl: string;
  supabaseAnonKey: string;
  supportedLanguages: Language[];
  defaultLanguage: Language;
  projectId: string;
  bucketName: string;
  blocks: BlockList[];
  allowImageTransformation: boolean;
  theme: {
    colorScheme: Color[];
  };
  globalBlocks: GlobalBlock[];
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

type List = {
  type: 'list';
  fields: { name: string; defaultValue: any; itemCount?: number }[];
  subList?: {
    propName: string;
    fields: { name: string; defaultValue: any; itemCount?: number }[];
    sideEditingProps?: SideEditingProps[];
  }[];
  sideEditingProps?: SideEditingProps[];
};

export type ListEditingProps = BasePropSchema & List;

export type SideEditingProps =
  | SwitchEditingProp
  | RadioGroupEditingProp
  | SelectEditingProp
  | BaseEditingProps
  | CustomEditingProp
  | ListEditingProps;

export type BlockSchema<T = Record<string, any>> = {
  name: string;
  id: string;
  group?: string;
  defaultPropValues: T;
  sideEditingProps: SideEditingProps[];
  lists?: ListSchema[];
};

export type ListSchema = {
  propName: string;
  label: string;
  schema: Record<string, any>;
  subLists?: ListSchema[];
  sideEditingProps?: SideEditingProps[];
};

export type Block<T = Record<string, any>> = React.FC<T> & { Schema: BlockSchema<T> };

export type BlockList = Block | Block<Record<any, any>>;

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
