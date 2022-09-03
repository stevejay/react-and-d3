import { useCallback } from 'react';
import { Helmet, HelmetProps } from 'react-helmet-async';

import { useAnnouncer } from '@/contexts/Announcer';

export function TitleAnnouncer() {
  const announcer = useAnnouncer();
  const handleChangeClientState = useCallback<NonNullable<HelmetProps['onChangeClientState']>>(
    (newState) => {
      announcer(newState?.title);
    },
    [announcer]
  );
  return <Helmet onChangeClientState={handleChangeClientState} />;
}
