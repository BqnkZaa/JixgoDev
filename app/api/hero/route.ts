import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
            console.error('Missing environment variables for Google Sheets');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
        const jwt = new google.auth.JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes,
        });

        const sheets = google.sheets({ version: 'v4', auth: jwt });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Hero!A2:H2', // Single row from Hero tab
        });

        const rows = response.data.values;
        if (!rows?.length) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        const row = rows[0];
        const heroData = {
            greeting: row[0] || 'HI \' I AM',
            name: row[1] || 'Developer',
            title: row[2] || 'Full Stack Developer',
            typewriterPhrases: row[3] ? row[3].split(',').map((phrase: string) => phrase.trim()) : [],
            buttonText: row[4] || 'My Project',
            githubUrl: row[5] || '#',
            linkedinUrl: row[6] || '#',
            facebookUrl: row[7] || '#',
        };

        return NextResponse.json(heroData);
    } catch (error) {
        console.error('Google Sheets API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
    }
}
