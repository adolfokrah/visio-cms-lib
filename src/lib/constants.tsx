import { DesktopIcon, MobileIcon } from '@radix-ui/react-icons';
import { TabletIcon } from 'lucide-react';
import { ResponsiveViews } from './states/usePagesState';

export const CMS_BASE_PATH = '/cms';

export const PAGES = {
  LOGIN: `${CMS_BASE_PATH}/login`,
  REGISTER: `${CMS_BASE_PATH}/register`,
  FORGOTTEN_PASSWORD: `${CMS_BASE_PATH}/forgotten-password`,
  BUILDER: `${CMS_BASE_PATH}/builder`,
  UPDATE_PASSWORD: `${CMS_BASE_PATH}/update-password`,
  PAGE_NOT_FOUND: `${CMS_BASE_PATH}/page-not-found`,
};

export const RESPONSIVE_VIEWS: ResponsiveViews[] = [
  {
    view: 'Desktop',
    size: '1200px',
    icon: <DesktopIcon />,
  },
  {
    view: 'Tablet',
    size: '720px',
    icon: <TabletIcon size={15} />,
  },
  {
    view: 'Mobile',
    size: '430px',
    icon: <MobileIcon />,
  },
];

export const VISIO_DOCS_BASE_URL = 'https://www.visiocms.com/docs';
