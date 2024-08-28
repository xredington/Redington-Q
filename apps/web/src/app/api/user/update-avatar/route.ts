import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import s3 from '@/utils/s3';

const prisma = new PrismaClient();


export async function PATCH(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const contentType = req.headers.get('content-type') || '';

        // Ensure the request content type is correct
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json({ error: 'Content-Type was not one of "multipart/form-data"' }, { status: 400 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }

        const extension = file.type.split('/').pop();
        const key = `${uuidv4()}.${extension}`;

        const params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
            Body: Buffer.from(await file.arrayBuffer()), // Convert the Blob to Buffer
            ContentType: file.type,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        // Update user's image in the database
        await prisma.user.update({
            where: { id: token.id },
            data: { image: imageUrl },
        });

        return NextResponse.json({ url: imageUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Error uploading file', details:( error as Error).message }, { status: 500 });
    }
}