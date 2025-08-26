# MultiLayerPopup

Este é um novo popup que exibe informações de múltiplas camadas simultaneamente quando o usuário passa o mouse sobre o mapa.

## Características

- **Query de múltiplas camadas**: Usa `queryRenderedFeatures` para pegar todas as features sob o mouse
- **Suporte a camadas vetoriais e raster**: Inclui dados de camadas vetoriais (incluindo parques) e raster (via WMS)
- **Ordenação por activeLayers**: Ordena as informações conforme a ordem definida no `layersStore.activeLayers`
- **Estilo simples**: Popup branco com opacidade e design limpo
- **Configuração automática**: Usa as configurações de `LAYER_CONFIGS` para exibir propriedades e unidades
- **Debounce**: Evita muitas requisições simultâneas com debounce de 150ms
- **Cache**: Cache de valores raster para evitar requisições repetidas
- **Performance**: Popup aparece imediatamente com dados vetoriais, raster carrega em background

## Como funciona

1. **Inicialização**: O popup é criado e inicializado após o setup das camadas em `SetupLayers.js`
2. **Eventos**: Escuta eventos de `mousemove` e `mouseleave` no mapa
3. **Query**: Para cada movimento do mouse, faz query de todas as camadas ativas
4. **Filtragem**: Filtra apenas features que têm configuração válida e valores não nulos
5. **Renderização imediata**: Mostra popup com dados vetoriais instantaneamente
6. **Busca raster em background**: Para camadas raster, faz requisições WMS sem bloquear a interface
7. **Cache**: Armazena valores raster para evitar requisições repetidas
8. **Atualização**: Atualiza popup com dados raster quando disponíveis
9. **Ordenação**: Ordena as features conforme a ordem em `activeLayers`

## Estrutura do HTML gerado

```html
<div class="popup-content">
  <div class="popup-layer-item">
    <div class="popup-layer-title">Nome da Camada</div>
    <div class="popup-layer-value">
      <strong>Valor Unidade</strong>
    </div>
  </div>
  <!-- Mais itens para outras camadas... -->
</div>
```

## Configuração necessária

Para que uma camada apareça no popup, ela deve ter:

1. **ID válido** em `LAYER_CONFIGS`
2. **Label** para exibição
3. **Estar ativa** no `layersStore.activeLayers`

### Para camadas vetoriais:
- **Propriedade definida** (`property` field)
- **Unidade de medida** (`unit` ou `popup.unit`)

### Para camadas raster:
- **Tipo raster** (`type: 'raster'`)
- **Unidade de medida** (`unit` ou `popup.unit`)

## Exemplo de configuração de camada

### Camada vetorial:
```javascript
// Em LAYER_CONFIGS
{
  id: 'temperatura',
  type: 'vector',
  label: 'Temperatura',
  property: 'temp_value',
  unit: '°C',
  popup: {
    label: 'Temperatura',
    unit: 'graus Celsius',
    format: (v) => v.toFixed(1)
  }
}
```

### Camada raster:
```javascript
// Em LAYER_CONFIGS
{
  id: 'ndvi',
  type: 'raster',
  label: 'Vigor da Vegetação (NDVI)',
  unit: '%',
  popup: {
    label: 'NDVI',
    unit: '',
    format: (v) => v.toFixed(2)
  }
}
```

### Camada de parques:
```javascript
// Em LAYER_CONFIGS
{
  id: 'parks',
  type: 'vector',
  label: 'Praças',
  property: 'nm_praca',
  popup: {
    label: 'Praça',
    unit: '',
    format: (v) => v || 'Praça'
  }
}
```

## Uso

O popup é inicializado automaticamente após o setup das camadas. Não é necessário chamar manualmente.

```javascript
// Em SetupLayers.js
const multiLayerPopup = createMultiLayerPopup(map);
if (multiLayerPopup) {
  multiLayerPopup.initialize();
}
```

## Estilos CSS

O popup inclui estilos CSS inline para:
- Fundo branco com opacidade
- Bordas arredondadas
- Sombra suave
- Tipografia legível
- Separação entre itens de camada

