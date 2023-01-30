export default function (VNode) {
  const props = VNode.$props;
  const mapboxProps = {};
  Object.entries(props).forEach((item) => {
    let key = item[0];
    const value = item[1];
    if (value !== undefined && VNode.$options.props[key].mapbox) {
      key = VNode.$options.props[key].name || key;
      mapboxProps[key] = value;
    }
  });
  return mapboxProps;
}
