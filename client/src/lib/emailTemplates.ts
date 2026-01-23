export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to ServicePanda!",
    body: `<p>Hi there,</p>
<p>Welcome to ServicePanda! We're excited to have you on board.</p>
<p>Best regards,<br>ServicePanda Team</p>`
  },
  {
    id: 2,
    name: "Notification",
    subject: "Important Notification",
    body: `<p>Hello,</p>
<p>This is an important notification from ServicePanda.</p>
<p>Thank you,<br>ServicePanda Team</p>`
  },
  {
    id: 3,
    name: "Reminder",
    subject: "Reminder",
    body: `<p>Hi,</p>
<p>This is a friendly reminder from ServicePanda.</p>
<p>Best regards,<br>ServicePanda Team</p>`
  },
  {
    id: 4,
    name: "Follow Up",
    subject: "Follow Up",
    body: `<p>Hello,</p>
<p>We wanted to follow up with you regarding your recent inquiry.</p>
<p>Please let us know if you have any questions.</p>
<p>Best regards,<br>ServicePanda Team</p>`
  },
  {
    id: 5,
    name: "Thank You",
    subject: "Thank You",
    body: `<p>Hi,</p>
<p>Thank you for your interest in ServicePanda!</p>
<p>We appreciate your business.</p>
<p>Best regards,<br>ServicePanda Team</p>`
  }
];
