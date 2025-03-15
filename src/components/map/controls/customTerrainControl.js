// CustomTerrainControl.js

class CustomTerrainControl {
  constructor(options = {}) {
    this.options = options;
    this._terrainActive = false;
    this._customClassName = 'custom-terrain-control';
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = `maplibregl-ctrl maplibregl-ctrl-group ${this._customClassName}`;

    // Create a button with "3D" text
    this._terrainButton = document.createElement('div');
    this._terrainButton.className = 'custom-terrain-button';
    this._terrainButton.innerHTML = '<div class="custom-terrain-icon">3D</div>';
    this._terrainButton.addEventListener('click', () => {
      this._toggleTerrain();
    });

    this._container.appendChild(this._terrainButton);

    // Apply styles directly
    this._applyStyles();

    // Initialize terrain source when the map is loaded
    if (this._map.loaded()) {
      this._initTerrainSource();
    } else {
      this._map.once('load', () => {
        this._initTerrainSource();
      });
    }

    return this._container;
  }

  _initTerrainSource() {
    // Setup terrain source if it doesn't exist
    if (!this._map.getSource(this.options.source || 'terrain')) {
      this._map.addSource(this.options.source || 'terrain', {
        type: 'raster-dem',
        url: 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=eizpVHFsrBDeO6HGwWvQ',
        tileSize: 256
      });
    }
  }

  _toggleTerrain() {
    if (this._terrainActive) {
      // Disable terrain
      this._map.setTerrain(null);
      this._terrainActive = false;
      this._terrainButton.classList.remove('active');

      // Show building layers
      this._toggleBuildingLayers(true);
    } else {
      // Ensure terrain source exists
      this._initTerrainSource();

      // Enable terrain
      this._map.setTerrain({
        source: this.options.source || 'terrain',
        exaggeration: this.options.exaggeration || 1.5
      });

      this._terrainActive = true;
      this._terrainButton.classList.add('active');

      // Hide building layers
      this._toggleBuildingLayers(false);
    }
  }

  // Helper function to toggle building layers visibility
  _toggleBuildingLayers(visible) {
    if (!this._map || !this._map.getStyle() || !this._map.getStyle().layers) {return;}

    const layers = this._map.getStyle().layers;
    for (const layer of layers) {
      if (layer.type === 'fill-extrusion' && layer.id.toLowerCase().includes('building')) {
        try {
          this._map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
        } catch (e) {
          console.error('Error toggling building layer:', e);
        }
      }
    }
  }

  _applyStyles() {
    // Inject styles into the document for our custom control
    if (!document.getElementById('custom-terrain-control-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-terrain-control-styles';
      style.innerHTML = `
        .custom-terrain-control {
          background: white;
          box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
          border: 2px solid white !important;
          margin-right: 10px;
          height: 29px !important;
          width: 29px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 7;
          transition: transform 0.2s ease;
          padding: 0 !important;
        }
        
        .custom-terrain-control:hover {
          background: #e9e9e9;
        }
        
        .custom-terrain-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .custom-terrain-icon {
          font-family: Roboto, Arial, sans-serif;
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }
        
        .custom-terrain-button.active {
          background: #D2E8DD;
        }
        
        .custom-terrain-button.active .custom-terrain-icon {
          color: #025949;
          
        }
      `;
      document.head.appendChild(style);
    }
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }
}

export default CustomTerrainControl;
