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
  unsplashAccessKey: string;
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
  scripts: {
    head: string;
    body: string;
  };
  setScripts: (script: { head: string; body: string }) => void;
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

type BasePropSchema<T = Record<string, any>> = {
  propName: string;
  label: string;
  group?: string;
  hide?: (inputs: T) => boolean;
};

type SwitchEditingProp<T = Record<string, any>> = BasePropSchema<T> & {
  type: 'switch';
  onLabel?: string;
  offLabel?: string;
};

type RadioGroupEditingProp<T = Record<string, any>> = BasePropSchema<T> & {
  type: 'radio-group';
  options: { label: string; value: string }[];
};

type SelectEditingProp<T = Record<string, any>> = BasePropSchema<T> & {
  type: 'select';
  options: { label: string; value: string }[];
  placeholder?: string;
};

type CustomEditingProp<T = Record<string, any>> = BasePropSchema<T> & {
  type: 'custom';
  component: React.FC<any>;
  componentProps?: Record<string, any>;
};

type BaseEditingProps<T = Record<string, any>> = BasePropSchema<T> & {
  type: 'text' | 'color' | 'link' | 'image' | 'number';
};

export type SideEditingProps<T = Record<string, any>> =
  | SwitchEditingProp<T>
  | RadioGroupEditingProp<T>
  | SelectEditingProp<T>
  | BaseEditingProps<T>
  | CustomEditingProp<T>;

export type BlockSchema<T = Record<string, any>> = {
  name: string;
  id: string;
  group?: string;
  defaultPropValues: T;
  sideEditingProps: SideEditingProps<T>[];
  lists?: ListSchema<T>[];
};

export type ListSchema<T = Record<string, any>> = {
  propName: string;
  label: string;
  defaultValue: any;
  subLists?: ListSchema<T>[];
  sideEditingProps?: SideEditingProps<T>[];
  maxCount?: number;
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

export interface UnsplashPhotoData {
  id: string;
  slug: string;
  alternative_slugs: {
    en: string;
    es: string;
    ja: string;
    fr: string;
    it: string;
    ko: string;
    de: string;
    pt: string;
  };
  created_at: string;
  updated_at: string;
  promoted_at: string | null;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string;
  breadcrumbs: string[];
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship: {
    impression_urls: string[];
    tagline: string;
    tagline_url: string;
    sponsor: {
      id: string;
      updated_at: string;
      username: string;
      name: string;
      first_name: string;
      last_name: string;
      twitter_username: string;
      portfolio_url: string;
      bio: string;
      location: string | null;
      links: {
        self: string;
        html: string;
        photos: string;
        likes: string;
        portfolio: string;
        following: string;
        followers: string;
      };
      profile_image: {
        small: string;
        medium: string;
        large: string;
      };
      instagram_username: string;
      total_collections: number;
      total_likes: number;
      total_photos: number;
      total_promoted_photos: number;
      total_illustrations: number;
      total_promoted_illustrations: number;
      accepted_tos: boolean;
      for_hire: boolean;
      social: {
        instagram_username: string;
        portfolio_url: string;
        twitter_username: string;
        paypal_email: string | null;
      };
    };
  } | null;
  topic_submissions: Record<string, any>;
  asset_type: string;
  user: {
    id: string;
    updated_at: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    twitter_username: string;
    portfolio_url: string;
    bio: string;
    location: string | null;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
      following: string;
      followers: string;
    };
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    instagram_username: string;
    total_collections: number;
    total_likes: number;
    total_photos: number;
    total_promoted_photos: number;
    total_illustrations: number;
    total_promoted_illustrations: number;
    accepted_tos: boolean;
    for_hire: boolean;
    social: {
      instagram_username: string;
      portfolio_url: string;
      twitter_username: string;
      paypal_email: string | null;
    };
  };
}

export type ProjectConfig = Pick<
ProjectConfiguration,
| 'supabaseAnonKey'
| 'supabaseProjectUrl'
| 'projectId'
| 'emailSender'
| 'defaultLanguage'
| 'supportedLanguages'
| 'blocks'
| 'allowImageTransformation'
| 'unsplashAccessKey'
> 