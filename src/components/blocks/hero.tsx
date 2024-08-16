import { Block, MediaFile } from '@/lib/exposed-types';
import Text from '../exposed-components/text';
import Image from '../exposed-components/image';

export type HeroProps = {
  mainHeader: string;
  announcement: string;
  subHeading: string;
  getStarted: string;
  learnMore: string;
  image: MediaFile;
  pageBlockId?: string;
};

const Hero: Block<HeroProps> = ({
  mainHeader,
  announcement,
  subHeading,
  getStarted,
  learnMore,
  image,
  pageBlockId = '',
}) => {
  return (
    <div className="visio-cms-relative isolate visio-cms-px-6 visio-cms-pt-14 lg:visio-cms-px-8">
      <div
        aria-hidden="true"
        className="visio-cms-absolute visio-cms-inset-x-0 visio-cms--top-40 visio-cms--z-10 visio-cms-transform-gpu visio-cms-overflow-hidden blur-3xl sm:visio-cms--top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="visio-cms-relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] visio-cms--translate-x-1/2 rotate-[30deg] visio-cms-bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] visio-cms-opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="visio-cms-mx-auto visio-cms-max-w-2xl visio-cms-py-32 sm:visio-cms-py-48 lg:visio-cms-py-56">
        <div className="visio-cms-hidden sm:visio-cms-mb-8 sm:visio-cms-flex sm:visio-cms-justify-center">
          <div className="visio-cms-relative visio-cms-rounded-full visio-cms-px-3 visio-cms-py-1 visio-cms-text-sm visio-cms-leading-6 visio-cms-text-gray-600 visio-cms-ring-1 ring-gray-900/10 hover:ring-gray-900/20 visio-cms-flex visio-cms-gap-2">
            <Text
              allowedControls={['bold', 'italic', 'text-color']}
              defaultValue={announcement}
              propName="announcement"
              pageBlockId={pageBlockId}
            />
            <a href="https://facebook.com" className="visio-cms-font-semibold visio-cms-text-indigo-600 ">
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="visio-cms-text-center">
          <h1 className="visio-cms-text-4xl visio-cms-font-bold visio-cms-tracking-tight visio-cms-text-gray-900 sm:visio-cms-text-6xl">
            <Text
              allowedControls={['bold', 'italic', 'text-color']}
              defaultValue={mainHeader}
              propName="mainHeader"
              pageBlockId={pageBlockId}
            />
          </h1>
          <div className="visio-cms-mt-6 visio-cms-text-lg visio-cms-leading-8 visio-cms-text-gray-600">
            <Text
              allowedControls={['italic', 'text-color']}
              defaultValue={subHeading}
              propName="subHeading"
              pageBlockId={pageBlockId}
            />
          </div>
          <div className="visio-cms-mt-10 visio-cms-flex visio-cms-items-center visio-cms-justify-center visio-cms-gap-x-6">
            <a
              href="#"
              className="visio-cms-rounded-md visio-cms-bg-indigo-600 visio-cms-px-3.5 visio-cms-py-2.5 visio-cms-text-sm visio-cms-font-semibold visio-cms-text-white visio-cms-shadow-sm hover:visio-cms-bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Text
                allowedControls={['italic', 'text-color']}
                defaultValue={getStarted}
                propName="getStarted"
                pageBlockId={pageBlockId}
              />
            </a>
            <a
              href="#"
              className="visio-cms-text-sm visio-cms-font-semibold visio-cms-flex visio-cms-gap-2 visio-cms-leading-6 visio-cms-text-gray-900"
            >
              <Text
                allowedControls={['italic', 'text-color']}
                defaultValue={learnMore}
                propName="learnMore"
                pageBlockId={pageBlockId}
              />{' '}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <Image
          defaultValue={image}
          propName="image"
          className="visio-cms-mt-12 visio-cms-rounded-lg visio-cms-mx-auto"
          pageBlockId={pageBlockId}
        />
      </div>
      <div
        aria-hidden="true"
        className="visio-cms-absolute visio-cms-inset-x-0 top-[calc(100%-13rem)] visio-cms--z-10 visio-cms-transform-gpu visio-cms-overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="visio-cms-relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] visio-cms--translate-x-1/2 visio-cms-bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] visio-cms-opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
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
  },
};

export default Hero;
