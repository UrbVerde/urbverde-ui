<!-- urbverde-ui/src/components/homepage/TawkTo.vue -->
<template>
  <div></div>
</template>

<script>
export default {
  name: 'TawkTo',

  // Script do TawkTo
  mounted() {
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/665004409a809f19fb344c19/1huk917ia';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
  },
};
</script>

  <style scoped>
  </style>
