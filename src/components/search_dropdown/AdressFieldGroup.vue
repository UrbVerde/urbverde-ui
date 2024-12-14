<template>
    <h3>Endereços</h3>
    <div class="grid grid-cols-3 gap-5">
      <label class="col-span-2 relative">
        Rua {{ street }}
        <input
          type="text"
          :value="searchQuery"
          @input="updateAddress($event.target.value)"
          ref="streetRef"
          placeholder="Pesquise um Lugar"
          @focus="showSuggestions = true"
        />
        <ul v-if="showSuggestions && suggestions.length" class="absolute bg-white border mt-1 w-full z-10">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
            class="p-2 hover:bg-gray-200 cursor-pointer"
          >
            {{ suggestion.display_name }}
          </li>
        </ul>
      </label>
      <label class="col-span-2">
        Número
        <input
          type="text"
          :value="streetNumber"
          @input="$emit('update:streetNumber', $event.target.value)"
          placeholder="Número"
        />
      </label>
      <label class="col-span-2">
        Postcode
        <input
          type="text"
          :value="postcode"
          @input="$emit('update:postcode', $event.target.value)"
          placeholder="CEP"
        />
      </label>
      <label class="col-span-2">
        Cidade
        <input
          type="text"
          :value="city"
          @input="$emit('update:city', $event.target.value)"
          placeholder="Cidade"
        />
      </label>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, watch } from 'vue';
  
  export default {
    name: 'AddressFieldGroup',
    props: {
      street: {
        type: String,
        default: '',
      },
      streetNumber: {
        type: String,
        default: '',
      },
      postcode: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
    },
    setup(props, context) {
      const streetRef = ref(null);
      const searchQuery = ref(props.street);
      const suggestions = ref([]);
      const showSuggestions = ref(false);
  
      const updateAddress = async (query) => {
        searchQuery.value = query;
        if (query.length > 3) {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
          );
          if (response.data) {
            suggestions.value = response.data;
          }
        } else {
          suggestions.value = [];
        }
      };
  
      const selectSuggestion = (suggestion) => {
        const place = suggestion.address;
        context.emit('update:street', place.road || '');
        context.emit('update:streetNumber', place.house_number || '');
        context.emit('update:postcode', place.postcode || '');
        context.emit('update:city', place.city || place.town || place.village || '');
        searchQuery.value = suggestion.display_name;
        showSuggestions.value = false;
      };
  
      watch(
        () => props.street,
        (newStreet) => {
          searchQuery.value = newStreet;
        }
      );
  
      return { streetRef, searchQuery, suggestions, showSuggestions, updateAddress, selectSuggestion };
    },
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
