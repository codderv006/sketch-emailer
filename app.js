const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files (including styles.css)
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle file upload and send email
app.post('/upload', upload.array('files'), (req, res) => {
    const { email } = req.body;
    
    if (!email || !req.files || req.files.length === 0) {
        return res.status(400).send('Invalid request. Make sure you provide an email and select at least one file.');
    }

    const attachments = req.files.map(file => ({
        filename: file.originalname,
        content: file.buffer,
    }));

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sketchyxcv@gmail.com',
            pass: 'kfbv nmbr axpc vcjj'
        }
    });

    const mailOptions = {
        from: 'sketchyxcv@gmail.com', // replace with your email
        to: email,
        subject: 'File from Sketchy gesture art app',
        text: 'Check out the what you\'ve designed: ',
        attachments: attachments,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

