import { MouseEventHandler, useCallback, useEffect, useMemo, useRef } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { polygonContains } from 'd3-polygon';
import { ScaleQuantize } from 'd3-scale';
import { pointer } from 'd3-selection';
import { Topology } from 'topojson-specification';

import { EntityBucket } from '@/api/stateofjs/generated';

import topology from './countries-with-antarctica.json';
import { getFeatures } from './generateGeometry';
import { Statistic } from './types';
import { TooltipState } from './useVirtualElementTooltip';

export type FeatureWithDatum = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> & {
  datum?: EntityBucket;
};

export interface CanvasWorldMapProps {
  width: number;
  height: number;
  data: (EntityBucket | undefined)[];
  colorScale: ScaleQuantize<string>;
  statistic: Statistic;
  showTooltip: TooltipState<FeatureWithDatum>['show'];
  hideTooltip: TooltipState<FeatureWithDatum>['hide'];
}

const pixelRatio = Math.round(globalThis.devicePixelRatio) || 1;

function featureContains(featureWithDatum: FeatureWithDatum, point: [number, number]) {
  if (!featureWithDatum.datum) {
    return false;
  }
  if (featureWithDatum.geometry.type === 'Polygon') {
    return featureWithDatum.geometry.coordinates.find((coords: number[][]) =>
      polygonContains(coords as [number, number][], point)
    );
  } else if (featureWithDatum.geometry.type === 'MultiPolygon') {
    return featureWithDatum.geometry.coordinates.find((coords1: number[][][]) =>
      coords1.find((coords2: number[][]) => polygonContains(coords2 as [number, number][], point))
    );
  }
  return false;
}

export function CanvasWorldMap({
  width,
  height,
  data,
  colorScale,
  statistic,
  showTooltip,
  hideTooltip
}: CanvasWorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTooltipDatum = useRef<FeatureWithDatum | null>(null);

  const mappedData = useMemo<FeatureWithDatum[]>(() => {
    lastTooltipDatum.current = null;
    const yearDataByCountry = new Map(data.map((datum) => [datum?.id, datum]));
    const features = getFeatures(topology as unknown as Topology);
    return features.features.map((feature) => ({
      ...feature,
      datum: yearDataByCountry.get(`${feature.id}`)
    }));
  }, [data]);

  const projection = useMemo(
    () =>
      geoMercator()
        .scale(width * pixelRatio * 0.16)
        .translate([width * pixelRatio * 0.5, height * pixelRatio * 0.62]),
    [width, height]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const path = geoPath(projection, context);
    context.clearRect(0, 0, canvas.width, canvas.height);

    mappedData.forEach((feature) => {
      const fillColor = feature.datum ? colorScale(feature.datum?.[statistic] ?? 0) : '#475569';
      context.fillStyle = fillColor;
      context.beginPath();
      path(feature);
      context.fill();
    });
  }, [width, height, statistic, colorScale, projection, mappedData]);

  const mouseMove = useCallback<MouseEventHandler<HTMLCanvasElement>>(
    (event) => {
      if (!canvasRef.current) {
        return;
      }

      const pointerPosition = pointer(event);
      const position = projection.invert?.([
        pointerPosition[0] * pixelRatio,
        pointerPosition[1] * pixelRatio
      ]);

      if (!position) {
        return;
      }

      let featureWithDatum = null;
      // First try the most likely case of the last hovered feature still being the hovered feature.
      if (lastTooltipDatum.current && featureContains(lastTooltipDatum.current, position)) {
        featureWithDatum = lastTooltipDatum.current;
      } else {
        featureWithDatum = mappedData.find((element) => featureContains(element, position));
      }

      if (featureWithDatum?.datum) {
        showTooltip(event.clientX, event.clientY, featureWithDatum);
        lastTooltipDatum.current = featureWithDatum;
      } else {
        hideTooltip();
        lastTooltipDatum.current = null;
      }
    },
    [projection, hideTooltip, showTooltip, mappedData]
  );

  return (
    <canvas
      ref={canvasRef}
      data-testid="world-map"
      style={{ width, height }}
      onMouseMove={mouseMove}
      onMouseLeave={hideTooltip}
    />
  );
}
