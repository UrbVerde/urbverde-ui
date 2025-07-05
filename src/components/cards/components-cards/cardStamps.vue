<template>
  <cardBase>
    <div class="goals">
      <!-- Imagem do selo -->
      <img
        class="stamp-image"
        :src="stampImageSrc"
        :alt="stampTitle"
      />
      <!-- Informações à direita -->
      <div class="info-wrapper">
        <!-- Título e subtítulo -->
        <div class="title">
          <span class="heading-h6 title-text">{{ stampTitle }}</span>
          <span class="body-small-medium subtitle-text">Complete as ações abaixo para sua cidade conquistar o selo do eixo</span>
        </div>
        <!-- Barra de progresso e contagem -->
        <div class="bar-wrapper">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" :style="{ width: barWidth }"></div>
          </div>
          <span class="progress-count heading-h4">{{ barPercentage[0] }}/{{ barPercentage[1] }}</span>
        </div>
        <!-- Botão que abre modal -->
        <PrimaryButton
          :label="'Como funcionam os selos?'"
          :filled="false"
          @click="showModal"
        />
        <!-- Modal -->
        <modalBootstrap
          ref="refModal"
          modalId="modalStampsInfo"
          title="Como funcionam os selos?"
          bodyText="Aqui você pode colocar uma explicação sobre o funcionamento dos selos."
          :showSecondaryButton="false"
          :showPrimaryButton="true"
          primaryButtonText="Fechar"
        />
      </div>
    </div>
  </cardBase>
</template>

<script setup>
import { ref, computed } from 'vue';
import cardBase from '../base/cardBase.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import modalBootstrap from '@/components/modal/modalBootstrap.vue';

// Importação estática das imagens
import parksImg from '@/assets/images/stamps/policies_parks.png';
import hidroImg from '@/assets/images/stamps/hidro.png';
import vegetationImg from '@/assets/images/stamps/policies_vegetation.png';
import agricultureImg from '@/assets/images/stamps/agriculture.png';

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

const showModal = () => {
  if (refModal.value && refModal.value.show) {
    refModal.value.show();
  }
};

const stampData = computed(() => {
  switch (props.eixo) {
  case 'policies_parks':
    return {
      img: parksImg,
      title: 'Selo UrbVerde de Parques e Praças'
    };
  case 'agriculture':
    return {
      img: agricultureImg,
      title: 'Selo UrbVerde de Agricultura Urbana'
    };
  case 'hidro':
    return {
      img: hidroImg,
      title: 'Selo UrbVerde de Hidrologia'
    };
  case 'policies_vegetation':
    return {
      img: vegetationImg,
      title: 'Selo UrbVerde de Vegetação'
    };
  default:
    return {
      img: '',
      title: 'Selo UrbVerde'
    };
  }
});

const stampImageSrc = computed(() => stampData.value.img);
const stampTitle = computed(() => stampData.value.title);

const barWidth = computed(() => {
  const [current, total] = props.barPercentage;
  if (!total || total === 0) {return '0%';}
  const percent = Math.min((current / total) * 100, 100);

  return `${percent}%`;
});
</script>

<style scoped lang="scss">
.goals {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  align-self: stretch;
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
</style>
