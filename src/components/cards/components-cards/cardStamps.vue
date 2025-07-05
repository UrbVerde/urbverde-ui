<template>
  <cardBase>
    <div class="goals">
      <!-- Imagem do selo -->
      <div class="stamp-image-wrapper">
        <img
          class="stamp-image"
          :src="stampImageSrc"
          :alt="stampTitle"
        />
      </div>
      <!-- Informações à direita -->
      <div class="info-wrapper">
        <!-- Título e subtítulo -->
        <div class="title">
          <span class="heading-h6 title-text">{{ stampTitle }}</span>
          <span class="body-small-regular subtitle-text">Complete as ações abaixo para sua cidade conquistar o selo do eixo</span>
        </div>
        <!-- Barra e botão só se for desktop_small ou maior -->
        <template v-if="largerThan('mobile_large')">
          <div class="bar-wrapper">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: barWidth }"></div>
            </div>
            <span class="progress-count heading-h5">{{ barPercentage[0] }}/{{ barPercentage[1] }}</span>
          </div>
          <PrimaryButton
            :label="'Como funcionam os selos?'"
            :filled="false"
            @click="showModal"
          />
        </template>
      </div>
    </div>
    <!-- Se for menor que desktop_small, barra e botão embaixo -->
    <div v-if="!largerThan('mobile_large')" class="responsive-actions">
      <div class="bar-wrapper">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: barWidth }"></div>
        </div>
        <span class="progress-count heading-h5">{{ barPercentage[0] }}/{{ barPercentage[1] }}</span>
      </div>
      <PrimaryButton
        :label="'Como funcionam os selos?'"
        :filled="false"
        @click="showModal"
      />
    </div>
    <!-- Modal -->
    <teleport to="body">
      <modalStamps ref="refModal" />
    </teleport>
  </cardBase>
</template>

<script setup>
import { ref, computed } from 'vue';
import cardBase from '../base/cardBase.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import modalStamps from '@/components/modal/modalStamps.vue';
import parksImg from '@/assets/images/stamps/parks.png';
import hidroImg from '@/assets/images/stamps/hidro.png';
import vegetationImg from '@/assets/images/stamps/vegetation.png';
import agricultureImg from '@/assets/images/stamps/agriculture.png';
import climateImg from '@/assets/images/stamps/climate.png';
import { useWindowSize } from '@/utils/useWindowsSize.js';

const props = defineProps({
  eixo: {
    type: String,
    required: true
  },
  barPercentage: {
    type: Array,
    required: true,
    validator: (val) => Array.isArray(val) && val.length === 2 && val.every(Number.isFinite)
  }
});

const refModal = ref(null);
const { largerThan } = useWindowSize();

const showModal = () => {
  if (refModal.value && refModal.value.show) {
    refModal.value.show();
  }
};

const stampImageSrc = computed(() => {
  switch (props.eixo) {
  case 'policies_parks':
    return parksImg;
  case 'agriculture':
    return agricultureImg;
  case 'hidro':
    return hidroImg;
  case 'policies_vegetation':
    return vegetationImg;
  case 'policies_climate':
    return climateImg;
  default:
    return '';
  }
});

const stampTitle = computed(() => {
  switch (props.eixo) {
  case 'policies_parks':
    return 'Selo UrbVerde de Parques e Praças';
  case 'agriculture':
    return 'Selo UrbVerde de Agricultura Urbana';
  case 'hidro':
    return 'Selo UrbVerde de Hidrologia';
  case 'policies_vegetation':
    return 'Selo UrbVerde de Vegetação';
  case 'policies_climate':
    return 'Selo UrbVerde de Emissões e Clima';
  default:
    return 'Selo UrbVerde';
  }
});

const barWidth = computed(() => {
  const [current, total] = props.barPercentage;
  if (!total || total === 0) {return '0%';}
  const percent = Math.min((current / total) * 100, 100);

  return `${percent}%`;
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.goals {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 64px;
  align-self: stretch;
  width: 100%;
  height: auto;
}
.stamp-image-wrapper {
  width: 128px;
  height: 128px;
  margin-left: 24px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
.stamp-image-wrapper:hover {
  transform: scale(1.03);
}
.stamp-image {
  width: 128px;
  height: 128px;
  flex-shrink: 0;
}
.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
  width: 100%;
}
.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1 0 0;
}
.title-text {
  color: map-get($body-text, body-color);
}
.subtitle-text {
  color: map-get($gray, 550);
}
.bar-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.progress-bar-bg {
  background: map-get($gray, 200);
  border-radius: 99px;
  width: 100%;
  height: 16px;
  position: relative;
  overflow: hidden;
}
.progress-bar-fill {
  background: map-get($green, 600);
  height: 100%;
  border-radius: 99px;
  transition: width 0.3s;
}
.progress-count {
  color: map-get($green, 600);
  margin-left: 8px;
}
.responsive-actions {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-top: 24px;
}

@include breakpoint-down('desktop-large') {
  .goals {
    gap: 40px;
  }
  .stamp-image-wrapper {
    margin-left: 8px;
  }
}
</style>
