import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Debug: Log which environment variables are set
        console.log('Environment variables check:');
        console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'SET' : 'MISSING');
        console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'SET' : 'MISSING');
        console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'SET' : 'MISSING');

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
            range: 'Sheet1!A2:G', // Updated to include column G for image URLs
        });

        const rows = response.data.values;
        if (!rows?.length) {
            return NextResponse.json([]);
        }

        const projects = rows.map((row) => ({
            title: row[0] || '',
            description: row[1] || '',
            tags: row[2]?.split(',').map((tag: string) => tag.trim()) || [],
            links: {
                demo: row[3] || '#',
                github: row[4] || '#',
            },
            iconName: row[5] || 'FaLaptopCode',
            imageUrl: row[6] || '', // Column G: Image URL
        }));

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Google Sheets API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}
