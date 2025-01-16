export default function getOnlyMapboxProps(vm) {
  const mapboxProps = {};
  Object.entries(vm.$options.propsData).forEach((item) => {
    const key = item[0];
    const value = item[1];
    if (vm.$options.props[key]?.mapbox) {
      mapboxProps[key] = value;
    }
  });
  return mapboxProps;
}