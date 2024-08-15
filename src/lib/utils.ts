import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BlockList, Folder, GroupedBlock, Message, OsTypes, PageTreeItem } from './types';
import { Page } from './states/usePagesState';
import * as jose from 'jose';
import { JSON_WEB_SECRET } from './constants';
import { useDbState } from './states/usedbState';

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
    const group = block.Schema.group || 'Ungrouped'; // Default to 'Ungrouped' if no group is specified
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

export type NestedObject = { [key: string]: any };

export function updateBlockInputs(obj: NestedObject, path: string, newValue: any): void {
  const pathParts = path
    .replace(/(\?\.)|(\?\[)/g, '.?') // Replace optional chaining with a more standard notation
    .replace(/\]\./g, '].') // Adjust bracket notation
    .split('.'); // Split path into parts

  const lastKey = pathParts.pop(); // Extract the last key to update

  if (!lastKey) return;

  const lastPart = pathParts.reduce<NestedObject>((acc, part, index) => {
    // Handle array indexing
    const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const [, key, index] = arrayMatch;
      acc = acc[key] ? acc[key][parseInt(index, 10)] : undefined;
    } else {
      acc = acc[part];
    }
    // Create nested objects if they do not exist
    if (index === pathParts.length - 1 && !acc[lastKey]) {
      acc[lastKey] = newValue; // Ensure the final key exists
    }
    return acc;
  }, obj);

  // Set the new value
  if (typeof lastPart === 'object' && lastPart !== null) {
    // Handle array indexing for last part
    const arrayMatch = lastKey.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const [, key, index] = arrayMatch;
      lastPart[key][parseInt(index, 10)] = newValue;
    } else {
      lastPart[lastKey] = newValue;
    }
  } else {
    obj[lastKey] = newValue;
  }
}
