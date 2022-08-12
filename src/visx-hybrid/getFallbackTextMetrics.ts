import { getContext } from './textMeasurementCanvas';

// The MIT License

// Copyright (c) 2013-2018 Mathew Groves, Chad Engler

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * String used for calculate font metrics.
 * These characters are all tall to help calculate the height required for text.
 */
const METRICS_STRING = '|ÉqÅ';

/**
 * Baseline symbol for calculate font metrics.
 */
const BASELINE_SYMBOL = 'M';

/**
 * Baseline multiplier for calculate font metrics.
 */
const BASELINE_MULTIPLIER = 1.4;

/**
 * Height multiplier for setting height of canvas to calculate font metrics.
 */
const HEIGHT_MULTIPLIER = 2.0;

/**
 * Calculates the ascent, descent and fontSize of a given font-style
 * @param font - String representing the style of the font
 * @returns Font properties object
 */
export function getFallbackTextMetrics(font: string): TextMetrics {
  let fontBoundingBoxAscent = 0;
  let fontBoundingBoxDescent = 0;

  const context = getContext();
  context.font = font;

  const metricsString = METRICS_STRING + BASELINE_SYMBOL;
  const width = Math.ceil(context.measureText(metricsString).width);
  let baseline = Math.ceil(context.measureText(BASELINE_SYMBOL).width);
  const height = Math.ceil(HEIGHT_MULTIPLIER * baseline);

  baseline = (baseline * BASELINE_MULTIPLIER) | 0;

  // This adjusts the size of the shared textMeasurementCanvas
  // but I believe that it is okay to do so. It should not affect
  // the text width measurements.
  context.canvas.width = width;
  context.canvas.height = height;

  context.fillStyle = '#f00';
  context.fillRect(0, 0, width, height);

  context.font = font;

  context.textBaseline = 'alphabetic';
  context.fillStyle = '#000';
  context.fillText(metricsString, 0, baseline);

  const imagedata = context.getImageData(0, 0, width, height).data;
  const pixels = imagedata.length;
  const line = width * 4;

  let i = 0;
  let idx = 0;
  let stop = false;

  // ascent. scan from top to bottom until we find a non red pixel
  for (i = 0; i < baseline; ++i) {
    for (let j = 0; j < line; j += 4) {
      if (imagedata[idx + j] !== 255) {
        stop = true;
        break;
      }
    }
    if (!stop) {
      idx += line;
    } else {
      break;
    }
  }

  fontBoundingBoxAscent = baseline - i;

  idx = pixels - line;
  stop = false;

  // descent. scan from bottom to top until we find a non red pixel
  for (i = height; i > baseline; --i) {
    for (let j = 0; j < line; j += 4) {
      if (imagedata[idx + j] !== 255) {
        stop = true;
        break;
      }
    }

    if (!stop) {
      idx -= line;
    } else {
      break;
    }
  }

  fontBoundingBoxDescent = i - baseline;
  return { fontBoundingBoxAscent, fontBoundingBoxDescent } as TextMetrics;
}
