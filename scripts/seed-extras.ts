/**
 * Incremental Seed: Populates Messages, Appointments, Notifications, and Leads.
 * Run: npx tsx scripts/seed-extras.ts
 * 
 * This script does NOT wipe existing data — it only adds to empty tables.
 */
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const CURRENT_USER_ID = 'OxSwavzjG950Ub4m3tIY';

async function main() {
    console.log('🚀 Seeding Messages, Appointments, Notifications & Leads...\n');

    // Fetch existing data to reference
    const users = await prisma.user.findMany();
    const listings = await prisma.listing.findMany({ where: { status: 'ACTIVE' }, take: 10 });
    const agents = users.filter(u => u.roles.includes('agent') || u.roles.includes('admin'));
    const clients = users.filter(u => !u.roles.includes('agent') && !u.roles.includes('admin'));

    if (listings.length === 0) {
        console.error('❌ No listings found. Run seed-data.ts first.');
        process.exit(1);
    }
    if (clients.length < 2) {
        console.error('❌ Not enough clients found. Run seed-data.ts first.');
        process.exit(1);
    }

    console.log(`   Found ${agents.length} agents, ${clients.length} clients, ${listings.length} listings\n`);

    // ═══════════════════════════════════════
    // 1. CONVERSATIONS & MESSAGES
    // ═══════════════════════════════════════
    const existingConvos = await prisma.conversation.count();
    if (existingConvos === 0) {
        console.log('💬 Creating conversations & messages...');

        const conversationData = [
            {
                participant1: CURRENT_USER_ID,
                participant2: clients[0].id,
                listingId: listings[0].id,
                messages: [
                    { senderId: clients[0].id, content: `Hola, me interesa la propiedad en ${listings[0].address}. ¿Está disponible para visita?` },
                    { senderId: CURRENT_USER_ID, content: 'Claro que sí. Podemos agendar una visita esta semana. ¿Qué día le conviene?' },
                    { senderId: clients[0].id, content: 'El jueves por la tarde me queda perfecto, ¿a las 5pm puede ser?' },
                    { senderId: CURRENT_USER_ID, content: 'Perfecto, lo agendo para el jueves a las 5pm. Le envío la dirección exacta y datos de acceso.' },
                    { senderId: clients[0].id, content: 'Muchas gracias. También quería preguntar si el precio es negociable.' },
                ],
            },
            {
                participant1: CURRENT_USER_ID,
                participant2: clients[1].id,
                listingId: listings[1].id,
                messages: [
                    { senderId: clients[1].id, content: `Buenos días, vi la propiedad en ${listings[1].address}. ¿Cuáles son las condiciones de financiamiento?` },
                    { senderId: CURRENT_USER_ID, content: 'Buenos días. Manejamos crédito hipotecario con varios bancos. Podemos ofrecerle hasta 20 años.' },
                    { senderId: clients[1].id, content: '¿Cuánto sería el enganche mínimo?' },
                    { senderId: CURRENT_USER_ID, content: 'El enganche mínimo es del 10%, pero con 20% obtiene mejor tasa de interés.' },
                ],
            },
            {
                participant1: CURRENT_USER_ID,
                participant2: clients[2].id,
                listingId: listings[2].id,
                messages: [
                    { senderId: clients[2].id, content: 'Buenas tardes, necesito un local comercial en el centro. ¿Tiene algo disponible?' },
                    { senderId: CURRENT_USER_ID, content: `Sí, tenemos uno excelente en ${listings[2].address}. 200m² con excelente ubicación.` },
                    { senderId: clients[2].id, content: '¿Puedo verlo mañana?' },
                ],
            },
        ];

        for (const convo of conversationData) {
            const lastMsg = convo.messages[convo.messages.length - 1];
            const conversation = await prisma.conversation.create({
                data: {
                    participant1: convo.participant1,
                    participant2: convo.participant2,
                    listingId: convo.listingId,
                    lastMessage: lastMsg.content,
                    lastMessageAt: new Date(),
                },
            });

            for (let i = 0; i < convo.messages.length; i++) {
                const msg = convo.messages[i];
                await prisma.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: msg.senderId,
                        content: msg.content,
                        isRead: i < convo.messages.length - 1, // Last message unread
                        createdAt: new Date(Date.now() - (convo.messages.length - i) * 3600000), // Spread over hours
                    },
                });
            }
        }
        console.log(`   ✓ Created ${conversationData.length} conversations with messages\n`);
    } else {
        console.log('💬 Conversations already exist, skipping.\n');
    }

    // ═══════════════════════════════════════
    // 2. APPOINTMENTS
    // ═══════════════════════════════════════
    const existingAppts = await prisma.appointment.count();
    if (existingAppts === 0) {
        console.log('📅 Creating appointments...');

        const now = new Date();
        const appointments = [
            {
                listingId: listings[0].id,
                agentId: CURRENT_USER_ID,
                visitorId: clients[0].id,
                startTime: new Date(now.getTime() + 2 * 24 * 3600000), // 2 days from now
                endTime: new Date(now.getTime() + 2 * 24 * 3600000 + 3600000),
                status: 'CONFIRMED',
                notes: 'Primera visita. Cliente interesado en la alberca y jardín. Traer planos.',
            },
            {
                listingId: listings[1].id,
                agentId: CURRENT_USER_ID,
                visitorId: clients[1].id,
                startTime: new Date(now.getTime() + 4 * 24 * 3600000), // 4 days
                endTime: new Date(now.getTime() + 4 * 24 * 3600000 + 3600000),
                status: 'PENDING',
                notes: 'Quiere ver opciones de financiamiento. Llevar documentación bancaria.',
            },
            {
                listingId: listings[2].id,
                agentId: CURRENT_USER_ID,
                visitorId: clients[2].id,
                startTime: new Date(now.getTime() + 1 * 24 * 3600000), // Tomorrow
                endTime: new Date(now.getTime() + 1 * 24 * 3600000 + 3600000),
                status: 'PENDING',
                notes: 'Local comercial para restaurante. Verificar instalaciones de gas.',
            },
            {
                listingId: listings[3].id,
                agentId: agents.length > 1 ? agents[1].id : CURRENT_USER_ID,
                visitorId: clients[3]?.id || clients[0].id,
                startTime: new Date(now.getTime() - 3 * 24 * 3600000), // 3 days ago
                endTime: new Date(now.getTime() - 3 * 24 * 3600000 + 3600000),
                status: 'COMPLETED',
                notes: 'Visita completada. Cliente pidió segunda visita con familia.',
            },
            {
                listingId: listings[4].id,
                agentId: CURRENT_USER_ID,
                visitorId: clients[4]?.id || clients[1].id,
                startTime: new Date(now.getTime() - 7 * 24 * 3600000), // 7 days ago
                endTime: new Date(now.getTime() - 7 * 24 * 3600000 + 3600000),
                status: 'COMPLETED',
                notes: 'Terreno de inversión. Cliente aprovó e inició trámites.',
            },
            {
                listingId: listings[5]?.id || listings[0].id,
                agentId: CURRENT_USER_ID,
                visitorId: clients[0].id,
                startTime: new Date(now.getTime() - 1 * 24 * 3600000), // Yesterday
                endTime: new Date(now.getTime() - 1 * 24 * 3600000 + 3600000),
                status: 'CANCELLED',
                notes: 'Cancelada por el cliente. Reagendar para la próxima semana.',
            },
        ];

        for (const appt of appointments) {
            await prisma.appointment.create({ data: appt });
        }
        console.log(`   ✓ Created ${appointments.length} appointments\n`);
    } else {
        console.log('📅 Appointments already exist, skipping.\n');
    }

    // ═══════════════════════════════════════
    // 3. NOTIFICATIONS
    // ═══════════════════════════════════════
    const existingNotifs = await prisma.notification.count();
    if (existingNotifs === 0) {
        console.log('🔔 Creating notifications...');

        const notifications = [
            {
                userId: CURRENT_USER_ID,
                type: 'APPOINTMENT_REQUEST',
                title: 'Nueva solicitud de cita',
                message: `${clients[0].firstName} ${clients[0].lastName} solicita visitar "${listings[0].title}"`,
                data: JSON.stringify({ listingId: listings[0].id }),
                isRead: false,
                createdAt: new Date(Date.now() - 1 * 3600000),
            },
            {
                userId: CURRENT_USER_ID,
                type: 'APPOINTMENT_CONFIRMED',
                title: 'Cita confirmada',
                message: `Tu cita para "${listings[1].title}" ha sido confirmada para el jueves`,
                data: JSON.stringify({ listingId: listings[1].id }),
                isRead: false,
                createdAt: new Date(Date.now() - 3 * 3600000),
            },
            {
                userId: CURRENT_USER_ID,
                type: 'NEW_LEAD',
                title: 'Nuevo prospecto',
                message: `Tienes un nuevo prospecto interesado en "${listings[2].title}"`,
                data: JSON.stringify({ listingId: listings[2].id }),
                isRead: true,
                createdAt: new Date(Date.now() - 6 * 3600000),
            },
            {
                userId: CURRENT_USER_ID,
                type: 'SYSTEM',
                title: 'Nuevo listado detectado',
                message: 'Se detectó un posible duplicado en la zona Campestre. Revisa la sección de inteligencia.',
                data: JSON.stringify({}),
                isRead: false,
                createdAt: new Date(Date.now() - 12 * 3600000),
            },
            {
                userId: CURRENT_USER_ID,
                type: 'REVIEW_RECEIVED',
                title: 'Nueva reseña recibida',
                message: `${clients[1].firstName} dejó una reseña de 5 estrellas: "Excelente servicio"`,
                data: JSON.stringify({}),
                isRead: true,
                createdAt: new Date(Date.now() - 24 * 3600000),
            },
            {
                userId: CURRENT_USER_ID,
                type: 'PRICE_ALERT',
                title: 'Alerta de precio',
                message: 'Se detectó un cambio de precio significativo en una propiedad en tu zona de monitoreo.',
                data: JSON.stringify({}),
                isRead: false,
                createdAt: new Date(Date.now() - 2 * 24 * 3600000),
            },
            {
                userId: CURRENT_USER_ID,
                type: 'SYSTEM',
                title: 'Regla de gobernanza activada',
                message: 'Una propiedad fue marcada por el motor de reglas. Revisa el panel de gobernanza.',
                data: JSON.stringify({}),
                isRead: true,
                createdAt: new Date(Date.now() - 3 * 24 * 3600000),
            },
            {
                userId: CURRENT_USER_ID,
                type: 'APPOINTMENT_REMINDER',
                title: 'Recordatorio de cita',
                message: `Tienes una cita mañana a las 5:00 PM para "${listings[0].title}"`,
                data: JSON.stringify({ listingId: listings[0].id }),
                isRead: false,
                createdAt: new Date(Date.now() - 4 * 3600000),
            },
        ];

        for (const notif of notifications) {
            await prisma.notification.create({ data: notif });
        }
        console.log(`   ✓ Created ${notifications.length} notifications\n`);
    } else {
        console.log('🔔 Notifications already exist, skipping.\n');
    }

    // ═══════════════════════════════════════
    // 4. LEADS
    // ═══════════════════════════════════════
    const existingLeads = await prisma.lead.count();
    if (existingLeads === 0) {
        console.log('📋 Creating leads...');

        const leads = [
            {
                listingId: listings[0].id,
                name: 'Roberto García López',
                email: 'roberto.garcia@gmail.com',
                phone: '+52 614 555 0101',
                message: 'Me interesa la propiedad. ¿Podemos agendar una visita esta semana?',
                status: 'NEW',
            },
            {
                listingId: listings[1].id,
                name: 'María Elena Vega',
                email: 'maria.vega@outlook.com',
                phone: '+52 614 555 0202',
                message: 'Busco información sobre financiamiento para esta propiedad.',
                status: 'CONTACTED',
            },
            {
                listingId: listings[2].id,
                name: 'Jorge Adrián Pérez',
                email: 'jorge.perez@yahoo.com',
                phone: '+52 614 555 0303',
                message: 'Soy inversionista y me interesan propiedades comerciales en la zona.',
                status: 'NEW',
            },
            {
                listingId: listings[3].id,
                name: 'Laura Patricia Morales',
                email: 'laura.morales@hotmail.com',
                phone: '+52 614 555 0404',
                message: 'Estoy buscando terreno para construir. ¿Este terreno tiene servicios?',
                status: 'CONTACTED',
            },
            {
                listingId: listings[4].id,
                name: 'Francisco Javier Ruiz',
                email: 'francisco.ruiz@gmail.com',
                phone: null,
                message: 'Vi su anuncio en la búsqueda. Me gustaría más detalles y fotografías.',
                status: 'CLOSED',
            },
        ];

        for (const lead of leads) {
            await prisma.lead.create({ data: lead });
        }
        console.log(`   ✓ Created ${leads.length} leads\n`);
    } else {
        console.log('📋 Leads already exist, skipping.\n');
    }

    // ═══════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════
    console.log('═══════════════════════════════════════');
    console.log('✅ Extra seed complete! Final counts:');
    console.log(`   Conversations:  ${await prisma.conversation.count()}`);
    console.log(`   Messages:       ${await prisma.message.count()}`);
    console.log(`   Appointments:   ${await prisma.appointment.count()}`);
    console.log(`   Notifications:  ${await prisma.notification.count()}`);
    console.log(`   Leads:          ${await prisma.lead.count()}`);
    console.log('═══════════════════════════════════════');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
