import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

export enum NotificationType {
    GOVERNANCE_ALERT = 'GOVERNANCE_ALERT',
    CLAIM_FILED = 'CLAIM_FILED',
    LISTING_SUSPENDED = 'LISTING_SUSPENDED',
    SYSTEM_INFO = 'SYSTEM_INFO',
    NEW_LEAD = 'NEW_LEAD',
    APPOINTMENT_REQUEST = 'APPOINTMENT_REQUEST',
    APPOINTMENT_CONFIRMED = 'APPOINTMENT_CONFIRMED',
    APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED'
}

export interface NotificationPayload {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: any;
}

class NotificationService {

    private async getTransporter() {
        if (process.env.ETHEREAL_EMAIL && process.env.ETHEREAL_PASSWORD) {
            return nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.ETHEREAL_EMAIL,
                    pass: process.env.ETHEREAL_PASSWORD
                }
            });
        }
        // Fallback to generating a test account if no env vars
        const testAccount = await nodemailer.createTestAccount();
        console.log('Created Ethereal Test Account:', testAccount.user);
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    async send(payload: NotificationPayload): Promise<void> {
        try {
            // 1. Store in Database (In-App)
            // Skip if userId is an email (external) - though we could look up User by email
            const isEmail = payload.userId.includes('@');

            if (!isEmail) {
                await prisma.notification.create({
                    data: {
                        userId: payload.userId,
                        type: payload.type,
                        title: payload.title,
                        message: payload.message,
                        data: JSON.stringify(payload.metadata || {}),
                        isRead: false
                    }
                });
            }

            // 2. Send Email (Ethereal / SMTP)
            const transporter = await this.getTransporter();
            const toAddress = isEmail ? payload.userId : 'admin@remax-polanco.mx'; // Default fallback

            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: '"Blue Jax MLS" <system@bluejax.ai>', // sender address
                to: toAddress, // list of receivers
                subject: `[${payload.type}] ${payload.title}`, // Subject line
                text: `${payload.message}\n\nMetadata: ${JSON.stringify(payload.metadata, null, 2)}`, // plain text body
                html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                            <h2 style="color: #0066FF;">${payload.title}</h2>
                            <p style="font-size: 16px;">${payload.message}</p>
                            ${payload.metadata ? `<pre style="background: #f4f4f4; padding: 10px; border-radius: 4px;">${JSON.stringify(payload.metadata, null, 2)}</pre>` : ''}
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #888;">Blue Jax MLS System Notification</p>
                            <p style="font-size: 10px; color: #aaa;">This is a development email sent via Ethereal.</p>
                        </div>
                    `, // html body
            });

            console.log(`\n[NOTIFICATION] Sent to ${toAddress}`);
            console.log(`   Message ID: ${info.messageId}`);
            console.log(`   Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            console.log('---------------------------------------------------\n');

        } catch (error) {
            console.error('[NOTIFICATION] Failed to send email:', error);
        }
    }

    async notifyAppointmentRequest(agentId: string, details: any) {
        await this.send({
            userId: agentId,
            type: NotificationType.APPOINTMENT_REQUEST,
            title: `Viewing Request for ${details.listingAddress}`,
            message: `A visitor has requested a viewing. Check your dashboard to confirm.`,
            metadata: details
        });
    }

    async notifyAppointmentStatusChange(visitorId: string, status: string, details: any) {
        await this.send({
            userId: visitorId,
            type: status === 'CONFIRMED' ? NotificationType.APPOINTMENT_CONFIRMED : NotificationType.APPOINTMENT_CANCELLED,
            title: `Viewing ${status}`,
            message: `Your viewing request for ${details.listingAddress} has been ${status.toLowerCase()}.`,
            metadata: details
        });
    }

    async notifyListingSuspended(userId: string, listingId: string, reason: string) {
        await this.send({
            userId,
            type: NotificationType.LISTING_SUSPENDED,
            title: 'Action Required: Listing Suspended',
            message: `Your listing (${listingId}) has been suspended due to a governance violation: ${reason}. Please review the claim details.`,
            metadata: { listingId, reason }
        });
    }

    async notifyClaimFiled(claimantId: string, listingId: string, claimId: string) {
        await this.send({
            userId: claimantId,
            type: NotificationType.CLAIM_FILED,
            title: 'Claim Received',
            message: `We have received your claim (${claimId}) regarding listing ${listingId}. Our team is reviewing the evidence.`,
            metadata: { listingId, claimId }
        });
    }

    // Notify the lisitng OWNER that a claim was filed against them
    async notifyOwnerClaimFiled(ownerId: string, listingId: string, claimType: string) {
        await this.send({
            userId: ownerId,
            type: NotificationType.GOVERNANCE_ALERT,
            title: 'Dispute Filed Against Your Listing',
            message: `A claim of type '${claimType}' has been filed against your listing ${listingId}.`,
            metadata: { listingId, claimType }
        });
    }

    async notifyNewLead(agentEmail: string, leadDetails: any) {
        await this.send({
            userId: agentEmail, // Send directly to email
            type: NotificationType.NEW_LEAD,
            title: `New Inquiry for ${leadDetails.listingTitle || 'Listing'}`,
            message: `You have received a new inquiry from ${leadDetails.name} (${leadDetails.email}).`,
            metadata: leadDetails
        });
    }
}

export const notificationService = new NotificationService();
