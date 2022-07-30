import { Helmet } from 'react-helmet-async';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

// import { SVGSimpleText } from '@/visx-hybrid/SVGSimpleText';
import { BarChartExample } from './BarChartExample';
// import { darkTheme } from './darkTheme';
// import { GroupedBarChartExample } from './GroupedBarChartExample';
import { RespondentsByLanguage } from './RespondentsByLanguage';
// import { StackedBarChartExample } from './StackedBarChartExample';

function VisxHybridPage() {
  return (
    <main className="w-full max-w-3xl p-4 mx-auto md:p-8">
      <PageHeading>Visx Hybrid</PageHeading>
      <Helmet>
        <title>Visx Hybrid - React and D3</title>
      </Helmet>
      <Paragraph>
        This page is for creating a version of Visx that has better animations and extensibility.
      </Paragraph>
      <SectionHeading>Bar Chart</SectionHeading>
      {/* <svg width={200} height={200}>
        <g>
          <SVGSimpleText
            textAnchor="middle"
            verticalAnchor="middle"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg>
      <svg width={200} height={200} style={{ marginTop: 20 }}>
        <g>
          <SVGSimpleText
            textAnchor="start"
            verticalAnchor="middle"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg>
      <svg width={200} height={200} style={{ marginTop: 20 }}>
        <g>
          <SVGSimpleText
            textAnchor="end"
            verticalAnchor="middle"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg>

      <svg width={200} height={200}>
        <g>
          <SVGSimpleText
            textAnchor="middle"
            verticalAnchor="start"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg>
      <svg width={200} height={200} style={{ marginTop: 20 }}>
        <g>
          <SVGSimpleText
            textAnchor="start"
            verticalAnchor="start"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg>
      <svg width={200} height={200} style={{ marginTop: 20 }}>
        <g>
          <SVGSimpleText
            textAnchor="end"
            verticalAnchor="start"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg>

      <svg width={200} height={200}>
        <g>
          <SVGSimpleText
            textAnchor="middle"
            verticalAnchor="end"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg>
      <svg width={200} height={200} style={{ marginTop: 20 }}>
        <g>
          <SVGSimpleText
            textAnchor="start"
            verticalAnchor="end"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg>
      <svg width={200} height={200} style={{ marginTop: 20 }}>
        <g>
          <SVGSimpleText
            textAnchor="end"
            verticalAnchor="end"
            fill="white"
            angle={90}
            textStyles={darkTheme.bigLabels}
            x={100}
            y={100}
          >
            Helly
          </SVGSimpleText>
        </g>
        <circle cx={100} cy={100} r={0.5} fill="white" />
      </svg> */}

      <BarChartExample />
      <RespondentsByLanguage />
      {/* <GroupedBarChartExample />
      <StackedBarChartExample /> */}
    </main>
  );
}

export default VisxHybridPage;
