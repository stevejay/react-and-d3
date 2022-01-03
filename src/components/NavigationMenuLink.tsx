import { FC } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

export type NavigationMenuLinkProps = { href: string; title: string; onClick: () => void };

export const NavigationMenuLink: FC<NavigationMenuLinkProps> = ({ href, title, onClick }) => {
  const isInternalLink = href.startsWith('/');
  return isInternalLink ? (
    <NavLink
      to={href}
      end
      onClick={onClick}
      className={({ isActive }) =>
        ` inline-block px-4 py-2 transition-transform outline-none hover:scale-110 focus-visible:bg-pink-600 ${
          isActive ? 'bg-pink-600' : ''
        }`
      }
    >
      {title}
    </NavLink>
  ) : (
    <a
      href={href}
      rel="nofollow noreferrer"
      target="_blank"
      onClick={onClick}
      className="inline-block px-4 py-2 transition-transform outline-none hover:scale-110 focus-visible:bg-pink-600"
    >
      {title}&nbsp;
      <FiExternalLink className="inline-block text-xl text-pink-400 align-top" />
    </a>
  );
};
