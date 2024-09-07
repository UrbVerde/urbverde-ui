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
        searchQuery: "",
        validPrefixes: [
          "Rua", "R.", "Avenida", "Av.", "Alameda", "Al.", "Travessa", "Tv.", "Largo", 
          "Lg.", "Praça", "Pça.", "Estrada", "Est.", "Rodovia", "Rod.", "Viela", 
          "Vl.", "Beco", "B.", "Parque", "Pq.", "Jardim", "Jd.", "Ladeira", "Ld.", 
          "Vila", "Vl.", "Caminho", "Conjunto", "Cj.", "Passagem", "Pass.", "Viaduto", 
          "Vd.", "Balneário", "Baln.", "Esplanada", "Espl."
        ],
        apiKey: "AIzaSyDinpvNF6Vh2KN8uK5cjiq_rz65Fj2W4fs", // Insira sua chave da API aqui
        latitude: -23.550520, // Coordenada de latitude
        longitude: -46.633308, // Coordenada de longitude
        searchTimeout: null,
        results: [] // Armazena os resultados da API
      };
    },
    methods: {
      handleInput() {
        const prefixMatch = this.validPrefixes.some(prefix =>
          this.searchQuery.startsWith(prefix)
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
        }, 1000); // Espera de 1 segundo após digitar espaço
      },
      searchAddress() {
        if (!this.latitude || !this.longitude) {
          console.log("Erro aqui: Latitude e longitude não estão definidas");
          return;
        }
  
        const baseURL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
        const params = new URLSearchParams({
          query: this.searchQuery, // Texto de busca (prefixos de endereço)
          location: `${this.latitude},${this.longitude}`, // Ponto central para busca
          radius: 5000, // Raio de busca em metros (5 km, por exemplo)
          key: this.apiKey // Chave de API
        });
  
        fetch(`${baseURL}?${params}`)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              this.results = data.results; // Armazena os resultados da busca
            } else {
              this.results = [];
              console.log("Nenhum resultado encontrado");
            }
          })
          .catch(error => {
            console.error("Erro na solicitação à API do Google Places:", error);
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
  