
import uploadImage from '../services/uploadService.js';



async function uploadImageController(req, res) {
  // Access the uploaded file using req.file
  const uploadedFile = req.file;


    const image = await uploadImage(uploadedFile);


  res.status(200).json({
    message: 'Image uploaded successfully',
    file: uploadedFile,
    imageId: image.imageId,
    jobId: image.jobId,
  });
}

export default uploadImageController;