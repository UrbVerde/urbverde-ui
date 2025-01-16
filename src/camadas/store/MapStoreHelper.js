export function addIdToLayers (layers, parentId = '') {
    layers.forEach(layer => {
        layer._id = parentId + '/' + layer.name
        if (Array.isArray(layer?.layers)) {
            addIdToLayers(layer?.layers, layer._id)
        }
    })
    return layers
}
  
  
export function normalizeLayers (layers, bag, parentId) {
    const normalizeLayer = bag || []
    layers.forEach(layer => {
        layer._parentId = parentId
        normalizeLayer.push(layer)
        if (Array.isArray(layer?.layers)) {
            normalizeLayers([...layer.layers], normalizeLayer, layer._id)
            delete layer.layers
        }
    })
    return normalizeLayer
}


export function serializeLayers (layers) {
    const layersSerialize = []
    layers.forEach(node => {
        // No parentId means top level
        if (!node._parentId) return layersSerialize.push(node)
        
        // Insert node as child of parent in layers array
        const parentIndex = layers.findIndex(el => el._id === node._parentId)
        if (!layers[parentIndex].layers) {
            return layers[parentIndex].layers = [node]
        }
        layers[parentIndex].layers.push(node)
    })
    return layersSerialize
}