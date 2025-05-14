<template>
  <div class="panel" :class="[panelClass, { 'nested-panel': nested }]">
    <template v-for="(child, i) in $slots.default ? $slots.default() : []" :key="i">
      <div class="panel-cell">
        <component :is="child" />
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

// Responsividade

@include breakpoint-down('mobile-large') {
  .panel {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
  }
}
</style>
