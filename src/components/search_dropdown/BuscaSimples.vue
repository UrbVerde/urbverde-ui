<template>
  <div>
    <div class="input-container">
      <input
        v-model="inputValue"
        @input="updateSuggestions"
        placeholder="Digite o nome de um estado brasileiro"
        class="input-field"
      />
      <div v-if="highlightedText" class="suggestion-overlay">
        <span class="suggestion-text">
          <span class="invisible">{{ visibleInput }}</span><span class="highlight">{{ highlightedText }}</span>
        </span>
      </div>
    </div>
    <div class="button-container">
      <button @click="submit">Enviar</button>
      <span class="suggestion-count" v-if="suggestions.length > 0">
        {{ suggestions.length }} sugestão(ões)
      </span>
    </div>
    <ul v-if="visibleSuggestions.length" class="suggestions-list">
      <li v-for="suggestion in visibleSuggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      visibleInput: '',
      suggestions: [],
      highlightedText: '',
      states: [
        'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
        'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
        'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
        'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
        'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
      ]
    };
  },
  computed: {
    visibleSuggestions() {
      return this.suggestions.slice(0, 2);
    }
  },
  methods: {
    updateSuggestions() {
      if (this.inputValue.length > 0) {
        const inputLower = this.inputValue.toLowerCase();
        this.suggestions = this.states.filter(state =>
          state.toLowerCase().startsWith(inputLower)
        );
        if (this.suggestions.length > 0) {
          const suggestion = this.suggestions[0];
          this.visibleInput = this.inputValue;
          this.highlightedText = suggestion.slice(this.inputValue.length);
        } else {
          this.visibleInput = this.inputValue;
          this.highlightedText = '';
        }
      } else {
        this.suggestions = [];
        this.visibleInput = '';
        this.highlightedText = '';
      }
    },
    selectSuggestion(suggestion) {
      this.inputValue = suggestion;
      this.visibleInput = suggestion;
      this.highlightedText = '';
      this.suggestions = [];
    },
    submit() {
      alert(`Você selecionou: ${this.inputValue}`);
    }
  }
};
</script>

<style scoped>
.input-container {
  position: relative;
  display: inline-block;
  width: 300px;
}
.input-field {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  font-size: 16px;
}
.suggestion-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
}
.suggestion-text {
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
}
.invisible {
  visibility: hidden;
}
.highlight {
  color: #bbb;
}
.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
}
.suggestions-list li {
  padding: 5px;
  cursor: pointer;
}
.suggestions-list li:hover {
  background-color: #f0f0f0;
}
.button-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.suggestion-count {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
}
</style>