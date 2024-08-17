import { Block } from '@/lib/exposed-types';
import Text from '../exposed-components/text';
import { Repeater, RepeaterItem } from '../exposed-components/repeater';

const navigation = {
  solutions: [
    { name: 'Marketing', href: '#', itemKey: '2423423423' },
    { name: 'Analytics', href: '#', itemKey: 'sdsgadgfasfsd' },
    { name: 'Commerce', href: '#', itemKey: 'sdfasgsf' },
    { name: 'Insights', href: '#', itemKey: 'sgsdkklagslksfd' },
  ],
  support: [
    { name: 'Pricing', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
    { name: 'API Status', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Claim', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'X',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

interface NavigationItem {
  solutionsHeader: string;
  supportHeader: string;
  companyHeader: string;
  subscriptionHeader: string;
  pageBlockId?: string;
  solutions: {
    name: string;
    href: string;
    itemKey: string;
    subSolutions?: { name: string; href: string; itemKey: string }[];
  }[];
}

const Footer: Block<NavigationItem> = ({
  solutionsHeader,
  supportHeader,
  companyHeader,
  subscriptionHeader,
  pageBlockId = '',
  solutions,
}) => {
  return (
    <footer aria-labelledby="footer-heading" className="visio-cms-bg-gray-900">
      <h2 id="footer-heading" className="visio-cms-sr-only">
        Footer
      </h2>
      <div className="visio-cms-mx-auto visio-cms-max-w-7xl visio-cms-px-6 visio-cms-pb-8 visio-cms-pt-20 sm:visio-cms-pt-24 lg:visio-cms-px-8 lg:visio-cms-pt-32">
        <div className="xl:visio-cms-grid xl:visio-cms-grid-cols-3 xl:visio-cms-gap-8">
          <div className="visio-cms-grid visio-cms-grid-cols-2 visio-cms-gap-8 xl:visio-cms-col-span-2">
            <div className="md:visio-cms-grid md:visio-cms-grid-cols-2 md:visio-cms-gap-8">
              <div>
                <h3 className="visio-cms-text-sm visio-cms-font-semibold visio-cms-leading-6 visio-cms-text-white">
                  <Text
                    pageBlockId={pageBlockId}
                    allowedControls={['bold', 'italic', 'text-color']}
                    defaultValue={solutionsHeader}
                    propName="solutionsHeader"
                  />
                </h3>
                <Repeater
                  component={'ul'}
                  defaultValue={solutions}
                  pageBlockId={pageBlockId}
                  propName="solutions"
                  className="visio-cms-mt-6 visio-cms-space-y-4"
                  renderBlock={(index, { name, href, subSolutions, itemKey }, pathName) => (
                    <RepeaterItem
                      propName={`${pathName}`}
                      component="li"
                      key={`${itemKey}-${name}`}
                      subRepeatersSchema={[
                        {
                          name: 'subSolutions',
                          schema: {
                            name: 'Sub Solutions',
                            href: '/sub-solutions',
                          },
                        },
                        {
                          name: 'subWorkers',
                          schema: {
                            name: 'Sub Workers',
                            href: '/sub-workers',
                          },
                        },
                        {
                          name: 'anti_toxic',
                          schema: {
                            name: 'Anti Toxic',
                            href: '/ant-toxic',
                          },
                        },
                      ]}
                    >
                      <a
                        href={href}
                        className="visio-cms-text-sm visio-cms-leading-6 visio-cms-text-gray-300 hover:visio-cms-text-white"
                      >
                        <Text pageBlockId={pageBlockId} defaultValue={name} propName={`${pathName}.name`} />
                      </a>

                      {subSolutions && (
                        <Repeater
                          component={'ul'}
                          defaultValue={subSolutions}
                          pageBlockId={pageBlockId}
                          propName={`${pathName}.subSolutions`}
                          className="visio-cms-mt-6 visio-cms-space-y-4"
                          renderBlock={(subIndex, { name, itemKey }, pathName) => (
                            <RepeaterItem propName={pathName} key={`${itemKey}-${name}-${subIndex}`} component="li">
                              <Text pageBlockId={pageBlockId} defaultValue={name} propName={`${pathName}.name`} />
                            </RepeaterItem>
                          )}
                        />
                      )}
                    </RepeaterItem>
                  )}
                />
              </div>
              <div className="visio-cms-mt-10 md:visio-cms-mt-0">
                <h3 className="visio-cms-text-sm visio-cms-font-semibold visio-cms-leading-6 visio-cms-text-white">
                  <Text
                    allowedControls={['bold', 'italic', 'text-color']}
                    defaultValue={supportHeader}
                    propName="supportHeader"
                    pageBlockId={pageBlockId}
                  />
                </h3>
                <ul role="list" className="visio-cms-mt-6 visio-cms-space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="visio-cms-text-sm visio-cms-leading-6 visio-cms-text-gray-300 hover:visio-cms-text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:visio-cms-grid md:visio-cms-grid-cols-2 md:visio-cms-gap-8">
              <div>
                <h3 className="visio-cms-text-sm visio-cms-font-semibold visio-cms-leading-6 visio-cms-text-white">
                  <Text
                    allowedControls={['bold', 'italic', 'text-color']}
                    defaultValue={companyHeader}
                    propName="companyHeader"
                    pageBlockId={pageBlockId}
                  />
                </h3>
                <ul role="list" className="visio-cms-mt-6 visio-cms-space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="visio-cms-text-sm visio-cms-leading-6 visio-cms-text-gray-300 hover:visio-cms-text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="visio-cms-mt-10 md:visio-cms-mt-0">
                <h3 className="visio-cms-text-sm visio-cms-font-semibold visio-cms-leading-6 visio-cms-text-white">
                  Legal
                </h3>
                <ul role="list" className="visio-cms-mt-6 visio-cms-space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="visio-cms-text-sm visio-cms-leading-6 visio-cms-text-gray-300 hover:visio-cms-text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="visio-cms-mt-10 xl:visio-cms-mt-0">
            <h3 className="visio-cms-text-sm visio-cms-font-semibold visio-cms-leading-6 visio-cms-text-white">
              <Text
                allowedControls={['bold', 'text-color', 'underline']}
                defaultValue={subscriptionHeader}
                propName="subscriptionHeader"
                pageBlockId={pageBlockId}
              />
            </h3>
            <p className="visio-cms-mt-2 visio-cms-text-sm visio-cms-leading-6 visio-cms-text-gray-300">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <form className="visio-cms-mt-6 sm:visio-cms-flex sm:visio-cms-max-w-md">
              <label htmlFor="email-address" className="visio-cms-sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                required
                placeholder="Enter your email"
                autoComplete="email"
                className="visio-cms-w-full visio-cms-min-w-0 visio-cms-appearance-none visio-cms-rounded-md visio-cms-border-0 bg-white/5 visio-cms-px-3 visio-cms-py-1.5 visio-cms-text-base visio-cms-text-white visio-cms-shadow-sm visio-cms-ring-1 visio-cms-ring-inset ring-white/10 placeholder:visio-cms-text-gray-500 focus:visio-cms-ring-2 focus:visio-cms-ring-inset focus:visio-cms-ring-indigo-500 sm:visio-cms-w-64 sm:visio-cms-text-sm sm:visio-cms-leading-6 xl:visio-cms-w-full"
              />
              <div className="visio-cms-mt-4 sm:visio-cms-ml-4 sm:visio-cms-mt-0 sm:visio-cms-flex-shrink-0">
                <button
                  type="submit"
                  className="visio-cms-flex visio-cms-w-full visio-cms-items-center visio-cms-justify-center visio-cms-rounded-md visio-cms-bg-indigo-500 visio-cms-px-3 visio-cms-py-2 visio-cms-text-sm visio-cms-font-semibold visio-cms-text-white visio-cms-shadow-sm hover:visio-cms-bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="visio-cms-mt-16 visio-cms-border-t border-white/10 visio-cms-pt-8 sm:visio-cms-mt-20 md:visio-cms-flex md:visio-cms-items-center md:visio-cms-justify-between lg:visio-cms-mt-24">
          <div className="visio-cms-flex visio-cms-space-x-6 md:visio-cms-order-2">
            {navigation.social.map((item) => (
              <a key={item.name} href={item.href} className="visio-cms-text-gray-500 hover:visio-cms-text-gray-400">
                <span className="visio-cms-sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="visio-cms-h-6 visio-cms-w-6" />
              </a>
            ))}
          </div>
          <p className="visio-cms-mt-8 visio-cms-text-xs visio-cms-leading-5 visio-cms-text-gray-400 md:visio-cms-order-1 md:visio-cms-mt-0">
            &copy; 2020 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.Schema = {
  name: 'Footer',
  id: 'footer',
  sideEditingProps: [],
  defaultPropValues: {
    solutionsHeader: 'Solutions',
    supportHeader: 'Support',
    companyHeader: 'Company',
    subscriptionHeader: 'Subscribe to our newsletter',
    solutions: navigation.solutions,
  },
  repeaters: [
    {
      name: 'solutions',
      schema: {
        name: 'Solutions',
        href: '/solutions',
      },
    },
  ],
  group: 'Navigation',
};

export default Footer;
