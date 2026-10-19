import multer from "multer";
import path from 'path';

// Penyimpanan sementara di memory rom
const storage =multer.memoryStorage();

const fileFilter = (req, file, cb ) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
        return cb(new Error("yang diinput hanya bisa berformat gambar (.jpg, .jpng, .png"))

    }
    cb(null, true)


}

const upload = multer({ storage, fileFilter})

export default upload