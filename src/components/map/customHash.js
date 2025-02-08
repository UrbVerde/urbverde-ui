// urbverde-ui/src/components/map/customHash.js
class CustomHash {
  constructor() {
    this._onHashChange = this._onHashChange.bind(this);
    this._updateHash = this._updateHash.bind(this);
    this._updatingHash = false;
  }

  addTo(map) {
    this._map = map;
    window.addEventListener('hashchange', this._onHashChange);
    this._map.on('moveend', this._updateHash);

    // Initial hash check
    if (window.location.hash) {
      const state = this._parseHash(window.location.hash.slice(1));
      if (state) {
        this._map.jumpTo(state);
      }
    }

    return this;
  }

  remove() {
    window.removeEventListener('hashchange', this._onHashChange);
    this._map.off('moveend', this._updateHash);
    this._map = undefined;
  }

  _parseHash(hash) {
    const match = hash.match(
      /@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z(?:,(-?\d+)b,(-?\d+)p)?/
    );
    if (!match) {return null;}

    return {
      center: [parseFloat(match[2]), parseFloat(match[1])],
      zoom: parseFloat(match[3]),
      bearing: match[4] ? parseInt(match[4]) : 0,
      pitch: match[5] ? parseInt(match[5]) : 0,
    };
  }

  _updateHash() {
    if (this._updatingHash) {return;}

    const center = this._map.getCenter();
    const zoom = this._map.getZoom().toFixed(2);
    const bearing = Math.round(this._map.getBearing());
    const pitch = Math.round(this._map.getPitch());
    const hash = `@${center.lat.toFixed(4)},${center.lng.toFixed(
      4
    )},${zoom}z,${bearing}b,${pitch}p`;

    const baseUrl = window.location.href.split('#')[0];
    window.history.replaceState(null, null, `${baseUrl}#${hash}`);
  }

  _onHashChange() {
    if (this._updatingHash) {return;}

    const state = this._parseHash(window.location.hash.slice(1));
    if (state) {
      this._updatingHash = true;
      this._map.flyTo({
        ...state,
        duration: 8000,
        essential: true,
      });
      setTimeout(() => {
        this._updatingHash = false;
      }, 0);
    }
  }
}

export default CustomHash;
