<!-- TempSection.vue -->
<template>
  <div>
    <div class="section-container"
         @mouseenter="isHovered = true"
         @mouseleave="isHovered = false">

      <div class="container-content">
        <div class="container-header">
          <div class="content-wrapper">
            <img src="@/assets/icons/temperatura.svg" alt="Temperature icon" />
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

        <div class="temperature-scale">
          <div class="temperature-bar"></div>
          <div class="temperature-labels">
            <span>-5ºC</span>
            <span>0ºC</span>
            <span>+5ºC</span>
          </div>
        </div>

        <!-- Novo botão expansível -->
        <div v-if="isHovered" class="expand-button">
          <button class="sector-button">
            <span class="body-small-semibold">Setor censitário</span>
            <img src="@/assets/icons/dropDown.svg" alt="Expand" class="expand-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TempSection',
  data() {
    return {
      isHovered: false,
      visibility: 70,
      isAnimating: false
    };
  },
  computed: {
    displayText() {
      return this.isHovered ? 'Temper...' : 'Temperatura de Superfície';
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
  width: 232px;
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

/* Estilos do Texto */
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

/* Seção da barra de temperatura */
.temperature-scale {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Barra de temperatura */
.temperature-bar {
  margin-top: 22px;
  width: 80%;
  height: 16px;
  padding: 8px;
  border-radius: 2px;
  background: linear-gradient(to right, #388BBB, #FADE8C, #D74752);
}

/* Rótulos da temperatura */
.temperature-labels {
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  width: 80%;
  font-size: 12px;
  font-weight: 500;
}

.expand-button {
  margin-top: 8px;
  width: 100%;
  opacity: 0;
  transform: translateY(-10px);
  animation: slideIn 150ms ease-in-out forwards;
}

.sector-button {
  width: 100%;
  padding: 4px 16px;
  background-color: #198754;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 150ms ease-in-out;
}

.sector-button:hover {
  background-color:     #18794c;
}

.expand-icon {
  width: 16px;
  height: 16px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
