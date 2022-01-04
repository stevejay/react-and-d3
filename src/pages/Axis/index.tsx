import { HorizontalRule } from '@/components/HorizontalRule';
import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';

import { AlternateLinearAxisExamples } from './AlternateLinearAxisExamples';
import { BandAxisExamples } from './BandAxisExamples';
import { CustomTimeAxisExamples } from './CustomTimeAxisExamples';
import { LinearAxisExamples } from './LinearAxisExamples';
import { TimeAxisExamples } from './TimeAxisExamples';

const Axis = () => (
  <>
    <PageHeading>Axis</PageHeading>
    <div className="w-full max-w-3xl p-4 mx-auto space-y-8 md:p-8">
      <Paragraph>
        The D3 axis component is a stalwart of D3 data visualisations. If you want to only use React instead
        of D3 to render your charts, you are going to need a replacement. This page demonstrates my port of
        the D3 axis to React. The main complication I had was recreating the animations. Entering ticks
        animate in based on the previous scale and exiting ticks animate out based on the new scale. Luckily
        Framer Motion can handle this well. You can try some examples below of various D3 axes and their React
        equivalent.
      </Paragraph>
      <HorizontalRule />
      <LinearAxisExamples transitionSeconds={0.5} />
      <HorizontalRule />
      <TimeAxisExamples transitionSeconds={0.5} />
      <HorizontalRule />
      <BandAxisExamples transitionSeconds={0.5} />
      <HorizontalRule />
      <Paragraph>
        The React animations work well but they are not perfect. A problem arises when an animation is
        interrupted. This can occur when the scale is updated while the axis is still animating to its next
        state. The issue is with ticks that are exiting and still need to continue to exit. They continue to
        animate to a position according to the old scale rather than a position according to the new scale.
        This is only really obvious if the animations are slowed down, as in the following example. Click on
        the update button while the axis is animating.
      </Paragraph>
      <HorizontalRule />
      <LinearAxisExamples transitionSeconds={1.5} />
      <HorizontalRule />
      <Paragraph>
        Luckily the problem is really only apparent with unrealistically long animation times. I did create a
        version of the React axis component that improves the exit animations, but is still not perfect. The
        implementation is also significantly more complex. You can try this alternate version below.
      </Paragraph>
      <HorizontalRule />
      <AlternateLinearAxisExamples transitionSeconds={1.5} />
      <h3 className="pt-8 text-3xl">Custom Axis</h3>
      <Paragraph>
        An advantage of the React axis component is that it is easy to use as a starting point for creating a
        custom axis. I find it easier to create a custom React axis rather than a custom D3 axis, and it
        should also be more maintainable. The following is an example of a custom time axis in React.
      </Paragraph>
      <HorizontalRule />
      <CustomTimeAxisExamples transitionSeconds={0.5} />
    </div>
  </>
);

export default Axis;
