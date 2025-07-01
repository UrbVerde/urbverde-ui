<template>
  <div class="badge-wrapper" :class="status">
    <span class="badge-text body-caption-medium">{{ getStatusText() }}</span>
  </div>
</template>

<script>
export default {
  name: 'BadgeCards',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['nao-informado', 'em-andamento', 'completo'].includes(value)
    }
  },
  methods: {
    getStatusText() {
      const statusMap = {
        'nao-informado': 'Não informado',
        'em-andamento': 'Em andamento',
        'completo': 'Completo'
      };

      return statusMap[this.status] || 'Não informado';
    }
  }
};
</script>

<style scoped lang="scss">
.badge-wrapper {
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;
  gap: 10px;
  border-radius: 4px;

  .badge-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  &.nao-informado {
    background: map-get($gray, 100);

    .badge-text {
      color: map-get($gray, 550);
    }
  }

  &.em-andamento {
    background: var(--Yellow-100, #FFF3CD);

    .badge-text {
      color: var(--Yellow-800, #664D03);
    }
  }

  &.completo {
    background: map-get($primary-fade, 100);

    .badge-text {
      color: map-get($theme, primary);
    }
  }
}
</style>
