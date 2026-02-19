
import { PrismaClient } from '@prisma/client';
import { notificationService, NotificationType } from './services/NotificationService';

const prisma = new PrismaClient();

async function verifyNotifications() {
    console.log('--- Verifying Notification System ---');

    // 1. Create Mock Users and Listing
    const agentId = 'test-agent-' + Date.now();
    const visitorId = 'test-visitor-' + Date.now();
    const listingId = 'test-listing-' + Date.now();

    console.log('Creating mock data...');
    // We don't actually need to create users in DB if our notification service just takes strings,
    // but for completeness in a real app we might. 
    // Here we just test the SERVICE logic which writes to the Notification table.

    // 2. Test Appointment Request Notification
    console.log('Testing Appointment Request Notification...');
    await notificationService.notifyAppointmentRequest(agentId, {
        listingId,
        listingAddress: '123 Test St',
        visitorName: 'Test Visitor',
        visitorEmail: 'visitor@test.com',
        startTime: new Date().toISOString(),
        notes: 'I want to see it now'
    });

    const agentNotifs = await prisma.notification.findMany({
        where: { userId: agentId, type: NotificationType.APPOINTMENT_REQUEST }
    });

    if (agentNotifs.length > 0) {
        console.log('✅ Agent Notification Created:', agentNotifs[0].title);
    } else {
        console.error('❌ Failed to create Agent Notification');
    }

    // 3. Test Status Change Notification
    console.log('Testing Status Change Notification...');
    await notificationService.notifyAppointmentStatusChange(visitorId, 'CONFIRMED', {
        listingId,
        listingAddress: '123 Test St',
        appointmentId: 'appt-123',
        newStatus: 'CONFIRMED'
    });

    const visitorNotifs = await prisma.notification.findMany({
        where: { userId: visitorId, type: NotificationType.APPOINTMENT_CONFIRMED }
    });

    if (visitorNotifs.length > 0) {
        console.log('✅ Visitor Notification Created:', visitorNotifs[0].title);
    } else {
        console.error('❌ Failed to create Visitor Notification');
    }

    console.log('--- Verification Complete ---');
}

verifyNotifications()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
