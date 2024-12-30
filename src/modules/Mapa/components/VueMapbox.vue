<!-- src/modules/Mapa/components/VueMapBox.vue -->
<template>
  <div class="vue-mapbox" :style="{ position: 'relative', width: myWidth, height: myHeight }">
    <div ref="mapabaselayer" id="mapaBaseLayer" class="map-layer mapbox-map-container" style="
          position: absolute;
          left: 0px;
          top: 0;
          bottom: 0;
          right: 0;
          width: 100%;
        ">
      <div v-if="mapLoaded">
        <slot></slot>
      </div>
      <div v-if="showLoader && !mapLoaded" class="loader">
        <slot name="loader">
          <v-progress-circular indeterminate color="green"></v-progress-circular>
        </slot>
      </div>
      <div v-if="devMode" style="
            position: absolute;
            bottom: 0;
            font-size: 9px;
            padding: 0.4em;
            z-index: 10;
            background: #00000066;
            color: white;
          ">
        {{ camera }}
      </div>
    </div>
  </div>
</template>

<script>
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import uniqueId from "lodash/uniqueId";

import maplibregl from "maplibre-gl";

const nativeEventsTypes = [
  "click",
  "dblclick",
  "mouseenter",
  "mouseleave",
  "mouseout",
  "mousedown",
  "mouseup",
  "contextmenu",
  "wheel",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "movestart",
  "move",
  "moveend",
  "dragstart",
  "drag",
  "dragend",
  "zoomstart",
  "zoom",
  "zoomend",
  "rotatestart",
  "rotate",
  "rotateend",
  "pitchstart",
  "pitch",
  "pitchend",
  "boxzoomstart",
  "boxzoomend",
  "boxzoomcancel",
  "webglcontextlost",
  "webglcontextrestored",
  "load",
  "render",
  "idle",
  "error",
  "data",
  "styledata",
  "sourcedata",
  "dataloading",
  "styledataloading",
  "sourcedataloading",
  "styleimagemissing",
];

export default {
  /* eslint-disable camelcase */
  /* eslint-disable eqeqeq */
  name: "VueMapbox",
  props: {
    /**
     * Mapa Width. In px or percent
     */
    width: {
      type: [Number, String],
      default: "100%",
    },
    /**
     * Mapa Height. In px or percent
     */
    height: {
      type: [Number, String],
      default: "100%",
    },
    /**
     * Show a Loader
     */
    showLoader: {
      type: Boolean,
      default: true,
    },
    /**
     * Allow layer name to be rewrite, so layer with same name don't show error, and you can get than with ref in vm-layer
     * But if your application need the exatc name of layer, so yo can get the exatc name, set it to false
     */
    layersCanRaname: {
      type: Boolean,
      default: true,
    },
    /**
     * The map's Mapbox style. Can be a URL or the STYLE OBJECT itself . example mapbox://styles/mapbox/streets-v11.  more info at https://mapbox.com/maplibre-gl-style-spec/
     */
    mapStyle: {
      type: String,
      required: true
    },
    /**
     * The minimum zoom level of the map (0-24).
     */
    minZoom: {
      type: Number,
      default: 0,
    },
    /**
     * The maximun zoom level of the map (0-24).
     */
    maxZoom: {
      type: Number,
      default: 24,
    },
    /**
     * Define Zoom level (0-24).
     */
    zoom: {
      type: Number,
      default: 4,
    },
    /**
     *  Define center array.
     */
    center: {
      type: Array,
      default: () => [-53.048889, -14.951209500045001],
    },
    /**
     * If true , the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL. For example, http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60 . An additional string may optionally be provided to indicate a parameter-styled hash, e.g. http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar , where foo is a custom parameter and bar is an arbitrary hash distinct from the map hash.
     */
    hash: {
      type: [Boolean, String],
      default: false,
    },
    /**
     *  The initial bounds of the map. If bounds is specified, it overrides center and zoom constructor options.
     */
    bounds: {
      type: Array,
      default: undefined,
    },
    /**
     *  The initial bounds of the map. If bounds is specified, it overrides center and zoom constructor options.
     */
    maxBounds: {
      type: Array,
      default: undefined,
    },
    /**
     * camera padding. will be user for all bounds, fly etc
     * @values number or {top,left,right,bottom}
     */
    padding: {
      type: [Object, Number],
      default: 0,
    },
    /**
     *  Other options to pass to mapbox. Will be merged here. See https://docs.mapbox.com/maplibre-gl-js/api/#map for all options.
     */
    otherOptions: {
      type: Object,
      default: () => ({}),
    },
    /**
     *  Object with images to load in format {'imagename':url,'image2name':url2}
     */
    images: {
      type: Object,
      default: () => ({}),
    }, // {'name':url,'name2':url2}
    /**
     *  show cameras attributes
     */
    devMode: {
      type: Boolean,
      default: false,
    }, // {'name':url,'name2':url2}
    /**
     *  show cameras attributes
     */
    interactive: {
      type: Boolean,
      default: true,
    },
    attributionControl: {
      type: Boolean,
      default: true,
    }, // {'name':url,'name2':url2}
    showBuildings: {
      type: Boolean,
      default: true,
    },
  },

  provide: function () {
    return {
      getMap: () => this.map,
      mapLoaded: this.mapLoaded,
      maplibregl: () => this.maplibregl,
      MaplibreVueInstance: this,
    };
  },

  data() {
    return {
      /**
       *  Set When Map Style is Loaded
       */
      mapLoaded: false,
      map: null,
      sources: null,
      layers: null,
      camera: "",
      terrainEnabled: false,
      buildingLayerIds: [],
      currentZoom: 0,
    };
  },

  beforeCreate() { },

  async created() {
    if (!window.maplibregl) {
      const maplibregl = await import(
        /* webpackChunkName: "mapboxgl-core" */ "maplibre-gl"
      );
      window.maplibregl = maplibregl.default || maplibregl;
    }
    this.maplibregl = window.maplibregl;
    // window.maplibregl.prewarm();
    this.sources = new Map(); // {id:{type,data,instance}}
    this.layers = new Map(); //
    this.imagesMap = new Map(); //
    // this.images = new Map() //
    this.layersGroups = new Map(); //
    this.eventsOnMap = new Map(); //

    // make sure the html div to use in mapbox is loaded
    this.$nextTick(() => {
      this.createMap();
    });
  },

  computed: {
    myHeight: function () {
      let h = this.height;
      if (typeof h === "number") {
        h += "px";
      }
      return h;
    },
    myWidth: function () {
      let w = this.width;
      if (typeof w === "number") {
        w += "px";
      }
      return w;
    },
  },

  watch: {
    currentZoom(newZoom, oldZoom) {
      if ((newZoom >= 16 && oldZoom < 16) || (newZoom < 16 && oldZoom >= 16)) {
        this.updateLayerOrder();
      }
    },
    bounds: function (val) {
      this.map.fitBounds(val, { padding: this.padding });
    },
    maxBounds: function (val) {
      if (this.map) {
        this.map.setMaxBounds(val);
      }
    },
    mapStyle: {
      handler: function (newStyle) {
        if (this.map) {
          const currentCenter = this.map.getCenter();
          const currentZoom = this.map.getZoom();
          this.map.setStyle(newStyle);
          this.map.once('styledata', () => {
            this.map.setCenter(currentCenter);
            this.map.setZoom(currentZoom);
          });
        }
      },
      immediate: true
    },
  },

  beforeUpdated() { },

  mounted() {
    this.$nextTick(() => {
      this.updateLayerOrder();
    });
  },

  updated() {
    if (this.updateLayerTimeout) clearTimeout(this.updateLayerTimeout);
    this.updateLayerTimeout = setTimeout(this.updateLayerOrder, 400);
  },

  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },

  methods: {
    createMap: function () {
      try {
        this.map = new maplibregl.Map({
          ...this.otherOptions,
          container: this.$refs.mapabaselayer,
          style: this.mapStyle,
          refreshExpiredTiles: false,
          antialias: true,
          center: this.center,
          zoom: this.zoom,
          hash: this.hash,
          bounds: this.bounds,
          maxBounds: this.maxBounds,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          interactive: this.interactive,
          attributionControl: this.attributionControl,
        });

        window.maplibregl = this.map;

        this.map.on('error', (e) => {
          console.error('Erro do MapLibre:', e);
        });

        this.addPropsImages();
        this.setupEvents(this.$listeners, this.map, nativeEventsTypes);

        this.map.on("load", () => {
          const _this = this;

          this.mapLoaded = true;
          this.$emit("load", _this, this.map);

          this.map.addControl(
            new maplibregl.NavigationControl({
              visualizePitch: true,
              // showZoom: true,
              // showCompass: true
            }), "top-right");

          this.map.addControl(
            new maplibregl.TerrainControl({
              source: 'terrain',
              exaggeration: 6,
            }),);

          this.map.addControl(
            new maplibregl.ScaleControl({
              maxWidth: 120,
              unit: 'metric',
            }), "bottom-left");

          this.map.addSource("terrain", {
            "type": "raster-dem",
            "url": "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=eizpVHFsrBDeO6HGwWvQ",
          });

          // Find and store building layer IDs
          // this.findBuildingLayers();

          // Listen for terrain changes
          this.map.on('terrain', (e) => {
            console.log('Terrain changed:', e.terrain);
            this.terrainEnabled = e.terrain;
            // We don't need to switch styles anymore, just update the terrain
            this.updateTerrain(e.terrain);
          });

          // Initialize currentZoom
          this.currentZoom = this.map.getZoom();

          // Add zoom change listener to update currentZoom
          this.map.on('zoom', () => {
            this.currentZoom = this.map.getZoom();
          });

          // Initial layer ordering
          this.updateLayerOrder();

          // Adicionar um ouvinte para mudanças de estilo
          this.map.on('style.load', () => {
            console.log('Novo estilo carregado');
            this.updateLayerOrder();
          });
        });

        // Listen for style changes
        this.map.on('styledata', () => {
          console.log('Style changed');
        });

      } catch (error) {
        console.error('Error creating map:', error);
      }
    },

    updateTerrain: function (enabled) {
      if (enabled) {
        this.toggleBuildingLayers(false);
        this.map.setTerrain({ source: 'terrain', exaggeration: 6 });
      } else {
        this.map.setTerrain(null);
        this.toggleBuildingLayers(true);
      }
    },

    toggleBuildingLayers: function (visible) {
      const layers = this.map.getStyle().layers;
      for (const layer of layers) {
        if (layer.type === 'fill-extrusion' && layer.id.toLowerCase().includes('building')) {
          this.map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
        }
      }
    },

    findBuildingAndStreetLayers: function () {
      const style = this.map.getStyle();
      this.buildingLayerIds = style.layers
        .filter(layer => layer.type === 'fill-extrusion' && layer.id.toLowerCase().includes('building'))
        .map(layer => layer.id);

      this.streetLayerIds = style.layers
        .filter(layer => (layer.type === 'line' || layer.type === 'fill') && layer.id.toLowerCase().includes('road'))
        .map(layer => layer.id);
    },

    updateBuildingsAndStreetsVisibility: function () {
      this.buildingLayerIds.forEach(layerId => {
        if (this.terrainEnabled) {
          this.map.setLayoutProperty(layerId, 'visibility', 'none');
        } else {
          this.map.setLayoutProperty(layerId, 'visibility', 'visible');
          this.map.moveLayer(layerId);
        }
      });

      this.streetLayerIds.forEach(layerId => {
        const layer = this.map.getLayer(layerId);
        if (layer) {
          if (this.terrainEnabled) {
            if (layer.type === 'line') {
              this.map.setPaintProperty(layerId, 'line-opacity', 0.5);
            } else if (layer.type === 'fill') {
              this.map.setPaintProperty(layerId, 'fill-opacity', 0.5);
            }
          } else {
            if (layer.type === 'line') {
              this.map.setPaintProperty(layerId, 'line-opacity', 1);
            } else if (layer.type === 'fill') {
              this.map.setPaintProperty(layerId, 'fill-opacity', 1);
            }
          }
          this.map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
      });
    },

    switchBasemapStyle: function (terrainEnabled) {
      console.log('Switching basemap style. Terrain enabled:', terrainEnabled);
      const currentStyleUrl = this.map.getStyle().sprite;
      let newStyleUrl;

      if (terrainEnabled) {
        // Switch to a style without building extrusions
        newStyleUrl = "https://api.maptiler.com/maps/92fa6478-03bb-44cc-897a-fe5411f52e99/style.json?key=eizpVHFsrBDeO6HGwWvQ";
      } else {
        // Switch back to the original style with building extrusions
        newStyleUrl = "https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ";
      }

      if (currentStyleUrl !== newStyleUrl) {
        console.log('Applying new style:', newStyleUrl);
        this.map.setStyle(newStyleUrl);
      }
    },

    updateBuildingsVisibility: function () {
      this.buildingLayerIds.forEach(layerId => {
        if (this.terrainEnabled) {
          this.map.setLayoutProperty(layerId, 'visibility', 'none');
        } else {
          this.map.setLayoutProperty(layerId, 'visibility', 'visible');
          // Ensure building extrusions are on top
          this.map.moveLayer(layerId);
        }
      });
    },

    getMap: function () {
      return this.map;
    },

    setupEvents: function (
      listners,
      MapboxElement,
      theEventsOfElement,
      layerId
    ) {
      if (listners) {
        Object.entries(listners).forEach((item) => {
          let eventName = item[0];
          const eventFunction = item[1];

          const eventFinal = (e) => {
            eventFunction(e, this.map, this);
          };
          let once = false;

          if (eventName.indexOf("~") === 0) {
            once = true;
            eventName = eventName.substring(1);
          }
          if (theEventsOfElement.includes(eventName)) {
            if (once) {
              if (layerId) {
                MapboxElement.once(eventName, layerId, eventFinal);
              } else {
                MapboxElement.once(eventName, eventFinal);
              }
            } else {
              if (layerId) {
                MapboxElement.on(eventName, layerId, eventFinal);
              } else {
                MapboxElement.on(eventName, eventFinal);
              }
            }
          }
        });
      }
    },

    addSource: function (id, type, options) {
      if (this.map.getSource(id) && this.layersCanRaname) {
        id = uniqueId(id + type);
      }

      if (type === "geojson" && !options?.generateId) {
        options.generateId = true;
      }

      this.map.addSource(id, { type, ...options });
      const sourceObject = this.map.getSource(id);

      this.sources.set(id, { id, type, options, instance: sourceObject });
      return this.sources.get(id);
    },

    getSource: function (id) {
      if (this.sources.has(id)) {
        return this.sources.get(id);
      }
      return false;
    },

    removeSource: function (id) { },

    updateSource: function (sourceid, type, options) {
      if (this.sources.has(sourceid)) {
        this.sources.delete(sourceid);
      }

      const layers = this.map.getStyle()?.layers;
      if (!layers) return;

      layers.forEach((layer) => {
        if (layer.source === sourceid) {
          this.map.removeLayer(layer.id);
        }
      });

      this.map.removeSource(sourceid);

      const source = this.addSource(sourceid, type, options);

      layers.forEach((layer, i) => {
        if (layer.source === sourceid) {
          const beforeLayer = layers?.[i - 1];
          if (beforeLayer) {
            this.map.addLayer(layer, beforeLayer.id);
          } else {
            this.map.addLayer(layer);
          }
        }
      });
      return source;
    },

    getNewIdForLayer: function (name) {
      let id = name;
      if (this.map.getLayer(name) && this.layersCanRaname) {
        id = uniqueId("autoNamelayer_" + name);
      }
      return id;
    },
    addLayerTemp: function (options) {
      this.map.addLayer(options);
    },

    addLayer: function (options, zIndex) {
      let id = options.id;

      if (this.map.getLayer(id)) {
        this.removeLayer(id);
      }

      let beforeId = this.updateLayerOrder(id);

      if (options?.source?.constructor?.name === "Object") {
        const sourceId = options?.source?.id ?? id;
        if (this.map.getSource(sourceId)) {
          options.id = uniqueId("new" + sourceId);
          id = options.id;
        }
      }

      if (this.map.getLayer(id)) {
        this.removeLayer(id);
      }

      if (!this.map.getLayer(beforeId)) {
        beforeId = undefined;
      }
      this.map.addLayer(options, beforeId);

      this.layers.set(id, { id });

      return options.id;
    },

    findLayers: function (VNode, bag) {
      bag = bag || [];
      if (Array.isArray(VNode)) {
        VNode.forEach((node) => {
          this.findLayers(node, bag);
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
        ) === "VmLayer"
      ) {
        bag.push(VNodeInstance);
      }
      const children = get(
        VNodeInstance,
        "$children",
        get(VNodeInstance, "children")
      );
      if (Array.isArray(children)) {
        children.forEach((node) => {
          this.findLayers(node, bag);
        });
      }
      return bag;
    },

    updateLayerOrder: function (setLayerNameToReturnItBeforeLayerID) {
      const currentLayers = this.map?.getStyle()?.layers ?? undefined;

      const layerInstances = this.findLayers(this.$slots.default);

      if (!currentLayers || !layerInstances) {
        return;
      }

      let layersId = layerInstances.map((layer, i) => {
        const component = layer.componentInstance || layer;
        const id = get(component, "$data.layerId");
        let zIndex = get(component, "$props.zIndex");
        const index = i;
        if (zIndex) {
          zIndex = Number(zIndex);
        }
        return { id, index, zIndex };
      });
      layersId = orderBy(layersId, ["index"], ["asc"]);

      for (let to = 0; to < layersId.length; to++) {
        if (!layersId[to].zIndex) {
          layersId[to].zIndex = to;
        }
      }
      layersId = orderBy(layersId, ["zIndex"], ["asc"]);

      // Identify different layer types
      const streetLayers = currentLayers.filter(layer =>
        (layer.type === 'line' || layer.type === 'symbol') &&
        (layer.id.toLowerCase().includes('road') || layer.id.toLowerCase().includes('street'))
      );

      const labelsAndBuildings = currentLayers.filter(layer =>
        layer.type === 'symbol' || (layer.type === 'fill-extrusion' && layer.id.toLowerCase().includes('building'))
      );

      const setoresCensitariosLayer = layersId.find(layer =>
        layer.id.toLowerCase().includes('setorescensitarios')
      );

      // Move other custom layers based on their zIndex
      for (let i = 0; i < layersId.length; i++) {
        const currentLayer = layersId[i].id;
        if (this.map.getLayer(currentLayer) && currentLayer !== setoresCensitariosLayer?.id) {
          this.map.moveLayer(currentLayer);
        }
      }

      // Move SetoresCensitariosVector layer to the top of custom layers
      if (setoresCensitariosLayer && this.map.getLayer(setoresCensitariosLayer.id)) {
        this.map.moveLayer(setoresCensitariosLayer.id);
      }

      // Move street layers based on zoom level
      if (this.currentZoom > 16) {
        streetLayers.forEach(layer => {
          if (this.map.getLayer(layer.id)) {
            this.map.moveLayer(layer.id);
          }
        });
      }

      // Always move label and building layers to the very top
      labelsAndBuildings.forEach(layer => {
        if (this.map.getLayer(layer.id)) {
          this.map.moveLayer(layer.id);
        }
      });
    },


    moveLayer: function (id, zIndex) { },

    addPropsImages: function (images) {
      if (!this.map) return;
      images = images || this.images;
      Object.entries(images).forEach((item) => {
        const key = item[0];
        const value = item[1];
        this.addImage(key, value);
      });
    },

    addImage: async function (key, url, forceUpdate = false) {
      if (!this?.map?.hasImage) return;
      // if already have the image on map, and not force update, return
      if (forceUpdate === false && this.imagesMap.has(key)) {
        return;
      }

      this.imagesMap.set(key, true);

      let imgElement;
      try {
        imgElement = await this.processImage(url);
      } catch (e) { }

      if (this.map.hasImage(key) && imgElement) {
        this.map.removeImage(key);
        this.map.addImage(key, imgElement);
        this.map.triggerRepaint();
      } else if (imgElement) {
        this.map.addImage(key, imgElement);
      }
    },

    removeImage: async function (key) {
      if (!this.map) return;

      if (this.map.hasImage(key)) {
        this.map.removeImage(key);
        this.imagesMap.delete(key);
      }
    },

    processImage: async function (imgSource) {
      return new Promise((resolve, reject) => {
        if (!imgSource) {
          reject(new Error("img empty"));
        } else if (imgSource?.constructor?.name === "HTMLImageElement") {
          resolve(imgSource);
        } else if (
          imgSource?.constructor?.name === "String" ||
          imgSource?.constructor?.name === "SVGSVGElement"
        ) {
          const newimg = new Image();
          newimg.crossOrigin = "Anonymous";
          newimg.onload = () => {
            resolve(newimg);
          };
          newimg.onerror = (e) => {
            console.warn("convert/load image error:");
            console.warn(e);
            reject(e);
          };

          if (
            (imgSource?.constructor?.name === "String" &&
              imgSource.match(/<\s*svg/g)) ||
            imgSource?.constructor?.name === "SVGSVGElement"
          ) {
            imgSource = this.convertSvgToBase64(
              imgSource?.outerHTML ?? imgSource
            );
          }
          newimg.src = imgSource;
        } else {
          reject(
            new Error(
              "Not compatibility image. Please set source as an url, a svg string, a svg element or img element"
            )
          );
        }
      });
    },

    convertSvgToBase64: function (content) {
      let encoded;
      try {
        encoded = window.btoa(unescape(encodeURIComponent(content)));
      } catch (e) {
        console.error(e);
      }

      return "data:image/svg+xml;base64," + encoded;
    },

    removeLayer: function (id) {
      if (!this.map) return;
      const map = this.getMap();

      if (this.layers.has(id)) {
        this.layers.delete(id);
      }

      try {
        if (map && map.getLayer(id)) {
          map.removeLayer(id);
        }
      } catch (e) { }
      this.$nextTick(() => this.updateLayerOrder());
    },

    docEvents: function () {
      this.$emit("click");
      this.$emit("dblclick");
      this.$emit("mouseenter");
      this.$emit("mouseleave");
      this.$emit("mouseout");
      this.$emit("contextmenu");
      this.$emit("wheel");
      this.$emit("touchstart");
      this.$emit("touchend");
      this.$emit("touchmove");
      this.$emit("touchcancel");
      this.$emit("movestart");
      this.$emit("move");
      this.$emit("moveend");
      this.$emit("dragstart");
      this.$emit("drag");
      this.$emit("dragend");
      this.$emit("zoomstart");
      this.$emit("zoom");
      this.$emit("zoomend");
      this.$emit("rotatestart");
      this.$emit("rotate");
      this.$emit("rotateend");
      this.$emit("pitchstart");
      this.$emit("pitch");
      this.$emit("pitchend");
      this.$emit("boxzoomstart");
      this.$emit("boxzoomend");
      this.$emit("boxzoomcancel");
      this.$emit("webglcontextlost");
      this.$emit("webglcontextrestored");
      this.$emit("load");
      this.$emit("render");
      this.$emit("idle");
      this.$emit("error");
      this.$emit("data");
      this.$emit("styledata");
      this.$emit("sourcedata");
      this.$emit("dataloading");
      this.$emit("styledataloading");
      this.$emit("sourcedataloading");
      this.$emit("styleimagemissing");
    },
  },
};
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
}

.map-layer {
  position: absolute !important;
  left: 0px;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;

  .maplibregl-canvas {
    left: 0;
  }
}
</style>
