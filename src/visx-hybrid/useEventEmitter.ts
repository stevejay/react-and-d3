import { useCallback, useContext } from 'react';
import { localPoint } from '@visx/event';

import { EventEmitterContext, EventType, HandlerParams } from './EventEmitterProvider';

export function useEventEmitter() {
  const emitter = useContext(EventEmitterContext);

  // wrap emitter.emit so we can enforce stricter type signature
  const emit = useCallback(
    (type: EventType, event: HandlerParams['event'], source?: string) => {
      if (emitter) {
        emitter.emit(type, { event, svgPoint: localPoint(event), source });
      }
    },
    [emitter]
  );

  return emitter ? emit : null;
}
