import React from 'react';

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/**
 * `getInterpolatedValue` provides a midpoint value
 * between y1 and y2, based on the ratio provided.
 *
 * @param {number} y1 - the value when our curve is
 *                      totally curvy
 * @param {number} y2 - the value when our curve is
 *                      totally flat
 * @param {number} x  - a value from 0 to 1 that
 *                      represents the ratio of curvy
 *                      to flat (0 = totally curvy,
 *                      1 = totally flat).
 */
const getInterpolatedValue = (y1, y2, x) => {
  // The slope of a line can be calculated as Δy / Δx.
  //
  // In this case, the domain of our function (AKA the
  // possible X values) are from 0 (x1) to 1 (x2).
  // Δx is therefore just equal to 1 (since 1 - 0 = 1).
  //
  // Because dividing by 1 has no effect, our slope in
  // this case can just be Δy.
  const a = y2 - y1;

  // Next, we know that y = ax + b.
  //
  // `b` is the Y-axis intercept, which we know is `y1`,
  // since `y1` is the `y` value when `x` is 0.
  return a * x + y1;
};

/**
 * Our first component, `ScrollArea`, tracks its children
 * as they're scrolled through the scrollable area (a
 * specific subset of the viewport).
 */
// const scrollAreaPropTypes = {
//   // The number of pixels between the top of the viewport,
//   // and the top of the scrollable area:
//   topBuffer: PropTypes.number.isRequired,
//   // The height, in pixels, of the scrollable area:
//   areaHeight: PropTypes.number.isRequired,
//   // We'll make the `scrollRatio` data available to its
//   // children with a `children` render prop:
//   children: PropTypes.func.isRequired
// };

class ScrollArea extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      scrollRatio: 0
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(ev) {
    const { topBuffer, areaHeight } = this.props;

    const windowHeight = window.innerHeight;
    const boundingBox = this.node.getBoundingClientRect();

    const distanceToTop = boundingBox.top - topBuffer;
    const pixelsScrolled = areaHeight - distanceToTop;

    let scrollRatio = pixelsScrolled / areaHeight;
    scrollRatio = clamp(scrollRatio, 0, 1);

    if (this.state.scrollRatio !== scrollRatio) {
      this.setState({ scrollRatio });
    }
  }

  render() {
    return (
      <div className="header__bezier" ref={node => (this.node = node)}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

// ScrollArea.propTypes = scrollAreaPropTypes;

/**
 * This is a simple Bézier curve presentational component.
 */
const BezierCurve = ({
  viewBoxWidth,
  viewBoxHeight,
  startPoint,
  firstControlPoint,
  secondControlPoint,
  endPoint,
  fill = 'white'
}) => {
  return (
    <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      <path
        d={`
          M ${startPoint}
          C ${firstControlPoint}
            ${secondControlPoint}
            ${endPoint}
          L ${viewBoxWidth},${viewBoxHeight}
          L 0,${viewBoxHeight}
        `}
        fill={fill}
      />
    </svg>
  );
};

/**
 * The two components above are the building blocks
 * for the effect we want to build. This last component
 * assembles them.
 *
 * It takes the `headerHeight` as a prop, so that we
 * can flatten it at the right moment.
 */
const ScrollBasedBezier = ({ headerHeight }) => (
  <ScrollArea
    topBuffer={headerHeight}
    areaHeight={
      // By setting a relatively small ScrollArea height,
      // we get to see the fully-curved version for a bit
      // before the flattening starts :D
      300 * 0.55
    }
  >
    {({ scrollRatio }) => {
      // Hardcoding these values since this component
      // isn't meant to be reusable.
      const viewBoxWidth = 500;
      const viewBoxHeight = 300;

      console.log('scroll area', scrollRatio);

      const startPointY = getInterpolatedValue(250, 0, scrollRatio);

      const firstControlPointY = getInterpolatedValue(-50, 0, scrollRatio);

      const secondControlPointY = getInterpolatedValue(550, 0, scrollRatio);

      const endPointY = 0;

      return (
        <BezierCurve
          viewBoxWidth={viewBoxWidth}
          viewBoxHeight={viewBoxHeight}
          startPoint={[0, startPointY]}
          firstControlPoint={[200, firstControlPointY]}
          secondControlPoint={[300, secondControlPointY]}
          endPoint={[500, endPointY]}
        />
      );
    }}
  </ScrollArea>
);

export default ScrollBasedBezier;
