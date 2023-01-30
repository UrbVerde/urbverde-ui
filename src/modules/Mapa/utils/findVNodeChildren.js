import get from "lodash/get";
import has from "lodash/has";
/**
 * Find If componente/Vnode has any children of type
 */

export default function (
  Node,
  componentNameToFind,
  depthLevel = 1,
  slots = [],
  scopedSlots = []
) {
  let foundInstances = [];

  const findLayers = (VNode, bag) => {
    bag = bag || [];

    if (Array.isArray(VNode)) {
      VNode.forEach((node) => {
        findLayers(node, bag);
      });
      return bag;
    }

    // I will allways get the component instance
    let VNodeInstance;

    if (get(VNode, "componentInstance")) {
      VNodeInstance = get(VNode, "componentInstance");
    } else {
      VNodeInstance = VNode;
    }

    if (
      get(
        VNodeInstance,
        "$options.name",
        get(VNodeInstance, "componentOptions.Ctor.options.name")
      ) === componentNameToFind
    ) {
      bag.push(VNodeInstance);
    }

    const children =
      get(VNodeInstance, "$children") || get(VNodeInstance, "children");
    if (Array.isArray(children)) {
      children.forEach((node) => {
        findLayers(node, bag);
      });
    }
    if (has(VNodeInstance, "$slots")) {
      const mySlots = Object.keys(VNodeInstance.$slots);
      mySlots.forEach((slotName) => {
        findLayers(VNodeInstance.$slots[slotName], bag);
      });
    }
    if (has(VNodeInstance, "$scopedSlots")) {
      const mySlots = Object.keys(VNodeInstance.$scopedSlots);
      mySlots.forEach((slotName) => {
        findLayers(VNodeInstance.$scopedSlots[slotName](), bag);
      });
    }
    return bag;
  };

  foundInstances = findLayers(Node);
  if (foundInstances.length === 0) {
    return undefined;
  }
  return foundInstances;
}
