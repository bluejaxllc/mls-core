const { Resend } = require('resend');

const resend = new Resend('re_DqaMer5B_JzTMKybMubS7tXttkRKxChmx');

async function testEmail() {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'edgar@bluejax.ai',
            subject: 'Test Email from Script',
            html: '<p>Testing Resend API Delivery</p>'
        });
        console.log("Success:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

testEmail();
