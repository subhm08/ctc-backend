module.exports = (enquiry) => {
    const enquiryDate = new Date(enquiry.createdAt).toDateString();
  
    return `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; padding: 12px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #00b894; padding: 8px; color: white; text-align: center;">
            <h2 style="margin: 0;">🗓️ New Enquiry recived</h2>
          </div>
          <div style="padding: 12px; font-size: 15px; color: #333;">
            <p><strong>👤 Name:</strong> ${enquiry.name}</p>
            <p><strong>📞 Phone:</strong><a href="tel:${enquiry.phone}"> ${enquiry.phone} </a></p>
            ${
              enquiry.message
                ? `<p><strong>📝 Message:</strong> ${enquiry.message}</p>`
                : ''
            }
            <hr/>
           <p style="text-align: center; color: #777;">Booked on: ${enquiryDate}</p>

            </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 16px; font-size: 13px; color: #777;">
            Manage your enquiry on <strong><a href="https://c2c-physio-admin.vercel.app" target="_blank">Care to Cure Physiotherapy Admin</a></strong>.
          </div>
          </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 16px; font-size: 13px; color: #777;">
            Manage your enquiry on <strong><a href="c2c-physio-admin.vercel.app">Care to Cure Physiotherapy Admin</a></strong>.
          </div>
        </div>
      </div>
    `;
  };
  