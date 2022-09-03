import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseExternalLink } from '@/components/ProseExternalLink';
import { ProseInternalLink } from '@/components/ProseInternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartExample } from './BarChartExample';
import { BarChartExampleWithPersistentTooltip } from './BarChartExampleWithPersistentTooltip';
import { StackedBarChartExample } from './StackedBarChartExample';
// import { StackedBarChartWithTooltipExample } from './StackedBarChartWithTooltipExample';

function TooltipPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Tooltip</PageHeading>
      <Helmet>
        <title>Tooltip - React and D3</title>
      </Helmet>
      <SectionHeading>Tooltip behaviour</SectionHeading>
      <Paragraph>
        There are many decisions to be made when you create a tooltip for a data visualisation:
      </Paragraph>
      <ul className="px-8 my-4 font-light leading-relaxed list-disc max-w-prose text-slate-200">
        <li>
          What should the z-order of the tooltip be? Should it sit above or below content like the page header
          and footer?
        </li>
        <li>
          Should the tooltip be rendered in a portal to achieve the desired z-order? (A portal would also be
          important if there is overflow clipping on the chart or one of its parent element, and the tooltip
          needs to be able to break out of that clipping.)
        </li>
        <li>What user interactions should trigger the tooltip to show?</li>
        <li>What user interactions should trigger the tooltip to hide?</li>
        <li>How should the tooltip be shown and hidden on a touchscreen device?</li>
        <li>Should the appearance and disappearance of the tooltip be animated?</li>
        <li>Should the movement of the tooltip be animated?</li>
        <li>
          Should the tooltip appear immediately or only after a delay? (This would prevent the tooltip showing
          in the scenario when the user is only moving the pointer over the chart to get to somewhere else on
          the page.)
        </li>
        <li>
          Should the tooltip be constrained to always rendering within the bounds of the chart or can it
          escape that area?
        </li>
        <li>
          Should the target of the tooltip be indicated with a crosshair? Should this be just a vertical or a
          horizontal crosshair, or both?
        </li>
        <li>Should the target of the tooltip be indicated with a glyph (e.g., a dot)?</li>
        <li>Should the tooltip include an arrow pointing to the element that it annotates?</li>
        <li>What orientation should the tooltip be relative to the element that it annotates?</li>
        <li>How should the tooltip container be styled to differentiate it from the regular page content?</li>
        <li>
          Does the tooltip need to include interactive content, such as a link or a button? (If there is no
          interactive content then you would likely want to set the pointer-events CSS property to
          &lsquo;none&rsquo; on the tooltip container.)
        </li>
        <li>Should the width and/or height of the tooltip be restricted?</li>
        <li>Should the tooltip snap horizontally or vertically to the element that it annotates?</li>
        <li>
          In a chart with stacked data, should the tooltip handle each stack as a single element or as
          separate elements?
        </li>
        <li>Should the tooltip disappear immediately or only after a delay?</li>
        <li>Should the tooltip disappear when the ESC key is pressed?</li>
        <li>Should the tooltip disappear when the user scrolls the page?</li>
        <li>Should the tooltip disappear if the user clicks or taps elsewhere on the page?</li>
        <li>Should the tooltip be accessible to screen readers or be hidden from them?</li>
      </ul>
      <Paragraph>
        You also need to be aware of a possible performance issue if a re-render of the tooltip also results
        in an unnecessary re-render of the whole chart. Ideally this would not happen.
      </Paragraph>
      <SectionHeading>Example implementations</SectionHeading>
      <Paragraph>
        The chart below has a tooltip that behaves in a similar way to the tooltip in the{' '}
        <ProseExternalLink href="https://airbnb.io/visx">visx</ProseExternalLink> library:
      </Paragraph>
      <BarChartExample />
      <Paragraph>
        This tooltip shows when the user hovers their mouse over the chart. It also shows if the user has a
        hybrid or touch device and they tap on the screen. The tooltip is placed just above where the user has
        hovered or tapped, but snaps to the categories in the x-axis direction. Accessibility is not a
        requirement. The chart can be made accessible through alternate means (as shown on the{' '}
        <ProseInternalLink to="/accessibility">Accessibility page</ProseInternalLink>) and so the tooltip is
        hidden from screenreaders.
      </Paragraph>
      <Paragraph>
        On a touch device, when the user taps on a bar the tooltip disappears shortly after appearing. An
        alternative implementation is to prevent the tooltip disappearing, and add listeners to hide the
        tooltip if the user scrolls the page or taps/clicks elsewhere on the screen. The following chart
        demonstrates this behaviour:
      </Paragraph>
      <BarChartExampleWithPersistentTooltip />
      <Paragraph>
        Finally, the following chart is an example of a stacked bar chart with a tooltip. The values for
        multiple series are shown within a single tooltip.
      </Paragraph>
      <StackedBarChartExample />
    </main>
  );
}

export default TooltipPage;
