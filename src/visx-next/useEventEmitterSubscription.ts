import { useContext, useEffect, useRef } from 'react';

import { EventEmitterContext, EventType, HandlerParams } from './EventEmitterProvider';

export type Handler = (params?: HandlerParams) => void;

/**
 * Hook for optionally subscribing to a specified EventType,
 * and returns emitter for emitting events.
 */
export function useEventEmitterSubscription(
  /** Type of event to subscribe to. */
  eventType?: EventType,
  /** Handler invoked on emission of EventType event.  */
  handler?: Handler,
  /** Optional valid sources for EventType subscription. */
  allowedSources?: string[]
) {
  const emitter = useContext(EventEmitterContext);
  const allowedSourcesRef = useRef<string[] | undefined>();
  allowedSourcesRef.current = allowedSources; // use ref so allowedSources[] can change without creating new handlers

  useEffect(() => {
    if (emitter && eventType && handler) {
      // register handler, with source filtering as needed
      const handlerWithSourceFilter: Handler = (params?: HandlerParams) => {
        if (
          !allowedSourcesRef.current ||
          (params?.source && allowedSourcesRef.current?.includes(params.source))
        ) {
          handler(params);
        }
      };
      emitter.on(eventType, handlerWithSourceFilter);
      return () => emitter?.off(eventType, handlerWithSourceFilter);
    }
    return undefined;
  }, [emitter, eventType, handler]);
}
