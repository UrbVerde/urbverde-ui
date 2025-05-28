<!-- urbverde-ui/src/components/cards/panel-config/base/SectionCards.vue -->
<template>
  <div class="panel" :class="[panelClass, { 'nested-panel': nested }]">
    <template v-for="(child, i) in $slots.default ? $slots.default() : []" :key="i">
      <div class="panel-cell">
        <component :is="child" v-bind="$attrs" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    required: true,
    validator: (value) => {
      const [rows, cols] = value.split('-').map(Number);

      return rows >= 1 && rows <= 4 && cols >= 1 && cols <= 4;
    }
  },
  nested: {
    type: Boolean,
    default: false
  }
});

// Define que o componente pode receber props adicionais
defineOptions({
  inheritAttrs: false
});

const panelClass = computed(() => {
  const [rows, cols] = props.variant.split('-').map(Number);

  return `panel-${rows}-${cols}`;
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.panel {
  display: grid;
  gap: 16px;
  width: 100%;
  height: 100%;
}

.panel-cell {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

// Gera combinações de linhas e colunas (1-4)
@for $rows from 1 through 4 {
  @for $cols from 1 through 4 {
    .panel-#{$rows}-#{$cols} {
      grid-template-rows: repeat($rows, auto);
      grid-template-columns: repeat($cols, minmax(0, 1fr));
    }
  }
}

// Responsividade avançada para grids aninhados
@include breakpoint-down('mobile-large') {
  // 1-2: permanece lado a lado, mas se quebrar, cada card ocupa 100%
  .panel-1-2 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    @media (max-width: 500px) {
      grid-template-columns: 1fr;
    }
  }

  // 1-3: duas colunas em cima, uma embaixo ocupando 100%
  .panel-1-3 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    & > .panel-cell:nth-child(1),
    & > .panel-cell:nth-child(2) {
      grid-column: auto;
      grid-row: 1;
    }
    & > .panel-cell:nth-child(3) {
      grid-column: 1 / span 2;
      grid-row: 2;
    }
  }

  // 1-4: duas colunas em cima, duas embaixo, cada uma ocupando 50%
  .panel-1-4 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    & > .panel-cell:nth-child(1),
    & > .panel-cell:nth-child(2) {
      grid-column: auto;
      grid-row: 1;
    }
    & > .panel-cell:nth-child(3),
    & > .panel-cell:nth-child(4) {
      grid-column: auto;
      grid-row: 2;
    }
  }

  // Painel aninhado: se for 1-1, sempre ocupa 100%
  .panel-1-1 {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  // Painel aninhado: se último filho de 1-3 for um painel 2-1, vira 1-2
  .panel-1-3 > .panel-cell:last-child .panel-2-1 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
}

// Para telas menores que mobile-medium, tudo empilha
@include breakpoint-down('mobile-medium') {
  .panel,
  .panel .panel,
  .panel .panel .panel,
  .panel .panel .panel .panel {
    display: grid !important;
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
    grid-auto-flow: row !important;
  }

  // Força todos os painéis a terem uma única coluna, exceto 1-1
  [class*="panel-"]:not(.panel-1-1) {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
  }

  // Garante que os painéis aninhados também sigam o mesmo padrão
  .panel-cell {
    grid-column: 1 !important;
    grid-row: auto !important;
  }
}
</style>
