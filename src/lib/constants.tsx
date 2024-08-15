import { DesktopIcon, MobileIcon } from '@radix-ui/react-icons';
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  PaintBucket,
  Quote,
  Redo,
  Strikethrough,
  TabletIcon,
  Type,
  Underline,
  Undo,
} from 'lucide-react';
import { ResponsiveViews } from './states/usePagesState';
import { MenuControlsType } from './types';

export const CMS_BASE_PATH = '/cms';

export const PAGES = {
  LOGIN: `${CMS_BASE_PATH}/login`,
  REGISTER: `${CMS_BASE_PATH}/register`,
  FORGOTTEN_PASSWORD: `${CMS_BASE_PATH}/forgotten-password`,
  BUILDER: `${CMS_BASE_PATH}/builder`,
  UPDATE_PASSWORD: `${CMS_BASE_PATH}/update-password`,
  PAGE_NOT_FOUND: `${CMS_BASE_PATH}/page-not-found`,
  PAGE_CONTENT: `${CMS_BASE_PATH}/page-content`,
};

export const RESPONSIVE_VIEWS: ResponsiveViews[] = [
  {
    view: 'Desktop',
    size: '1200px',
    icon: <DesktopIcon />,
  },
  {
    view: 'Tablet',
    size: '768px',
    icon: <TabletIcon size={15} />,
  },
  {
    view: 'Mobile',
    size: '640px',
    icon: <MobileIcon />,
  },
];

export const VISIO_DOCS_BASE_URL = 'https://www.visiocms.com/docs';

export const JSON_WEB_SECRET = '304c0f795e0a4defcb822b5ea47d559b';

export const ROLES = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  OWNER: 'Owner',
};

export const EDITOR_MENU_CONTROLS: MenuControlsType[] = [
  {
    name: 'bold',
    icon: <Bold size={16} />,
    title: 'Bold',
  },
  {
    name: 'italic',
    icon: <Italic size={16} />,
    title: 'Italic',
  },
  {
    name: 'strike',
    icon: <Strikethrough size={16} />,
    title: 'Strike',
  },
  {
    name: 'underline',
    icon: <Underline size={16} />,
    title: 'Underline',
  },
  {
    name: 'code',
    icon: <Code2 size={16} />,
    title: 'Code Block',
  },
  {
    name: 'paragraph',
    icon: <Type size={16} />,
    title: 'Paragraph',
  },
  {
    name: 'h1',
    icon: <Heading1 size={16} />,
    title: 'Heading 1',
  },
  {
    name: 'h2',
    icon: <Heading2 size={16} />,
    title: 'Heading 2',
  },
  {
    name: 'h3',
    icon: <Heading3 size={16} />,
    title: 'Heading 3',
  },
  {
    name: 'h4',
    icon: <Heading4 size={16} />,
    title: 'Heading 4',
  },
  {
    name: 'h5',
    icon: <Heading5 size={16} />,
    title: 'Heading 5',
  },
  {
    name: 'h6',
    icon: <Heading6 size={16} />,
    title: 'Heading 6',
  },
  {
    name: 'bullet-list',
    icon: <List size={16} />,
    title: 'Bullet List',
  },
  {
    name: 'ordered-list',
    icon: <ListOrdered size={16} />,
    title: 'Ordered List',
  },
  {
    name: 'blockquote',
    icon: <Quote size={16} />,
    title: 'Blockquote',
  },
  {
    name: 'link',
    icon: <Link size={16} />,
    title: 'Link',
  },
  {
    name: 'image',
    icon: <Image size={16} />,
    title: 'Image',
  },
  {
    name: 'undo',
    icon: <Undo size={16} />,
    title: 'Undo',
  },
  {
    name: 'redo',
    icon: <Redo size={16} />,
    title: 'Redo',
  },
  {
    name: 'text-color',
    icon: <PaintBucket size={16} />,
    title: 'Text Color',
  },
  {
    name: 'background-color',
    icon: <Highlighter size={16} />,
    title: 'Text Highlight Color',
  },
];
