<template>
  <div>
    <p v-if="city">Você está em: {{ city }}, {{ state }}, {{ stateAbbreviation }}, {{ country }}</p>
    <p v-else>Obtendo sua localização...</p>
  </div>
</template>


<script>
export default {
  data() {
    return {
      latitude: null,
      longitude: null,
      city: null,
      state: null,
      stateAbbreviation: null,
      country: null,
      international: false,
      statesBrazil: [
        { name: 'Acre', abbreviation: 'AC' },
        { name: 'Alagoas', abbreviation: 'AL' },
        { name: 'Amapá', abbreviation: 'AP' },
        { name: 'Amazonas', abbreviation: 'AM' },
        { name: 'Bahia', abbreviation: 'BA' },
        { name: 'Ceará', abbreviation: 'CE' },
        { name: 'Distrito Federal', abbreviation: 'DF' },
        { name: 'Espírito Santo', abbreviation: 'ES' },
        { name: 'Goiás', abbreviation: 'GO' },
        { name: 'Maranhão', abbreviation: 'MA' },
        { name: 'Mato Grosso', abbreviation: 'MT' },
        { name: 'Mato Grosso do Sul', abbreviation: 'MS' },
        { name: 'Minas Gerais', abbreviation: 'MG' },
        { name: 'Pará', abbreviation: 'PA' },
        { name: 'Paraíba', abbreviation: 'PB' },
        { name: 'Paraná', abbreviation: 'PR' },
        { name: 'Pernambuco', abbreviation: 'PE' },
        { name: 'Piauí', abbreviation: 'PI' },
        { name: 'Rio de Janeiro', abbreviation: 'RJ' },
        { name: 'Rio Grande do Norte', abbreviation: 'RN' },
        { name: 'Rio Grande do Sul', abbreviation: 'RS' },
        { name: 'Rondônia', abbreviation: 'RO' },
        { name: 'Roraima', abbreviation: 'RR' },
        { name: 'Santa Catarina', abbreviation: 'SC' },
        { name: 'São Paulo', abbreviation: 'SP' },
        { name: 'Sergipe', abbreviation: 'SE' },
        { name: 'Tocantins', abbreviation: 'TO' },
      ],
    };
  },
  mounted() {
    this.loadCachedLocation();
  },
  methods: {
    loadCachedLocation() {
      const cachedCity = localStorage.getItem('cachedCity');
      const cachedState = localStorage.getItem('cachedState');
      const cachedStateAbbreviation = localStorage.getItem('cachedStateAbbreviation');
      const cachedCountry = localStorage.getItem('cachedCountry');
      const cachedInternational = localStorage.getItem('cachedInternational') === 'true';
      const cachedTimestamp = localStorage.getItem('cachedTimestamp');
      const cacheDuration = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

      if (cachedCity && cachedState && cachedStateAbbreviation && cachedCountry && cachedTimestamp) {
        const now = Date.now();
        if (now - cachedTimestamp < cacheDuration) {
          this.city = cachedCity;
          this.state = cachedState;
          this.stateAbbreviation = cachedStateAbbreviation;
          this.country = cachedCountry;
          this.international = cachedInternational;
          this.emitLocationData(); // Emitir dados ao montar com cache
        } else {
          this.getLocation(); // Cache expirado, busca nova localização
        }
      } else {
        this.getLocation(); // Nenhum cache encontrado, busca nova localização
      }
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.setPosition,
          this.showError
        );
      } else {
        alert("Geolocalização não é suportada por este navegador.");
      }
    },
    setPosition(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.getCityName();
    },
    showError(error) {
      console.error("Erro ao obter localização: ", error);
    },
    async getCityName() {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitude}&lon=${this.longitude}`
        );
        const data = await response.json();
        this.city = data.address.city || data.address.town || data.address.village || 'error';
        this.state = data.address.state || 'error';
        this.country = data.address.country || 'error';
        
        // Verifica se o país é diferente de Brasil
        this.international = this.country !== 'Brasil';

        // Define a sigla do estado
        if (!this.international) {
          const stateInfo = this.statesBrazil.find(state => state.name === this.state);
          this.stateAbbreviation = stateInfo ? stateInfo.abbreviation : 'error';
        } else {
          this.stateAbbreviation = null;
        }

        // Cache a cidade, estado, país, sigla do estado e o status de internacional
        localStorage.setItem('cachedCity', this.city);
        localStorage.setItem('cachedState', this.state);
        localStorage.setItem('cachedStateAbbreviation', this.stateAbbreviation);
        localStorage.setItem('cachedCountry', this.country);
        localStorage.setItem('cachedInternational', this.international.toString());
        localStorage.setItem('cachedTimestamp', Date.now().toString());

        this.emitLocationData(); // Emitir dados após obter localização
      } catch (error) {
        console.error("Erro ao obter o nome da cidade: ", error);
      }
    },
    emitLocationData() {
      this.$emit('location-updated', {
        city: this.city,
        state: this.state,
        stateAbbreviation: this.stateAbbreviation,
        country: this.country,
        international: this.international,
      });
    },
  },
};
</script>
