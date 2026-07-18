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

const allowedExtensions =[".jpeg" , ".png" ,".pdf" ,".jpg" ]
const allowedMimeTypes =["image/jpeg" ,"image/jpg" , "image/png","application/pdf"]

const fileFilter = (req , file ,cb)=>{
    const extension = path.extname(file.originalname).toLowerCase();

    const isExtensionValid = allowedExtensions.includes(extension)
    const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype)

    if(isExtensionValid && isMimeTypeValid){
        return cb(null , true)
    }
    return cb(new Error('Only JPG, JPEG , PNG and PDF files are allowed'))
}
const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 5 * 1024 * 1024
    }
})
module.exports = upload;