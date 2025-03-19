import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  BlockList,
  Color,
  Folder,
  GlobalBlock,
  GroupedBlock,
  ListSchema,
  MediaFile,
  Message,
  OsTypes,
  PageTreeItem,
  ProjectConfig,
  ProjectConfiguration,
  SideEditingProps,
} from './types';
import { Page, PageBlock, usePagesState } from './states/usePagesState';
import * as jose from 'jose';
import { JSON_WEB_SECRET, PAGES } from './constants';
import { useDbState } from './states/usedbState';
import { useProjectConfigurationState } from './states/useProjectConfigState';
import { usePageContentState } from './states/usePageContentState';
import { useAuthState } from './states/useAuthState';
import { useParamState } from './states/useParamState';
import lodash from 'lodash';
import { useTabState } from './states/useTabsState';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getQueryParamsFromUrl(url: string): Record<string, string> {
  const hash = url.split('?')[1];

  if (!hash) return {};

  const params: Record<string, string> = hash.split('&').reduce(
    (acc, param) => {
      const [key, value] = param.split('=');
      if (key !== undefined && value !== undefined) {
        acc[decodeURIComponent(key)] = decodeURIComponent(value);
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return params;
}

export const supabase = () => {
  const { supabase: db } = useDbState.getState();
  return db;
};

export const mapScaleToPercentage = (scale: number): number => {
  // Define the range boundaries
  const minScale = 1;
  const maxScale = 8;
  const minPercentage = 10;
  const maxPercentage = 100;

  // Ensure scale is within the range of 1 to 8
  if (scale < minScale) {
    scale = minScale;
  } else if (scale > maxScale) {
    scale = maxScale;
  }

  // Calculate percentage
  const percentage = ((scale - minScale) / (maxScale - minScale)) * (maxPercentage - minPercentage) + minPercentage;
  return Math.round(percentage);
};

export const getOS = (): OsTypes => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes('macintosh') || userAgent.includes('mac os x')) {
    return 'mac';
  }
  if (userAgent.includes('windows nt')) {
    return 'windows';
  }
  return 'unknown'; // Fallback for unknown OS
};

export function generateTree(treeItems: PageTreeItem[], pages: Page[]): PageTreeItem[] {
  const folders = treeItems.filter((item) => item.type === 'Folder') as Folder[];
  const pageWithNoFolders = pages.filter((page) => !folders.find((folder) => folder.id === page.folderId));
  const pagesWithFolders = pages.filter((page) => folders.find((folder) => folder.id === page.folderId));

  folders.forEach((item) => {
    const children = pagesWithFolders.filter((page) => page.folderId === item.id);
    item.children = children.map((page) => ({ ...page, type: 'Page' }));
    item.isExpanded = item.children.find((child) => child.type === 'Page' && child.active) ? true : item.isExpanded;
  });

  const tree = [
    ...folders.map((folder) => ({
      ...folder,
      type: 'Folder',
    })),
    ...pageWithNoFolders.map((page) => ({ ...page, type: 'Page' })),
  ] as PageTreeItem[];
  return tree;
}

export function formatStringToSlug(str: string): string {
  return str
    .replace(/^\/+|\/+$/g, '') // Remove leading and trailing slashes
    .replace(/\/{2,}/g, '/') // Replace multiple consecutive slashes with a single slash
    .replace(/ /g, '-') // Replace spaces with hyphens
    .replace(/\/+$/g, '') // Remove trailing slashes after replacement
    .replace(/^\/+/g, ''); // Remove leading slashes after replacement
}

function isValidEmail(email: string) {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function areAllEmailsValid(emails: string[]) {
  // Check if every email in the array is valid
  return emails.every((email) => isValidEmail(email));
}

export function stringToColor(string: string) {
  // Hash the string to a number
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a color
  const color = `#${(hash & 0x00ffffff).toString(16).padStart(6, '0')}`;
  return color;
}

export async function signToken({ token }: { token: string }) {
  const secret = new TextEncoder().encode(JSON_WEB_SECRET);
  const alg = 'HS256';

  const jwt = await new jose.SignJWT({ token })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:visio:issuer')
    .setAudience('urn:visio:audience')
    .setExpirationTime('1h')
    .sign(secret);

  return jwt;
}

export async function verifyToken({ token }: { token: string }) {
  const secret = new TextEncoder().encode(JSON_WEB_SECRET);
  const alg = 'HS256';

  const jwt = await jose.jwtVerify(token, secret, { algorithms: [alg] });

  return jwt;
}

export function groupBlocks(blocks: BlockList[]): { groupName: string; blocks: BlockList[] }[] {
  const grouped: GroupedBlock = blocks.reduce((acc: GroupedBlock, block) => {
    const group = block.group || 'Ungrouped'; // Default to 'Ungrouped' if no group is specified
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(block);
    return acc;
  }, {});

  // Convert grouped object to array of GroupedBlock
  return Object.entries(grouped).map(([groupName, blocks]) => ({
    groupName,
    blocks,
  }));
}

export const sendMessageToParent = (messageToSend: Message) => {
  window.parent.postMessage(messageToSend, '*'); // Replace '*' with the specific origin if needed
};

export function isValidURL(url: string): boolean {
  try {
    // Create a new URL object to check the validity
    const parsedURL = new URL(url);

    // Optional: You can add more specific validations here
    const validProtocols = ['http:', 'https:', 'ftp:', 'tel:', 'mailto:']; // Adjust as needed
    if (!validProtocols.includes(parsedURL.protocol)) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
}

export type Path = (string | number)[];
type NestedObject = { [key: string]: any } | any[];

export function updateValueByPath<T extends NestedObject>(obj: T, path: Path, newValue: any): T {
  if (path.length === 0) return obj;

  const key = path[0];

  if (path.length === 1) {
    if (Array.isArray(obj)) {
      const newArray = [...obj];
      newArray[key as number] = newValue;
      return newArray as T;
    } else {
      return {
        ...obj,
        [key]: newValue,
      };
    }
  }

  const nextObj = obj[key as keyof T];

  if (typeof nextObj !== 'object' || nextObj === null) {
    throw new Error(`Path "${key}" does not lead to a nested object or array.`);
  }

  const updatedNextObj = updateValueByPath(nextObj as NestedObject, path.slice(1), newValue);

  if (Array.isArray(obj)) {
    const newArray = [...obj];
    newArray[key as number] = updatedNextObj;
    return newArray as T;
  } else {
    return {
      ...obj,
      [key]: updatedNextObj,
    };
  }
}

export function convertToTitleCase(input: string): string {
  // Convert camelCase to snake_case by inserting an underscore before each uppercase letter and lowercasing everything
  const snakeCase = input.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

  // Split the snake_case string by underscores
  const words = snakeCase.split('_');

  // Capitalize the first letter of each word and join them with spaces
  const titleCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return titleCase;
}

export function getValueByPath(obj: any, path: Path): any {
  const newObj = lodash.cloneDeep(obj);
  return path.reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, newObj);
}

export function stripHtmlTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, '');
}

export function getProjectMode() {
  if (typeof window === 'undefined') return 'LIVE';

  if (
    window.location.pathname.includes(PAGES.PAGE_CONTENT) ||
    window.location.pathname.includes(PAGES.GLOBAL_BLOCK_EDIT_CONTENT)
  ) {
    return 'BUILDER';
  } else if (window.location.pathname.includes(PAGES.PREVIEW_PAGE)) {
    return 'PREVIEW';
  } else {
    return 'LIVE';
  }
}

export function updateColorById(
  data: { [key: string]: any }[],
  targetId: string,
  newColorHex: string,
  newColorName: string,
): { [key: string]: any }[] {
  // Recursive helper function to traverse and update the color
  function traverseAndUpdate(obj: any): any {
    // Create a shallow copy of the object to avoid mutation
    const newObj = { ...obj };

    // Check if the current object has an 'id' field that matches the targetId
    if (newObj.id === targetId) {
      newObj.colorHex = newColorHex;
      newObj.colorName = newColorName;
    }

    // Iterate over all keys in the current object
    for (const key in newObj) {
      if (Object.prototype.hasOwnProperty.call(newObj, key)) {
        const value = newObj[key];

        // If the value is an array of objects, recurse and update it
        if (Array.isArray(value)) {
          newObj[key] = value.map((item) =>
            typeof item === 'object' && item !== null ? traverseAndUpdate(item) : item,
          );
        }
        // If the value is an object, recurse and update it
        else if (typeof value === 'object' && value !== null) {
          newObj[key] = traverseAndUpdate(value);
        }
      }
    }

    return newObj;
  }

  // Return a new array with updated elements
  return data.map((item) => traverseAndUpdate(item));
}

export function groupSideEditingProps(items: SideEditingProps[]): { group: string; items: SideEditingProps[] }[] {
  const groupedItems: { [key: string]: SideEditingProps[] } = items.reduce(
    (acc, item) => {
      const group = item.group || 'default';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {} as { [key: string]: SideEditingProps[] },
  );

  // Convert the grouped object into an array
  return Object.keys(groupedItems).map((group) => ({
    group,
    items: groupedItems[group],
  }));
}

export function getLink(link: string) {
  const projectMode = getProjectMode();
  let href = link;
  const { pages } = usePageContentState.getState();
  const { pages: newPages } = usePagesState.getState();

  const { locale } = getParams<{ locale: string }>();
  const page = pages.find((page) => page.id === link) || newPages.find((page) => page.id === link);
  if (page) {
    href =
      projectMode === 'BUILDER'
        ? `#`
        : projectMode === 'PREVIEW'
          ? `${PAGES.PREVIEW_PAGE}/${page.id}`
          : `/${locale}${page.slug}`;
  } else {
    href = projectMode === 'BUILDER' ? `#` : href;
  }

  return href;
}

export function getColor(color: Color): string {
  const { theme } = usePageContentState.getState();
  const foundColor = theme.colorScheme.find((c) => c.id === color.id)?.colorHex || color.colorHex;
  return foundColor;
}

export function getImageUrl(image: MediaFile): string {
  const db = supabase();
  if (image?.mediaHash?.includes('https') || image?.mediaHash?.includes('http')) {
    return `${image.mediaHash}`;
  }
  const projectMode = getProjectMode();

  if (projectMode === 'LIVE') {
    const { projectId } = usePageContentState.getState();
    return projectId ? `https://${projectId}.supabase.co/storage/v1/object/public/media/${image?.mediaHash}` : '';
  }
  const { bucketName, allowImageTransformation } = useProjectConfigurationState.getState();
  const { allowImageTransformation: pageContent_allowImageTransformation } = usePageContentState.getState();
  const data: { [keys: string]: any } = {};
  if (allowImageTransformation || pageContent_allowImageTransformation) {
    data['transform'] = {
      width: image?.width,
      height: image?.height,
    };
  }
  const publicUrl = db.storage.from(bucketName).getPublicUrl(image?.mediaHash || '', data).data.publicUrl;
  return `${publicUrl}`;
}

export function findObjectWithParents(array: ListSchema[], targetPropName: string): ListSchema[] | null {
  for (const item of array) {
    if (item.propName === targetPropName) {
      return [item]; // Return the found object as an array
    }

    // If the item has subLists, search within them recursively
    if (item.subLists && item.subLists.length > 0) {
      const result = findObjectWithParents(item.subLists, targetPropName);
      if (result) {
        return [item, ...result]; // Return the current item and the found object(s)
      }
    }
  }

  return null; // No matching object found
}

function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export function deleteItemByPathArray(data: NestedObject, path: string[]): NestedObject | null {
  // Clone the original data to avoid mutating it
  const dataCopy = deepClone(data);

  let currentLevel: any = dataCopy;

  // Traverse to the second last element of the path
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const index = parseInt(key, 10);

    if (Array.isArray(currentLevel) && !isNaN(index)) {
      currentLevel = currentLevel[index];
    } else if (typeof currentLevel === 'object' && key in currentLevel) {
      currentLevel = currentLevel[key];
    } else {
      return null; // Path is invalid
    }
  }

  const lastIndex = parseInt(path[path.length - 1], 10);

  // Check if the target exists and delete it
  if (Array.isArray(currentLevel) && !isNaN(lastIndex)) {
    currentLevel.splice(lastIndex, 1);
    return dataCopy; // Return the updated copy
  }

  return null; // Target not found or not deletable
}

export function moveItemByPathArray(data: NestedObject, path: string[], direction: 'up' | 'down'): NestedObject | null {
  // Clone the original data to avoid mutating it
  const dataCopy = deepClone(data);

  let currentLevel: any = dataCopy;
  let parentArray: any[] | null = null;
  let indexToMove: number | null = null;

  // Traverse to the level before the target item
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const index = parseInt(key, 10);

    if (Array.isArray(currentLevel) && !isNaN(index)) {
      parentArray = currentLevel;
      currentLevel = currentLevel[index];
    } else if (typeof currentLevel === 'object' && key in currentLevel) {
      currentLevel = currentLevel[key];
      if (Array.isArray(currentLevel)) {
        parentArray = currentLevel;
      }
    } else {
      return null; // Path is invalid
    }
  }

  indexToMove = parseInt(path[path.length - 1], 10);

  // Ensure we have a valid array to move the item in
  if (Array.isArray(parentArray) && !isNaN(indexToMove) && parentArray[indexToMove] !== undefined) {
    const item = parentArray[indexToMove];
    const newIndex = direction === 'up' ? indexToMove - 1 : indexToMove + 1;

    if (newIndex >= 0 && newIndex < parentArray.length) {
      // Remove item from the old position
      parentArray.splice(indexToMove, 1);
      // Insert item at the new position
      parentArray.splice(newIndex, 0, item);
      return dataCopy; // Return the updated copy
    } else {
      return null; // Direction out of bounds
    }
  }

  return null; // Target not found or path is invalid
}

type Position = 'first' | 'last' | 'firstAndLast' | 'middle' | null;

export function getItemPositionByPathArray(data: NestedObject, path: string[]): Position {
  let currentLevel: any = data;
  let indexToCheck: number | null = null;

  // Traverse to the level before the target item
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const index = parseInt(key, 10);

    if (Array.isArray(currentLevel) && !isNaN(index)) {
      currentLevel = currentLevel[index];
    } else if (typeof currentLevel === 'object' && key in currentLevel) {
      currentLevel = currentLevel[key];
    } else {
      return null; // Path is invalid
    }
  }

  // The last item in the path is the index to check within the currentLevel array
  indexToCheck = parseInt(path[path.length - 1], 10);

  // Ensure we have a valid array to check position
  if (Array.isArray(currentLevel) && !isNaN(indexToCheck) && currentLevel[indexToCheck] !== undefined) {
    const isOnlyItem = currentLevel.length === 1;
    const isFirst = indexToCheck === 0;
    const isLast = indexToCheck === currentLevel.length - 1;

    if (isOnlyItem) {
      return 'firstAndLast'; // Item is the only one in the array
    } else if (isFirst) {
      return 'first'; // Item is the first item in the array
    } else if (isLast) {
      return 'last'; // Item is the last item in the array
    } else {
      return 'middle'; // Item is neither at the beginning nor at the end
    }
  }

  return null; // Path is invalid or item not found
}

export async function updateOrInsertProjectConfig(configData: object) {
  const db = supabase();
  const { data } = await db.from('project_configuration').select().limit(1);
  if (data && data.length) {
    const { error } = await db.from('project_configuration').update(configData).eq('id', data[0].id);
    if (error) throw error;
  } else {
    const { error } = await db.from('project_configuration').insert(configData);
    if (error) throw error;
  }
}

export async function fetchProjectConfig() {
  const db = supabase();
  const projectMode = getProjectMode();
  const { setTheme, setGlobalBlocks, setScripts } = useProjectConfigurationState.getState();
  const { tabs } = useTabState.getState();

  const { setTheme: setPageContentTheme, setGlobalBlocks: setPageContentGlobalBlocks } = usePageContentState.getState();
  const { data, error } = await db.from('project_configuration').select().limit(1);

  if (error) throw error;

  setTheme((data && data[0]?.theme) || { colorScheme: [] });
  if (tabs.filter((tab) => tab.type === 'globalBlock').length === 0) {
    setGlobalBlocks((data && data[0]?.global_blocks) || []);
  }
  setScripts((data && data[0]?.scripts) || { header: '', body: '' });

  if (projectMode === 'BUILDER') {
    setPageContentTheme((data && data[0]?.theme) || { colorScheme: [] });
    if (tabs.filter((tab) => tab.type === 'globalBlock').length === 0) {
      setPageContentGlobalBlocks((data && data[0]?.global_blocks) || []);
    }
  }
}

export async function updatePageData(dataObject: { [key: string]: any }, pageId: string, isManualSave = false) {
  const db = supabase();
  const { pages } = usePagesState.getState();
  const { user } = useAuthState.getState();
  const page = pages.find((page) => page.id === pageId);

  if (!page || (!page.autoSave && !isManualSave)) return;

  const { data: foundPageData, error: foundPageError } = await db.from('pages').select().eq('id', page.id);
  if (foundPageError) throw foundPageError;

  const pageBlocks = foundPageData[0].blocks;
  if (
    foundPageData[0].status[page.activeLanguageLocale] === 'Publish' ||
    dataObject?.['status']?.[page.activeLanguageLocale] === 'Publish'
  ) {
    pageBlocks[page.activeLanguageLocale] =
      dataObject?.['blocks_dev']?.[page.activeLanguageLocale] || page.blocks?.[page.activeLanguageLocale];
    dataObject['blocks'] = pageBlocks;
  }

  if (dataObject?.['status']?.[page.activeLanguageLocale] || dataObject?.['publish_date']) {
    let action = 'DELETE';
    if (dataObject?.['publish_date'] || dataObject?.['status']?.[page.activeLanguageLocale] === 'Schedule') {
      action = 'CREATE';
    }
    const { error: cronError } = await db.functions.invoke('cron-job', {
      body: {
        action,
        date: dataObject?.['publish_date'] || new Date(),
        name: `${page.id}-locale-${page.activeLanguageLocale}`,
      },
    });

    if (cronError) throw cronError;
  }

  const filteredDataObject = filterObject(dataObject);
  const data = {
    name: page.name,
    slug: page.slug,
    status: page.status,
    seo: page.seo,
    blocks_dev: page.blocks,
    tags: page.tags,
    author: user?.user_metadata.id,
    publish_date: null,
    ...filteredDataObject,
  };

  const { error } = await db.from('pages').update(data).eq('id', pageId);
  if (error) throw error;
}

function filterObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const allowedColumns = ['name', 'slug', 'status', 'tags', 'seo', 'blocks_dev', 'blocks', 'folder_id', 'publish_date'];
  return Object.fromEntries(Object.entries(obj).filter(([key]) => allowedColumns.includes(key))) as Partial<T>;
}

export type PageData = {
  pageBlocks: PageBlock[];
  pages: Page[];
  projectConfiguration: {
    globalBlocks: ProjectConfiguration['globalBlocks'];
    theme: ProjectConfiguration['theme'];
    scripts: { head: string; body: string };
  };
  params: { [key: string]: any };
};

export async function getPageBlocks(
  slug: string,
  locale: string,
  config: ProjectConfig,
): Promise<PageData & { error?: string }> {
  const url = `${config.supabaseProjectUrl}/functions/v1/get-page-blocks`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slug, locale }),
  };

  const response = await fetch(url, options);

  const externalData = config.routeHandlers ? await config.routeHandlers(slug) : null;

  if (response.status === 200) {
    const data = await response.json();
    const blockExternalData = await getBlockExternalData(data.pageBlocks, config.blocks);
    data.params = { externalData: {...externalData, ...blockExternalData}, ...data.params,  };
    return { ...data, error: null } as PageData;
  } else if (response.status === 404) {
    return { error: 'page not found' } as PageData & { error: string };
  } else {
    // Handle other potential status codes if necessary
    return { error: `unexpected error: ${response.status}` } as PageData & { error: string };
  }
}

export async function getBlockExternalData(pageBlocks: PageBlock[] | GlobalBlock[], configBlocks: ProjectConfig['blocks'], cache: { [key: string]: any } = {}): Promise<{ [key: string]: any }> {
  const extralData: {
    blockExternalData: { [key: string]: any };
    blockId: string;
    pageBlockId: string;
  }[] = []

  for (const block of pageBlocks) {
     const foundBlockData = configBlocks.find((b) => b.id === block.blockId);
     console.log(configBlocks, 'found blog', pageBlocks)
     const foundExternalBlockData = extralData.find((b) => b.blockId === block.blockId);
      if (foundBlockData?.getExternalData) {
        console.log(configBlocks, pageBlocks )
        let blockExternalData = {}
        try {
           if(cache[block.id]) {
              blockExternalData = cache[block.id]
           }else{
            blockExternalData = foundExternalBlockData ? foundExternalBlockData.blockExternalData  :  await foundBlockData.getExternalData(block.inputs)
           }
        } catch (error) {
          blockExternalData = {}
        }
        const d = {
          pageBlockId: block.id,
          blockId: block.blockId,
          blockExternalData
        }
        extralData.push(d);


      }
  }

  const data: {[key:string]: any} = {}

  for (const d of extralData) {
    data[d.pageBlockId] = d.blockExternalData
  }

  return data
}

type PageMeta = {
  seo: {
    title: string;
    description: string;
    keywords: string;
    featuredImage?: string;
  };
  params: { [key: string]: any };
  error?: string;
};
export async function getPageMetaData(
  slug: string,
  supabaseAnonKey: string,
  supabaseProjectUrl: string,
  locale: string,
): Promise<PageMeta> {
  const url = `${supabaseProjectUrl}/functions/v1/get-page-meta`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slug, locale }),
  };

  const response = await fetch(url, options);

  function extractProjectId(url: string): string {
    // Split the URL by '/' and get the hostname
    const hostname = url.split('//')[1]?.split('.')[0];

    // If hostname is not found, return an empty string
    if (!hostname) {
      return '';
    }

    return hostname;
  }

  if (response.status === 200) {
    const data = await response.json();
    const projectId = extractProjectId(supabaseProjectUrl);
    const featuredImage = `https://${projectId}.supabase.co/storage/v1/object/public/media/${data?.featuredImage}`;
    return { ...data, featuredImage, error: null } as PageMeta;
  } else if (response.status === 404) {
    return { error: 'page meta not found' } as PageMeta & { error: string };
  } else {
    // Handle other potential status codes if necessary
    return { error: `unexpected error: ${response.status}` } as PageMeta & { error: string };
  }
}

export function getParams<T>(): T {
  const { params } = useParamState.getState();
  return params as T;
}

export function removeHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

type BuilderPage = {
  slug: string;
  element: React.ComponentType<any>;
};

type MatchResult = {
  page: BuilderPage;
  params: { [key: string]: string };
} | null;

export function matchSlug(slug: string, pages: BuilderPage[]): MatchResult {
  // Normalize the slug by removing any trailing slashes
  const normalizedSlug = slug.endsWith('/') ? slug.slice(0, -1) : slug;

  // First, check for an exact match
  const exactMatch = pages.find((page) => page.slug === normalizedSlug);
  if (exactMatch) return { page: exactMatch, params: {} };

  // If no exact match, look for a pattern match
  for (const page of pages) {
    const pageParts = page.slug.split('/');
    const slugParts = normalizedSlug.split('/');

    if (pageParts.length !== slugParts.length) continue;

    let isMatch = true;
    const params: { [key: string]: string } = {};

    for (let i = 0; i < pageParts.length; i++) {
      if (pageParts[i].startsWith(':')) {
        // It's a parameter, so capture its value
        const paramName = pageParts[i].slice(1);
        params[paramName] = slugParts[i];
      } else if (pageParts[i] !== slugParts[i]) {
        // If parts don't match, it's not a match
        isMatch = false;
        break;
      }
    }

    if (isMatch) return { page, params };
  }

  // If no match is found
  return null;
}

export function buildConfig(props: ProjectConfig): ProjectConfig {
  return props;
}

export function updateIsSelectedByBlockId(obj: any, blockIdToSelect: string): any {
  // Iterate through all keys in the object
  for (const key in obj) {
    if (key in obj) {
      const value = obj[key];

      // If the current key is "blockId" and it matches the passed blockId, set isSelected to true
      if (key === 'blockId' && 'isSelected' in obj) {
        obj.isSelected = obj.id == blockIdToSelect ? true : false;
      }

      // If the value is an object, recursively call the function
      if (typeof value === 'object' && value !== null) {
        updateIsSelectedByBlockId(value, blockIdToSelect);
      }

      // If the value is an array, traverse each element
      if (Array.isArray(value)) {
        value.forEach((item) => updateIsSelectedByBlockId(item, blockIdToSelect));
      }
    }
  }

  return obj;
}

export function getSelectedBlock(obj: any, id?: string): any | null {
  // Iterate through all keys in the object
  for (const key in obj) {
    if (key in obj) {
      const value = obj[key];

      // If the current object has the 'isSelected' key and it's true, return this object

      if (id && id == obj.id) {
        return obj;
      } else if (!id && 'isSelected' in obj && obj.isSelected === true) {
        return obj;
      }

      // If the value is an object, recursively call the function
      if (typeof value === 'object' && value !== null) {
        const selectedBlock = getSelectedBlock(value, id);
        if (selectedBlock) {
          return selectedBlock;
        }
      }

      // If the value is an array, traverse each element
      if (Array.isArray(value)) {
        for (const item of value) {
          const selectedBlock = getSelectedBlock(item, id);
          if (selectedBlock) {
            return selectedBlock;
          }
        }
      }
    }
  }

  return null; // If no selected block is found, return null
}

export function getSelectedBlockPath(obj: any, blockId: string, path: string = ''): string | null {
  // Iterate through all keys in the object
  for (const key in obj) {
    if (key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key; // Update the path

      // Check if the current object has the 'blockId' and matches the provided blockId
      if (obj.id == blockId) {
        return path;
      }

      // If the value is an object, recursively call the function
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const result = getSelectedBlockPath(value, blockId, currentPath);
        if (result) {
          return result;
        }
      }

      // If the value is an array, traverse each element
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const result = getSelectedBlockPath(value[i], blockId, `${currentPath}.${i}`);
          if (result) {
            return result;
          }
        }
      }
    }
  }

  return null; // If no matching block is found
}

interface Block {
  products?: any[];
  total?: number;
  [key: string]: any;
}

interface Data {
  books?: any[];
  authorNumber?: number;
  [key: string]: any;
}

export function extractBlockData(data: Data, blockId: string): Data & Block {

  // Create a new object to store the result
  const result: Data & Block = {};

  // Iterate over each key in the original data object
  for (const key in data) {
    // Check if the key is a non-block ID key
    if (!/^\d+$/.test(key)) {
      // Add the key-value pair to the result object
      result[key] = data[key];
    }
  }

  // Check if the blockId exists in the data
  if (data[blockId]) {
    // Merge the block's properties into the result object
    Object.assign(result, data[blockId]);
  }


  return result;
}
