import { HorizontalRule } from '@/components/HorizontalRule';
import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';

import { NonTabbableTooltipBarChartExample } from './NonTabbableTooltipBarChartExample';
import { TabbableTooltipBarChartExample } from './TabbableTooltipBarChartExample';

const TooltipPage = () => (
  <>
    <PageHeading>Tooltip</PageHeading>
    <div className="w-full max-w-3xl p-4 mx-auto space-y-8 md:p-8">
      <Paragraph>
        The example chart below has a tooltip that shows on hover, on touch tap, and on keyboard tab. To do
        this it handles mouseenter, mouseleave, focus and blur events. There are additional behaviours:
      </Paragraph>
      <ul className="list-disc list-inside">
        <li>
          Show on hover is delayed to prevent the tooltip popping up if the user is just moving their mouse
          across the screen.
        </li>
        <li>
          However, once the tooltip is showing, there is no delay when showing another tooltip as long as the
          user moves their mouse to the new bar within around two seconds.
        </li>
        <li>The tooltip has a short fade in/out animation.</li>
        <li>The tooltip hides on scroll.</li>
        <li>
          The trigger area for a bar encompasses the entire height of the chart area, not just the height of
          the bar.
        </li>
      </ul>
      <HorizontalRule />
      <TabbableTooltipBarChartExample />
      <HorizontalRule />
      <Paragraph>
        The example chart below has a tooltip that shows on hover and touch tap only. It has the same
        additional behaviours as the previous example.
      </Paragraph>
      <HorizontalRule />
      <NonTabbableTooltipBarChartExample />
    </div>
  </>
);

export default TooltipPage;
