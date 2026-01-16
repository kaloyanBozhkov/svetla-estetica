import { db } from "@/lib/db";
import { resend } from "@/lib/email";
import { env } from "@/env";
import MagicLinkEmail from "@/app/_components/emails/MagicLinkEmail";

const MAGIC_LINK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function createMagicLink(email: string): Promise<string> {
  let user = await db.user.findUnique({ where: { email } });

  if (!user) {
    user = await db.user.create({
      data: { email },
    });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_DURATION_MS);

  await db.magic_link.create({
    data: {
      token,
      user_id: user.id,
      expires_at: expiresAt,
    },
  });

  return token;
}

export async function sendMagicLinkEmail(email: string, token: string): Promise<void> {
  const magicLinkUrl = `${env.BASE_URL}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "Svetla Estetica <noreply@svetlaestetica.com>",
    to: email,
    subject: "Il tuo link di accesso - Svetla Estetica",
    react: MagicLinkEmail({ magicLinkUrl }),
  });
}

export async function verifyMagicLink(token: string): Promise<number | null> {
  const magicLink = await db.magic_link.findUnique({
    where: { token },
  });

  if (!magicLink || magicLink.used || magicLink.expires_at < new Date()) {
    return null;
  }

  await db.magic_link.update({
    where: { id: magicLink.id },
    data: { used: true },
  });

  await db.user.update({
    where: { id: magicLink.user_id },
    data: { email_verified: true },
  });

  return magicLink.user_id;
}

