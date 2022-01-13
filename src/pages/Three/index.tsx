import { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

const PlaneObject = () => {
  const mesh = useRef();

  const { size } = useThree();

  return (
    <>
      <mesh position={[0, 0, -0.1]} ref={mesh}>
        <planeBufferGeometry args={[size.width - 2, size.height - 2]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
};

const ThreePage = () => (
  <div className="w-full max-w-3xl p-4 mx-auto md:p-8">
    <PageHeading>Three.js Rendering</PageHeading>
    <SectionHeading>TODO</SectionHeading>
    <Paragraph>TODO</Paragraph>
    <div className="h-[396px] w-full">
      <Canvas
        orthographic={true}
        style={{ backgroundColor: 'red' }}
        frameloop="demand"
        camera={{ zoom: 1, position: [0, 0, 0] }}
      >
        <ambientLight />
        <PlaneObject />
      </Canvas>
    </div>
  </div>
);

export default ThreePage;
