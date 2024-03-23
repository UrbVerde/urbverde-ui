<template>
    <!-- NEWSLETTER FUNCIONANDO -->
    <div class="pl-4 pr-4">
        <v-row style="align: center;">

            <v-col cols="12" md="6" style="align-self: center; margin-top: 10px">
                <p style="font-size: 32px; color: #003c3c;">
                    <strong>Fique por dentro das atualizações da Urbverde </strong>
                </p>
                <p style="font-size: 17px; color: #003c3c;">
                    Receba instruções, conteúdos e atualizações do projeto por e-mail.
                </p>
            </v-col>

            <v-col cols="12" md="6" style="align-self: center; margin-top: 10px;">
                <form method="POST" class="mt-4"
                    action="https://script.google.com/macros/s/AKfycbz65DYp3YkIOry7fe6QEKXqULEWVMIUkiMLVbwR6umHN4Tyca0XPd09kGMnY9H7C02bHA/exec"
                    style="max-width: 100%;"
                    target="_blank">

                    <v-row class="d-flex justify-center align-center">
                        <input name="Os" type='hidden' id="Os" :value="getNavigator.os">
                        <input name="Device" type='hidden' id="Device" :value="getNavigator.device">
                        <input name="Browser" type='hidden' id="Browser" :value="getNavigator.browser">
                        <input name="Url" type='hidden' id="Url" :value="getUrl">

                        <v-col cols="12" md="8">
                            <v-text-field hide-details dense outlined v-model="email" :rules="emailRules" label="E-mail"
                                required name="Email"></v-text-field>
                        </v-col>

                        <v-col cols="auto">
                            <v-btn regular color="#01DC82" class="mb-0" type="submit">
                                &nbsp; Assinar &nbsp;
                            </v-btn>
                        </v-col>

                        <v-checkbox v-model="checked" :rules="checkedRules"
                            label="Eu concordo com o recebimento de e-mails da UrbVerde" required name="Agree"
                            style="margin: 0; padding: 0;"></v-checkbox>
                    </v-row>

                </form>
            </v-col>

        </v-row>
    </div>
</template>

<script>

export default {
    props: {
    },
    data() {
        return {
            email: "",
            emailRules: [
                v => !!v || 'E-mail is required',
                (v) => /.+@.+/.test(v) || "E-mail precisa ser válido",
            ],
            checkedRules: [],
            checked: false,
        };
    },
    computed: {
        getUrl() {
            return String(window.location.href);
        },
        getNavigator() {
            var userAgent = navigator.userAgent;
            var deviceRegex = /\((.*?)\)/;
            var deviceMatch = userAgent.match(deviceRegex);
            var device = deviceMatch ? deviceMatch[1].split(';')[0].trim() : 'Unknown Device';
            var osRegex = /(Windows NT \d+\.\d+|Mac OS X \d+(?:[._]\d+)*|Android \d+(?:[._]\d+)*|Linux [\w\d\s]+)(?=\)|$)/;
            var osMatch = userAgent.match(osRegex);
            var os = osMatch ? osMatch[1] : 'Unknown OS';
            var browserRegex = /(Chrome|Firefox|Safari|Opera|Edge)\/([\d\.]+)/;
            var browserMatch = userAgent.match(browserRegex);
            var browser = browserMatch ? browserMatch[1] : 'Unknown Browser';
            var browserVersion = browserMatch ? browserMatch[2] : 'Unknown Version';
            return {
                device: decodeURIComponent(device),
                os: decodeURIComponent(os),
                browser: decodeURIComponent(browser + ' ' + browserVersion)
            };
        }
    }, methods: {
        // setActiveButton(button) {
        //     if (button.id !== this.activeButtonId) {
        //         const previousActiveButton = this.buttons.find(
        //             (btn) => btn.id === this.activeButtonId
        //         );
        //         previousActiveButton.isActive = false;
        //         button.isActive = true;
        //         this.activeButtonId = button.id;
        //     }
        // },
    },

    watch: {
    },

    async created() {
        await this.getUserCity();
    },

    destroyed() {
    },
};
</script>

<style lang="scss" scoped></style>
