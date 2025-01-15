<template>
  <div class="tips-card">
    <div class="tips-card-content">
      <h2 class="tips-card-title">Como podemos tornar as cidades mais frescas?</h2>
      <ul class="tips-card-list">
        <li class="tips-card-item">
          <span class="tips-card-number">1</span>
          Árvores ajudam a reduzir o calor e melhorar a qualidade do ar.
        </li>
        <li class="tips-card-item">
          <span class="tips-card-number">2</span>
          Rios e lagos ajudam a resfriar o clima urbano.
        </li>
        <li class="tips-card-item">
          <span class="tips-card-number">3</span>
          Implementação de políticas públicas que promovem áreas verdes.
        </li>
      </ul>
      <PrimaryButton
        label="Ver mais dicas"
        :filled="true"
        icon="bi-info-circle" 
        iconType="bootstrap"
        iconPosition="right"
        class="tips-card-button"
      />
    </div>
    <div class="tips-card-image">
      <img
        src="@/assets/images/cards/environmentalcampaign.svg"
        alt="Ilustração dicas"
      />
    </div>
  </div>
</template>

<script>
import PrimaryButton from "@/components/buttons/PrimaryButton.vue";

export default {
  name: "TipsCard",
  components: {
    PrimaryButton,
  },
};
</script>

<style scoped>
.tips-card {
  width: 960px;
  height: 266px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid var(--Gray-200, #E9ECEF);
  border-radius: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: 16px;
  box-sizing: border-box;
}

.tips-card-content {
  flex: 1;
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tips-card-image img {
  width: 250px;
  height: auto;
  object-fit: contain;
}

.tips-card-title {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}

.tips-card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-card-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #374151;
  margin-bottom: 12px;
}

.tips-card-number {
  width: 32px;
  height: 32px;
  background-color: #e7f6e8;
  color: #10b981;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.tips-card-button {
  margin-top: 16px;
  align-self: flex-start;
}
</style>
