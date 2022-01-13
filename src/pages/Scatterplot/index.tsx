import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

// import { D3ScatterplotExample } from './D3ScatterplotExample';
import { ScatterplotExample } from './ScatterplotExample';

const Scatterplot = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Scatterplot</PageHeading>
    <SectionHeading>Interactive Scatterplot</SectionHeading>
    <Paragraph>TODO</Paragraph>
    <ScatterplotExample />
    {/* <SectionHeading>D3 Scatterplot</SectionHeading>
    <Paragraph>TODO</Paragraph>
    <D3ScatterplotExample /> */}
  </div>
);

export default Scatterplot;
