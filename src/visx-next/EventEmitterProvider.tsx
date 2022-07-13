import { createContext, FocusEvent, PointerEvent, ReactNode, useMemo } from 'react';
import { localPoint } from '@visx/event';
import mitt, { Emitter } from 'mitt';

export type HandlerParams = {
  /** The react PointerEvent or FocusEvent. */
  event: PointerEvent | FocusEvent;
  /** Position of the PointerEvent in svg coordinates. */
  svgPoint: ReturnType<typeof localPoint>;
  /** The source of the event. This can be anything, but for this package is the name of the component which emitted the event. */
  source?: string;
};

export type Events = {
  pointermove: HandlerParams;
  pointerout: HandlerParams;
  pointerup: HandlerParams;
  focus: HandlerParams;
  blur: HandlerParams;
};

export type EventType = keyof Events;

export type EventEmitterContextType = Emitter<Events>; // TODO fix any

export const EventEmitterContext = createContext<EventEmitterContextType | null>(null);

/** Provider for EventEmitterContext. */
export function EventEmitterProvider({ children }: { children: ReactNode }) {
  const emitter = useMemo(() => mitt<Events>(), []);
  return <EventEmitterContext.Provider value={emitter}>{children}</EventEmitterContext.Provider>;
}
