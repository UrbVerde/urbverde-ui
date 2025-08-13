// urbverde-ui/src/utils/bootstrapTooltips.js
import { Tooltip } from 'bootstrap';

export function initializeTooltips() {
  // Initialize all tooltips on the page
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl, {
    delay: { show: 300, hide: 100 },
    trigger: 'hover',
    animation: true,
    container: 'body',
    boundary: 'window'
  }));
}

/**
 * Destroi todos os tooltips existentes para evitar duplicação
 */
export function destroyAllTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].forEach(tooltipTriggerEl => {
    const tooltip = Tooltip.getInstance(tooltipTriggerEl);
    if (tooltip) {
      tooltip.dispose();
    }
  });
}

/**
 * Reinicializa todos os tooltips (destroi os existentes e cria novos)
 */
export function reinitializeTooltips() {
  destroyAllTooltips();
  initializeTooltips();
}

/**
 * Função para usar em componentes Vue após mudanças no DOM
 * Aguarda o nextTick e reinicializa os tooltips automaticamente
 * @param {Function} nextTick - Função nextTick do Vue
 */
export async function reinitializeTooltipsAfterDOMUpdate(nextTick) {
  await nextTick();
  reinitializeTooltips();
}

/**
 * Função para usar em componentes Vue que precisam reinicializar tooltips
 * após mudanças reativas (watchEffect, computed, etc.)
 * @param {Function} nextTick - Função nextTick do Vue
 * @param {Function} callback - Callback opcional a ser executado antes da reinicialização
 */
export async function handleReactiveTooltipUpdate(nextTick, callback = null) {
  if (callback) {
    await callback();
  }
  await reinitializeTooltipsAfterDOMUpdate(nextTick);
}

// Initialize tooltips when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeTooltips();
});

/*
EXEMPLOS DE USO:

1. Em watchEffect (mudanças reativas):
```javascript
import { handleReactiveTooltipUpdate } from '@/utils/bootstrapTooltips';

watchEffect(async () => {
  // Suas mudanças reativas aqui
  await handleReactiveTooltipUpdate(nextTick);
});
```

2. Em funções que modificam o DOM:
```javascript
import { reinitializeTooltipsAfterDOMUpdate } from '@/utils/bootstrapTooltips';

async function minhaFuncao() {
  // Modifica o DOM
  await reinitializeTooltipsAfterDOMUpdate(nextTick);
}
```

3. Com callback personalizado:
```javascript
import { handleReactiveTooltipUpdate } from '@/utils/bootstrapTooltips';

await handleReactiveTooltipUpdate(nextTick, async () => {
  // Seu código personalizado aqui
  await algumaOperacao();
});
```

4. Reinicialização manual:
```javascript
import { reinitializeTooltips } from '@/utils/bootstrapTooltips';

// Reinicializa todos os tooltips
reinitializeTooltips();
```
*/
