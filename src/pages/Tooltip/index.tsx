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
        This first example has a tooltip that shows on hover, on touch tap, and on keyboard tab. To do this it
        handles mouseenter, mouseleave, focus and blur events.
      </Paragraph>
      <TabbableTooltipBarChartExample />
      <HorizontalRule />
      <Paragraph>This second example has a tooltip that shows on hover and touch tap only.</Paragraph>
      <NonTabbableTooltipBarChartExample />
    </div>
  </>
);

export default TooltipPage;
