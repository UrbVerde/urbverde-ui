<template>
    <TemperatureCard :data="cardData"/>
</template>

<script>
import TemperatureCard from './TemperatureCard.vue';

export default{
    components: {
        TemperatureCard
    },
    data(){
        return {
            cardData: [
                {title: "Temperatura", subtitle: "lalalal", value:"25"},
            ]
        }
    }
}
</script>

<style>
</style>