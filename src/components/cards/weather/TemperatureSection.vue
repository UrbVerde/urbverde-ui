<template>
    <TemperatureCard :data="cardData"/>
    <InfoTemperature />
</template>

<script>
import InfoTemperature from './InfoTemperature.vue';
import TemperatureCard from './TemperatureCard.vue';

export default{
    components: {
        InfoTemperature,
        TemperatureCard
    },
    data(){
        return {
            cardData: [
                {title: "Nível de ilha de calor", subtitle: "abaixo da media nacional de 72", value:"62"},
                {title: "Temperatura media da superfície", subtitle: "Acima da média nacional de 28°C", value:"30 °C"}
            ]
        }
    }
}
</script>

<style>
</style>