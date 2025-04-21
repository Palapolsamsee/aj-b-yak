import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// LINE API endpoint
app.post('/api/line-notify', async (req, res) => {
    try {
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer XWt4yxlVahItRGGp/he752NbmBvz9/1WJYD4qTt2sI9yYyNuDjKAWOKFVtM2EqBtGB1zCRp0dLwchAJIsDIRPk+oPCfXgnJTm5doRnqT3VkasOBLPqzwO2eTS0ktfhoxSaaUbsnovAIBnxiXWumROwdB04t89/1O/w1cDnyilFU=`
            },
            body: JSON.stringify({
                to: "U4eb05e7c181038411c3e83b6ebad1b36",
                messages: [{ type: 'text', text: req.body.message }]
            })
        });
        
        const data = await response.json();
        console.log('LINE API Response:', data);
        res.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 