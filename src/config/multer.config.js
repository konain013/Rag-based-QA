const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");
const storage = multer.diskStorage({
    destination: function (req , file ,cb){
        
        cb(null , uploadDir)
    },
    filename : function (req , file , cb){
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName)
    }
})

const allowedExtensions = [ ".pdf",".docx",".xlsx",".html",".md" ];
const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/html",
  "text/markdown"
];

const fileFilter = (req , file ,cb)=>{
    const extension = path.extname(file.originalname).toLowerCase();

    const isExtensionValid = allowedExtensions.includes(extension)
    const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype)

    if(isExtensionValid && isMimeTypeValid){
        return cb(null , true)
    }
    return cb(new Error('Only PDF, DOCX, XLSX, HTML, and Markdown files are allowed'))
}
const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 10 * 1024 * 1024
    }
})
module.exports = upload;