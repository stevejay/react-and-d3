import { ReactElement, useContext } from 'react';
import type { AxisScale } from '@visx/axis';

import { DataContext } from './DataContext';
import { CommonGridProps, GridComponentProps } from './types';

export type GridProps = {
  /** Whether to render GridRows. */
  rows?: boolean;
  /** Whether to render GridColumns. */
  columns?: boolean;
  /** Rendered GridRows component which is passed GridRowProps by BaseGrid. */
  GridRowsComponent: (props: GridComponentProps<AxisScale>) => ReactElement;
  /** Rendered GridColumns component which is passed GridColumnsProps by BaseGrid. */
  GridColumnsComponent: (props: GridComponentProps<AxisScale>) => ReactElement;
} & CommonGridProps;

export function Grid({
  rows = true,
  columns = true,
  GridRowsComponent,
  GridColumnsComponent,
  ...props
}: GridProps) {
  const {
    xScale: columnsScale,
    yScale: rowsScale,
    margin,
    innerWidth,
    innerHeight
  } = useContext(DataContext);

  // TODO make configurable
  const gridLineStyles = {
    stroke: 'red',
    strokeWidth: 1
  };

  return (
    <>
      {rows && rowsScale && innerWidth != null && (
        <GridRowsComponent
          left={margin?.left}
          lineStyle={gridLineStyles}
          dimension={innerWidth}
          scale={rowsScale}
          {...props}
        />
      )}
      {columns && columnsScale && innerHeight != null && (
        <GridColumnsComponent
          top={margin?.top}
          lineStyle={gridLineStyles}
          dimension={innerHeight}
          scale={columnsScale}
          {...props}
        />
      )}
    </>
  );
}
