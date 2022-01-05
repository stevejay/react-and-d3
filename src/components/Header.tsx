import { FC, useState } from 'react';
import { FiGithub, FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, m as motion, MotionConfig } from 'framer-motion';

import { NavigationMenuLink } from './NavigationMenuLink';

const variants = {
  enter: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export type NavigationLink = { href: string; title: string };
export type NavigationSection = { title: string; links: NavigationLink[] };

export type HeaderProps = {
  navigationData: NavigationSection[];
};

export const Header: FC<HeaderProps> = ({ navigationData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  return (
    <header className="sticky top-0 border-b bg-slate-900 border-slate-600">
      <div className="flex items-center justify-between px-4 py-1 mx-auto md:px-6 md:py-2 max-w-screen-2xl">
        <h2 className="text-2xl font-thin text-transparent uppercase bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
          <Link to="/" className="outline-none focus-visible:ring-2">
            React &amp; D3
          </Link>
        </h2>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/stevejay/react-and-d3"
            rel="nofollow noreferrer"
            target="_blank"
            className="p-2 text-3xl transition-colors outline-none hover:bg-slate-800 focus-visible:ring-2"
            aria-label="Github repository for this Web site"
          >
            <FiGithub />
          </a>
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setIsOpen(true)}
            className="p-2 -mr-2 text-3xl transition-colors outline-none hover:bg-slate-800 focus-visible:ring-2"
          >
            <FiMenu />
          </button>
        </div>
        <MotionConfig transition={{ duration: 0.25, ease: 'easeInOut' }}>
          <AnimatePresence>
            {isOpen && (
              <Dialog
                key="dialog"
                as={motion.div}
                static
                open={isOpen}
                onClose={close}
                className="fixed z-[10000] inset-0 p-8 overflow-y-auto md:p-12 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-600"
                variants={variants}
                initial="enter"
                animate="animate"
                exit="exit"
                aria-label="Navigation menu"
              >
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={close}
                  className="fixed p-2 text-4xl transition-transform outline-none top-4 right-4 hover:scale-110 focus-visible:bg-pink-600"
                >
                  <FiX />
                </button>
                <div className="flex flex-col gap-6 mx-auto max-w-screen-2xl md:flex-row md:gap-12">
                  {navigationData.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <h2 className="font-bold text-blue-500 uppercase text-md">{section.title}</h2>
                      <ul className="-ml-4 space-y-2 text-2xl md:text-3xl font-extralight">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <NavigationMenuLink {...link} onClick={close} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Dialog>
            )}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </header>
  );
};
