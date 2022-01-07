import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseInternalLink } from '@/components/ProseInternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartWithTooltipExample } from './BarChartWithTooltipExample';
import { StackedBarChartWithTooltipExample } from './StackedBarChartWithTooltipExample';

const TooltipPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Tooltip</PageHeading>
    <Paragraph>
      There are many possible behaviours for a chart tooltip. On this page I describe what is generally the
      best implementation to use.
    </Paragraph>
    <SectionHeading>The &lsquo;Follow On Hover&rsquo; Tooltip</SectionHeading>
    <Paragraph>
      The tooltip shows when the user hovers their mouse over the chart and when they click on it. The click
      behaviour is so the tooltip also shows if the user has a hybrid or touch device and they tap on the
      screen. The tooltip is placed just above where the user has hovered or tapped. Accessibility is not a
      requirement. The chart can be made accessible through alternate means (as shown in the{' '}
      <ProseInternalLink to="/accessibility">Accessibility section</ProseInternalLink>) and so the tooltip is
      hidden from screenreaders.
    </Paragraph>
    <Paragraph>The chart below demonstrates the tooltip. It has the following notable behaviours:</Paragraph>
    <ul className="px-8 my-4 font-light leading-relaxed list-disc max-w-prose text-slate-400">
      <li>
        Delayed show on hover to prevent the tooltip popping up if the user is just moving their mouse across
        the screen.
      </li>
      <li>No delay on hover if the tooltip was shown recently (within a second or so).</li>
      <li>A short opacity fade animation on show and hide.</li>
      <li>Hide on scroll.</li>
      <li>Hide on a click or tap outside of the chart area.</li>
    </ul>
    <BarChartWithTooltipExample />
    <Paragraph>
      The following is an example of a stacked bar chart with a tooltip. The values for multiple series are
      shown in a single tooltip.
    </Paragraph>
    <StackedBarChartWithTooltipExample />
    <Paragraph>
      Be aware of a potential performance issue with this type of tooltip. It has to re-render on every
      movement of the mouse when the user is hovering over the chart. Ensure that only the tooltip gets
      re-rendered and not the chart as well.
    </Paragraph>
  </div>
);

export default TooltipPage;
