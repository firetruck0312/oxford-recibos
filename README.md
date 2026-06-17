# Oxford Recibos 🎓

**Sistema de Recibos de Pago** para Centro Educativo Oxford de Matamoros.

Demo funcional con dos interfaces:
- **📱 App Secretaria**: Busca alumnos, genera recibos en < 30 segundos
- **💼 Panel Director**: Dashboard, gestión de alumnos, reportes de adeudos

---

## 🚀 Inicio Rápido

### 1. Clonar el repo

```bash
git clone https://github.com/TU_USUARIO/oxford-recibos.git
cd oxford-recibos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en local

```bash
npm run dev
```

Se abrirá en `http://localhost:5173`

---

## 📦 Estructura

```
oxford-recibos/
├── src/
│   ├── App.jsx                    # Router principal (selector de rol)
│   ├── main.jsx                   # Entry point
│   ├── components/
│   │   ├── oxford-recibos.jsx     # App iPad Secretaria
│   │   └── oxford-admin.jsx       # Panel Director
├── index.html                     # Template HTML
├── vite.config.js                 # Config Vite
├── package.json
└── README.md
```

---

## 🌐 Publicar en GitHub Pages

### Paso 1: Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `oxford-recibos`
3. ✅ Public
4. **NO** inicialices con README (lo haremos local)

### Paso 2: Agregar remoto local y push inicial

```bash
git add .
git commit -m "Initial commit: Oxford Recibos v1.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/oxford-recibos.git
git push -u origin main
```

### Paso 3: Configurar GitHub Pages

#### Opción A: Si el repo es **usuario.github.io** (página personal)

- El `base` en `vite.config.js` debe ser `/`
- Build automático desde `main`

```bash
npm run build && git add dist && git commit -m "Deploy v1.0" && git push
```

#### Opción B: Si el repo es **oxford-recibos** (proyecto)

1. **Actualizar `vite.config.js`:**

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/oxford-recibos/',  // ← Importante: trailing slash
})
```

2. **Hacer build y push:**

```bash
npm run build
git add -A
git commit -m "Configure GitHub Pages"
git push
```

3. **En GitHub → Settings → Pages:**
   - Source: Deploy from a branch
   - Branch: `main` / folder `/ (root)`
   - Click Save

4. **Espera 1-2 minutos** y tu demo estará en:
   ```
   https://tu-usuario.github.io/oxford-recibos
   ```

---

## 🔄 Actualizar Demo (Flujo rápido)

Cada vez que hagas cambios:

```bash
npm run build          # Compila el código
git add -A             # Agrega cambios
git commit -m "Update: tu cambio"
git push               # Sube a GitHub
```

GitHub Pages se actualiza automáticamente en ~30 segundos.

---

## 📱 Usuarios Demo

No hay login (es un prototipo). Selecciona rol al entrar:

| Rol | Qué hace |
|-----|----------|
| **Secretaria** | Busca alumno → selecciona pago → imprime recibo (2 copias) |
| **Director** | Ve KPIs, lista alumnos, perfil con historial, reporte adeudos |

---

## 🎨 Datos de Demostración

Alumnos incluidos (nombres y colegiaturas reales):
- ROBERTO CRUZ JR (PREESCOLAR)
- FRANCISCO JAVIER CASTILLO RIOS (PREESCOLAR)
- JUAN JAIR SANCHEZ PEÑA (PREESCOLAR)
- MANUEL JUAREZ HERNANDEZ (PRIMARIA)
- Y más...

Ciclo escolar: **Agosto 2025 → Junio 2026**

---

## 📋 Próximos Pasos (Fase 1)

- [ ] Conectar Supabase (auth + datos reales)
- [ ] Migrar datos desde Excel
- [ ] Implementar impresora real (WiFi/USB)
- [ ] Audit log
- [ ] Deployment en producción

---

## 📄 Archivos de Referencia

- **Base de Conocimiento**: `OXFORD_BASE_CONOCIMIENTO.md` (en repo principal)
- **Documento Funcional**: `Oxford_Comprension_Funcional.pdf`
- **Propuestas Impresión**: `Oxford_Comparativo_Propuestas.pdf`

---

## 🎯 Branding Oxford

Colores identidad:
- Verde principal: `#8DC63F`
- Verde oscuro: `#3d6010`
- Naranja acentos: `#F5A623`
- Amarillo: `#F5E642`

Fuente: **Nunito** (Google Fonts)

---

## 📧 Contacto

- **Desarrollador**: Brian (independiente)
- **Proyecto**: Oxford Recibos
- **Versión**: 1.0 · Junio 2026

---

## 📜 Licencia

Privado — Centro Educativo Oxford

---

**¡Demo lista para mostrar al cliente!** 🚀
