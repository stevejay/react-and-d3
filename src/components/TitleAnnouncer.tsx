import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import { useAnnouncer } from '@/contexts/Announcer';

export function TitleAnnouncer() {
  const announcer = useAnnouncer();
  const handleChangeClientState = useCallback(
    (newState: any) => {
      announcer(newState?.title);
    },
    [announcer]
  );
  return <Helmet onChangeClientState={handleChangeClientState} />;
}
