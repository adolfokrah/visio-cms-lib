import { Block, MediaFile } from '@/lib/exposed-types';
import Text from '../exposed-components/text';
import Image from '../exposed-components/image';
import List from '../exposed-components/list';

export type HeroProps = {
  mainHeader: string;
  announcement: string;
  subHeading: string;
  getStarted: string;
  learnMore: string;
  image: MediaFile;
  pageBlockId?: string;
  getStartedButton: {
    name: string;
    url: string;
    itemKey: string;
  }[];
};

const Hero: Block<HeroProps> = ({
  mainHeader,
  announcement,
  subHeading,
  learnMore,
  image,
  pageBlockId = '',
  getStartedButton,
}) => {
  return (
    <div className="visio-cms-relative isolate visio-cms-px-6 visio-cms-pt-14 lg:visio-cms-px-8">
      <div className="visio-cms-mx-auto visio-cms-max-w-2xl visio-cms-py-32">
        <div className="visio-cms-hidden sm:visio-cms-mb-8 sm:visio-cms-flex sm:visio-cms-justify-center">
          <div className="visio-cms-relative visio-cms-rounded-full visio-cms-px-3 visio-cms-py-1 visio-cms-text-sm visio-cms-leading-6 visio-cms-text-gray-600 visio-cms-ring-1 ring-gray-900/10 hover:ring-gray-900/20 visio-cms-flex visio-cms-gap-2">
            <Text defaultValue={announcement} propName="announcement" pageBlockId={pageBlockId} />
            <a href="https://facebook.com" className="visio-cms-font-semibold visio-cms-text-indigo-600 ">
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="visio-cms-text-center">
          <h1 className="visio-cms-text-4xl visio-cms-font-bold visio-cms-tracking-tight visio-cms-text-gray-900 sm:visio-cms-text-6xl">
            <Text defaultValue={mainHeader} propName="mainHeader" pageBlockId={pageBlockId} />
          </h1>
          <div className="visio-cms-mt-6 visio-cms-text-lg visio-cms-leading-8 visio-cms-text-gray-600">
            <Text defaultValue={subHeading} propName="subHeading" pageBlockId={pageBlockId} />
          </div>
          <div className="visio-cms-mt-10 visio-cms-flex visio-cms-items-center visio-cms-justify-center visio-cms-gap-x-6">
            <List
              propName="getStartedButton"
              pageBlockId={pageBlockId}
              defaultPropValues={getStartedButton}
              component=""
              renderComponent={(button, index) => (
                <a
                  href={button.url}
                  key={`${button.itemKey}-${index}`}
                  className="visio-cms-rounded-md visio-cms-bg-indigo-600 visio-cms-px-3.5 visio-cms-py-2.5 visio-cms-text-sm visio-cms-font-semibold visio-cms-text-white visio-cms-shadow-sm hover:visio-cms-bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 visio-cms-inline-block"
                >
                  <Text
                    defaultValue={button.name}
                    propName={`getStartedButton.${index}.name`}
                    pageBlockId={pageBlockId}
                  />
                </a>
              )}
            />

            <a
              href="#"
              className="visio-cms-text-sm visio-cms-font-semibold visio-cms-flex visio-cms-gap-2 visio-cms-leading-6 visio-cms-text-gray-900"
            >
              <Text defaultValue={learnMore} propName="learnMore" pageBlockId={pageBlockId} />{' '}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <Image
          defaultValue={image}
          propName="image"
          pageBlockId={pageBlockId}
          renderImage={({ imagePublicUrl, altText }) => (
            <img
              src={imagePublicUrl}
              alt={altText}
              className="visio-cms-mt-12 visio-cms-w-full visio-cms-rounded-lg visio-cms-shadow-lg"
            />
          )}
        />
      </div>
    </div>
  );
};

Hero.Schema = {
  name: 'hero',
  id: 'Hero',
  group: 'Content',
  sideEditingProps: [],
  defaultPropValues: {
    mainHeader: 'Data to enrich your online business',
    announcement: 'Announcing our next round of funding.',
    subHeading: 'Tons of data is waiting for you in our platform. Join Today!',
    getStarted: '<span>Get started</span>',
    learnMore: 'Learn more',
    image: {
      mediaHash: undefined,
      altText: 'Hero Image',
      width: 400,
      height: 678,
    },
    getStartedButton: [],
  },
  lists: [
    {
      propName: 'getStartedButton',
      label: 'Get Started Button',
      defaultValue: {
        name: 'Get started button',
        url: '/get-started',
      },
    },
  ],
};

export default Hero;
