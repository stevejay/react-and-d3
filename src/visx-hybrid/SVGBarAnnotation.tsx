import { Annotation, CircleSubject, Connector, Label } from '@visx/annotation';

import { useBarAnnotation } from './useBarAnnotation';

export interface SVGBarAnnotationProps<Datum extends object> {
  dataKey: string;
  datum: Datum;
}

export function SVGBarAnnotation<Datum extends object>({ dataKey, datum }: SVGBarAnnotationProps<Datum>) {
  const origin = useBarAnnotation(dataKey, datum);
  if (!origin) {
    return null;
  }
  return (
    <Annotation x={origin.x} y={origin.y} dx={-40} dy={-50}>
      <Connector stroke="white" pathProps={{ strokeWidth: 2 }} />
      <CircleSubject radius={7} stroke="white" strokeWidth={2} role="presentation" aria-hidden />
      <Label
        title="Context about this point"
        titleFontSize={16}
        titleFontWeight={400}
        titleProps={{ fontFamily: '"Readex Pro"', lineHeight: '1.2em' }}
        showAnchorLine={false}
        backgroundFill="white"
      />
    </Annotation>
  );
}
