import { FC, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * This is a basic 'restore scroll to top' effect that only triggers
 * when navigating normally (so not on a back button or forward button click).
 * An alternative is to use https://github.com/oaf-project/oaf-react-router
 */
export const ScrollToTop: FC = () => {
  const location = useLocation();
  const action = useNavigationType();

  useLayoutEffect(() => {
    if (action !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [location, action]);

  return null;
};
