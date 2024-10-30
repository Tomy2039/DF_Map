import React, { useState } from 'react';

const MarkerForm = ({ position, onClose, onAddMarker }) => {
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddMarker({ lat: position.lat, lng: position.lng, description });
        setDescription(''); // Limpiar el campo de descripción después de agregar el marcador
    };

    return (
        <div className="absolute top-0 left-0 z-10 p-4 bg-white shadow-lg rounded-lg w-80">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    placeholder="Descripción del marcador"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
                />
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Agregar Marcador
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MarkerForm;
