import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { ProseExternalLink } from '@/components/ProseExternalLink';
import { SectionHeading } from '@/components/SectionHeading';

import { StackedBarChart } from './StackedBarChart';
import { StackedBarChartWithAlternativeAlly } from './StackedBarChartWithAlternativeA11y';
import { VoiceOverQuote } from './VoiceOverQuote';

function AccessibilityPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:px-8 md:py-16">
      <PageHeading>Accessibility</PageHeading>
      <Helmet>
        <title>Accessibility - React and D3</title>
      </Helmet>
      <SectionHeading>An Accessible Stacked Bar Chart</SectionHeading>
      <Paragraph>
        The{' '}
        <ProseExternalLink href="https://www.w3.org/TR/graphics-aria-1.0/">
          WAI-ARIA Graphics Module
        </ProseExternalLink>{' '}
        describes how an SVG data visualisation can be made accessible to screen reader users. Graphics role
        attributes are used to annotate elements in the SVG. Labels and role descriptions are then added to
        them. You are free to phrase those labels and description however you see fit, although you may need
        to work around how the screen reader actually reads out that information.
      </Paragraph>
      <Paragraph>
        You have a choice between annotating existing elements in the chart, such as the &lt;rect&gt; bar
        elements in a bar chart, or adding elements specifically for accessibility. I prefer the latter
        approach. The existing elements in the chart might need to be rendered in a particular hierarchy for
        each series to animate correctly when entering and exiting. This arrangement could be at odds with how
        I want the screen reader user to be able to navigate the data. This also results in a better
        separation of concerns.
      </Paragraph>
      <Paragraph>
        The stacked bar chart below follows the WAI-ARIA Graphics Module recommendations. Use a screen reader
        to hear the result. On macOS you can use VoiceOver with the Safari Web browser. On Windows you can use
        NVDA with Chrome or Firefox, or JAWS with Chrome. Some screen readers work best with a particular
        browser, such as Voiceover with Safari. Other screen readers might support multiple browsers but some
        combinations are more popular than others. (You can find recent usage figures{' '}
        <ProseExternalLink href="https://webaim.org/projects/screenreadersurvey9/#browsers">
          here
        </ProseExternalLink>
        .)
      </Paragraph>
      <StackedBarChart />
      <Paragraph>I first hear the chart title when I navigate to the chart:</Paragraph>
      <VoiceOverQuote>Figure 1: Comparing sales strategies, Stacked bar chart</VoiceOverQuote>
      <Paragraph>
        When I then navigate into the chart, the first sales strategy is visually outlined and the stack data
        for that strategy is read out by the screen reader:
      </Paragraph>
      <VoiceOverQuote>
        Using Strategy 1: Product A sold 20 units, Product B sold 0 units, Product C sold 0 units, Strategy 1
      </VoiceOverQuote>
      <Paragraph>
        The screen reader has concatenated two strings to create this description: the aria label text for the
        stack data (
        <em>
          &ldquo;Using Strategy 1: Product A sold 20 units, Product B sold 0 units, Product C sold 0
          units&rdquo;
        </em>
        ) and the role description text (<em>&ldquo;Strategy 1&rdquo;</em>).
      </Paragraph>
      <Paragraph>
        When I then navigate forward, I hear the description for the second sales strategy:
      </Paragraph>
      <VoiceOverQuote>
        Using Strategy 2: Product A sold 84 units, Product B sold 20 units, Product C sold 40 units, Strategy
        2
      </VoiceOverQuote>
      <Paragraph>
        This annotation does lead to repetition of the sales strategy number but I think it is reasonable. I
        could remove the repetition by rephrasing the aria label text but this could make the information
        harder to understand:
      </Paragraph>
      <VoiceOverQuote>
        Product A sold 84 units, Product B sold 20 units, Product C sold 40 units, Strategy 2
      </VoiceOverQuote>
      <Paragraph>
        Note that you cannot navigate to the legend, the axis labels, the axis tick labels or the tooltip, and
        they are all not announced. I deliberately hide them from the screen reader because the accessibility
        markup is sufficient.
      </Paragraph>
      <Paragraph>
        I grouped the data in the chart so that the values for each product are read out all together for a
        given strategy. This mirrors how the tooltip works, and it facilitates comparison between the products
        for a given sales strategy. It would also be valid to render each product series separately. You can
        try this variation below:
      </Paragraph>
      <StackedBarChartWithAlternativeAlly />
      <Paragraph>
        Similar to the first chart, I first hear the chart title when I navigate to the chart:
      </Paragraph>
      <VoiceOverQuote>
        Figure 2: Comparing sales strategies with alternative accessibility markup, Stacked bar chart
      </VoiceOverQuote>
      <Paragraph>
        When I then navigate into the chart, the title for the first data series is read out:
      </Paragraph>
      <VoiceOverQuote>Product 1, group</VoiceOverQuote>
      <Paragraph>
        I can either navigate into the data series, or navigate to the second series. If I do the latter, the
        title for the second data series is read out:
      </Paragraph>
      <VoiceOverQuote>Product 2, group</VoiceOverQuote>
      <Paragraph>
        If I navigate into that second series, the sales figure for the first sales strategy in that series is
        read out:
      </Paragraph>
      <VoiceOverQuote>0 units sold, Strategy 1</VoiceOverQuote>
      <Paragraph>
        I can then continue to navigate through the remainder of the sales figures for product 2:
      </Paragraph>
      <VoiceOverQuote>20 units sold, Strategy 2</VoiceOverQuote>
      <VoiceOverQuote>50 units sold, Strategy 3</VoiceOverQuote>
      <VoiceOverQuote>10 units sold, Strategy 4</VoiceOverQuote>
      <VoiceOverQuote>0 units sold, Strategy 5</VoiceOverQuote>
      <Paragraph>
        The best approach to use will depend on the data and which makes that data easiest to comprehend.
      </Paragraph>
      <SectionHeading>Adding descriptions</SectionHeading>
      <Paragraph>
        As described in the WAI-ARIA Graphics Module, it is also possible to use the &lt;desc&gt; element to
        add a description to any part of the chart. I originally included a description for the chart itself
        and for each strategy. These worked well with VoiceOver but in NVDA the description text is spoken
        immediately after the aria label text and I found this confusing.
      </Paragraph>
      <SectionHeading>An alternative approach</SectionHeading>
      <Paragraph>
        Rather than add extra markup to the chart, you could instead completely hide the chart from the screen
        reader and render a visually hidden table alongside it. The screen reader user would then navigate
        this table in order to discover the data.
      </Paragraph>
    </main>
  );
}

export default AccessibilityPage;
