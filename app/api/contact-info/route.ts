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
            range: 'ContactInfo!A2:G2', // Single row from ContactInfo tab
        });

        const rows = response.data.values;
        if (!rows?.length) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        const row = rows[0];
        const contactInfo = {
            sectionTitle: row[0] || 'Get In Touch',
            subtitle: row[1] || '',
            email: row[2] || '',
            phone: row[3] || '',
            location: row[4] || '',
            facebookName: row[5] || '',
            facebookUrl: row[6] || '#',
        };

        return NextResponse.json(contactInfo);
    } catch (error) {
        console.error('Google Sheets API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 });
    }
}
