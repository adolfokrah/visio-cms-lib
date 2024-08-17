import { Block } from '@/lib/exposed-types';
import { Repeater } from '../exposed-components/repeater';
import Text from '../exposed-components/text';

type NavbarProps = {
  links: {
    title: string;
    url: string;
    subLinks?: {
      title: string;
      url: string;
      subsubLinks?: {
        title: string;
        url: string;
        lastSubLInk?: { title: string; url: string }[];
      }[];
    }[];
  }[];
  pageBlockId?: string;
};

const Navbar: Block<NavbarProps> = ({ links, pageBlockId = '' }) => {
  return (
    <div className="visio-cms-p-12">
      <ul>
        <Repeater
          pageBlockId={pageBlockId}
          defaultValue={links}
          propName="links"
          renderBlock={(index, { title, subLinks }, pathName) => (
            <li key={title}>
              <Text propName={`${pathName}.title`} pageBlockId={pageBlockId} defaultValue={title} />

              <Repeater
                pageBlockId={pageBlockId}
                defaultValue={subLinks || []}
                propName={`${pathName}.subLinks`}
                renderBlock={(subIndex, { title, subsubLinks }, pathName) => (
                  <li key={title} className="visio-cms-pl-2">
                    <Text propName={`${pathName}.title`} pageBlockId={pageBlockId} defaultValue={title} />

                    <Repeater
                      pageBlockId={pageBlockId}
                      defaultValue={subsubLinks || []}
                      propName={`${pathName}.subsubLinks`}
                      renderBlock={(subsubIndex, { title, lastSubLInk }, pathName) => (
                        <li key={title} className="visio-cms-pl-2">
                          <Text propName={`${pathName}.title`} pageBlockId={pageBlockId} defaultValue={title} />

                          <Repeater
                            pageBlockId={pageBlockId}
                            defaultValue={lastSubLInk || []}
                            propName={`${pathName}.lastSubLInk`}
                            renderBlock={(lastSubLInkIndex, { title }, pathName) => (
                              <li key={title} className="visio-cms-pl-2">
                                <Text propName={`${pathName}.title`} pageBlockId={pageBlockId} defaultValue={title} />
                              </li>
                            )}
                          />
                        </li>
                      )}
                    />
                  </li>
                )}
              />
            </li>
          )}
        />
      </ul>
    </div>
  );
};

Navbar.Schema = {
  name: 'Navbar',
  id: 'navbar',
  sideEditingProps: [],
  defaultPropValues: {
    links: [
      {
        title: 'Home',
        url: '/',
        subLinks: [
          {
            title: 'Sublink 1',
            url: '/sublink-1',
            subsubLinks: [
              {
                title: 'Subsublink 1',
                url: '/subsublink-1',
                lastSubLInk: [{ title: 'Last Sublink', url: '/last-sublink' }],
              },
              { title: 'Subsublink 2', url: '/subsublink-2' },
            ],
          },
          { title: 'Sublink 2', url: '/sublink-2' },
        ],
      },
      { title: 'About', url: '/about' },
      { title: 'Contact', url: '/contact' },
    ],
  },
  group: 'Navigation',
};

export default Navbar;
