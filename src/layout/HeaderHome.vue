<template>
    <header class="row home__box_header">
        <v-row style="width:100%">

            <!-- Logo -->
            <v-col cols="4" md="4" class="d-flex justify-center align-center" style="margin-right:5.0em;">
                <router-link :to="{ name: 'Home' }">
                    <img width="70%" style="-webkit-filter: drop-shadow(3px 3px 4px rgba(0,0,0,0.3))"
                        src="@/assets/logos/urbverde-logo-white.png" /></router-link>
            </v-col>

            <!-- Sobre -->
            <v-col class='menu'>
                <router-link  :to="{ name: 'About' }"><a>Sobre</a></router-link>
            </v-col>

            <!-- Blog -->
            <!-- <v-col class='menu'>
                <router-link  :to="{ name: '' }"><a>Blog</a></router-link>
            </v-col>
             -->
            <!-- Downloads https://drive.google.com/drive/folders/1LRnTUDsZLIa0LSwGOA0AMCEl9uK0QfcW?usp=sharing" target=”_blank” -->
            <v-col class='menu'>
                <a href="#" 
                    >Downloads</a>
            </v-col>

            <!-- Contato -->
            <v-col class='menu'>
                <router-link :to="{ name: 'Contato' }">Contato</router-link>
            </v-col>


            
            <!-- CTA - Acesse a Plataforma -->
            <v-col >
                <router-link
                    :to="{ name: 'Mapa', params: { id: this.munId || 3548906, ano: 2021, escala: 'intraurbana', categoria: 'pracasparques', }, }"
                    style="padding: 12px; display: inline-block; background-color: #00494A;
                            border-radius: 5px; padding-left: 2em; padding-right: 2em; margin-left:1.5em;white-space: nowrap;">
                    <a>Acesse a Plataforma</a>
                </router-link>
            </v-col>
        </v-row>
    </header>
</template>

<script>
export default {
  data() {
    return {
      munId: null, // Initialize munId property
    };
  },
}
</script>

<style lang="scss" scoped>

header {
    padding: 2em 6em;
    font-size: 1em;
}

.menu {
    text-align: center;
    align-self: center;
    border-radius: 5px;
    display: block;
}

.menu:hover {
    font-weight: bold;
    background-color: #00494A;
}

a {
    text-decoration: none;
    color: #e6f1f2 !important;
    // border-bottom: 3px solid #003c3c;
    // -webkit-filter: drop-shadow(5px 5px 7px rgba(0,0,0,0.6));
}


</style>
