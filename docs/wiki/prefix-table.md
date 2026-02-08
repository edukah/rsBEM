# Utility Prefix Tablosu

rsBEM v2 Layer 3 (Utility) için onaylanan prefix sistemi.

## Final Tablo

| Kategori | Prefix | Örnekler |
|----------|--------|----------|
| Display | `d-` | d-flex, d-grid, d-table, d-block, d-none |
| Flex | `flex-` | flex-center, flex-col, flex-gap-md |
| Grid | `grid-` | grid-cols-2, grid-cols-3, grid-auto-fit |
| Padding | `padding-` | padding-sm, padding-md, padding-y-sm |
| Margin | `margin-` | margin-sm, margin-md, margin-t-sm |
| Text | `text-` | text-center, text-upper, text-nowrap |
| Font Size | `fsi-` | fsi-12, fsi-14, fsi-16 |
| Font Weight | `fwe-` | fwe-regular, fwe-semibold |
| Font Family | `ffa-` | ffa-sans, ffa-mono |
| Width | `w-` | w-full, w-auto, w-fit |
| Height | `h-` | h-full, h-auto, h-screen |
| Image | `img-` | img-responsive, img-circle |
| Theme Color | `tc-` | tc-pri-500, tc-danger-500, tc-text-dark-1 |
| Theme BG | `tbc-` | tbc-pri-100, tbc-grey-300 |
| Position | `pos-` | pos-relative, pos-absolute, pos-sticky |
| Z-index | `z-` | z-10, z-50, z-max |
| Overflow | `ovf-` | ovf-hidden, ovf-auto, ovf-x-auto |
| Cursor | `cursor-` | cursor-pointer, cursor-default |
| User-select | `sel-` | sel-none, sel-all |
| Visibility | `vis-` | vis-hidden--md-up, vis-show--lg-down |

## Tasarım Kararları

### Neden kısa prefix'ler? (w-, h-, z-)
Sık kullanılan utility'ler HTML'de çok tekrarlanıyor. Kısa prefix'ler okunabilirliği artırıyor:
```html
<div class="d-flex w-full h-screen">  <!-- vs d-flex width-full height-screen -->
```

### Neden uzun prefix'ler? (padding-, margin-, cursor-)
Nadir kullanılan veya tek harfle anlamsız olacak kategorilerde açıklık öncelikli:
```html
<div class="padding-sm margin-y-md cursor-pointer">
```

### Font neden 3 ayrı prefix?
`fsi-` (size), `fwe-` (weight), `ffa-` (family) — tek `font-` prefix'i belirsizlik yaratır:
- `font-14` → size mi? weight mi?
- `fsi-14` → açıkça font-size: 14px

### Değişiklik Geçmişi
İlk versiyondan farklılaşan satırlar:
- Display: `ds-` → `d-` (daha kısa, Bootstrap ile uyumlu)
- Width: `width-` → `w-` (sık kullanım, kısalık)
- Height: `height-` → `h-` (sık kullanım, kısalık)
- Z-index: `zin-` → `z-` (gereksiz uzunluk)
- Overflow: `ov-` → `ovf-` (overflow ile daha net bağlantı)
