import { FiExternalLink } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

export interface NavigationMenuLinkProps {
  href: string;
  title: string;
  onClick: () => void;
}

export function NavigationMenuLink({ href, title, onClick }: NavigationMenuLinkProps) {
  const isInternalLink = href.startsWith('/');
  return isInternalLink ? (
    <NavLink
      to={href}
      end
      onClick={onClick}
      className={({ isActive }) =>
        ` inline-block px-4 py-2 transition-transform outline-none hover:scale-110 focus-visible:bg-slate-600 ${
          isActive ? 'bg-slate-600' : ''
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
      className="inline-block px-4 py-2 transition-transform outline-none hover:scale-110 focus-visible:bg-slate-600"
    >
      {title}&nbsp;
      <FiExternalLink className="inline-block text-xl align-top text-slate-400" />
    </a>
  );
}
