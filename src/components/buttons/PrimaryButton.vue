<!-- Exemplo de Uso
    <PrimaryButton 
      label="Cancelar"
      :filled="false"
      :icon="logo"
      iconPosition="right"
    />

    Deve importar a imagem no local para utilizar, Vite não cosegue carregar dinamicamente a imagem.    
-->

<template>
    <button
        class="primary-button"
        :class="{ 'filled': filled, 'notFilled': !filled}"
    >
        <!-- Ícone no lado esquerdo -->
        <span v-if="icon && iconPosition === 'left'" class="icon">
            <img :src="icon" alt="icon" />
        </span>
            
        <!-- Texto do botão -->
        {{ label }}
            
        <!-- Ícone no lado direito -->
        <span v-if="icon && iconPosition === 'right'" class="icon">
            <img :src="icon" alt="icon" />
        </span>
    </button>
</template>

<script>
    export default{
        name: "PrimaryButton",
        props: {
            label: {
                type: String,
                default: "Primary Button"
            },
            filled: {
                type: Boolean,
                default: true,
            },
            icon: {
                type: String, // Caminho ou URL do ícone
                default: null,
            },
            iconPosition: {
                type: String, // Define a posição do ícone: "left" ou "right"
                default: "left", 
                validator: (value) => ["left", "right"].includes(value),
            },
        },
    };

</script>

<style scoped>

    .primary-button{
        width: 261px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        gap: 6px;        
        transition: all 0.1s ease-in-out;
    }

    .icon img {
        width: 16px; 
        height: 16px;
        margin-top: -4px;
    }

    .filled {
        border: none;
        background: radial-gradient(48.28% 48.28% at 51.72% 100%, #146C43 0%, #198754 100%);
        box-shadow: 0px 0px 2px 0px rgba(255, 255, 255, 0.25) inset;

        font-size: 16px;
        color: #FFFF;
    }

    .filled:hover {
        background: radial-gradient(48.28% 48.28% at 51.72% 100%, #0D5232 0%, #15774A 100%);
        box-shadow: 0px 0px 2px 0px rgba(255, 255, 255, 0.25) inset;

    }

    .notFilled {
        border: 1px solid var(--Green-500, #198754);
        background-color: #FFF;
        color: #146C43;
    }

    .notFilled:hover {
        border: 3px solid var(--Green-500, #198754);
        box-shadow: 0px 0px 2px 0px rgba(255, 255, 255, 0.25) inset;
    }
</style>