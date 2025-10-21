import React, { useState } from 'react';
import apiService from '../services/apiService';

const CustomerSearch = () => {
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const onSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!customerId.trim()) {
      setError('Ingresa un documento/ID para buscar');
      return;
    }
    try {
      setLoading(true);
      const res = await apiService.getCustomerById(customerId.trim());
      setResult(res.data || null);
    } catch (err) {
      setError('Cliente no encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Buscar cliente</h2>
      <form onSubmit={onSearch} className="form-grid" style={{ marginBottom: 16 }}>
        <label>Documento / ID
          <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="Ej: 12345678" />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="details-grid">
          <div><strong>Documento:</strong> {result.document}</div>
          <div><strong>Nombres:</strong> {result.firstname}</div>
          <div><strong>Apellidos:</strong> {result.lastname}</div>
          <div><strong>Dirección:</strong> {result.address}</div>
          <div><strong>Teléfono:</strong> {result.phone}</div>
          <div><strong>Email:</strong> {result.email}</div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                try {
                  localStorage.setItem('editCustomerId', result.document || '');
                } catch {}
                window.location.href = '/users/edit';
              }}
            >
              Editar este cliente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;


