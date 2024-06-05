const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      select: {
        documentTitle: true,
        address: true
      }
    });
    const formattedDocuments = documents.map(document => ({
      title: document.documentTitle,
      address: document.address
    }));
    res.status(200).json(formattedDocuments);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

module.exports = { getAllDocuments };