class CustomHash {
    constructor() {
        this.hash = '';
        this._onHashChange = this._onHashChange.bind(this);
        this._updateHash = this._updateHash.bind(this);
        this._updatingHash = false;
        this._moveInProgress = false;
    }
  
    addTo(map) {
        this._map = map;
        window.addEventListener('hashchange', this._onHashChange);
        
        this._map.on('move', this._updateHash);
        this._map.on('movestart', () => { this._moveInProgress = true; });
        this._map.on('moveend', () => {
            this._moveInProgress = false;
            this._updateHash();  
        });

        // Check for existing hash on load
        if (window.location.hash) {
            const hash = window.location.hash.slice(1);
            const state = this._parseHash(hash);
            if (state) {
                this._map.jumpTo({
                    center: [state.lng, state.lat],
                    zoom: state.zoom,
                    bearing: state.bearing,
                    pitch: state.pitch
                });
            }
        } else {
            // If no hash, update it with current state
            this._updateHash();
        }
        return this;
    }

    _parseHash(hash) {
        const match = hash.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z(?:,(\d+)b,(\d+)p)?/);
        if (match) {
            return {
                lat: parseFloat(match[1]),
                lng: parseFloat(match[2]),
                zoom: parseFloat(match[3]),
                bearing: match[4] ? parseInt(match[4]) : 0,
                pitch: match[5] ? parseInt(match[5]) : 0
            };
        }
        return null;
    }
  
    remove() {
      window.removeEventListener('hashchange', this._onHashChange);
      this._map.off('moveend', this._updateHash);
      this._map = undefined;
    }
  
    _getState() {
      const center = this._map.getCenter();
      return {
        lat: center.lat.toFixed(4),
        lng: center.lng.toFixed(4),
        zoom: this._map.getZoom().toFixed(2),
        bearing: Math.round(this._map.getBearing()),
        pitch: Math.round(this._map.getPitch())
      };
    }
  
    _updateHash() {
        if (this._updatingHash) return;
        this._updatingHash = true;
      
        const state = this._getState();
        const hash = `@${state.lat},${state.lng},${state.zoom}z${state.bearing !== 0 || state.pitch !== 0 ? `,${state.bearing}b,${state.pitch}p` : ''}`;

        // Ensure hash starts with #
        if (!window.location.hash.startsWith('#')) {
            window.location.hash = `#${hash}`;
        } else if (window.location.hash.slice(1) !== hash) {
            window.location.hash = `#${hash}`;
        }
      
        if (this._map.fire) {
            this._map.fire('scalezoom', { zoom: parseFloat(state.zoom) });
        }

        setTimeout(() => {
            this._updatingHash = false;
        }, 0);
    }
  
    _onHashChange() {
      if (this._updatingHash) return;  // Prevent recursive updates
      
      const hash = window.location.hash.replace('#', '');
      const match = hash.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z(?:,(\d+)b,(\d+)p)?/);
      
      if (match) {
        const state = {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
          zoom: parseFloat(match[3]),
          bearing: match[4] ? parseInt(match[4]) : 0,
          pitch: match[5] ? parseInt(match[5]) : 0
        };
  
        if (!isNaN(state.lat) && !isNaN(state.lng) && !isNaN(state.zoom)) {
          this._updatingHash = true;
          this._map.jumpTo({
            center: [state.lng, state.lat],
            zoom: state.zoom,
            bearing: state.bearing,
            pitch: state.pitch
          });
          setTimeout(() => {
            this._updatingHash = false;
          }, 0);
        }
      }
    }
}

export default CustomHash;