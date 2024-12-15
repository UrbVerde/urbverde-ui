<template>
  <div>
    <input
      type="text"
      v-model="searchQuery"
      @input="handleInput"
      @keyup.space="startSearchTimer"
      placeholder="Digite um endereço"
    />
    <button @click="searchAddress">Enviar</button>
    <!-- Lista de resultados -->
    <div v-if="results.length > 0">
      <h3>Resultados da Busca:</h3>
      <ul>
        <li v-for="(result, index) in results" :key="index">
          {{ result.name }} - {{ result.formatted_address }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      validPrefixes: [
        'Rua', 'R.', 'Avenida', 'Av.', 'Alameda', 'Al.', 'Travessa', 'Tv.', 'Largo',
        'Lg.', 'Praça', 'Pça.', 'Estrada', 'Est.', 'Rodovia', 'Rod.', 'Viela',
        'Vl.', 'Beco', 'B.', 'Parque', 'Pq.', 'Jardim', 'Jd.', 'Ladeira', 'Ld.',
        'Vila', 'Vl.', 'Caminho', 'Conjunto', 'Cj.', 'Passagem', 'Pass.', 'Viaduto',
        'Vd.', 'Balneário', 'Baln.', 'Esplanada', 'Espl.'
      ],
      apiKey: 'YOUR_API_KEY_HERE', // Substitua pela sua chave da API
      latitude: -23.550520,
      longitude: -46.633308,
      searchTimeout: null,
      results: []
    };
  },
  methods: {
    handleInput() {
      const prefixMatch = this.validPrefixes.some(prefix =>
        this.searchQuery.toLowerCase().startsWith(prefix.toLowerCase())
      );
      if (!prefixMatch) {
        clearTimeout(this.searchTimeout);
      }
    },
    startSearchTimer() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.searchAddress();
      }, 1000);
    },
    searchAddress() {
      if (!this.latitude || !this.longitude) {
        return;
      }

      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const baseURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
      const params = new URLSearchParams({
        query: this.searchQuery,
        location: `${this.latitude},${this.longitude}`,
        radius: 5000,
        key: this.apiKey
      });

      fetch(`${proxyUrl}${baseURL}?${params}`, {
        headers: {
          'Origin': window.location.origin
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.json();
        })
        .then(data => {
          if (data.results && data.results.length > 0) {
            this.results = data.results;
          } else {
            this.results = [];
          }
        })
        .catch(error => {
          console.error('Erro na solicitação à API do Google Places:', error);
        });
    }
  }
};
</script>

<style scoped>
input {
  padding: 8px;
  margin-right: 10px;
  font-size: 16px;
}
button {
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
}
ul {
  list-style-type: none;
  padding-left: 0;
}
li {
  padding: 5px 0;
}
</style>
