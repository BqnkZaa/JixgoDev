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
            range: 'About!A2:F2', // Single row from About tab
        });

        const rows = response.data.values;
        if (!rows?.length) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        const row = rows[0];
        const aboutData = {
            sectionTitle: row[0] || 'About Me',
            heading: row[1] || '',
            description: row[2] || '',
            profileImageUrl: row[3] || 'https://ui-avatars.com/api/?name=Profile&size=400&background=3b82f6&color=fff',
            cvLinkText: row[4] || 'Download CV',
            cvUrl: row[5] || '#',
        };

        return NextResponse.json(aboutData);
    } catch (error) {
        console.error('Google Sheets API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
    }
}
