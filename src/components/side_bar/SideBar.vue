<template>
  <div>
    <div :class="['sidebar', { 'sidebar-open': isOpen }]">
      <div :class="['top-area', { 'top-area-open': isOpen }]">

        <LogoButton v-show="isOpen" />
        <MinimizeButton @changed-state="changeSidebar" />

      </div>
      <div v-show="isOpen" class="middle-area">
        <DropDown v-show="true" :options="options" />
      </div>


      <div v-show="isOpen" class="bottom-area">

        <a class="link-button">
          <img class="d-inline-block" id="imgIcon" src="../icons/export.svg" width="20"
            height="20" />
          <span id="txtBottom">Colabore com dados</span>
        </a>
        <a class="link-button">
          <img class="d-inline-block" id="imgIcon" src="../icons/help.svg" width="20"
            height="20" />
          <span id="txtBottom">Central de ajuda</span>
        </a>
      </div>


    </div>
  </div>
</template>

<script setup>
import DropDown from "@/components/side_bar/drop_down/NavbarDropdown.vue"
import MinimizeButton from '../side_bar/buttons/MinimizeButton.vue'
import LogoButton from '../side_bar/buttons/LogoButton.vue';
import { ref } from "vue";

const options = ref(["Clima", "Vegetação", "Parques e Praças"]);
const isOpen = ref(true);

function changeSidebar() {
  isOpen.value = !isOpen.value;
}

</script>


<style scoped lang="scss">
@import '../../assets/styles/custom.scss';


.sidebar {
  width: 72px;
  height: 100vh;
  transition: 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: map-get($gray-colors, white);
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
}

.sidebar-open {
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;


}

.top-area {
  display: flex;
  height: 88px;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  background-color: map-get($gray-colors, white);
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
}

.logo {
  display: flex;
  padding-left: 8px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
}

.list-group {
  width: 100%;
}

.list-group-item {
  width: 100%;
}

.middle-area {
  display: flex;
  padding: 32px 16px 16px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
  align-self: stretch;
}

.bottom-area {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  padding: 16px 24px;
  margin-top: auto;
  /* Empurra a área inferior para o fim */
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
  border-top: 1px solid rgba(0, 0, 0, 0.13);
  background-color: map-get($gray-colors, white);
}


.link-button {
  text-decoration: none;
  color: map-get($theme-colors, primary);
  font-weight: bold;
  display: flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

#txtBottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  @extend .small-regular;

}
</style>
