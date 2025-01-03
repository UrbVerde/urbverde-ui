<template>
    <div>
      <Card
        :title="titulo"
        :subtitle="description"
        :value="value"
      >
        <!-- Slot adicional para a imagem -->
        <template #custom-content>
          <img :src="image" alt="Ilustração" class="card-image" />
        </template>
      </Card>
    </div>
  </template>
  
  <script>
  import Card from "@/components/Card.vue";
  
  export default {
    name: "CardGrande",
    components: {
      Card,
    },
    data() {
      return {
        titulo: "O que sao ilhas de calor?", // Título fixo do card
        description: "Este é um card estático com descrição detalhada.", // Descrição fixa
        image: "https://via.placeholder.com/233x168", // URL da imagem fixa
      };
    },
  };
  </script>
  
  <style scoped>
  .card-image {
    width: 233px;
    height: 168px;
    margin-bottom: 24px; /* Espaço entre a imagem e o restante do conteúdo */
    object-fit: cover;
    border-radius: 8px; /* Opcional: bordas arredondadas */
  }
  </style>