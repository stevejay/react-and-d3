import { FC, useState } from 'react';

import { AriaKitDialog } from './AriaKitDialog';
import { Checkbox } from './Checkbox';
import { CustomTimeAxisExamples } from './CustomTimeAxisExamples';
// import { HeadlessUiDialog } from './HeadlessUiDialog';
import { LinearAxisExamples } from './LinearAxisExamples';
import { RadarChartExamples } from './RadarChartExamples';
import { SparklineExamples } from './SparklineExamples';
import { TimeAxisExamples } from './TimeAxisExamples';

const SectionHeading: FC = ({ children }) => (
  <h2 className="text-2xl font-bold text-slate-700">{children}</h2>
);

const fastAnimationSeconds = 0.75;
const slowAnimationSeconds = 2;

export const App: FC = () => {
  const [slowAnimations, setSlowAnimations] = useState(false);
  const [drawTicksAsGridLines, setDrawTicksAsGridLines] = useState(false);
  const transitionSeconds = slowAnimations ? slowAnimationSeconds : fastAnimationSeconds;
  return (
    <>
      <div className="sticky top-0 flex px-8 py-4 space-x-8 bg-white shadow-lg">
        <Checkbox
          label="Draw inner ticks as grid lines"
          checked={drawTicksAsGridLines}
          onChange={setDrawTicksAsGridLines}
        />
        <Checkbox label="Use slow animations" checked={slowAnimations} onChange={setSlowAnimations} />
      </div>
      <AriaKitDialog />
      {/* <HeadlessUiDialog /> */}
      <div className="m-8 space-y-8">
        <SectionHeading>Linear Axis</SectionHeading>
        <LinearAxisExamples
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
        <SectionHeading>Time Axis</SectionHeading>
        <TimeAxisExamples drawTicksAsGridLines={drawTicksAsGridLines} transitionSeconds={transitionSeconds} />
        <SectionHeading>Custom Time Axis</SectionHeading>
        <CustomTimeAxisExamples transitionSeconds={transitionSeconds} />
        <SectionHeading>Radar Chart</SectionHeading>
        <RadarChartExamples transitionSeconds={transitionSeconds} />
        <SectionHeading>Sparkline</SectionHeading>
        <SparklineExamples transitionSeconds={transitionSeconds} />
      </div>
    </>
  );
};
