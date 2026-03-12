import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const BASE_URL = process.env.NEXTAUTH_URL || 'https://mls.bluejax.ai';

export async function sendVerificationEmail(to: string, token: string, firstName?: string) {
    const verifyUrl = `${BASE_URL}/api/auth/verify?token=${token}`;
    const name = firstName || 'Usuario';

    if (!resend) {
        console.log(`[Email] No RESEND_API_KEY set. Verification URL for ${to}: ${verifyUrl}`);
        return { success: true, preview: verifyUrl };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM || 'BLUE JAX MLS <onboarding@resend.dev>',
            to: [to],
            subject: 'Verifica tu cuenta — BLUE JAX MLS',
            html: `
        <div style="font-family: 'Inter', 'Helvetica Neue', sans-serif; max-width: 520px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px 32px; border-radius: 16px; border: 1px solid rgba(59,130,246,0.1);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; background: #3b82f6; border-radius: 3px;"></div>
              <span style="font-weight: 700; font-size: 14px; letter-spacing: -0.02em;">BLUE JAX</span>
              <span style="color: #52525b; font-size: 12px;">/ MLS</span>
            </div>
          </div>
          
          <h1 style="font-size: 22px; font-weight: 800; text-align: center; margin: 0 0 8px; background: linear-gradient(to bottom, #fff, #a1a1aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Verifica tu Email
          </h1>
          <p style="color: #71717a; text-align: center; font-size: 14px; margin: 0 0 32px;">
            Hola ${name}, confirma tu dirección de correo para activar tu cuenta.
          </p>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${verifyUrl}" 
               style="display: inline-block; padding: 14px 40px; background: linear-gradient(to right, #2563eb, #3b82f6); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 0 40px -10px rgba(59,130,246,0.4);">
              Verificar Email
            </a>
          </div>
          
          <p style="color: #52525b; font-size: 11px; text-align: center; margin: 0 0 8px;">
            O copia este enlace en tu navegador:
          </p>
          <p style="color: #3b82f6; font-size: 11px; text-align: center; word-break: break-all; margin: 0 0 32px;">
            ${verifyUrl}
          </p>
          
          <div style="border-top: 1px solid #27272a; padding-top: 20px;">
            <p style="color: #3f3f46; font-size: 10px; text-align: center; margin: 0;">
              Este enlace expira en 24 horas. Si no solicitaste esta verificación, ignora este correo.
              <br/>© 2026 BLUE JAX CORE — Acceso restringido a brokers autorizados.
            </p>
          </div>
        </div>
      `,
        });

        if (error) {
            console.error('[Email] Send failed:', error);
            return { success: false, error };
        }

        console.log(`[Email] Verification sent to ${to} (id: ${data?.id})`);
        return { success: true, id: data?.id };
    } catch (err) {
        console.error('[Email] Exception:', err);
        return { success: false, error: err };
    }
}
