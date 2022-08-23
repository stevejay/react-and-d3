import { Helmet } from 'react-helmet-async';
import { easeCubicInOut } from 'd3-ease';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseInternalLink } from '@/components/ProseInternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { BarChartWithTooltipExample } from './BarChartWithTooltipExample';
import { BarChartExample } from './NewBarChartExample';
import { StackedBarChartWithTooltipExample } from './StackedBarChartWithTooltipExample';

const springConfig = { duration: 500, easing: easeCubicInOut };

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
          What should the z-order of the tooltip be? Should it sit above or below content like the header and
          footer?
        </li>
        <li>Should the tooltip be rendered in a portal to achieve that desired z-order?</li>
        <li>What user interactions should trigger the tooltip to show?</li>
        <li>What user interactions should trigger the tooltip to hide?</li>
        <li>How should the tooltip be shown and dismissed on a touchscreen device?</li>
        <li>Should the appearance and disappearance of the tooltip be animated?</li>
        <li>Should the movement of the tooltip be animated?</li>
        <li>
          Should the tooltip appear immediately or only after a delay? (This would prevent the tooltip showing
          in the scenario when the user is only moving the pointer over the chart to get to somewhere else on
          the page.)
        </li>
        <li>Should the target of the tooltip be indicated with a crosshair?</li>
        <li>Should the target of the tooltip be indicated with a glyph (e.g., a dot)?</li>
        <li>How should the tooltip container be styled to differentiate it from the regular page content?</li>
        <li>Does the tooltip need to include interactive content, such as a link or a button?</li>
        <li>Should the width and/or height of the tooltip be restricted?</li>
        <li>What orientation should the tooltip be relative to the element that it annotates?</li>
        <li>Should the tooltip include an arrow pointing to the element that it annotates?</li>
        <li>Should the tooltip snap horizontally or vertically to the element that it annotates?</li>
        <li>
          In a chart with stacked data, should the tooltip handle each stack as a single element or as
          separate elements?
        </li>
        <li>Should the tooltip disappear immediately or only after a delay?</li>
        <li>Should the tooltip disappear when the ESC key is pressed?</li>
        <li>Should the tooltip disappear when the user scrolls the page?</li>
        <li>Should the tooltip disappear if the user clicks elsewhere on the page?</li>
        <li>Should the tooltip be accessible to screen readers or hidden from them?</li>
      </ul>
      <Paragraph>
        You will likely also need to ensure that a re-render of the tooltip does not result in an unnecessary
        re-render of the chart.
      </Paragraph>
      <SectionHeading>The tooltip</SectionHeading>
      <Paragraph>
        This tooltip shows when the user hovers their mouse over the chart. It also shows if the user has a
        hybrid or touch device and they tap on the screen. The tooltip is placed just above where the user has
        hovered or tapped, but snaps to the categories in the x-axis direction. Accessibility is not a
        requirement. The chart can be made accessible through alternate means (as shown in the{' '}
        <ProseInternalLink to="/accessibility">Accessibility section</ProseInternalLink>) and so the tooltip
        is hidden from screenreaders.
      </Paragraph>
      <Paragraph>
        The chart below demonstrates the tooltip. It has the following notable behaviours:
      </Paragraph>
      <ul className="px-8 my-4 font-light leading-relaxed list-disc max-w-prose text-slate-200">
        <li>
          Delayed show on hover to prevent the tooltip popping up if the user is just moving their mouse
          across the screen.
        </li>
        <li>No delay on hover if the tooltip was shown recently (within a second or so).</li>
        <li>A short opacity fade animation on show and hide.</li>
        <li>Hide on scroll.</li>
        <li>Hide on a click or tap outside of the chart area.</li>
        <li>
          On a tap, the tooltip is centred horizontally on the tapped bar. This makes it more obvious to the
          touch interface user which bar the tooltip is showing for.
        </li>
      </ul>
      <BarChartExample />
      <BarChartWithTooltipExample springConfig={springConfig} />
      <Paragraph>
        The following is an example of a stacked bar chart with a tooltip. The values for multiple series are
        shown in a single tooltip.
      </Paragraph>
      <StackedBarChartWithTooltipExample springConfig={springConfig} />
      <Paragraph>
        Be aware of a potential performance issue with this type of tooltip. It has to re-render on every
        movement of the mouse when the user is hovering over the chart. Ensure that only the tooltip gets
        re-rendered and not the chart as well.
      </Paragraph>
    </main>
  );
}

export default TooltipPage;
