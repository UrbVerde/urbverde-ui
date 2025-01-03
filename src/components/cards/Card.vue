<template>
    <div class="custom-card">
      <div class="card-content">
        <h1 class="titulo">{{ title }}</h1>
        <h2 class="info" v-if="value">{{ value }}</h2>
        <p class="textodescritivo" v-if="subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Card",
    props: {
      title: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: false,
      },
      subtitle: {
        type: String,
        required: false,
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-card {
    border-radius: 16px;
    border: 1px solid var(--Gray-200, #E9ECEF);
    background: var(--Gray-White, #FFF);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    width: 285px;
    padding: 24px;
    box-sizing: border-box;
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .titulo {
    font-size: 18px;
    font-weight: bold;
    color: var(--Gray-800, #343A40);
  }
  
  .info {
    font-size: 24px;
    font-weight: bold;
    color: var(--Primary-500, #007BFF);
  }
  
  .textodescritivo {
    font-size: 14px;
    color: var(--Gray-600, #6C757D);
  }
  </style>