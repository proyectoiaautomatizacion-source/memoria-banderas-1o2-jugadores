---
inclusion: always
---

# Tech Steering

## Stack

| Capa | Tecnología | Versión objetivo |
|---|---|---|
| Runtime | Node.js | 20 LTS o superior |
| Build tool | Vite | 5.x |
| UI | React | 18.x |
| Estilos | Tailwind CSS | 3.x |
| Animación | Framer Motion | 11.x |
| Confeti | canvas-confetti | 1.9.x |
| Pruebas unitarias | Vitest + React Testing Library | 2.x / 16.x |
| Pruebas de propiedades | fast-check | 3.x |
| Lenguaje | JavaScript (JSX) | ES2022 |

No se usa TypeScript en este MVP, aunque el diseño lo menciona en pseudotipos: la implementación es JS plano con JSDoc opcional. No se introduce ningún framework adicional de estado (Redux, Zustand, MobX) ni router (react-router). El cambio de pantalla se maneja con un campo `screen` en el estado global.

## Dependencias

Producción:

```
react
react-dom
framer-motion
canvas-confetti
```

Desarrollo:

```
vite
@vitejs/plugin-react
tailwindcss
postcss
autoprefixer
vitest
@testing-library/react
@testing-library/jest-dom
jsdom
fast-check
```

Cualquier dependencia adicional debe justificarse contra el requisito que resuelve y evitar duplicar capacidades ya cubiertas por las anteriores.

## Pruebas

- Framework: Vitest con entorno `jsdom`.
- Librería de aserciones de DOM: `@testing-library/jest-dom`.
- Ubicación: junto al archivo probado (`*.test.jsx` / `*.test.js`) o en `src/**/__tests__/`.
- Cobertura mínima esperada: lógica de generación de tablero, comparación de pares, cambio de turno, determinación de ganador, persistencia.
- Los tests no deben hacer peticiones reales a REST Countries API: se mockea `fetch`.

## Comandos

```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo (puerto por defecto 5173)
npm run dev

# Compilar para producción
npm run build

# Previsualizar el build
npm run preview

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## Seguridad

- No se manejan credenciales ni tokens: REST Countries API es pública y sin autenticación.
- No se inyecta HTML crudo: las banderas se renderizan como `<img src>` y los textos se escapan por React.
- No se permite agregar `dangerouslySetInnerHTML` ni `eval` sin justificación explícita.
- No se añaden secretos al repositorio: si en algún punto se integra un servicio con clave, se usa variable de entorno prefijada por `VITE_` y se documenta en `.env.example`.

## Restricciones

- **SPA sin backend:** toda la lógica vive en el cliente. No se introduce servidor, API propia ni base de datos.
- **Sin routing:** el cambio de pantalla es por estado, no por URL.
- **Sin TypeScript:** el proyecto es JS + JSX.
- **Persistencia exclusiva en `sessionStorage`:** no se usa `localStorage`, cookies ni IndexedDB.
- **No ampliar alcance:** ver `product.md` para la lista de límites del producto.

## Integraciones

| Servicio | Tipo | Uso | Autenticación |
|---|---|---|---|
| REST Countries API (`https://restcountries.com/v3.1/all`) | REST público | Obtener banderas y nombres de países | Ninguna |

La integración se hace con `fetch()` nativo + `AbortController` para timeout. Los resultados se cachean en `sessionStorage` bajo `memoria-banderas-flags` para evitar llamadas repetidas dentro de la misma sesión de navegador.

## Referencias

- Diseño técnico completo: `#[[file:../specs/memoria-banderas/design.md]]`
