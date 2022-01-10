import { Canvas } from '@react-three/fiber';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

import { Box } from './Box';

const ThreePage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Three.js Rendering</PageHeading>
    <SectionHeading>TODO</SectionHeading>
    <Paragraph>TODO</Paragraph>
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  </div>
);

export default ThreePage;
