import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const multerConfig = {
  // Destino de los archivos
  dest: './uploads/routing-sheets',
  
  // Configuración de almacenamiento
  storage: diskStorage({
    destination: './uploads/routing-sheets',
    filename: (req, file, callback) => {
      // Generar un nombre único para el archivo
      const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
      callback(null, uniqueSuffix);
    },
  }),
  
  // Filtros de archivo
  fileFilter: (req, file, callback) => {
    // Permitir solo ciertos tipos de archivo
    if (!file.mimetype.match(/\/(pdf|jpeg|jpg|png|doc|docx)$/)) {
      return callback(new Error('Archivo no soportado. Solo se permiten PDF, imágenes y documentos Word.'), false);
    }
    callback(null, true);
  },
  
  // Límite de tamaño (5MB)
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB en bytes
  },
};