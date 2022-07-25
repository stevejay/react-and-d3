// From https://codesandbox.io/s/github/tannerlinsley/react-charts/tree/beta/examples/simple?file=/src/useLagRadar.js:0-3661

// TODO Could create a canvas version.

import { useEffect } from 'react';
import { useWindowSize } from '@react-hook/window-size';

export function useLagRadar() {
  const [width, height] = useWindowSize();
  useEffect(
    () =>
      lagRadar({
        frames: 50, // number of frames to draw, more = worse performance
        speed: 0.0017, // how fast the sweep moves (rads per ms)
        size: Math.min(width, height) / 3, // outer frame px
        inset: 3, // circle inset px
        parent: globalThis.document.body // DOM node to attach to
      }),
    [width, height]
  );
}

interface LagRadarConfig {
  frames: number;
  speed: number;
  size: number;
  inset: number;
  parent: Element;
}

/**
 * lagRadar
 * Licence: ISC copyright: @mobz 2018
 */
function lagRadar(config: Partial<LagRadarConfig> = {}) {
  const {
    frames = 50, // number of frames to draw, more = worse performance
    speed = 0.0017, // how fast the sweep moves (rads per ms)
    size = 300, // outer frame px
    inset = 3, // circle inset px
    parent = globalThis.document.body // DOM node to attach to
  } = config;

  const svgns = 'http://www.w3.org/2000/svg';

  function $svg(
    tag: string,
    attributes: Record<string, string> = {},
    styles: Record<string, string> = {},
    children: SVGElement[] = []
  ) {
    const el = document.createElementNS(svgns, tag) as SVGCircleElement;
    Object.keys(attributes).forEach((attribute) => el.setAttribute(attribute, attributes[attribute]));
    Object.keys(styles).forEach((style) => el.style.setProperty(style, styles[style]));
    children.forEach((child) => el.appendChild(child));
    return el;
  }

  const PI2 = Math.PI * 2;
  const middle = size / 2;
  const radius = middle - inset;

  const $hand = $svg('path', { class: 'lagRadar-hand', 'stroke-width': '4px', 'stroke-linecap': 'round' });
  const $arcs = new Array(frames).fill('path').map((t) => $svg(t, { 'shape-rendering': 'crispEdges' }));
  const $root = $svg(
    'svg',
    { class: 'lagRadar', height: `${size}`, width: `${size}` },
    {
      'pointer-events': 'none',
      position: 'fixed',
      bottom: '0.5rem',
      right: '0.5rem'
    },
    [
      $svg('g', { class: 'lagRadar-sweep' }, {}, $arcs),
      $hand,
      $svg('circle', {
        class: 'lagRadar-face',
        cx: `${middle}`,
        cy: `${middle}`,
        r: `${radius}`,
        fill: 'transparent'
      })
    ]
  );

  parent.appendChild($root);

  let frame: number;
  let framePtr = 0;
  let last = {
    rotation: 0,
    now: Date.now(),
    tx: middle + radius,
    ty: middle
  };

  const calcHue = (() => {
    const max_hue = 120;
    const max_ms = 1000;
    const log_f = 10;
    const mult = max_hue / Math.log(max_ms / log_f);
    return function (ms_delta: number) {
      return max_hue - Math.max(0, Math.min(mult * Math.log(ms_delta / log_f), max_hue));
    };
  })();

  function animate() {
    const now = Date.now();
    const rdelta = Math.min(PI2 - speed, speed * (now - last.now));
    const rotation = (last.rotation + rdelta) % PI2;
    const tx = middle + radius * Math.cos(rotation);
    const ty = middle + radius * Math.sin(rotation);
    const bigArc = rdelta < Math.PI ? '0' : '1';
    const path = `M${tx} ${ty}A${radius} ${radius} 0 ${bigArc} 0 ${last.tx} ${last.ty}L${middle} ${middle}`;
    const hue = calcHue(rdelta / speed);

    $arcs[framePtr % frames].setAttribute('d', path);
    $arcs[framePtr % frames].setAttribute('fill', `hsl(${hue}, 80%, 40%)`);
    $hand.setAttribute('d', `M${middle} ${middle}L${tx} ${ty}`);
    $hand.setAttribute('stroke', `hsl(${hue}, 80%, 60%)`);

    for (let i = 0; i < frames; i++) {
      $arcs[(frames + framePtr - i) % frames].style.fillOpacity = `${1 - i / frames}`;
    }

    framePtr++;
    last = { now, rotation, tx, ty };
    frame = window.requestAnimationFrame(animate);
  }

  animate();

  return function destroy() {
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
    $root.remove();
  };
}
