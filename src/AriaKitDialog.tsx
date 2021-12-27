// import { useState } from 'react';
// import { FocusOn } from 'react-focus-on';
// import { Button } from 'ariakit/Button';
import { FC } from 'react';
import {
  Dialog,
  DialogDescription,
  DialogDisclosure,
  DialogDismiss,
  DialogHeading,
  useDialogState
} from 'ariakit/Dialog';
import { motion, MotionConfig } from 'framer-motion';

const variants = {
  //   enter: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

// TODO see if there is a way around using 'any' here.
const DialogBackdrop: FC<any> = (props) => (
  <motion.div
    {...props}
    className="absolute inset-0 flex items-center justify-center bg-slate-900/50"
    variants={variants}
    initial="exit"
    animate={props.hidden ? 'exit' : 'animate'}
  />
);

export const AriaKitDialog = () => {
  const dialog = useDialogState({ animated: true });
  return (
    <>
      <DialogDisclosure
        state={dialog}
        className="px-4 py-2 font-light text-white outline-none bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring"
      >
        Open dialog
      </DialogDisclosure>
      <MotionConfig transition={{ duration: 0.25, ease: 'easeInOut' }}>
        <Dialog
          state={dialog}
          as={motion.div}
          backdrop={DialogBackdrop}
          className="absolute w-32 h-56 text-white bg-slate-900"
          variants={variants}
          initial="exit"
          animate={dialog.visible ? 'animate' : 'exit'}
          onAnimationComplete={dialog.stopAnimation}
        >
          <DialogHeading>Heading</DialogHeading>
          <DialogDescription>The description</DialogDescription>
          <DialogDismiss />
          Welcome to Reakit!
        </Dialog>
      </MotionConfig>
    </>
  );
};
