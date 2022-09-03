import * as topojson from 'topojson-client';
import { GeometryObject, Properties, Topology } from 'topojson-specification';

function isFeatureCollection<P extends Properties = GeoJSON.GeoJsonProperties>(
  feature: GeoJSON.Feature<GeoJSON.GeometryObject, P> | GeoJSON.FeatureCollection<GeoJSON.GeometryObject, P>
): feature is GeoJSON.FeatureCollection<GeoJSON.GeometryObject, P> {
  return feature && 'type' in feature && feature.type === 'FeatureCollection';
}

export function getFeatures(topology: Topology) {
  const featureCollection = topojson.feature(topology, topology.objects.countries);
  if (!isFeatureCollection(featureCollection)) {
    throw new Error('Expected GeoJSON.FeatureCollection but got GeoJSON.Feature');
  }
  return featureCollection;
}

export function getMesh(topology: Topology) {
  const outline = topojson.mesh(
    topology,
    topology.objects.countries as GeometryObject<object>,
    (a, b) => a === b
  ); // exterior
  const borders = topojson.mesh(
    topology,
    topology.objects.countries as GeometryObject<object>,
    (a, b) => a !== b
  ); // interior
  return { outline, borders };
}
