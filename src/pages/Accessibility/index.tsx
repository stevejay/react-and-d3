import type { FC } from 'react';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseExternalLink } from '@/components/ProseExternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { VerticalStackedBarChartExample } from './VerticalStackedBarChartExample';

const VoiceOverText: FC = ({ children }) => (
  <blockquote className="px-4 py-2 my-4 italic font-light leading-relaxed rounded max-w-prose text-slate-300">
    {children}
  </blockquote>
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
      describes how a data visualisation can be made accessible to screenreader users. The stacked bar chart
      below follows these recommendations. Use a screenreader with its preferred browser to hear the result.
      On macOS you can use VoiceOver with the Safari Web browser.
    </Paragraph>
    <VerticalStackedBarChartExample />
    <Paragraph>I hear the following when I use VoiceOver and navigate to the chart:</Paragraph>
    <VoiceOverText>Comparing sales strategies, Stacked bar chart</VoiceOverText>
    <Paragraph>After a short pause I then hear the chart description:</Paragraph>
    <VoiceOverText>
      Analysing how different sales strategies affect the sales figures of our three most popular products,
      You are currently in a Stacked bar chart.
    </VoiceOverText>
    <Paragraph>If I then navigate into the chart, the screen reader places me on the first series:</Paragraph>
    <VoiceOverText>Product A, Data series</VoiceOverText>
    <Paragraph>After a short pause I hear the series description:</Paragraph>
    <VoiceOverText>
      The description for Product A data series, You are currently in a Data series
    </VoiceOverText>
    <Paragraph>If I navigate to the second series, I hear the following:</Paragraph>
    <VoiceOverText>Product B, Data series</VoiceOverText>
    <Paragraph>
      It also has a description. If I now navigate into that second series, I hear the first value in it:
    </Paragraph>
    <VoiceOverText>0 units sold using Strategy 1, Product B</VoiceOverText>
    <Paragraph>I can continue to navigate through the rest of the values in the series:</Paragraph>
    <VoiceOverText>
      20 units sold using Strategy 2, Product B
      <br />
      50 units sold using Strategy 3, Product B
      <br />
      10 units sold using Strategy 4, Product B
      <br />0 units sold using Strategy 5, Product B
    </VoiceOverText>
    <Paragraph>
      Note that you cannot navigate to the axis labels, the axis tick labels and the tooltip, and they are not
      read out. I have deliberately hidden them from the screenreader as they do not add anything to the
      experience.
    </Paragraph>
  </div>
);

export default AccessibilityPage;
