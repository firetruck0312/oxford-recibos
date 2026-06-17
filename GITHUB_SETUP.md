# 🚀 Guía: Publicar Oxford Recibos en GitHub Pages

## ✅ Estructura actual del proyecto

```
oxford-recibos/
├── src/
│   ├── App.jsx                         # Router principal
│   ├── main.jsx                        # Entry point
│   └── components/
│       ├── oxford-recibos.jsx          # App Secretaria (iPad)
│       └── oxford-admin.jsx            # Panel Director
├── index.html                          # Template HTML
├── vite.config.js                      # Config Vite
├── package.json                        # Dependencias
├── .gitignore                          # Archivos a ignorar
└── README.md                           # Documentación
```

---

## 📝 Paso 1: Preparar tu máquina local

### Si es la PRIMERA VEZ con git:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Verifica que tengas Node.js instalado:

```bash
node --version   # Debe ser v16+
npm --version    # Debe ser npm 7+
```

---

## 🔧 Paso 2: Clonar/Descargar el proyecto

### Opción A: Si descargaste como ZIP

```bash
unzip oxford-recibos-main.zip
cd oxford-recibos
```

### Opción B: Si ya tienes la carpeta

```bash
cd ruta/a/oxford-recibos
```

---

## 📦 Paso 3: Instalar dependencias

```bash
npm install
```

Esto descargará React, Vite, y gh-pages (necesario para desplegar).

---

## 🧪 Paso 4: Probar localmente (opcional)

```bash
npm run dev
```

Se abrirá en `http://localhost:5173`. Puedes cambiar entre Secretaria y Director. ✅

Presiona `Ctrl+C` para parar.

---

## 🌐 Paso 5: Crear repositorio en GitHub

### 1. Ve a **https://github.com/new**

### 2. Llena el formulario:

| Campo | Valor |
|-------|-------|
| **Repository name** | `oxford-recibos` |
| **Description** | Sistema de Recibos de Pago - Oxford |
| **Visibility** | ✅ Public |
| **Initialize with** | ⬜ NO marques nada |

### 3. Click **Create repository**

Copiarás la URL que te muestre (algo como `https://github.com/tuusuario/oxford-recibos.git`)

---

## 💾 Paso 6: Inicializar git y hacer push

En tu terminal, dentro de la carpeta `oxford-recibos`:

### A. Inicializar repositorio local

```bash
git init
git add .
git commit -m "Initial commit: Oxford Recibos v1.0"
git branch -M main
```

### B. Conectar con GitHub y subir

```bash
git remote add origin https://github.com/TU_USUARIO/oxford-recibos.git
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu usuario real de GitHub.

✅ **Todo tu código está ahora en GitHub.**

---

## 🚀 Paso 7: Configurar GitHub Pages

### A. Actualizar vite.config.js (IMPORTANTE)

Abre `vite.config.js` y asegúrate de que tenga:

```javascript
base: '/oxford-recibos/',
```

(Con la barra al inicio y final)

```bash
git add vite.config.js
git commit -m "Configure GitHub Pages base path"
git push
```

### B. Hacer build y crear rama `gh-pages`

```bash
npm run build
npm run deploy
```

Esto:
1. ✅ Compila el código
2. ✅ Crea carpeta `dist/`
3. ✅ Sube automáticamente a rama `gh-pages`

Espera a que termine (verás "Published" al final).

### C. En GitHub, activa GitHub Pages

1. Ve a tu repo → **Settings** (engranaje arriba a la derecha)
2. Baja a **Pages** (lado izquierdo)
3. En **Source**, selecciona:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

Espera 30-60 segundos. 

✅ **Tu demo estará en: `https://tuusuario.github.io/oxford-recibos`**

---

## 🔄 Actualizar la demo (después de cambios)

Cada vez que modifiques el código:

```bash
npm run build           # Compila
npm run deploy          # Sube a gh-pages
```

O si usas un flujo más manual:

```bash
git add .
git commit -m "Update: descripción del cambio"
git push
npm run build
npm run deploy
```

GitHub Pages se actualiza en ~30 segundos.

---

## 📱 Compartir con cliente

Envía este enlace:

```
https://tuusuario.github.io/oxford-recibos
```

**Funcionalidades que verá:**
- ✅ Buscar alumnos por nombre
- ✅ Generar recibos en < 30 segundos
- ✅ Impresión (2 copias: Original + Copia Escuela)
- ✅ Dashboard con KPIs
- ✅ Gestión de alumnos
- ✅ Reporte de adeudos
- ✅ Datos de demostración (alumnos reales de Oxford)

---

## 🆘 Si algo falla

### Error: "fatal: not a git repository"

```bash
git init
```

### Error: "fatal: The remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/oxford-recibos.git
```

### Error: "npm command not found"

Instala Node.js desde https://nodejs.org (versión LTS)

### Error: "base is not defined" en build

Asegúrate que `vite.config.js` tiene:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/oxford-recibos/',  // ← Esta línea es crítica
})
```

### Demo no se ve en GitHub Pages

1. Verifica que la rama sea `gh-pages` (Settings → Pages)
2. Espera 2-3 minutos
3. Limpia cache: `Ctrl+Shift+R` (Chrome) o `Cmd+Shift+R` (Mac)

---

## 📊 Status final

Cuando todo esté bien:

```
✅ Repositorio en GitHub (rama main)
✅ Build automático funciona
✅ Rama gh-pages creada
✅ GitHub Pages activado
✅ Demo en vivo en: https://tuusuario.github.io/oxford-recibos
```

---

## 🎯 Próxima fase

Una vez que el cliente apruebe la demo:

1. Conectar **Supabase** para datos reales
2. Implementar **autenticación** (Login secretaria + director)
3. Integrar **impresora** (WiFi o USB)
4. Deploy en **producción** (Cloudflare Pages o servidor propio)

---

**¡Listo para mostrar al cliente! 🎓**

Si necesitas ayuda: revisa el README.md o contacta a Brian.
