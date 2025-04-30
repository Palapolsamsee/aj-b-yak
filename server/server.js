import cors from 'cors';
import express from 'express';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

// Serve the "public" folder statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


const express = require('express');
const bodyParser = require('body-parser');
const FormData = require('form-data');
const axios = require('axios');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
// LINE API endpoint
app.post('/api/line-image', async (req, res) => {
    try {
        const { base64Image } = req.body;

        // Validate
        if (!base64Image || !base64Image.startsWith('data:image/')) {
            return res.status(400).json({ message: 'Invalid base64 image' });
        }

        // Extract data
        const matches = base64Image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ message: 'Malformed base64 string' });
        }

        const mimeType = matches[1];
        const extension = mimeType.split('/')[1];
        const imageData = matches[2];
        const buffer = Buffer.from(imageData, 'base64');

        // Save to file
        const filename = `image_${Date.now()}.${extension}`;
        const filePath = path.join(__dirname, 'public/uploads', filename);
        fs.writeFileSync(filePath, buffer);

        // Public URL
        const imageUrl = `http://localhost:3000/uploads/${filename}`;

        // Send to LINE
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ddDlPU8oh4WOICrS4lvdlrfKAB1qeHOMAMPIeeA/C5+9YyAjfMzFVikzytBqejwVGB1zCRp0dLwchAJIsDIRPk+oPCfXgnJTm5doRnqT3VmPc/NL4+Bbjh4RU50+oAuytavXBYYTZpyUokBQNW7jswdB04t89/1O/w1cDnyilFU=`
            },
            body: JSON.stringify({
                to: "U4eb05e7c181038411c3e83b6ebad1b36",
                messages: [
                    {
                        type: 'image',
                        originalContentUrl: imageUrl,
                        previewImageUrl: imageUrl
                    }
                ]
            })
        });

        const data = await response.json();
        res.json({ message: 'Image sent', data });

    } catch (error) {
        console.error('Image Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 