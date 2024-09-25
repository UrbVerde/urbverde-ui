<template>
  <div id="app">
    <h1>Busca de Cidades Brasileiras</h1>
    <input v-model="query" type="text" placeholder="Digite o nome da cidade"/>
    <button @click="searchCity">Buscar</button>
    <pre v-if="responseData">{{ responseData }}</pre>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      responseData: null,
    };
  },
  methods: {
    async searchCity() {
      if (this.query.trim() === '') {
        alert('Por favor, insira o nome de uma cidade');
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.query)}&country=Brazil&format=json&limit=40&addressdetails=1&dedupe=1&accept-language=pt-BR`
        );
        const data = await response.json();

        // Filtrando resultados que começam com "São"
        const filteredData = data.filter(item => item.display_name.startsWith('São'));

        this.responseData = JSON.stringify(filteredData, null, 2);
      } catch (error) {
        console.error('Erro ao buscar a cidade:', error);
      }
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}
input {
  padding: 10px;
  margin-right: 10px;
  width: 300px;
}
button {
  padding: 10px 20px;
}
pre {
  text-align: left;
  margin-top: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
