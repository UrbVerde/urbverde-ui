<template>
  <Card :title="title" :subtitle="subtitle">
    <div class="sections">
      <div class="section" v-for="(section, index) in data" :key="index">
        <p class="section-title">{{ section.title }}</p>
        <p class="section-value">
          <span class="value">{{ section.value }}</span>
          <span v-if="section.total" class="total"> de {{ section.total }}</span>
        </p>
      </div>
    </div>
  </Card>
</template>


<script>
import Card from "@/components/cards/Card.vue"; 

export default {
  name: "RankingCard",
  components: {
    Card, 
  },
  props: {
    title: {
      type: String, 
      required: false, 
    },
    subtitle: {
      type: String, 
      required: false, 
    },
    data: {
      type: Array, 
      required: true,
      validator: (value) => {
        return value.every(
          (item) =>
            typeof item.title === "string" &&
            typeof item.value === "string" && 
            (typeof item.total === "string" || item.total === undefined) 
        );
      },
    },
  },
};
</script>

<style scoped>
.rank-card {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #343a40;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 16px;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 16px;
  color: #6c757d;
}

.section-value {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.value {
  color: #28a745; 
}

.total {
  color: #6c757d; 
}
</style>
