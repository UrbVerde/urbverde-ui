<template>
  <div class="app">
    <h1>Busca de Cidades Brasileiras</h1>
    <div class="search-container">
      <input
        v-model="query"
        type="text"
        placeholder="Digite o nome da cidade"
        @keyup.enter="searchCity"
      />
      <button @click="searchCity">Buscar</button>
    </div>
    <div v-if="cities.length > 0" class="results">
      <h2>Resultados:</h2>
      <ul>
        <li v-for="city in cities" :key="city.id">
          {{ city.nome }}, {{ city.microrregiao.mesorregiao.UF.sigla }}
        </li>
      </ul>
    </div>
    <p v-else-if="searched">Nenhuma cidade encontrada.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      cities: [],
      searched: false,
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
          `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(this.query)}`
        );
        const data = await response.json();
        this.cities = data.filter(city => city.nome.toLowerCase().startsWith(this.query.toLowerCase()));
        this.searched = true;
      } catch (error) {
        console.error('Erro ao buscar a cidade:', error);
      }
    },
  },
};
</script>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}

.search-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  flex-grow: 1;
  padding: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}
</style>
