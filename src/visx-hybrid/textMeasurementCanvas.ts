import { isNil } from './isNil';

let context: CanvasRenderingContext2D;

/**
 * Access a 2D rendering context by creating one if it doesn't exist yet.
 *
 * Note: The size of this canvas might get adjusted by the `getFallbackTextMetrics`
 * function.
 */
export function getContext() {
  if (isNil(context)) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }
  return context;
}
