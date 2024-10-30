import Marker from '../models/markerModel.js';
import cloudinary from '../db/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear un nuevo marcador
export const createMarker = async (req, res) => {
  const { lat, lng, name, description, category, useCloudinary } = req.body;

  if (!lat || !lng || !name || !description || !category) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    let imageUrl = '';
    let audioUrl = '';

    // Subir archivos a Cloudinary si se usa esta opción
    if (useCloudinary === 'true' && req.files) {
      if (req.files.image) {
        const imageResult = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: 'markers' });
        imageUrl = imageResult.secure_url;
        fs.unlinkSync(req.files.image.tempFilePath); // Eliminar archivo temporal
      }
      if (req.files.audio) {
        const audioResult = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
          folder: 'markers/audios',
          resource_type: 'video', // Para audio
        });
        audioUrl = audioResult.secure_url;
        fs.unlinkSync(req.files.audio.tempFilePath); // Eliminar archivo temporal
      }
    }

    const newMarker = new Marker({
      location: { lat, lng },
      name,
      description,
      category,
      image: imageUrl,
      audio: audioUrl,
    });

    await newMarker.save();
    res.status(201).json(newMarker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los marcadores
export const getMarkers = async (req, res) => {
  try {
    const markers = await Marker.find();
    res.status(200).json(markers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un marcador existente
export const updateMarker = async (req, res) => {
  const { name, description, category, useCloudinary } = req.body;
  
  if (!name || !description || !category) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    let updatedFields = { ...req.body }; // Los campos actualizados

    // Manejar subida de archivos en la actualización
    if (useCloudinary === 'true' && req.files) {
      if (req.files.image) {
        const imageResult = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: 'markers' });
        updatedFields.image = imageResult.secure_url;
        fs.unlinkSync(req.files.image.tempFilePath); // Eliminar archivo temporal
      }
      if (req.files.audio) {
        const audioResult = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
          folder: 'markers/audios',
          resource_type: 'video',
        });
        updatedFields.audio = audioResult.secure_url;
        fs.unlinkSync(req.files.audio.tempFilePath); // Eliminar archivo temporal
      }
    }

    const updatedMarker = await Marker.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.status(200).json(updatedMarker);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el marcador', error });
  }
};

// Eliminar un marcador
export const deleteMarker = async (req, res) => {
  try {
    await Marker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Marcador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el marcador', error });
  }
};
