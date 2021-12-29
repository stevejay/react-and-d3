import { HorizontalRule } from '@/components/HorizontalRule';
import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';

import { CustomTimeAxisExamples } from './CustomTimeAxisExamples';

const CustomAxis = () => (
  <>
    <PageHeading>Custom Axis</PageHeading>
    <div className="p-8">
      <div className="w-full ml-56 space-y-8">
        <Paragraph>
          The advantage to creating a React-rendered axis component is that it is much easier to create a
          custom version of that axis. It is also more maintainable. The following is a custom time axis.
        </Paragraph>
        <HorizontalRule />
        <CustomTimeAxisExamples transitionSeconds={0.5} />
        <HorizontalRule />
      </div>
    </div>
  </>
);

export default CustomAxis;
