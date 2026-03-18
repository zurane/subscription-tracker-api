import logo from '../assets/venus_logo.svg'
export const generateEmailTemplate = ({
    userName,
    subscriptionName,
    renewalDate,
    price,
    paymentMethod,
    daysLeft,
}) => `
<div style="margin:0; padding:30px 15px; background-color:#050816; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#ffffff;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px; margin:0 auto; border-collapse:separate;">
    <tr>
      <td style="padding:0;">


        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:linear-gradient(180deg, #0a1230 0%, #060b1d 100%); border:1px solid rgba(255,255,255,0.08); border-radius:20px; overflow:hidden;">
          
 
          <tr>
            <td style="padding:40px 30px 30px; text-align:center; background:
              radial-gradient(circle at top left, rgba(35,93,255,0.25) 0%, rgba(35,93,255,0) 35%),
              radial-gradient(circle at top right, rgba(85,0,255,0.18) 0%, rgba(85,0,255,0) 35%),
              linear-gradient(180deg, #0b1435 0%, #070d21 100%);
              border-bottom:1px solid rgba(255,255,255,0.06);">

              <p style="margin:0 0 12px; font-size:34px; line-height:38px; font-weight:800; color:#ffffff; letter-spacing:-1px;">
                ${logo}
              </p>

              <p style="margin:0 auto 15px; display:inline-block; font-size:12px; line-height:12px; color:#9fb4ff; background-color:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:999px; padding:8px 14px;">
                Subscription renewal reminder
              </p>

              <h1 style="margin:0 0 14px; font-size:34px; line-height:40px; font-weight:800; color:#ffffff; letter-spacing:-1px;">
                Stay ahead of<br>surprise renewals.
              </h1>

              <p style="margin:0 auto; max-width:420px; font-size:16px; line-height:25px; color:#aab4d0;">
                Your <strong style="color:#ffffff;">${subscriptionName}</strong> subscription is coming up for renewal soon. Here is a quick reminder before it hits.
              </p>
            </td>
          </tr>


          <tr>
            <td style="padding:32px 30px 10px;">

              <p style="font-size:16px; line-height:26px; margin:0 0 22px; color:#d8def0;">
                Hello <strong style="color:#4f8cff;">${userName}</strong>,
              </p>

              <p style="font-size:16px; line-height:26px; margin:0 0 26px; color:#d8def0;">
                Your <strong style="color:#ffffff;">${subscriptionName}</strong> subscription is set to renew on
                <strong style="color:#4f8cff;">${renewalDate}</strong> — that is <strong style="color:#ffffff;">${daysLeft} days from today</strong>.
              </p>


              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:26px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
                <tr>
                  <td style="padding:22px 22px 18px;">
                    <p style="margin:0 0 16px; font-size:14px; color:#8fa2c9; text-transform:uppercase; letter-spacing:1px;">
                      Renewal Details
                    </p>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:0 0 14px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:15px; color:#aab4d0;">
                          <strong style="color:#ffffff;">Subscription:</strong> ${subscriptionName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.08); font-size:15px; color:#aab4d0;">
                          <strong style="color:#ffffff;">Renewal Date:</strong> ${renewalDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.08); font-size:15px; color:#aab4d0;">
                          <strong style="color:#ffffff;">Price:</strong> ${price}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0 0; font-size:15px; color:#aab4d0;">
                          <strong style="color:#ffffff;">Payment Method:</strong> ${paymentMethod}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

       
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center" style="border-radius:999px; background:linear-gradient(90deg, #1764ff 0%, #0d4fe0 100%);">
                    <a href="#" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:999px;">
                      Review Subscription
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px; line-height:25px; margin:0 0 24px; color:#94a0bf;">
                Best regards,<br>
                <strong style="color:#ffffff;">The Venus Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 30px 28px; border-top:1px solid rgba(255,255,255,0.06); text-align:center; background-color:rgba(255,255,255,0.02);">
              <p style="margin:0 0 10px; font-size:13px; line-height:22px; color:#7f8baa;">
                Venus Plus Inc. | 123 Main St, Anytown, AN 12345
              </p>
              <p style="margin:0; font-size:13px; line-height:22px;">
                <a href="#" style="color:#7ea8ff; text-decoration:none; margin:0 8px;">Unsubscribe</a>
                <span style="color:#4b5674;">|</span>
                <a href="#" style="color:#7ea8ff; text-decoration:none; margin:0 8px;">Privacy Policy</a>
                <span style="color:#4b5674;">|</span>
                <a href="#" style="color:#7ea8ff; text-decoration:none; margin:0 8px;">Terms of Service</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
`;

export const emailTemplates = [
    {
        label: "7 days before reminder",
        generateSubject: (data) =>
            `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
        generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
    },
    {
        label: "5 days before reminder",
        generateSubject: (data) =>
            `⏳ ${data.subscriptionName} Renews in 5 Days – Stay Subscribed!`,
        generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
    },
    {
        label: "2 days before reminder",
        generateSubject: (data) =>
            `🚀 2 Days Left!  ${data.subscriptionName} Subscription Renewal`,
        generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
    },
    {
        label: "1 days before reminder",
        generateSubject: (data) =>
            `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
        generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
    },
];

export default emailTemplates;