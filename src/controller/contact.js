const Contact = require("../model/contact"); // ✅ This should match the model export

const createContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const newMessage = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getContact = async (req, res) => {
  try {
    const allMessages = await Contact.find();
    res.status(200).json({ success: true, data: allMessages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createContact,
  getContact,
};
