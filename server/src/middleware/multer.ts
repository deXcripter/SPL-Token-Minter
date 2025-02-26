import multer from "multer";
import path from "path";

const upload = multer({
  dest: path.resolve(__dirname, "../../public/uploads"),
});

export default upload;
