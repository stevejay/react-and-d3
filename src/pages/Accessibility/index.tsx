import type { FC } from 'react';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseExternalLink } from '@/components/ProseExternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { StackedBarChartWithTooltipExample } from './StackedBarChartWithTooltipExample';

const VoiceOverText: FC = ({ children }) => (
  <figure>
    <blockquote>
      <p className="px-4 py-2 my-4 italic font-light leading-relaxed rounded max-w-prose text-slate-300">
        {children}
      </p>
    </blockquote>
    <figcaption className="sr-only">Text spoken by VoiceOver</figcaption>
  </figure>
);

const AccessibilityPage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Accessibility</PageHeading>
    <SectionHeading>An Accessible Stacked Bar Chart</SectionHeading>
    <Paragraph>
      The{' '}
      <ProseExternalLink href="https://www.w3.org/TR/graphics-aria-1.0/">
        WAI-ARIA Graphics Module
      </ProseExternalLink>{' '}
      describes how a data visualisation can be made accessible to screen reader users. The stacked bar chart
      below follows these recommendations. Use a screen reader with its preferred browser to hear the result.
      On macOS you can use VoiceOver with the Safari Web browser.
    </Paragraph>
    <StackedBarChartWithTooltipExample />
    <Paragraph>
      Using that particular combination, I hear the following when I navigate to the chart:
    </Paragraph>
    <VoiceOverText>Comparing sales strategies, Stacked bar chart</VoiceOverText>
    <Paragraph>After a short pause I hear the chart description:</Paragraph>
    <VoiceOverText>
      Analysing how different sales strategies affect the sales figures of our three most popular products,
      You are currently on a Stacked bar chart.
    </VoiceOverText>
    <Paragraph>
      If I then navigate into the chart, the first category is selected and announced by the screen reader:
    </Paragraph>
    <VoiceOverText>Strategy 1, Sales strategy</VoiceOverText>
    <Paragraph>After a short pause I hear the category description:</Paragraph>
    <VoiceOverText>Sales results for Strategy 1, You are currently in a Sales strategy</VoiceOverText>
    <Paragraph>If I now navigate to the second category, I hear the following:</Paragraph>
    <VoiceOverText>Strategy 2, Sales strategy</VoiceOverText>
    <Paragraph>
      If I navigate into this category, the screen reader announces the first of its values:
    </Paragraph>
    <VoiceOverText>84 units sold, Product A</VoiceOverText>
    <Paragraph>I can then navigate through the rest of the category values:</Paragraph>
    <VoiceOverText>
      20 units sold, Product B
      <br />
      40 units sold, Product C
    </VoiceOverText>
    <Paragraph>
      Note that you cannot navigate to the axis labels, the axis tick labels or the tooltip, and they are not
      announced. I have deliberately hidden them from the screen reader as they do not aid comprehension.
    </Paragraph>
  </div>
);

export default AccessibilityPage;
