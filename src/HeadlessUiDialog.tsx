import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';

const overlayVariants = {
  enter: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const dialogVariants = {
  enter: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const HeadlessUiDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open dialog
      </button>
      <MotionConfig transition={{ duration: 0.25, ease: 'easeInOut' }}>
        <AnimatePresence>
          {isOpen && (
            <Dialog
              key="dialog"
              static
              open={isOpen}
              onClose={close}
              className="fixed inset-0 z-10 overflow-y-auto"
            >
              <Dialog.Overlay
                as={motion.div}
                className="fixed inset-0 bg-black/30"
                variants={overlayVariants}
                initial="enter"
                animate="animate"
                exit="exit"
              />
              <div className="flex items-center justify-center min-h-screen">
                <motion.div
                  className="relative max-w-sm bg-white rounded min-w-[256px]"
                  variants={dialogVariants}
                  initial="enter"
                  animate="animate"
                  exit="exit"
                >
                  <Dialog.Title>Hello Dialog!</Dialog.Title>
                  <button onClick={close}>Cancel</button>
                </motion.div>
              </div>
            </Dialog>
          )}
        </AnimatePresence>
      </MotionConfig>
    </>
  );
};
