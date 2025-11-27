import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Star, MapPin, Phone, Clock, Heart, Search } from 'lucide-react';

const Clinics = () => {
  const [professionals, setProfessionals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');

  useEffect(() => {
    loadProfessionals();
    loadFavorites();
  }, []);

  const loadProfessionals = async () => {
    try {
      const data = await userService.getProfessionals();
      setProfessionals(data);
    } catch (error) {
      console.error('Error loading professionals:', error);
      // Datos mock temporalmente
      setProfessionals([
        {
          id: 1,
          first_name: 'Juan',
          last_name: 'Pérez',
          specialty: 'Cardiología',
          license_number: 'LM-12345',
          phone_number: '+1234567890',
          address: 'Av. Principal 123, Consultorio 401',
          rating: 4.8,
          reviews_count: 45,
          availability: 'Lun-Vie: 8:00 AM - 6:00 PM'
        },
        {
          id: 2,
          first_name: 'María',
          last_name: 'García',
          specialty: 'Dermatología',
          license_number: 'LM-67890',
          phone_number: '+1234567891',
          address: 'Calle Secundaria 456, Consultorio 205',
          rating: 4.9,
          reviews_count: 32,
          availability: 'Lun-Sáb: 9:00 AM - 5:00 PM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    // Temporal - después conectar con backend
    const savedFavorites = JSON.parse(localStorage.getItem('favorite_professionals') || '[]');
    setFavorites(savedFavorites);
  };

  const toggleFavorite = (professionalId) => {
    const newFavorites = favorites.includes(professionalId)
      ? favorites.filter(id => id !== professionalId)
      : [...favorites, professionalId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorite_professionals', JSON.stringify(newFavorites));
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = 
      `${prof.first_name} ${prof.last_name} ${prof.specialty} ${prof.address}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = 
      !filterSpecialty || prof.specialty === filterSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  const specialties = [...new Set(professionals.map(p => p.specialty))];

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid #3b82f6',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem auto'
        }}></div>
        <p>Cargando consultorios...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          🏥 Consultorios y Profesionales
        </h1>
        <p style={{ color: '#6b7280' }}>
          Encuentra y guarda tus profesionales de salud favoritos
        </p>
      </div>

      {/* Filtros y Búsqueda */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            backgroundColor: 'white',
            fontSize: '0.875rem',
            minWidth: '200px'
          }}
        >
          <option value="">Todas las especialidades</option>
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Profesionales */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {filteredProfessionals.map(professional => {
          const isFavorite = favorites.includes(professional.id);
          
          return (
            <div
              key={professional.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              {/* Botón Favorito */}
              <button
                onClick={() => toggleFavorite(professional.id)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isFavorite ? '#ef4444' : '#d1d5db',
                  transition: 'color 0.2s'
                }}
              >
                <Heart size={20} fill={isFavorite ? '#ef4444' : 'transparent'} />
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '1.5rem',
                alignItems: 'start'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {professional.first_name[0]}{professional.last_name[0]}
                </div>

                {/* Información Principal */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    margin: '0 0 0.5rem 0'
                  }}>
                    Dr. {professional.first_name} {professional.last_name}
                  </h3>
                  
                  <p style={{ 
                    color: '#3b82f6', 
                    fontWeight: '500',
                    margin: '0 0 1rem 0',
                    fontSize: '1rem'
                  }}>
                    {professional.specialty}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {professional.address}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={16} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {professional.phone_number}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {professional.availability}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating y Acciones */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '1rem',
                  minWidth: '120px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginBottom: '0.25rem',
                      justifyContent: 'center'
                    }}>
                      <Star size={16} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>
                        {professional.rating}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      ({professional.reviews_count} reseñas)
                    </span>
                  </div>

                  <button
                    onClick={() => window.location.href = `/professional/${professional.id}`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    Ver Perfil
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProfessionals.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <Search size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
            No se encontraron profesionales
          </h3>
          <p style={{ color: '#6b7280' }}>
            Intenta con otros términos de búsqueda o filtros diferentes
          </p>
        </div>
      )}
    </div>
  );
};

export default Clinics;