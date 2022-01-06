import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { FollowOnHoverTooltipBarChartExample } from './FollowOnHoverTooltipBarChartExample';
import { VerticalStackedBarChartExample } from './VerticalStackedBarChartExample';
// import { TabbableTooltipBarChartExample } from './TabbableTooltipBarChartExample';

const TooltipPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Tooltip</PageHeading>
    <Paragraph>
      There are many possible behaviours for a chart tooltip. On this page I describe what is generally the
      best implementation to use.
    </Paragraph>
    <SectionHeading>The &lsquo;Follow On Hover&rsquo; Tooltip</SectionHeading>
    <Paragraph>
      This tooltip type shows when the user hovers their mouse over the chart and when they click on it. This
      click behaviour is so the tooltip also shows if the user has a hybrid or touch device and they tap on
      the screen. The tooltip is placed alongside where the user has hovered or tapped. Accessibility is not a
      requirement for it. The chart can be made accessible through alternate means and so the tooltip is
      hidden from screenreaders.
    </Paragraph>
    <Paragraph>
      The chart below demonstrates this type of tooltip. It has the following notable behaviours:
    </Paragraph>
    <ul className="px-8 my-4 font-light leading-relaxed list-disc max-w-prose text-slate-400">
      <li>
        Delayed show on hover to prevent the tooltip popping up if the user is just moving their mouse across
        the screen.
      </li>
      <li>No delay on hover if the tooltip was shown recently (within a second or so).</li>
      <li>A short opacity fade animation on show and hide.</li>
      <li>Hide on scroll.</li>
    </ul>
    <FollowOnHoverTooltipBarChartExample />
    <Paragraph>The following is an example of a stacked bar chart with a tooltip:</Paragraph>
    <VerticalStackedBarChartExample />
    <Paragraph>
      Be aware of a potential performance issue with this type of tooltip. It has to re-render on every
      movement of the mouse when the user is hovering over the chart. Ensure that only the tooltip gets
      re-rendered and not the chart as well.
    </Paragraph>
    {/* <SectionHeading>The Tabbable Tooltip</SectionHeading>
    <Paragraph>
      The example chart below has a tooltip that shows on hover, on touch tap, and on keyboard tab. To do this
      it handles mouseenter, mouseleave, focus and blur events. The active area is the entire width and height
      of the central chart area, not just the exact area of each bar. This means the user always has a large
      target area, which helps on touch devices.
    </Paragraph>
    <Paragraph>The visibility behaviour is as follows:</Paragraph>
    <ul className="px-8 my-4 font-light leading-relaxed list-disc max-w-prose text-slate-400">
      <li>
        Delayed show on hover to prevent the tooltip popping up if the user is just moving their mouse across
        the screen.
      </li>
      <li>No delay on hover if the tooltip was shown recently (within around two seconds).</li>
      <li>A short fade in/out animation.</li>
    </ul>
    <TabbableTooltipBarChartExample />
    <Paragraph>
      An option is to hide the tooltip on scroll, but I found this behaviour comes with visibility quirks.
    </Paragraph> */}
  </div>
);

export default TooltipPage;
