# Recursos isométricos / Isometric resources

> Estilo aprobado como **barra de calidad** (DESIGN.md `motifs.isometric`, v1.50.0, hero del sitio
> Elaniin 2027). Un recurso isométrico **explica cómo encajan las piezas** (un stack, un flujo, una
> arquitectura). Alcance: heroes y secciones cuyo contenido es lo bastante complejo como para que una
> imagen lo explique mejor que el texto. Nunca decoración, nunca dentro de cards o listas.
> Las escenas de producto 2D (cases) significan "así se ve el producto"; el isométrico significa
> "así encajan las piezas".

| Quiero… | Usa |
|---|---|
| Landing / HTML autocontenido | `templates/iso-stack.js` (vanilla) + `<div data-iso-stack>` |
| Next.js / React | `templates/iso/` (`HeroStack`, `Slab`, `Floor`, `iso.ts`, `use-clock.ts`) |
| Un recurso nuevo (otro flujo o stack) | el kit (`ElaniinIso` o `iso/`) + la receta de la sección 9 |

## 1 · Fundamentos CSS (lo que SÍ es CSS)

Casi no hay "hoja de estilos": el estilo son **propiedades de SVG escritas en línea con tokens vía
`var()`**. Funciona porque el SVG está **en línea** en el HTML y hereda las variables CSS (un SVG
cargado con `<img>` no las vería).

1. **Colores solo de tokens**, en el elemento: `style="fill:var(--color-blue-100);fill-opacity:.78;stroke:var(--color-excellence-blue)"`.
   Nunca hex.
2. **Lenguaje de trazo:** líneas de 1 px con `stroke-linejoin: round`; caras de vidrio con
   `fill-opacity` .78 (AI .82); sin degradados, sin `box-shadow`, sin sombras CSS.
3. **Apilado de capas con CSS de layout:** contenedor `relative w-full`; cada capa es un SVG
   `absolute inset-0 block h-full w-full` con **el mismo `viewBox`**; el alto lo da el SVG de la sombra
   (`block h-auto w-full`) por la proporción del `viewBox`. La pieza va en un `div` con `iso-levitate`.
4. **Vidrio esmerilado (frost):** un `div` bajo cada losa con
   `clip-path: polygon(6 puntos de la silueta en % del viewBox)` y `backdrop-filter: blur(14px)`.
   Como todas las capas comparten caja y `viewBox`, los % coinciden con el dibujo. Cuando la losa se
   desliza, el frost se mueve con `transform: translate(%, %)`.
5. **Animación = 3 keyframes**, todas con `animation: none` bajo `prefers-reduced-motion`:
   `rise` (entrada, escalonada con `--i`), `iso-levitate` (6 px, 3 s, alternate) e `iso-float`
   (4 px, 2 s, alternate, `animation-delay: calc(var(--d) * 400ms)`).
6. **Excepción al "sin desenfoque":** el blur existe **solo dentro del recurso**: el frost (14 px) y
   el halo del pulso (`feGaussianBlur stdDeviation 3`, filtro de SVG). Nunca llega al fondo de la
   página, al texto ni a otro componente. No hay degradados.

**Tokens como variables siempre emitidas:** el recurso lee `var(--color-*)` desde estilos en línea y JS, no
desde utilidades. Tailwind v4 **poda las variables de `@theme` que ninguna utilidad usa**, y un `var()` ausente
renderiza **negro sin avisar** (las losas salían negras). Por eso `tokens.css` declara `@theme static`
(el bloque principal). En un proyecto Next con el `@theme` del sitio, declara `@theme static` o garantiza que esas
variables se emitan.

**Tokens que usa** (ya existen en `templates/tokens.css`): software `blue-tint-50 / blue-100 /
blue-200`; AI `blue-800 / excellence-blue / blue-active-dark`; cloud `surface-subtle / border-default /
border-strong`; placa y riser `white / blue-tint-50 / blue-100`; texturas `blue-400`, `white`,
`border-input`; línea y detalle `excellence-blue`, `elevate-blue`, `text-on-dark-accent`,
`border-on-dark-strong`; sombra y etiqueta `surface-subtle`, `blue-300`, `text-primary`, `font-display`.

## 2 · Lo que NO es CSS (igual de obligatorio)

- **Proyección y geometría:** el atributo `transform="matrix(...)"` del SVG y los `points`,
  calculados con la matemática de `iso.ts`. `project`: `X = ox + (x − y)·cos30°`,
  `Y = oy + (x + y)/2 − z`. Plano horizontal a altura z:
  `translate(0 −z) matrix(cos30 .5 −cos30 .5 ox oy)`.
- **El reloj de 12 s es JavaScript:** una función de `t` que calcula la posición del pulso, el largo
  de los brazos, el desplazamiento y la opacidad de cada losa. Corre cada 50 ms, **solo mientras la
  escena está en pantalla** (IntersectionObserver).
- **El movimiento principal lo escribe JS** en atributos del SVG y en `transform` / `opacity` en línea
  en cada tick. **No hay transiciones CSS** en ese movimiento.
- **Reduced motion:** el reloj queda en `t = 11999`, el estado ensamblado: nada se desliza, flota ni viaja.

## 3 · Las 15 reglas

1. **Proyección:** isométrico verdadero, ejes a 30°, un solo ángulo en todo el sitio.
2. **Construcción:** SVG en línea, sin motor 3D ni imágenes, con el kit (proyección, losa, sombra).
3. **Vidrio:** losas esmeriladas (sección 1.4). **Cada entidad tiene su color definido**, tomado de la
   línea visual que el sistema ya tiene para ella. Excellence Blue y Elaniin Black son para líneas y
   detalles, nunca para el cuerpo de una losa, con **una excepción por recurso**: una entidad cuyo color
   de marca es Excellence Blue (AI) puede serlo. Las demás son el azul principal y su rampa, o gris,
   para que la pieza no se lea seria y pesada.
4. **Textura** fina en la cara superior, que lleva la identidad: software cuadritos de 3 u cada 12
   (`blue-400` 60%); AI cuadrícula hairline cada 12 (blanco 14%); cloud líneas cada 10 (`border-input` 50%).
   Sin panel de brillo ni color suave bajo las caras.
5. **Excepción del blur** (sección 1.6). No hay degradados.
6. **Elevate Blue es un detalle:** pulso, borde superior encendido, iconos de las etiquetas, marcadores
   de puerto pequeños y, **solo en este recurso**, el logotipo azul sobre la losa de software
   (`logotipo-elaniin-blue.svg`, 3.96:1 sobre su cara, 88 u de ancho). Prohibido en otro uso.
7. **Estructura:** nada flota en el aire. Cada línea está unida a una estructura y dice de dónde vienen
   las piezas. Placa de vidrio como base; un riser (columna fina) a la izquierda alimenta cada losa por
   un **brazo** horizontal a su altura media. Las losas escalonan (230, 160, 90 u de ancho, misma
   profundidad) para dejar visible una franja de cada cara superior, donde va su etiqueta; las caras
   izquierdas comparten un plano. Un pulso recorre un trazo en la placa, sube por el riser y en cada nivel
   se divide en el brazo de esa losa; **cada trayecto termina exactamente donde empieza el siguiente**.
8. **Levitación y sombra:** la pieza queda 36 u sobre su sombra (rombo plano `surface-subtle`, algo más
   chico que la placa, sin cuadrícula ni blur) y flota 6 px en ciclos de 3 s (`iso-levitate`); la sombra
   se queda en el suelo.
9. **Énfasis:** cuando un pulso llega a una losa, se desliza 28 u hacia adelante en x (el brazo se
   telescopa con ella para no desprenderse) y su borde superior se enciende; las demás bajan a 60% de
   opacidad. Luego vuelve.
10. **Etiquetas:** pastilla blanca de 38 u de alto con el icono de la entidad (los tres oficiales de Elaniin para software, AI y cloud;
    Lucide genérico de 20 u para cualquier otro; **nunca el logo de una marca de terceros**) y su nombre corto (Instrument Sans 500, 15 u), tendida
    sobre la franja visible de la cara superior y leyendo hacia arriba a la derecha. Flota 4 px (`iso-float`).
11. **Texto en la escena:** solo el logotipo (nunca el símbolo) y las etiquetas de la regla 10.
12. **Movimiento:** un reloj por escena, bucle de 12 s, solo en pantalla. Ensamble único con `rise`
    (de abajo hacia arriba, 120 ms de escalón). Línea de tiempo en la sección 5.
13. **Accesibilidad:** decorativo, `aria-hidden`, nada enfocable; el texto de la sección lleva el significado.
14. **Responsive:** `viewBox` fijo que escala a su contenedor. Por debajo de 1024 px va centrado bajo el
    texto centrado, limitado a 560 px, sin recortarse.
15. **Costo:** tres blur recortados y unas pocas formas; ~18.5 ms por frame en desktop de desarrollo.
    **Mídelo en un teléfono antes de publicar**; si pesa, vuelve a un solo SVG y quita el frost.

## 4 · Geometría exacta (la escena del hero)

`viewBox` `67 30 640 500`; origen `O = (400, 246)`; `LIFT = 36`; profundidad de las losas `D = 200`.

| Pieza | x, y | z | ancho (w) · prof. (d) · alto (h) |
|---|---|---|---|
| Placa | −90, −30 | 0 | 350 · 260 · 12 |
| Riser | −68, 192 | 12 | 16 · 16 · 200 |
| Cloud | 0, 0 | 12 | 230 · 200 · 40 |
| Software | 0, 0 | 72 | 160 · 200 · 80 |
| AI | 0, 0 | 172 | 90 · 200 · 40 |

El brazo de cada losa sale de `RISER_X = −52` a la altura media `z + h/2`. El trazo en la placa va de
`(260, 218)` a `(−52, 218)` y a `(−52, 200)`, a `z = 12`. Etiqueta: largo `56 + 9·letras`.
Logotipo: sesgo `matrix(cos30 −0.5 0 1 e f)` sobre la cara derecha de software.

## 5 · Línea de tiempo (ms, bucle de 12 000)

- Trazo en la placa: 1000 → 2000.
- Por losa (R = inicia la subida del riser, B = inicia el brazo, A = llega): R₀ = 2000; B = R + 900;
  A = B + 1000; la siguiente losa empieza su R en la B de la anterior (se solapan).
- Cada A: sube 700 (ease) · se mantiene 900 · baja 700. Actividad total ≈ 8 s, luego reposo.
- `opacidad de las demás = 1 − 0.4 · énfasis · (1 − env)`.

## 6 · Uso

**HTML autocontenido (landing):**
```html
<div data-iso-stack data-software="Software" data-ai="AI" data-cloud="Cloud"></div>
<!-- la página lleva <symbol id="elaniin-logo-blue"> (landing.html ya lo trae), tokens.css y: -->
<script src="iso-stack.js"></script>   <!-- o pega su contenido en un <script> al final del body -->
```
El hero **split** (texto izquierda, recurso derecha desde 1024 px; centrado debajo; lead de máx. 40ch
bajo 1024 px; `h1` de máx. 12ch) está en `templates/landing.html`. El hero centrado sigue siendo la otra
variante oficial cuando no hay recurso visual.

**React / Next:**
```tsx
import { HeroStack } from "@/components/iso/hero-stack";   // copia templates/iso/ a src/components/iso/
<HeroStack labels={{ software: "Software", ai: "AI", cloud: "Cloud" }} />
```
Necesita `lucide-react`, `tokens.css` (`rise`, `iso-levitate`, `iso-float`) y copiar
`assets/logotipo-elaniin-blue.svg` a `public/assets/`.

## 7 · API del kit (`window.ElaniinIso` / `templates/iso/`)

`project(p3, origin)` · `pointsAttr(points3, origin)` · `planeTransform(origin, z)` ·
`pointAt(polyline, progress)` · `clamp01` · `easeInOut` · `slabSvg(look, box, origin)` (`look`:
`software | ai | cloud | brand | plate | dark`) · `floorSvg(origin, x, y, w, d, z)` · `topFace(box)` ·
`mountStack(host, labels)`. En React: `Slab`, `Floor`, `IsoPill` (+ `pillLength`; `check` añade la marca verde), `IsoPulse` + `HaloFilter`, `IsoLogotipo` (`tone` blue|black, `face` right|top), `SCENE_W` (418) y `useClock(periodMs)`.

**Íconos (v1.87):** las pills de software, AI y cloud llevan los tres íconos oficiales de Elaniin (`assets/icons/`, `iso/elaniin-icons.tsx`), dibujados al 90 % con el trazo dividido por 0.9; cualquier otra pill usa Lucide genérico, nunca el logo de una marca de terceros.

**Looks extra (v1.55–v1.60, solo en el kit React por ahora):** `brand` = Elaniin mismo (rampa azul 200/300/400 con módulos blancos; lleva el logotipo en Elaniin Black, 6.4:1; nunca Elevate Blue ni Excellence Blue, que es de AI). `dark` = vidrio claro para superficies oscuras (caras blancas al 12 % top, 7 % izquierda, 18 % derecha, borde `border-on-dark-strong`, sin textura, sin frost ni diamante de sombra; la pill se queda blanca; único acento Elevate Blue).

## 8 · Lo que cambia entre recursos

La **estructura** depende de la información que comunica. Lo que **no cambia** es la calidad y las
reglas: la misma proyección, vidrio, frost, textura, etiquetas, levitación, sombra y movimiento.

**Reglas añadidas (v1.71):** las escenas de una misma familia comparten el ancho del viewBox (`SCENE_W` 418) para que pills y texto tengan la misma escala; el lienzo de escenas pequeñas es 448×336 (viewBox `-24 -18 448 336`); el frost solo se usa donde el vidrio se superpone a algo que se vería a través (si no, cuesta blur sin ganar nada); las escenas pequeñas se limitan a 320px bajo 1024px; el frost nunca va sobre texto.

## 9 · Receta para un recurso nuevo

a. **Define primero** qué información debe comunicar y cuáles son sus piezas y flujos.
b. **Constrúyelo** con el mismo kit y reglas; el color de cada entidad sale del sistema (su línea visual
   ya definida), no se inventa.
c. **Comprueba** que ninguna línea flota y que cada trayecto de movimiento es continuo.
d. **Verifica** a 375, 768, 1024 y 1280 px, el contraste de cada texto y logo, y reduced motion.
e. **Espera aprobación** antes de aplicarlo en otro lugar.

## Checklist

- [ ] Una sola proyección a 30°; SVG en línea; colores solo `var(--color-*)`.
- [ ] Frost 14 px recortado a la silueta; blur solo dentro del recurso; sin degradados.
- [ ] Color propio por entidad; Excellence Blue solo si es el color de marca de la entidad.
- [ ] Logotipo azul solo sobre la losa de software; sin símbolo; sin logos de terceros.
- [ ] Nada flota; trayectos continuos; reloj único de 12 s, pausado fuera de pantalla.
- [ ] Reduced motion: estado ensamblado, sin movimiento. `aria-hidden`.
- [ ] Probado en teléfono (costo) y a 375 / 768 / 1024 / 1280.

## 10 · Escenas listas del sitio (`templates/iso/scenes/`, DESIGN.md `motifs.engagement-scenes`, `components.audience-routes`, `components.solutions-grid`, hero)

Copiar de aquí en vez de redibujar. Todas: SVG en línea con el kit, decorativas (`aria-hidden`), un reloj (`useClock`) que corre solo en pantalla, estado final en reduced-motion, cada trayecto termina exactamente donde empieza el siguiente, nada flota en el aire. Las etiquetas vienen del diccionario (tipos en `scenes/types.ts`). Verificar a 375/768/1024/1280, contraste de cada par texto/logotipo y reduced-motion; esperar aprobación antes de reutilizar una escena nueva.

| Escena | Archivo | Qué explica / cómo se mueve |
|---|---|---|
| **Engagement · Staff augmentation** ("conoces a cada uno por su nombre") | `engagement` → `staff-scene.tsx` | base de vidrio, tres losas caen una tras otra (1.0 s, luego cada 1.0 s) en su carril; cada una enciende su borde al aterrizar y lleva una pill blanca con un nombre de ejemplo; se mantienen y se desvanecen al final del loop |
| **Engagement · Dedicated teams** ("un equipo completo alrededor de un producto") | `team-scene.tsx` | losa central alta con borde Elevate Blue y cuatro losas pequeñas en las esquinas; un pulso recorre las cuatro esquinas, vuelta tras vuelta. Sin texto |
| **Engagement · Project delivery** ("del descubrimiento al lanzamiento") | `project-scene.tsx` | tres escalones de altura creciente; un pulso sube por las cimas del primero al tercero, que enciende su borde y espera antes de reiniciar. Sin texto |
| Reglas de las tres | | superficie OSCURA: look `dark` (vidrio blanco 12/7/18 %, borde `border-on-dark-strong`, sin textura, sin frost, sin diamante); la pill sigue blanca; único acento Elevate Blue; canvas 448×336, dibujada a 230 px (1024) – 340 px (1280); su reloj corre solo mientras su card está abierta |
| **Rutas · Escala tu equipo** | `audience-routes` → `staff-visual.tsx` | una losa azul claro con la pill "your team" y un hueco; una losa ancha de la rampa con el logotipo entra y se acopla, enciende su borde (el equipo crece) |
| **Rutas · Moderniza un sistema crítico** | `modernization-visual.tsx` | losa legacy gris y moderna azul claro, cuatro cubos que migran uno a uno (se vuelven azules al aterrizar) mientras un pulso cruza ambas cada 2.5 s sin detenerse (la operación nunca para); al final la legacy baja a 50 % y la moderna se enciende |
| **Rutas · Software que corre tu negocio** | `software-visual.tsx` | el producto se construye por capas: contorno punteado del producto terminado; caen DATA (look cloud), LOGIC (software) e INTERFACE (brand), 1.2 s entre sí; al aterrizar la interfaz aparece la pill "Your product" con check. Huella según la longitud de la pill, 22 unidades por capa, loop 12 s |
| **Rutas · Software crítico** | `critical-visual.tsx` | un núcleo alto (software, 56) CRECE; cuatro muros bajos (look brand, 16 de alto) suben en sentido horario, 500 ms entre sí, cada uno enciende su borde, hasta cerrar el anillo; aparece la pill "Critical" con escudo + check. Los muros frente al núcleo se dibujan después (una valla) |
| **Rutas · Impacto en la población** | `impact-visual.tsx` | un servicio que ALCANZA personas: placa cuadrada de 210 con un bloque bajo atrás y la pill "Service"; nueve nodos ciudadanos tendidos sobre el plano en L a lo largo de los dos bordes frontales (4 + 4 + 1 compartido, a 20 unidades del borde); tres ondas (anillos en el plano, Elevate Blue, 1 s entre sí, 2.4 s cada una) salen del bloque; cada nodo se enciende al llegarle la primera onda y se queda encendido |
| **Rutas · Alta disponibilidad** | `availability-visual.tsx` | dos gemelos (Primary y Backup) y un tráfico que no para; un nodo de usuarios envía pulsos por una línea en el suelo (cada 0.7 s) al primario con check; a los 4.8 s el PRIMARIO FALLA (se atenúa a blanco 50 %, pierde el check, los pulsos en camino desaparecen), a los 5.2 s la línea al BACKUP toma el relevo (más rápido, 0.45 s: demanda pico) y este se enciende y recibe su check. La falla se muestra atenuando, nunca con los colores de estado |
| (Rutas · público) | `public-visual.tsx` | ya no la usa ningún ítem; se conserva hasta que el equipo decida |
| Reglas de las seis | | cada placa se dimensiona al mismo span que las dos originales (ancho + profundidad ≈ 446 unidades) mientras las pills conservan el tamaño de la familia; se dibujan al 90 % del ancho de su stage; las nuevas se elevan en el viewBox para quedar centradas verticalmente; la línea entre isométrico y texto queda a la misma altura en las tres cards (subgrid, dos filas compartidas); en español la pill "Servicio" es más larga: ≥15 unidades entre el bloque y cada nodo en ambos idiomas |
| **Soluciones · AI delivery** | `solutions` → `delivery-visual.tsx` | cuatro tiras de vidrio sobre una base oscura (tests, review, staging, production), cada una con su pill blanca; un pulso cruza el borde frontal y cada tira enciende su borde y muestra el check de su pill; la última se mantiene, luego fade y reinicio |
| **Soluciones · Software** | `product-visual.tsx` | pila de tres niveles que se construye capa a capa, el más ancho primero (platform), luego web app, luego mobile; cada tira lleva una pill; look `software` con diamante de sombra |
| **Soluciones · Cloud** | `cloud-visual.tsx` | una barra larga de vidrio (look cloud) con la pill "Availability" y a su lado doce cubos pequeños (las instancias) que caen uno a uno, tres columnas × cuatro filas, a medida que crece la demanda; cada uno enciende su borde al aterrizar |
| Reglas de las tres | | viewBox del MISMO ancho (`SCENE_W` 418; los de ruta 448) para que pill, texto y losa tengan el mismo tamaño; `overflow: visible` en las que caen desde arriba; sobre 320 px bajo 1024 px y centradas; nunca hacer zoom a una escena para llenar su card; comprobar la altura del texto de la pill contra sus hermanas |
| **Hero · propuesta 1** (mejorado) | `hero` → `hero-stack-plus.tsx` | ver `components.md` §2 |
| **Hero · propuesta 2** (modernización a escala hero) | `hero-modernization.tsx` | monolito legacy (112 → 40, un paso por cubo) y torre moderna (52 → 140, pisos de 28 con bandas, el último piso encendido), base de dos peldaños, ondas de notificación (tres anillos en el plano, 280 ms entre sí, Elevate Blue) al llegar a la cima; sin logotipo ni mástil |

Detalles de piezas: pill con check verde (`status.success.dot`) al final cuando corresponde (la pill reserva el espacio); los nodos y fichas del suelo se dibujan EN el plano en perspectiva (discos = elipses, íconos sesgados con el plano, nunca planos sobre la pantalla); iconos de capacidades en el suelo (no repetir los tres de las soluciones): Team (users), Review (git pull request), Security (shield check), Data (database), Release (rocket), nodos Apps (smartphone) y Performance (gauge); logotipo Elaniin sobre la losa `brand` en Elaniin Black (6.4:1); el logotipo azul solo en la losa de software del hero (3.96:1). Las propuestas del hero con ventana de navegador recortada (propuesta 3) y las escenas de producto de los casos son contenido del sitio de Elaniin (ver `components.md` §2 y §9).
