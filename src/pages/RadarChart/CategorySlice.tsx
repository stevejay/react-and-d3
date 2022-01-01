import { FC } from 'react';

export type CategorySliceProps = {
  /** Whether this slice is the currently selected slice. */
  isSelected: boolean;
  /**
   * The angle of the center of the slice, in degrees, with
   * the first slice position being zero degrees.
   */
  degree: number;
  /** The text to show in the slice. */
  label: string;
  /** The value of the `d` attribute of the slice path. */
  path: string;
  /** The font size in px of the slice label text. */
  sliceLabelFontSizePx: number;
  /**
   * The path ID to use to draw the labels in the lower half
   * of the radar chart
   */
  lowerLabelArcId: string;
  /**
   * The path ID to use to draw the labels in the upper half
   * of the radar chart
   */
  upperLabelArcId: string;
  /** The callback for when a slice is clicked. */
  onClick: () => void;
};

/** Renders a slice of the outer ring of the radar chart. */
export const CategorySlice: FC<CategorySliceProps> = ({
  isSelected,
  degree,
  label,
  path,
  sliceLabelFontSizePx,
  lowerLabelArcId,
  upperLabelArcId,
  onClick
}) => (
  <g>
    <path
      className={`slice-arc transition-colors fill-current ${
        isSelected ? 'text-slate-700' : 'text-slate-800'
      } hover:text-slate-700`}
      role="presentation"
      d={path}
      onClick={onClick}
    />
    <text
      className={`slice-label pointer-events-none transition-colors uppercase ${
        isSelected ? 'text-white' : 'text-slate-400'
      } fill-current`}
      role="presentation"
      aria-hidden
      dy={degree > 90 && degree < 270 ? '0.75em' : '0em'}
      style={{
        transform: `rotate(${degree}deg)`,
        fontSize: sliceLabelFontSizePx
      }}
    >
      <textPath
        startOffset="50%"
        href={degree > 90 && degree < 270 ? `#${lowerLabelArcId}` : `#${upperLabelArcId}`}
        style={{ textAnchor: 'middle' }}
      >
        {label}
      </textPath>
    </text>
  </g>
);
