<template>
    <v-row>
        <vue-resizable :w="columnWidth" class="resizable-column" @resizing="updateColumnWidth">
        a
        </vue-resizable>

        <v-col cols="12" md="9">
        b
        </v-col>
    </v-row>
</template>

<script>
import VueResizable from 'vue-resizable';

export default {
    components: {
        VueResizable
    },
    data() {
        return {
            columnWidth: 300 // Initial width
        };
    },
    methods: {
        updateColumnWidth(width) {
            this.columnWidth = width;
        }
    }
};
</script>

<style>
.resizable-column {
    border-right: 2px solid #ccc;
}
</style>