// backend/utils/multer.js
import multer from 'multer';

// Esto le dice a multer que guarde los archivos en memoria temporalmente
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limita el tamaño del archivo a 5MB
  }
});

export default upload;