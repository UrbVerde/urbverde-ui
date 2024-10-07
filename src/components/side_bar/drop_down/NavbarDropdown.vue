<template>
    <div class="container">
        <span class="text">CATEGORIAS</span>


        <div>
            <NavbarItem v-for="(dropdown, index) in dropdowns" :key="index" :isSelectedItem="dropdown.isSelected" :itemName="dropdown.name"
                @update:isSelectedItem="handleSelectionChange(index)" />

        </div>

    </div>
</template>

<script setup>

import NavbarItem from "@/components/side_bar/drop_down/NavbarItemDropdown.vue";


import { defineProps } from "vue";
import { reactive } from 'vue';

const dropdowns = reactive([
    {name: 'Clima', isSelected: false },
    {name: 'Vegetação', isSelected: false },
    {name: 'Parques e Praças', isSelected: false },
]);


const props = defineProps({
    options: {
        type: Array,
        required: true
    }
});

const handleSelectionChange = (selectedIndex) => {
  dropdowns.forEach((dropdown, index) => {
    dropdown.isSelected = index === selectedIndex;
  });
};

</script>



<style scoped>
.container {
    padding: 0px 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
    align-self: stretch;



    flex: 1 0 0;
    color: black;
    background: var(--HitBox, rgba(255, 255, 255, 0.00));



}

.text {
    color: var(--Theme-Secondary, #6C757D);

    /* Body/Caption/Medium */
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    font-family: Inter, sans-serif;
    /* 18px */

    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;


}


</style>