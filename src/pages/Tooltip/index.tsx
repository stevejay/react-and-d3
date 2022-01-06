import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

// import { NonTabbableTooltipBarChartExample } from './NonTabbableTooltipBarChartExample';
import { SingleAreaTooltipBarChartExample } from './SingleAreaTooltipBarChartExample';
import { TabbableTooltipBarChartExample } from './TabbableTooltipBarChartExample';

const TooltipPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Tooltip</PageHeading>
    <SectionHeading>Tabbable Tooltip</SectionHeading>
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
    </Paragraph>
    {/* <SectionHeading>Non-tabbable Tooltip</SectionHeading>
    <Paragraph>
      The example chart below has a tooltip that shows on hover and touch tap only. It has the same visibility
      behaviour as the previous example. It also prevents the tooltip showing when a touch user is swiping
      rather than tapping.
    </Paragraph>
    <NonTabbableTooltipBarChartExample /> */}
    <SectionHeading>Follow-On-Hover Tooltip</SectionHeading>
    <Paragraph>
      The example chart below has a tooltip that shows on hover and click only. On hover it follows the mouse
      pointer, so the tooltip is always alongside where the user&apos;s attention is currently. In the
      previous example, the tooltip could be positioned significantly away from where the user is hovering.
    </Paragraph>
    <SingleAreaTooltipBarChartExample />
    <Paragraph>
      The tooltip re-renders on hover every time the user moves the mouse within the chart area. Care needs to
      be taken that only the tooltip itself re-renders, not the entire chart as well.
    </Paragraph>
  </div>
);

export default TooltipPage;
