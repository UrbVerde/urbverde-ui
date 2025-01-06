<template>
    <div>
      <Card
        v-for="(item, index) in data"
        :key="index"
        :title="item.title"
        :subtitle="item.subtitle"
        :value="item.value"
      />
    </div>
  </template>
  
  <script>
  import Card from "@/components/cards/Card.vue";
  
  export default {
    name: "TemperatureCard",
    components: {
      Card,
    },
    props: {
      data: {
        type: Array, // Define que 'data' é um array
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px; /* Espaçamento entre os elementos */
  }
  
  .titulo {
    font-size: 18px;
    font-weight: bold;
    color: var(--Gray-800, #343A40);
  }
  
  .info {
    font-size: 24px;
    font-weight: bold;
    color: var(--Primary-500, #007BFF);
  }
  
  .textodescritivo {
    font-size: 14px;
    font-weight: normal;
    color: var(--Gray-600, #6C757D);
  }
  </style>