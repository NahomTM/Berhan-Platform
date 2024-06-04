const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const pdf = require("pdf-parse");

// Function to get the content type based on file extension
const getFileContentType = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "pdf":
      return "application/pdf";
    case "ppt":
    case "pptx":
      return "application/vnd.ms-powerpoint";
    case "doc":
    case "docx":
      return "application/msword";
    case "txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
};

// Function to get a specific file by ID
const getFile = async (req, res) => {
  try {
    const fileId = parseInt(req.params.id);

    // Retrieve file information from the database based on the provided ID
    const file = await prisma.InstructorUploads.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Read the file from the file system
    const filePath = path.join(__dirname, "../", file.filePath);
    const fileStream = fs.createReadStream(filePath);

    // Set the appropriate content type based on the file extension
    const contentType = getFileContentType(file.fileName);
    res.setHeader("Content-Type", contentType);

    // Pipe the file stream to the response object
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ message: "Error retrieving file" });
  }
};

// Function to handle file upload and store path in PostgreSQL
const uploadFileAndTextToSpeech = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User information missing" });
  }

  const documentTitle = req.body.documentTitle;
  const userId = req.user.id;

  try {
    // Upload the file
    const fileName = req.file.originalname;
    const filePath = `/uploads/${req.file.filename}`;

    let dataBuffer = fs.readFileSync(path.join(__dirname, "../", filePath));
    let text = await pdf(dataBuffer); // This will extract text from the PDF

    // Store or process the extracted text
    // For example, let's log it to the console for now
    console.log(text.text); // 'text.text' because pdf-parse returns an object with the text property

    const newFile = await prisma.InstructorUploads.create({
      data: {
        fileName,
        filePath,
        userId,
      },
    });

    const docId = newFile.id;

    // Set up text-to-speech request parameters
    const encodedParams = new URLSearchParams();
    encodedParams.set("voice_code", "en-US-1");
    encodedParams.set("text", text.text);
    encodedParams.set("speed", "1.00");
    encodedParams.set("pitch", "1.00");
    encodedParams.set("output_type", "audio_url");

    const options = {
      method: "POST",
      url: "https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "cloudlabs-text-to-speech.p.rapidapi.com",
      },
      data: encodedParams,
    };

    console.log("API key: ", process.env.RAPID_API_KEY);

    // Call text-to-speech API
    const response = await axios.request(options);
    const audioUrl = response.data.result.audio_url;

    // Generate a new filename with an audio extension
    const audioFileName = `${path.parse(fileName).name}.mp3`;

    await downloadAudio(audioUrl, audioFileName)
      .then(() => {
        console.log("Audio file downloaded and saved successfully.");
      })
      .catch((error) => {
        console.error("Failed to download the audio file:", error);
      });

    // Save document information and audio URL to the database
    await prisma.document.create({
      data: {
        userId,
        documentTitle,
        address: audioUrl,
        docId,
      },
    });

    // Respond to the client
    res.status(200).json({
      message:
        "File uploaded and text-to-speech conversion completed successfully",
      file: newFile,
      audioUrl: audioUrl,
    });
  } catch (error) {
    console.error(
      "Error during file upload and text-to-speech conversion:",
      error
    );

    // Check if headers are already sent before sending a response
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Error during file upload and text-to-speech conversion.",
      });
    }
  }
};

const downloadAudio = async (url, filename) => {
  try {
    // Path where the file will be saved
    const filePath = path.join(__dirname, "../uploads", filename);

    // Request the audio file from the URL
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    // Create a write stream to save the file
    const writer = fs.createWriteStream(filePath);

    // Pipe the response data to the file
    response.data.pipe(writer);

    // Return a promise that resolves when the file is fully written
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading the audio file:", error);
    throw error;
  }
};


// Function to retrieve a file's information from the database

const getUploads = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploads = await prisma.InstructorUploads.findMany({
      where: { userId },
    });
    res.json(uploads);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ message: "Error retrieving file" });
  }
};

const deleteUpload = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.InstructorUploads.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
};

const getAudio = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Assuming prisma is properly imported and initialized
    console.log("Id is: ", id);
    const uploads = await prisma.instructorUploads.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!uploads) {
      // If the upload with the given ID is not found
      return res.status(404).send('File not found');
    }

    const audioFileName = `${path.parse(uploads.fileName).name}.mp3`;
    const filePath = path.join(__dirname, '../uploads', audioFileName);

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  } catch (error) {
    // Handle any potential errors
    console.error('Error retrieving audio:', error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
  uploadFileAndTextToSpeech,
  getUploads,
  getFile,
  deleteUpload,
  getAudio,
};
