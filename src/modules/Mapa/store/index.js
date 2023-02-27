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
};

let mutations = {
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
    currentLayer.visible = !currentLayer.visible;
    state.layers = cloneDeep(layers);
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
};

let actions = {
  async getMunicipioVegData({ commit }, id) {
    await axios
      .get(
        `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Avegetacao_highlights_data&CQL_FILTER=cd_mun=${id}&outputFormat=application%2Fjson`
        // `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Adados_vegetacao_por_municipio&CQL_FILTER=cd_mun=${id}&outputFormat=application%2Fjson`
      )
      .then((response) => {
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
      });
  },

  async getMunicipioPracaData({ commit }, id) {
    await axios
      .get(
        `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Adados_pracas_por_municipio&CQL_FILTER=cd_mun=${id}&outputFormat=application%2Fjson`
      )
      .then((response) => {
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
      });
  },

  async getMunicipioTempData({ commit }, id) {
    await axios
      .get(
        `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Adados_temperatura_por_municipio&CQL_FILTER=cd_mun=${id}&outputFormat=application%2Fjson`
      )
      .then((response) => {
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
      });
  },

  async getMunicipiosGeojson({ commit }) {
    await axios
      .get(
        "https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Ageom_municipios&outputFormat=application%2Fjson"
      )
      .then((response) => {
        commit("SET_MUN_GEOJSONS", response.data.features);
        let munList = [];
        response.data.features.forEach((item) =>
          munList.push(item.properties.nm_mun)
        );
        commit("SET_MUN_LIST", munList);
      })
      .catch((err) => console.log("error"));
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
