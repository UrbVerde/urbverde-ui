<template>
  <div>
    <div
      class="mx-auto pointer"
      @click="showModal = true"
      style="
        display: grid;
        place-items: center;
        background-color: #01dc82;
        width: 45px;
        height: 43px;
        border-radius: 0px 15px 15px 15px;
      "
    >
      <img width="20px" src="@/assets/home/share-icon.png" />
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Compartilhe</h3>
          <button @click="showModal = false">x</button>
        </div>
        <div class="modal-body">
          <v-form class="mt-4 d-flex justify-center">
            <v-text-field disabled dense outlined v-model="url"></v-text-field>
            <v-btn
              @click="copyToClipBoard"
              class="ml-1 white--text"
              color="#01dc82"
              >Copiar!</v-btn
            >
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      showModal: false,
    };
  },
  methods: {
    copyToClipBoard() {
      navigator.clipboard.writeText(this.url);
      this.showModal = false;
    },
  },
  watch: {
    $route: {
      handler: function (url) {
        this.url = `https://urbverde.iau.usp.br/#` + this.$route.fullPath;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
.modal-overlay {
  background-color: white;
  position: relative;
  top: 0;
  left: 0;
  z-index: 100;
}
.modal-content {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
}
.modal-header {
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}
.modal-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.modal-footer {
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}
</style>
