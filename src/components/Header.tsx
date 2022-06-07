import { useState } from 'react';
import { FiGithub, FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { animated, useTransition } from 'react-spring';
import { Dialog } from '@headlessui/react';

import { NavigationMenuLink } from './NavigationMenuLink';

export interface NavigationLink {
  href: string;
  title: string;
}

export interface NavigationSection {
  title: string;
  links: NavigationLink[];
}

export interface HeaderProps {
  navigationData: NavigationSection[];
}

export function Header({ navigationData }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 20 },
    reverse: isOpen
  });
  return (
    <header className="sticky top-0 z-10 border-b bg-slate-900 border-slate-600">
      <div className="flex items-center justify-between px-4 py-1 mx-auto md:px-6 md:py-2 max-w-screen-2xl">
        <Link
          to="/"
          className="outline-none focus-visible:ring-2 text-2xl font-thin text-transparent uppercase bg-clip-text bg-gradient-to-r from-blue-500 to-green-500"
        >
          React &amp; D3 <span className="sr-only">home page</span>
        </Link>
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
        {transitions(
          (styles, item) =>
            item && (
              <Dialog
                key="dialog"
                as={animated.div}
                style={styles}
                static
                open={isOpen}
                onClose={close}
                className="fixed z-[10000] inset-0 p-8 overflow-y-auto md:p-12 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-600"
                aria-label="Navigation menu"
              >
                <div className="flex flex-col gap-6 mx-auto max-w-screen-2xl md:flex-row md:gap-12">
                  <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={close}
                    className="fixed p-2 text-4xl transition-transform outline-none top-4 right-4 hover:scale-110 focus-visible:ring-2"
                  >
                    <FiX />
                  </button>
                  {navigationData.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <h2 className="font-semibold text-blue-500 uppercase text-md">{section.title}</h2>
                      <ul className="-ml-4 space-y-0 text-2xl md:text-3xl font-extralight">
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
            )
        )}
      </div>
    </header>
  );
}
