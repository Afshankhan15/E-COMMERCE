import multer from "multer";
import { v4 as uuid } from "uuid"; // to generate random ID
// multer().single("file")
const storage = multer.diskStorage({
  destination(req, res, callback) {
    callback(null, "uploads"); // destination ---> uploads folder
  },
  // each file name should be unique that's why we use uuid
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(".").pop(); // file.originlname = uploads\mb.jpg ---> split(".") --> ['uploads\mb', 'png]  --> pop element is last element of array whhich is ---> png
    const fileName = `${id}.${extName}`;
    callback(null, fileName);
  },
});
export const singleUpload = multer({ storage }).single("photo"); // req.file.photo
