import { HorizontalRule } from '@/components/HorizontalRule';
import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { LinearAxisExamples } from '@/pages/Axis/LinearAxisExamples';
import { TimeAxisExamples } from '@/pages/Axis/TimeAxisExamples';

import { CustomTimeAxisExamples } from '../CustomAxis/CustomTimeAxisExamples';

import { AlternateLinearAxisExamples } from './AlternateLinearAxisExamples';
import { BandAxisExamples } from './BandAxisExamples';

const Axis = () => (
  <>
    <PageHeading>Axis</PageHeading>
    <div className="p-8">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <Paragraph>
          The D3 axis component is a stalwart of D3 data visualisations. I wanted to create a React-rendered
          version. The primary complication was recreating the animations of the D3 axis. Entering ticks
          animate in based on the previous scale and exiting ticks animate out based on the new scale. I used
          the Framer Motion animation library to create similar animations in React. You can see the result
          below for a few types of D3 axis.
        </Paragraph>
        <HorizontalRule />
        <LinearAxisExamples drawTicksAsGridLines={false} transitionSeconds={0.5} />
        <HorizontalRule />
        <TimeAxisExamples drawTicksAsGridLines={false} transitionSeconds={0.5} />
        <HorizontalRule />
        <BandAxisExamples drawTicksAsGridLines={false} transitionSeconds={0.5} />
        <HorizontalRule />
        <Paragraph>
          The React axis animations work well but they are not perfect. An issue arises when an animation is
          interrupted, by the data being updated while the axis is still animating. The problem is with the
          animation of the previously exiting ticks that need to continue to exit. They continue to animate to
          a position according to the old scale rather than a position according to the new scale. This is
          only really obvious if the animations are slowed down, as in the following example. Click on the
          update button while the axis is animating.
        </Paragraph>
        <HorizontalRule />
        <LinearAxisExamples drawTicksAsGridLines={false} transitionSeconds={1.5} />
        <HorizontalRule />
        <Paragraph>
          This issues is not a deal breaker. The problem is really only obvious with unrealistically long
          animation times. I did create a version of the React axis component that improves the exit
          animations, but is still not perfect. It is also significantly more complex in implementation. You
          can try this alternate version below.
        </Paragraph>
        <HorizontalRule />
        <AlternateLinearAxisExamples drawTicksAsGridLines={false} transitionSeconds={1.5} />
        {/* <HorizontalRule /> */}
        <h3 className="pt-8 text-3xl">Custom Axis</h3>
        <Paragraph>
          An advantage of a React-rendered axis component is that it is easy to use as a starting point for a
          custom axis. I find it easier to create a custom React axis rather than a custom D3 axis, and it is
          also more maintainable. The following is an example of a custom time axis in React.
        </Paragraph>
        <HorizontalRule />
        <CustomTimeAxisExamples transitionSeconds={0.5} />
      </div>
    </div>
  </>
);

export default Axis;
