import { FC, useState } from 'react';
import { MeshProps } from '@react-three/fiber';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { motion } from 'framer-motion/three'; // WTF
// import * as THREE from 'three';

export const Box: FC<MeshProps> = (props) => {
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  //   return (
  //     <mesh
  //       {...props}
  //       //   ref={meshRef}
  //       scale={active ? 1.5 : 1}
  //       //   transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
  //       //   animate={{ rotateX: 2 * Math.PI }}
  //       onClick={() => setActive(!active)}
  //       onPointerOver={() => setHover(true)}
  //       onPointerOut={() => setHover(false)}
  //     >
  //       <boxGeometry args={[1, 1, 1]} />
  //       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
  //     </mesh>
  //   );
  return (
    <motion.mesh
      {...props}
      scale={active ? 1.5 : 1}
      transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
      animate={{ rotateX: 2 * Math.PI }}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </motion.mesh>
  );
};
