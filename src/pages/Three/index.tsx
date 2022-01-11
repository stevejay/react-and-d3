import { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';

import { PageHeading } from '@/components/PageHeading';
import { Paragraph } from '@/components/Paragraph';
import { SectionHeading } from '@/components/SectionHeading';

// import { Box } from './Box';

const PlaneObject = () => {
  const mesh = useRef();

  const { size } = useThree();

  // 5 ??? -900           renderOrder
  return (
    <>
      {/* <mesh position={[0, 0, -900]} ref={mesh}>
        <planeBufferGeometry args={[size.width - 2, size.height - 2]} />
        <meshStandardMaterial color="white" polygonOffset polygonOffsetUnits={1} />
      </mesh>

      <mesh position={[0, 0, -900]} ref={mesh}>
        <planeBufferGeometry args={[size.width - 2, size.height - 2]} />
        <meshStandardMaterial color="green" polygonOffset polygonOffsetUnits={2} />
      </mesh> */}

      <mesh position={[0, 0, -0.1]} ref={mesh}>
        <planeBufferGeometry args={[size.width - 2, size.height - 2]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* <mesh position={[0, 0, -100]} ref={mesh}>
        <planeBufferGeometry args={[size.width - 2, size.height - 2]} />
        <meshStandardMaterial color="green" />
      </mesh> */}
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
        {/* <pointLight position={[10, 10, 10]} /> */}
        <PlaneObject />
        {/* <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} /> */}
      </Canvas>
    </div>
  </div>
);

export default ThreePage;
