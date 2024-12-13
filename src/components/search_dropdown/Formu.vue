<template>
    <form class="my-20 mx-auto max-w-2xl">
        <AddressFieldGroup
            v-model:street="form.deliveryAddress.street"
            v-model:streetNumber="form.deliveryAddress.streetNumber"
            v-model:postcode="form.deliveryAddress.postcode"
            v-model:city="form.deliveryAddress.city"
        />
    </form>
</template>

<script>
import { ref } from 'vue';
import AddressFieldGroup from './AdressFieldGroup.vue';

export default {
    name: "FormComponent",
    components: {
        AddressFieldGroup
    },
    setup() {
        const form = ref({
            deliveryAddress: {
                street: '',
                streetNumber: '',
                postcode: '',
                city: '',
            },
        });

        return { form };
    }
}
</script>
