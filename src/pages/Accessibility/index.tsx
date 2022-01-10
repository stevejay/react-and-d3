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
      On macOS you can use VoiceOver with the Safari Web browser. On Windows you can use NVDA with Firefox.
    </Paragraph>
    <StackedBarChartWithTooltipExample />
    <Paragraph>
      Using either of those combinations, I hear the following when I navigate to the chart:
    </Paragraph>
    <VoiceOverText>Comparing sales strategies, Stacked bar chart</VoiceOverText>
    <Paragraph>
      If I then navigate into the chart, the first category is selected and announced by the screen reader:
    </Paragraph>
    <VoiceOverText>Strategy 1, Sales strategy</VoiceOverText>
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
    <Paragraph>
      As described in the WAI-ARIA Graphics Module, it is also possible to add descriptions to the parts of
      the chart. Originally I included a description for the chart and each category. These worked well with
      VoiceOver but in NVDA the description text is spoken immediately after the label text, which I found
      confusing.
    </Paragraph>
  </div>
);

export default AccessibilityPage;
