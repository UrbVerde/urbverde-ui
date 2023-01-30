<template>
  <vc-donut
    background="white"
    foreground="#f2ecff"
    :size="size"
    unit="px"
    :thickness="30"
    :sections="sections"
    :total="100"
    :start-angle="180"
    :auto-adjust-text-size="true"
    @section-click="handleSectionClick"
  >
    <h1>{{ valor.toFixed() }}%</h1>
  </vc-donut>
</template>
<script>
export default {
  props: ["valor", "size"],
  data() {
    return {
      sections: [{ value: this.valor, color: "#01dc82" }],
    };
  },
  methods: {
    handleSectionClick(section, event) {
      console.log(`${section.label} clicked.`);
    },
  },
};
</script>

<style scoped>
h1 {
  color: #01dc82;
  font-size: 3em;
}
</style>
