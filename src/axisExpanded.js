// ----------------------------------------------------------------------------
//
// This is a commented version of the axis component from the d3.js library.
// I've also expanded some of the syntax to make it easier to read. The aim is
// to help people learning d3 to understand how this component works. It
// incorporates a few techniques that are worth knowing about.
//
// Original source code:
//     https://github.com/d3/d3-axis/blob/64372b12c9ba5c8a816277b3ad04ff813db5af97/src/axis.js
// Documentation:
//     https://github.com/d3/d3-axis
//
// ----------------------------------------------------------------------------

// A function to simply return the given argument.
function identity(x) {
  return x;
}

// The axis component supports four orientations for the rendered axis: top,
// bottom, left and right.
const top = 1;
const right = 2;
const bottom = 3;
const left = 4;

// Some older browsers exhibited performance issues when animations involved
// numbers very close to zero. These are sometimes known as denormalised values
// (see https://en.wikipedia.org/wiki/Subnormal_number). Instead of using zero
// as a target value for an animation, the smallest positive non-denormalised
// value is used instead. Here, this value is termed 'epsilon'.
const epsilon = 1e-6;

// For creating an x-axis transform attribute value.
function translateX(x) {
  return `translate(${x},0)`;
}

// For creating an y-axis transform attribute value.
function translateY(y) {
  return `translate(0,${y})`;
}

// Returns a function that transforms a domain value into a position in pixels
// using the given scale object to do so. This is the transform used when the
// scale is not a band scale.
function number(scale) {
  return (d) => +scale(d);
}

// Returns a function that transforms a domain value into a position in pixels
// using the given scale object to do so. This is the transform used when the
// scale is a band scale.
function center(scale, offset) {
  offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
  if (scale.round()) {
    offset = Math.round(offset);
  }
  return (d) => +scale(d) + offset;
}

// Returns `true` if the node this function is called on does not already have
// the `__axis` property set on it.
function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  // Used to directly control exactly which inner ticks are generated on the axis.
  // This is normally left unset, and so the scale's ticks or domain value is used
  // to determine the inner ticks to generate.
  let tickValues = null;

  // Used to directly control exactly which inner ticks are generated when it is
  // the axis' scale that is generating them. The exact arguments to pass depends
  // on the type of the scale used with the axis.
  let tickArguments = [];

  // The formatter function that is used to generate the text for an inner tick's
  // label. This is normally left unset and so it is the scale's formatter
  // function that is used when the axis is rendered.
  let tickFormat = null;

  // The length of the inner ticks (which are the ticks with labels).
  let tickSizeInner = 6;

  // The length of the outer ticks. These do not have labels, but note that an
  // inner tick could get rendered over the top of an outer tick. This would make
  // it appear that an outer tick had the length and label of an inner tick.
  let tickSizeOuter = 6;

  // The distance in pixels between the end of the tick's line and the tick's
  // label.
  let tickPadding = 3;

  // Used to ensure crisp edges on low-resolution devices.
  let offset = typeof window !== 'undefined' && window.devicePixelRatio > 1 ? 0 : 0.5;

  // Three constants to allow the axis function to support all of the four
  // orientations.
  const k = orient === top || orient === left ? -1 : 1;
  const x = orient === left || orient === right ? 'x' : 'y';
  const transform = orient === top || orient === bottom ? translateX : translateY;

  // The axis generator function. The context is some D3 selection, for example, a
  // containing group (<g />) SVG element.
  function axis(context) {
    // Determine the exact tick values to use.
    const values =
      tickValues == null
        ? scale.ticks
          ? scale.ticks.apply(scale, tickArguments)
          : scale.domain()
        : tickValues;

    // Determine the exact tick text formatter function to use.
    const format =
      tickFormat == null
        ? scale.tickFormat
          ? scale.tickFormat.apply(scale, tickArguments)
          : identity
        : tickFormat;

    // The distance between the axis domain line and the tick labels.
    const spacing = Math.max(tickSizeInner, 0) + tickPadding;

    // The scale's range:
    const range = scale.range();

    // The pixel position to start drawing the axis domain line at:
    const range0 = +range[0] + offset;

    // The pixel position to finish drawing the axis domain line at:
    const range1 = +range[range.length - 1] + offset;

    // Get a function that can be used to calculate the pixel position for a tick
    // value. This has special handling if the scale is a band scale, in which case
    // the position is in the center of each band. The scale needs to be copied
    // (`scale.copy()`)because it will later be stored in the DOM to be used for
    // enter animations the next time that this axis component is rendered.
    const position = (scale.bandwidth ? center : number)(scale.copy(), offset);

    // The parent selection. It could be a regular selection or a transition
    // selection (if the axis is being animated).
    const selection = context.selection ? context.selection() : context;

    // Select the domain line. Note the use of `[null]` as the data to join
    // with that selection.
    let path = selection.selectAll('.domain').data([null]);

    // Select the inner tick groups. The scale is used as the key function, meaning
    // that it is the translated pixel position for each tick value that is used as
    // its key value. This key value is used to match each datum to a DOM element.
    //
    // The `order()` call is used to ensure that the document order of the selection
    // elements matches the selection order, by re-inserting them into the DOM. (I'm
    // not sure why this is important because, regardless of the order of the
    // elements in the DOM, the ticks are still displayed in their correct position
    // in the axis.)
    let tick = selection.selectAll('.tick').data(values, scale).order();

    // Select the exiting tick groups.
    let tickExit = tick.exit();

    // Create a <g /> element for each of the entering tick groups.
    let tickEnter = tick.enter().append('g').attr('class', 'tick');

    // Select all the line elements within the existing tick groups.
    let line = tick.select('line');

    // Select all the text elements within the existing tick groups.
    let text = tick.select('text');

    // Create a <path /> element for the domain line if it does not already exist.
    // Note how `currentColor` is used for the colors of all the axis elements so
    // that you can easily change the color of the entire axis. Also, `insert()`
    // rather than the usual `append()` method is used for adding the path element
    // so that it is before all the tick group elements in the DOM.
    path = path.merge(
      path.enter().insert('path', '.tick').attr('class', 'domain').attr('stroke', 'currentColor')
    );

    // Merge the existing ticks with the newly created ticks.
    tick = tick.merge(tickEnter);

    // Create a line element within each of the entering tick groups and then merge
    // those created line elements with the line elements in the existing tick
    // groups.
    line = line.merge(
      tickEnter
        .append('line')
        .attr('stroke', 'currentColor')
        .attr(x + '2', k * tickSizeInner) // Sets the `x2` or `y2` value.
    );

    // Create a text element within each of the entering tick groups and then merge
    // those created text elements with the text elements in the existing tick
    // groups.
    text = text.merge(
      tickEnter
        .append('text')
        .attr('fill', 'currentColor')
        .attr(x, k * spacing)
        .attr('dy', orient === top ? '0em' : orient === bottom ? '0.71em' : '0.32em')
    );

    // If true, this indicates that we are animating the axis so transitions need to
    // be applied to the axis elements.
    if (context !== selection) {
      // Create transitions for all of the axis elements, inheriting them from the
      // context's transition.
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      // Set up the exiting ticks to animate to being (almost) invisible and to being
      // positioned according to the current scale, as opposed to the old scale. Note
      // that if the exiting datum does not map to a valid pixel value (tested using
      // the `position(d)` call) then the existing transform value is used instead.
      tickExit = tickExit
        .transition(context)
        .attr('opacity', epsilon)
        .attr('transform', function (d) {
          return isFinite((d = position(d))) ? transform(d + offset) : this.getAttribute('transform');
        });

      // Set entering ticks to start as (almost) invisible and to be positioned where
      // they would have been if they had been rendered according to the old scale
      // (the one that we are animating from).
      tickEnter.attr('opacity', epsilon).attr('transform', function (d) {
        var p = this.parentNode.__axis;
        return transform((p && isFinite((p = p(d))) ? p : position(d)) + offset);
      });
    }

    // Remove the exiting tick groups (either immediately or once the exit animations
    // have completed).
    tickExit.remove();

    // Update the domain line. A single path is used to draw the domain line and the
    // outer ticks as one continuous line.
    path.attr(
      'd',
      orient === left || orient === right
        ? tickSizeOuter
          ? 'M' + k * tickSizeOuter + ',' + range0 + 'H' + offset + 'V' + range1 + 'H' + k * tickSizeOuter
          : 'M' + offset + ',' + range0 + 'V' + range1
        : tickSizeOuter
        ? 'M' + range0 + ',' + k * tickSizeOuter + 'V' + offset + 'H' + range1 + 'V' + k * tickSizeOuter
        : 'M' + range0 + ',' + offset + 'H' + range1
    );

    // Update all entering and updating tick groups so they have an opacity of 1 and
    // the correct new position.
    tick.attr('opacity', 1).attr('transform', function (d) {
      return transform(position(d) + offset);
    });

    // Update the position of all entering and updating tick line elements.
    line.attr(x + '2', k * tickSizeInner);

    // Update the position and text of all entering and updating tick text elements.
    text.attr(x, k * spacing).text(format);

    // Set a few attributes on the the DOM element that this axis component was
    // invoked on. These are only added if this is the first time the axis has been
    // rendered. (It detects this by looking for a truthy value for the `__axis`
    // property on the DOM element, which is a property that is set below.)
    selection
      .filter(entering)
      .attr('fill', 'none')
      .attr('font-size', 10)
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', orient === right ? 'start' : orient === left ? 'end' : 'middle');

    // Saves the current position function to the DOM element that this axis
    // component was invoked on. This is so it can be used when the axis is next
    // rendered to calculate the initial pixel positions for any tick groups that
    // are entering. This means that they render initially where they would be on
    // the old version of the axis, and then smoothly animate to their correct
    // positions on the new version of the axis.
    selection.each(function () {
      this.__axis = position;
    });
  }

  // The remainder of the functions here are almost all combined getter/setter
  // functions for various axis properties. These control the appearance of the
  // rendered axis.

  axis.scale = function (_) {
    return arguments.length ? ((scale = _), axis) : scale;
  };

  axis.ticks = function () {
    return (tickArguments = Array.from(arguments)), axis;
  };

  axis.tickArguments = function (_) {
    return arguments.length
      ? ((tickArguments = _ == null ? [] : Array.from(_)), axis)
      : tickArguments.slice();
  };

  axis.tickValues = function (_) {
    return arguments.length
      ? ((tickValues = _ == null ? null : Array.from(_)), axis)
      : tickValues && tickValues.slice();
  };

  axis.tickFormat = function (_) {
    return arguments.length ? ((tickFormat = _), axis) : tickFormat;
  };

  axis.tickSize = function (_) {
    return arguments.length ? ((tickSizeInner = tickSizeOuter = +_), axis) : tickSizeInner;
  };

  axis.tickSizeInner = function (_) {
    return arguments.length ? ((tickSizeInner = +_), axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function (_) {
    return arguments.length ? ((tickSizeOuter = +_), axis) : tickSizeOuter;
  };

  axis.tickPadding = function (_) {
    return arguments.length ? ((tickPadding = +_), axis) : tickPadding;
  };

  axis.offset = function (_) {
    return arguments.length ? ((offset = +_), axis) : offset;
  };

  return axis;
}

// These are the four axis components that are available. The only difference
// between them is the orientation.

function axisTop(scale) {
  return axis(top, scale);
}

function axisRight(scale) {
  return axis(right, scale);
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

module.exports = {
  axisTop,
  axisBottom,
  axisLeft,
  axisRight
};
