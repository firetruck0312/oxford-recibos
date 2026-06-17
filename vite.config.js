import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Si publicarás en tu propio dominio, usa '/'. 
// Si será en GitHub Pages (usuario.github.io/oxford-recibos), descomenta la línea:
 const base = '/oxford-recibos/'

export default defineConfig({
  plugins: [react()],
  base: '/', // Cambiar a '/oxford-recibos/' si lo publicas en una subruta
})
