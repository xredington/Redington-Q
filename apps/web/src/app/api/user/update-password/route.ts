import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Ensure the token is valid and contains an id
    if (!token || typeof token.id !== 'string') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: token.id } });

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: token.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}
