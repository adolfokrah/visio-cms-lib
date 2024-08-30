import { Block, Color, MediaFile } from '@/lib/exposed-types';
import Text from '../exposed-components/text';
import { cn, getColor, getLink, getProjectMode } from '@/lib/utils';
import Image from '../exposed-components/image';
import List from '../exposed-components/list';
type NavbarProps = {
  logo: MediaFile;
  links: {
    title: string;
    url: string;
    itemKey: string;
    subLinks?: {
      title: string;
      url: string;
      itemKey: string;
      subsubLinks?: {
        title: string;
        url: string;
        itemKey: string;
        lastSubLInk?: { title: string; url: string; itemKey: string }[];
      }[];
    }[];
  }[];
  pageBlockId?: string;
  sideButtons: {
    title: string;
    url: string;
    color: Color;
  }[];
};

const Navbar: Block<NavbarProps> = ({ links, pageBlockId = '', logo, sideButtons }) => {
  const projectMode = getProjectMode();

  return (
    <nav
      className={cn(
        'visio-cms-p-2  visio-cms-w-full visio-cms-justify-between visio-cms-flex visio-cms-gap-2 visio-cms-items-center visio-cms-bg-white ',
        {
          'visio-cms-fixed visio-cms-z-30': projectMode != 'BUILDER',
        },
      )}
    >
      <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center">
        <Image
          pageBlockId={pageBlockId}
          defaultValue={logo}
          propName="logo"
          renderImage={({ imagePublicUrl, altText, width, height }) => (
            <a href="#">
              <img src={imagePublicUrl} alt={altText} width={width} height={height} />
            </a>
          )}
        />

        <List
          propName="links"
          pageBlockId={pageBlockId}
          defaultPropValues={links}
          className="visio-cms-flex visio-cms-gap-4 visio-cms-relative visio-cms-items-center"
          listItemClassName="visio-cms-group visio-cms-relative"
          renderComponent={(link, index) => (
            <>
              <a
                href={getLink(link.url)}
                key={`${link.title}-${index}`}
                className="visio-cms-relative visio-cms-p-2 hover:visio-cms-bg-gray-100 visio-cms-cursor-pointer visio-cms-inline-block "
              >
                <Text pageBlockId={pageBlockId} defaultValue={link.title} propName={`links.${index}.title`} />
              </a>

              <List
                propName={`links.${index}.subLinks`}
                pageBlockId={pageBlockId}
                defaultPropValues={link.subLinks}
                className="visio-cms-absolute visio-cms-left-0 visio-cms-top-[100%] visio-cms-hidden group-hover:visio-cms-block hover:visio-cms-block visio-cms-w-max visio-cms-min-w-[200px] visio-cms-bg-white visio-cms-shadow-md visio-cms-rounded-md visio-cms-z-10"
                listItemClassName="visio-cms-relative visio-cms-group/item"
                renderComponent={(subLink, subIndex) => (
                  <>
                    <a
                      href={getLink(subLink.url)}
                      key={`${subLink.title}-${subIndex}`}
                      className="visio-cms-relative visio-cms-p-2  visio-cms-w-full hover:visio-cms-bg-gray-100 visio-cms-cursor-pointer visio-cms-inline-block"
                    >
                      <Text
                        pageBlockId={pageBlockId}
                        defaultValue={subLink.title}
                        propName={`links.${index}.subLinks.${subIndex}.title`}
                      />
                    </a>

                    <List
                      propName={`links.${index}.subLinks.${subIndex}.subsubLinks`}
                      pageBlockId={pageBlockId}
                      defaultPropValues={subLink.subsubLinks}
                      className="visio-cms-absolute visio-cms-left-[100%] group-hover/item:visio-cms-block visio-cms-hidden visio-cms-top-0 visio-cms-bg-white visio-cms-shadow-md visio-cms-rounded-md visio-cms-z-10 visio-cms-w-[200px]"
                      renderComponent={(subsubLink, subSubIndex) => (
                        <>
                          <a
                            href={getLink(subsubLink.url)}
                            key={`${subsubLink.title}-${subSubIndex}`}
                            className="visio-cms-relative visio-cms-p-2 visio-cms-w-full  hover:visio-cms-bg-gray-100 visio-cms-cursor-pointer visio-cms-inline-block"
                          >
                            <Text
                              pageBlockId={pageBlockId}
                              defaultValue={subsubLink.title}
                              propName={`links.${index}.subLinks.${subIndex}.subsubLinks.${subSubIndex}.title`}
                            />
                          </a>
                        </>
                      )}
                    />
                  </>
                )}
              />
            </>
          )}
        />
      </div>

      <List
        propName="sideButtons"
        pageBlockId={pageBlockId}
        className="visio-cms-flex visio-cms-gap-2"
        defaultPropValues={sideButtons}
        renderComponent={(button, index) => (
          <a
            href={getLink(button.url)}
            key={`${button.title}-${index}`}
            className="visio-cms-px-3.5 visio-cms-py-1.5 hover:visio-cms-bg-indigo-500 visio-cms-cursor-pointer visio-cms-bg-indigo-400 visio-cms-rounded-md visio-cms-text-white visio-cms-inline-block"
            style={{ backgroundColor: getColor(button.color) }}
          >
            {button.title}
          </a>
        )}
      />
    </nav>
  );
};

Navbar.Schema = {
  name: 'Navbar',
  id: 'navbar',
  sideEditingProps: [
    {
      type: 'image',
      propName: 'logo',
      label: 'Logo',
      hide: ({ sideButtons }) => {
        return sideButtons.length > 0;
      },
    },
  ],
  defaultPropValues: {
    sideButtons: [],
    logo: {
      mediaHash: 'https://placehold.co/70x70',
      altText: 'Hero Image',
      width: 70,
      height: 70,
    },
    links: [
      { title: 'Home', url: '/', itemKey: 'home' },
      { title: 'About', url: '/about', itemKey: 'about' },
      { title: 'Contact', url: '/contact', itemKey: 'contact' },
    ],
  },
  group: 'Navigation',
  lists: [
    {
      propName: 'links',
      label: 'Link',
      defaultValue: {
        title: 'Home',
        url: '/',
      },
      sideEditingProps: [
        {
          type: 'link',
          propName: 'url',
          label: 'URL',
        },
      ],
      maxCount: 5,
      subLists: [
        {
          propName: 'links.subLinks',
          label: 'Sub Link',
          defaultValue: {
            title: 'Sub Link',
            url: '/sub-link',
          },
          maxCount: 2,
          subLists: [
            {
              propName: 'links.subLinks.subsubLinks',
              label: 'Sub Sub Link',
              defaultValue: {
                title: 'Sub Sub Link',
                url: '/sub-link',
              },
              maxCount: 2,
            },
          ],
        },
      ],
    },
    {
      propName: 'sideButtons',
      label: 'Side Buttons',
      defaultValue: {
        title: 'Button',
        url: '/button',
        color: { colorHex: '#000000', id: '1', colorName: 'Black' },
      },
      sideEditingProps: [
        {
          type: 'text',
          propName: 'title',
          label: 'Title',
        },
        {
          type: 'link',
          propName: 'url',
          label: 'URL',
        },
        {
          type: 'color',
          propName: 'color',
          label: 'Color',
          hide: (data) => {
            return data?.sideButtons[0]?.title.length < 1;
          },
        },
      ],
    },
  ],
};

export default Navbar;
