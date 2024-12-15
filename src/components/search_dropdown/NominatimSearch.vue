<template>
  <div class="search">
    <input type="text" v-model="query" placeholder="Digite o nome do município" />
    <button @click="searchNominatim">Enviar</button>
    <ul v-if="results.length > 0">
      <li v-for="(result, index) in results" :key="index">{{ result.display_name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      results: [],
    };
  },
  methods: {
    async searchNominatim() {
      if (!this.query) {return;}

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${this.query},Brazil&format=json&addressdetails=0&limit=50`

        );
        const data = await response.json();
        this.results = data;
      } catch (error) {
        console.error('Erro ao buscar dados do Nominatim:', error);
      }
    },
  },
};
</script>

  <style scoped>
  .search {
    max-width: 500px;
    margin: 50px auto;
    text-align: center;
  }

  input {
    padding: 10px;
    width: 70%;
    margin-right: 10px;
  }

  button {
    padding: 10px;
  }

  ul {
    margin-top: 20px;
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }
  </style>
