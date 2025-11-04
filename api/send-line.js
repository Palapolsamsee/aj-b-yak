// api/send-line.js
export default async function handler(req, res) {
    console.log('=== LINE API CALLED ===');
    console.log('Method:', req.method);
    console.log('Body:', req.body);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        console.log('Preflight request');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            console.log('No message provided');
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Message to send:', message);

        const LINE_NOTIFY_TOKEN = 'ddDlPU8oh4WOICrS4lvdlrfKAB1qeHOMAMPIeeA/C5+9YyAjfMzFVikzytBqejwVGB1zCRp0dLwchAJIsDIRPk+oPCfXgnJTm5doRnqT3VmPc/NL4+Bbjh4RU50+oAuytavXBYYTZpyUokBQNW7jswdB04t89/1O/w1cDnyilFU=';

        console.log('Calling LINE API...');

        const response = await fetch('https://notify-api.line.me/api/notify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `message=${encodeURIComponent(message)}`
        });

        console.log('LINE API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LINE API error details:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`LINE API returned ${response.status}: ${errorText}`);
        }

        console.log('✅ Message sent successfully to LINE');

        res.status(200).json({
            success: true,
            message: 'Sent to LINE successfully'
        });

    } catch (error) {
        console.error('❌ Error in send-line API:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}