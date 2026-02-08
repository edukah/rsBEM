# Mimari Kararlar

rsBEM naming convention tasarım kararları.

## 3-Layer Sistemi
- **Layer 1 (Template/rsBEM):** `folder-file__element--modifier` — tek template'e ait
- **Layer 2 (Component/BEM):** `block__element--modifier` — paylaşılan UI bileşenleri
- **Layer 3 (Utility):** `prefix-value` — tek amaçlı yardımcı sınıflar
- Layer 4 (Framework) önerildi ve **reddedildi** — proje-spesifik BEM bileşenleri zaten Layer 2'ye giriyor

## Spacing Axis Convention: `lr` → `x`, `tb` → `y`
Padding ve margin'de çift yön kısaltmaları:
- `lr` (left+right) → `x` olarak değiştirildi
- `tb` (top+bottom) → `y` olarak değiştirildi
- Tek yön kısaltmaları (`t/b/l/r`) aynen kalıyor

Hiyerarşi:
- Hepsi: `padding-sm`
- Eksen: `padding-x-sm`, `padding-y-md`
- Tek yön: `padding-t-sm`, `padding-l-md`

**Gerekçe:** `x/y` sektör standardı (Tailwind, Bootstrap). Daha kısa ve evrensel.

## Spacing Scale: Semantic Kalacak
`sm/md/lg` yerine `1/2/3` numeric scale önerildi ve **reddedildi**.
- rsBEM'de açıklık öncelikli (`padding-` vs `p-` kararıyla tutarlı)
- `padding-sm` okuyan herkes ne olduğunu anlar, `padding-2` için scale tablosuna bakmak lazım
- 5 kademe yetmezse `2xs`, `2xl`, `3xl` ile genişletilebilir

## Float Utility'leri
`.fl-l`, `.fl-r` korundu. `.clear` silindi — flexbox ile gereksiz hale geldi.

## State Convention: `is-*` / `has-*`
JS tarafından toggle edilen dinamik durumlar için ayrı bir konvansiyon. Layer 1 ve Layer 2 içinde kullanılır.

**Gerekçe:** BEM modifier'ları (`--`) statik varyantlar için tasarlandı (danger, lg, top). Dinamik durumlar (açık/kapalı, seçili, yükleniyor) kavramsal olarak farklı. `is-*` prefix'i:
1. JS tarafını temiz tutar: `classList.add('is-open')` vs `classList.add('block__element--open')`
2. Scope güvenli: SCSS'te `&.is-open {}` olarak bileşen bloğu içinde tanımlanır
3. Anlamsal ayrım sağlar: "ne tür" (variant) vs "ne oluyor" (state)
4. Yaygın konvansiyon: SMACSS, ITCSS, Bootstrap

**Prefix'ler:**
- `is-*` — elementin kendi durumu: `is-open`, `is-visible`, `is-selected`, `is-loading`, `is-entering`, `is-leaving`
- `has-*` — elementin içerdiği bir şey: `has-error`, `has-children`

## Animation Prefix: `anim-`
Utility prefix kategorisi. CSS transition/animation efektleri için:
- `anim-fade` — opacity transition
- `anim-fade` + `is-visible` — active state

## Theme Layer (Renk Prefix'leri)
**Yeni prefix'ler:**
- `tc-` (theme color) — text/foreground renkleri: `tc-pri-500`, `tc-danger-500`, `tc-text-dark-1`
- `tbc-` (theme background color) — arka plan renkleri: `tbc-pri-100`, `tbc-grey-100`

**Brand renk kısaltması:**
- `theme-1` → `pri` (primary)
- `theme-2` → `sec` (secondary)
- `theme-3` → `ter` (tertiary)
