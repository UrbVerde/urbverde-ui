import set from "lodash/set";
import find from "lodash/find";
import filter from "lodash/filter";
import cloneDeep from "lodash/cloneDeep";

import axios from "axios";

import { LAYERS_DEFAULT } from "../configs/layers.js";
import {
  addIdToLayers,
  normalizeLayers,
  serializeLayers,
} from "./MapStoreHelper.js";

let state = {
  layers: normalizeLayers(addIdToLayers(LAYERS_DEFAULT)),
  munVegData: [],
  munPracaData: [],
  munTempData: [],
  municipios: [],
  municipiosList: [],
  mesoPracaData: [],
  activeLayersList: [],
  previousLayers: [],
  zoom: null,     // Add zoom property
  viewbox: null,  // Add viewbox property
};

let mutations = {
  SET_CURRENT_STATE: function (state, obj) {
    Object.entries(obj).forEach((item) => {
      const key = item[0];
      const value = item[1];
      if (Array.isArray(value)) {
        state[key] = [...value];
      } else if (typeof value === "object") {
        state[key] = { ...value };
      } else {
        state[key] = value;
      }
    });
  },

  SET_MUN_PRACA_DATA: function (state, payload) {
    state.munPracaData = payload;
  },
  SET_MUN_VEG_DATA: function (state, payload) {
    state.munVegData = payload;
  },
  SET_MUN_TEMP_DATA: function (state, payload) {
    state.munTempData = payload;
  },

  SET_MUN_GEOJSONS: function (state, payload) {
    state.municipios = payload;
  },
  SET_MUN_LIST: function (state, payload) {
    state.municipiosList = payload;
  },

  TOGGLE_LAYER: function (state, layer) {
    const layers = cloneDeep(state.layers);

    const currentLayer = find(layers, { _id: layer._id });

    if (currentLayer.visible) {
      this.commit("REMOVE_FROM_LAYERLIST", layer._id);
    } else {
      this.commit("ADD_ON_LAYERLIST", layer._id);
    }
    currentLayer.visible = !currentLayer.visible;
    state.layers = cloneDeep(layers);
  },

  ADD_ON_LAYERLIST: function (state, layer) {
    if (state.activeLayersList.includes(layer)) {
      return;
    } else {
      state.activeLayersList.push(layer);
    }
  },

  REMOVE_FROM_LAYERLIST: function (state, layerId) {
    const index = state.activeLayersList.findIndex(
      (layer) => layer === layerId
    );
    if (index >= 0) {
      state.activeLayersList.splice(index, 1);
    }
  },

  SET_PREVIOUS_LAYERS: function (state, ids) {
    state.previousLayers = ids;
  },

  SET_LAYER_PROPERTIES: function (state, { layer, prop, value }) {
    const layers = [...state.layers];
    const currentLayer = find(layers, { _id: layer._id });
    set(currentLayer, prop, value);

    state.layers = layers;
  },
};

let getters = {
  layers: (state) => {
    const layers = cloneDeep(state.layers);
    layers.forEach((layer) => {
      if (!layer?.props?.source) {
        return;
      }
      const source = cloneDeep(layer.props.source);
      layer.props.source = source;
    });
    const layersFinal2 = serializeLayers(layers);
    return layersFinal2;
  },

  getMunVegData: (state) => {
    return cloneDeep(state.munVegData);
  },

  getMunPracaData: (state) => {
    return cloneDeep(state.munPracaData);
  },

  getMunTempData: (state) => {
    return cloneDeep(state.munTempData);
  },

  getMunicipios: (state) => {
    return cloneDeep(state.municipios);
  },
  getMunicipiosList: (state) => {
    return cloneDeep(state.municipiosList);
  },

  layersAtivos: (state) => {
    return cloneDeep(state.activeLayersList);
  },

  getPreviousLayers: (state) => {
    return cloneDeep(state.previousLayers);
  },
};

let actions = {
  async getMunicipioVegData({ commit }, id) {
    try {
      const response = await axios.get(
        `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Avegetacao_highlights_data&CQL_FILTER=cd_mun=${id}&outputFormat=application%2Fjson`
      );
      let vegetacaoSerieHistorica = {
        2016: [],
        2017: [],
        2018: [],
        2019: [],
        2020: [],
        2021: [],
      };
      response.data.features.forEach((item) =>
        vegetacaoSerieHistorica[item.properties.ano].push(item.properties)
      );
      commit("SET_MUN_VEG_DATA", vegetacaoSerieHistorica);
    } catch (error) {
      console.error("Error in getMunicipioVegData:", error);
    }
  },

  async getMunicipioPracaData({ commit }, id) {
    try {
      const response = await axios.get(
        `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Adados_pracas_por_municipio&CQL_FILTER=cd_mun=${id}&outputFormat=application%2Fjson`
      );
      let pracaSerieHistorica = {
        2016: [],
        2017: [],
        2018: [],
        2019: [],
        2020: [],
        2021: [],
      };
      response.data.features.forEach((item) =>
        pracaSerieHistorica[item.properties.ano].push(item.properties)
      );
      commit("SET_MUN_PRACA_DATA", pracaSerieHistorica);
    } catch (error) {
      console.error("Error in getMunicipioPracaData:", error);
    }
  },

  async getMunicipioTempData({ commit }, id) {
    try {
      const response = await axios.get(
        `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Adados_temperatura_por_municipio&CQL_FILTER=cd_mun=${id}&outputFormat=application%2Fjson`
      );
      let tempSerieHistorica = {
        2016: [],
        2017: [],
        2018: [],
        2019: [],
        2020: [],
        2021: [],
      };
      response.data.features.forEach((item) =>
        tempSerieHistorica[item.properties.ano].push(item.properties)
      );
      commit("SET_MUN_TEMP_DATA", tempSerieHistorica);
    } catch (error) {
      console.error("Error in getMunicipioTempData:", error);
    }
  },

  async getMunicipiosGeojson({ commit }) {
    try {
      const response = await axios.get(
        "https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Ageom_municipios&outputFormat=application%2Fjson"
      );
      commit("SET_MUN_GEOJSONS", response.data.features);
      const munList = response.data.features.map((item) => item.properties.nm_mun);
      commit("SET_MUN_LIST", munList);
    } catch (error) {
      console.error("Error in getMunicipiosGeojson:", error);
      // router.push("/"); // Redirect the user to the homepage
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
