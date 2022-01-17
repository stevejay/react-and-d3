import { easeCubicInOut } from 'd3-ease';

import { ChartTitle } from '@/components/ChartTitle';
import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { BandAxisExamples } from './BandAxisExamples';
import { CustomTimeAxisExamples } from './CustomTimeAxisExamples';
import { LinearAxisExamples } from './LinearAxisExamples';
import { TimeAxisExamples } from './TimeAxisExamples';

const fastSpringConfig = { duration: 500, easing: easeCubicInOut };
const slowSpringConfig = { duration: 1500, easing: easeCubicInOut };

const Axis = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Axis</PageHeading>
    <SectionHeading>The D3 Axis in React</SectionHeading>
    <Paragraph>
      The D3 axis component is a stalwart of D3 data visualisations. If you want to use React instead of D3 to
      render your charts then you are going to need a suitable replacement. This page demonstrates my port of
      the D3 axis component. Like that component, entering ticks animate in based on the previous scale and
      exiting ticks animate out based on the new scale. You can try some examples below of D3 axes and their
      React equivalents.
    </Paragraph>
    <ChartTitle>Example 1: Linear axis</ChartTitle>
    <LinearAxisExamples transitionSeconds={0.5} springConfig={fastSpringConfig} />
    <ChartTitle>Example 2: Time axis</ChartTitle>
    <TimeAxisExamples transitionSeconds={0.5} springConfig={fastSpringConfig} />
    <ChartTitle>Example 3: Band axis</ChartTitle>
    <BandAxisExamples transitionSeconds={0.5} springConfig={fastSpringConfig} />
    <SectionHeading>Animation Differences</SectionHeading>
    <Paragraph>
      The React animations work well but they are not perfect. Problems can arise when the animation is
      interrupted. An interruption occurs when the scale is updated while the axis is still transitioning. The
      issue is with ticks that are exiting and still need to continue to exit. They continue to animate to a
      position according to the old scale rather than a position according to the new scale.
    </Paragraph>
    <Paragraph>
      This is only really obvious if the animations are slowed down, as in the following example. Click on the
      update button while the axis is animating to see the difference.
    </Paragraph>
    <ChartTitle>Example 4: Slow animations</ChartTitle>
    <LinearAxisExamples transitionSeconds={1.5} springConfig={slowSpringConfig} />
    <Paragraph>
      Luckily it is unusual to use such long animation times with data visualisations and so the problem can
      be ignored.
    </Paragraph>
    {/* <Paragraph>
      Luckily it is unusual to use such long animation times with data visualisations and so the problem can
      be ignored. I did create a version of the React axis component that has improved exit animations, but it
      is still not perfect. The implementation is also significantly more complex. You can try this alternate
      version below.
    </Paragraph>
    <ChartTitle>Example 5: The alternate React linear axis</ChartTitle>
    <AlternateLinearAxisExamples transitionSeconds={1.5} /> */}
    <SectionHeading>Custom Axis</SectionHeading>
    <Paragraph>
      An advantage of the React axis component is that it is easy to use as a starting point for creating your
      own custom axis components. The following is an example of a custom time axis.
    </Paragraph>
    <ChartTitle>Example 5: A custom React time axis</ChartTitle>
    <CustomTimeAxisExamples springConfig={fastSpringConfig} />
  </div>
);

export default Axis;
