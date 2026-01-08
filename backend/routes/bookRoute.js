// routes/bookRoute.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createBook, getBooks, deleteBook } from '../controllers/bookController.js';

const bookRouter = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

bookRouter.post('/', upload.single('image'), createBook);
bookRouter.get('/', getBooks);
bookRouter.delete('/:id', deleteBook);

export default bookRouter;
