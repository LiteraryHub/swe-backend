const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Replace the uri string with your MongoDB Atlas connection string
const uri = "mongodb+srv://khaledbahaa2012:a0RycYZtfXQnRfqB@cluster0.oli8qgt.mongodb.net/";
const client = new MongoClient(uri);

// Multer configuration for temporary file storage
const upload = multer({ dest: 'tmp/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust according to your needs
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    console.log('POST request received');
    upload.single('pdfFile')(req, res, async (error) => {
      if (error instanceof multer.MulterError) {
        console.error(`Multer Error: ${error.message}`);
        return res.status(400).json({ error: error.message });
      } else if (error) {
        console.error(`Upload Error: ${error}`);
        return res.status(500).json({ error: 'Failed to process file upload' });
      }

      const pdfFile = req.file;
      if (!pdfFile) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log(`Processing file: ${pdfFile.originalname}`);

      try {
        await client.connect();
        console.log('Connected to MongoDB Atlas.');

        const db = client.db('Grad');
        const bucket = new GridFSBucket(db, { bucketName: 'Book_Data' });

        console.log(`Uploading file: ${pdfFile.originalname} to GridFS`);
        const readStream = fs.createReadStream(pdfFile.path);
        const uploadStream = bucket.openUploadStream(pdfFile.originalname);

        readStream.pipe(uploadStream);

        uploadStream.on('finish', async () => {
          console.log(`File uploaded to GridFS with ID: ${uploadStream.id}`);
          fs.unlinkSync(pdfFile.path); // Clean up the temporary file
          res.status(200).json({ message: 'File uploaded successfully to GridFS', fileId: uploadStream.id });
          await client.close(); // Moved inside the 'finish' event
          console.log('MongoDB connection closed');
        });

        uploadStream.on('error', async (error) => {
          console.error(`Error uploading file to GridFS: ${error}`);
          res.status(500).json({ error: 'Failed to upload file to GridFS' });
          await client.close(); // Ensure connection closes on error
          console.log('MongoDB connection closed');
        });
      } catch (error) {
        console.error(`Error saving file to MongoDB: ${error}`);
        res.status(500).json({ error: 'Failed to save file to MongoDB' });
        await client.close(); // Ensure connection closes on catch
        console.log('MongoDB connection closed');
      }
    });
  } else {
    console.log('Method not allowed');
    res.status(405).json({ error: 'Method not allowed' });
  }
}
