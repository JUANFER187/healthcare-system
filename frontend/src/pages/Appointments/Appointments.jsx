import React, { useState } from 'react';
import AppointmentList from '../../components/AppointmentList';
import CreateAppointment from '../../components/CreateAppointment';
import Header from '../components/Header'; 

const Appointments = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <>
    <Header />
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                📅 Mis Citas
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: 0
              }}>
                Gestiona todas tus citas médicas en un solo lugar
              </p>
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              ➕ Nueva Cita
            </button>
          </div>
        </div>

        {/* Lista de Citas */}
        <AppointmentList 
          compact={false}
          showHeader={false}
          limit={null}
        />

        {/* Modal para crear cita */}
        {showCreateForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <CreateAppointment
                onAppointmentCreated={() => {
                  setShowCreateForm(false);
                  window.location.reload(); // Recargar para ver la nueva cita
                }}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Appointments;