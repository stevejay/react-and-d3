import { FC, useState } from 'react';

import { CustomTimeAxisExamples } from './CustomTimeAxisExamples';
import { LinearAxisExamples } from './LinearAxisExamples';
import { RadarChartExamples } from './RadarChartExamples';
import { TimeAxisExamples } from './TimeAxisExamples';

const SectionHeading: FC = ({ children }) => <h2 className="text-2xl text-gray-700 font-bold">{children}</h2>;

const fastAnimationSeconds = 0.75;
const slowAnimationSeconds = 2;

export const App: FC = () => {
  const [transitionSeconds, setTransitionSeconds] = useState(fastAnimationSeconds);
  const [drawTicksAsGridLines, setDrawTicksAsGridLines] = useState(false);

  return (
    <>
      <div className="px-8 py-4 flex space-x-8 bg-white shadow-lg sticky top-0">
        <div className="flex items-center space-x-2">
          <input
            id="ticks-as-grid-lines"
            type="checkbox"
            checked={drawTicksAsGridLines}
            onChange={() => setDrawTicksAsGridLines((state) => !state)}
          />
          <label htmlFor="ticks-as-grid-lines">Draw inner ticks as grid lines</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="slow-animations"
            type="checkbox"
            checked={transitionSeconds === slowAnimationSeconds}
            onChange={() =>
              setTransitionSeconds((state) =>
                state === fastAnimationSeconds ? slowAnimationSeconds : fastAnimationSeconds
              )
            }
          />
          <label htmlFor="slow-animations">Slow animations</label>
        </div>
      </div>
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
      </div>
    </>
  );
};
