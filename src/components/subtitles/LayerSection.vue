<!-- LayersSection.vue -->
<template>
  <div>
    <div class="container-layers">
      <span>CAMADAS</span>
      <img :src="addIcon" />
    </div>

    <div class="section-container"
         @mouseenter="isHovered = true"
         @mouseleave="isHovered = false">

      <div class="container-header">
        <div class="content-wrapper">
          <img src="@/assets/icons/layer.svg" alt="Layer icon" />
          <span class="title-text body-small-semibold" :class="{ 'shortened': isHovered }">
            <transition name="fade" mode="out-in">
              <span :key="isHovered">{{ displayText }}</span>
            </transition>
          </span>
        </div>
        <div class="hover-buttons" v-if="isHovered">
          <button class="action-button">
            <img src="@/assets/icons/eye.svg" alt="Visibility toggle" />
          </button>
          <div class="visibility-input">
            <input
              type="number"
              v-model="visibility"
              min="0"
              max="100"
              class="number-input"
            />
            <span class="percentage-symbol">%</span>
          </div>
          <button class="action-button">
            <img src="@/assets/icons/menuButton.svg" alt="More options" />
          </button>
        </div>

      </div>
      <div class="layer-details">
        <p class="layer-sub body-small-regular">
          <span class="legend-line black"></span>Setores censitários
        </p>
        <p class="layer-sub body-small-regular">
          <span class="legend-line blue"></span>Municípios
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import addIcon from '@/assets/icons/add.svg';

export default {
  name: 'LayerSection',
  data() {
    return {
      addIcon,
      isHovered: false,
      visibility: 70
    };
  },
  computed: {
    displayText() {
      return this.isHovered ? 'Contor...' : 'Contorno e Traços';
    }
  },
  methods: {
    handleHover(value) {
      this.isHovered = value;
    }
  }
};
</script>

  <style scoped>
  /* Container Principal */
  .section-container {
    background-color: #FFF;
    padding: 16px 24px;
    margin-bottom: 16px;
    border-radius: 16px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

  /* Seção CAMADAS */
  .container-layers {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 12px;
  }

  .container-layers span {
    color: #525960;
    font-family: Inter;
    font-size: 12px;
    font-weight: 500;
    line-height: 150%;
    margin-left: 8px;
  }

  .container-layers img {
    width: 16px;
    height: 16px;
    margin-right: 16px;
  }

  /* Header do Container */
  .container-header {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
  }

  .container-header img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  /* Wrapper do Conteúdo */
  .content-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
    min-width: 0;
    width: 100%;
  }

  .title-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width 150ms ease-in-out;
}

.shortened {
  max-width: 35px;
  transition: max-width 150ms ease-in-out;
}

/* Animações de fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

   /* Hover Actions */
.hover-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button img {
  width: 16px;
  height: 16px;
}

.action-button:hover {
  background-color: #f0f0f0;
  border-radius: 4px;
}

/* Input de visibilidade */
.visibility-input {
  position: relative;
  display: flex;
  align-items: center;
}

.number-input {
  width: 40px;
  height: 24px;
  padding: 2px 16px 2px 4px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 12px;
  color: #525960;
}

.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.percentage-symbol {
  position: absolute;
  right: 4px;
  font-size: 12px;
  color: #525960;
  pointer-events: none;
}

  /* Detalhes da Camada */
  .layer-details {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }

  .layer-sub {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 16px;
  }

  /* Linhas da Legenda */
  .legend-line {
    width: 22px;
    height: 3px;
    border-radius: 8px;
    display: inline-block;
  }

  .legend-line.black {
    background-color: rgb(194, 25, 25);
  }

  .legend-line.blue {
    background-color: blue;
  }
  </style>
