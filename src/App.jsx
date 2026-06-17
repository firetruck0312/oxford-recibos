import { useState } from 'react'
// 1. Importamos tus componentes reales desde la carpeta components
import OxfordRecibos from './components/oxford-recibos'
import OxfordAdmin from './components/oxford-admin'

export default function App() {
  const [rol, setRol] = useState(null)

  if (!rol) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3d6010 0%, #8DC63F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Nunito', sans-serif"
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <svg width="80" height="80" viewBox="0 0 100 100" style={{ marginBottom: '24px' }}>
            <circle cx="50" cy="50" r="50" fill="#8DC63F" />
            <g transform="translate(50,50) rotate(45)">
              <rect x="-22" y="-22" width="44" height="44" rx="7" fill="#F5A623" />
              <rect x="-22" y="-22" width="22" height="22" rx="5" fill="#3d6010" />
              <rect x="0" y="0" width="22" height="22" rx="5" fill="#F5E642" />
              <rect x="-22" y="0" width="22" height="22" rx="5" fill="#F5E642" />
              <rect x="0" y="-22" width="22" height="22" rx="5" fill="#3d6010" />
            </g>
            <circle cx="50" cy="50" r="10" fill="#fff" />
            <circle cx="50" cy="53" r="5" fill="#8DC63F" />
          </svg>

          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#111c06', marginBottom: '8px' }}>
            OXFORD RECIBOS
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px', marginTop: '8px' }}>
            Demo v1.0
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => setRol('secretaria')}
              style={{
                padding: '16px',
                background: '#8DC63F',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              📱 SECRETARIA
            </button>
            <button
              onClick={() => setRol('admin')}
              style={{
                padding: '16px',
                background: '#3d6010',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              💼 DIRECTOR
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 2. Aquí es donde ocurre la magia: dependiendo del rol, mostramos la interfaz correspondiente
  return (
    <div style={{ background: '#f0f7e8', minHeight: '100vh', position: 'relative' }}>
      
      {/* Botón flotante para regresar al menú principal por si quieres cambiar de rol */}
      <button 
        onClick={() => setRol(null)} 
        style={{ 
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 9999,
          padding: '10px 20px', 
          background: '#3d6010', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        ← Salir / Volver
      </button>

      {/* 3. Condición para renderizar el componente adecuado */}
      {rol === 'secretaria' ? <OxfordRecibos /> : <OxfordAdmin />}
      
    </div>
  )
}