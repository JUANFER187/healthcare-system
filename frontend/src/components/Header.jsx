import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);  // ← ESTADO CORRECTO
  const [isHovered, setIsHovered] = useState(false);
  const [toggleMenuAnimation, setMenuAnimation] = useState(false);


  // Paleta de colores
  const colors = {
    primary: '#F6F3ED',
    secondary: '#C2CBD3', 
    accent: '#0f1a24ff',
    lightText: '#6b7380ff'
  };

  const toggleMenu = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    setMenuAnimation(newState); // Mismo estado para ambos
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header style={{
        backgroundColor: colors.accent,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: colors.secondary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: colors.accent,
            fontSize: '18px'
          }}>
            🏥
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0,
            cursor: 'pointer'
          }} onClick={() => navigate('/dashboard')}>
            Mediturno
          </h1>
        </div>

        {/* Botón Menú Hamburguesa Animado - CORREGIDO */}
        <button
          onClick={toggleMenu}  // ← DEBE LLAMAR A toggleMenu
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            boxShadow: isHovered ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
          }}
>
          <div style={{
            width: '24px',
            height: '24px',
            position: 'relative'
          }}>
            {/* Línea superior - ANIMACIÓN CORREGIDA */}
            <div style={{
              position: 'absolute',
              top: sidebarOpen ? '11px' : '4px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: sidebarOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transformOrigin: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
            
            {/* Línea media - ANIMACIÓN CORREGIDA */}
            <div style={{
              position: 'absolute',
              top: '11px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              opacity: sidebarOpen ? 0 : 1,
              transform: sidebarOpen ? 'scaleX(0)' : 'scaleX(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
            
            {/* Línea inferior - ANIMACIÓN CORREGIDA */}
            <div style={{
              position: 'absolute',
              top: sidebarOpen ? '11px' : '18px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: sidebarOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
              transformOrigin: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
          </div>
        </button>
      </header>

      {/* Resto del componente... */}
    </>
  );
};

export default Header;