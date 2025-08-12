module.exports = (admin) => {
    // const otpExpiry = new Date(admin.createdAt.getTime() + 10 * 60 * 1000); // 10 minutes from createdAt
    const createdDate = new Date(admin.createdAt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  
    return `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; padding: 12px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #6c5ce7; padding: 12px; color: white; text-align: center;">
            <h2 style="margin: 0;">🔐 Admin OTP Verification</h2>
          </div>
  
          <!-- Body -->
          <div style="padding: 16px; font-size: 15px; color: #333;">
            <p>Hello, <strong>Care to Cure Physiotherapy Owner</strong>,</p>
            <p>
              <strong>👤 ${admin.username}</strong> (<a href="mailto:${admin.email}" style="color: #0984e3;">${admin.email}</a>) 
              has requested access to the <strong>Admin Dashboard</strong>.
            </p>
            <p style="margin-top: 12px;">Only share if the requester is an authorised person</p>
            <p style="margin-top: 12px;">Please verify this request using the OTP below:</p>
  
            <div style="background-color: #f0f0f0; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #6c5ce7;">${admin.otp}</span>
            </div>
  
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If the requester is not authorized, please ignore this email.</p>
  
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
  
            <p style="text-align: center; color: #777;">Requested on: ${createdDate}</p>
          </div>
  
          <!-- Footer -->
          <div style="background-color: #f1f1f1; text-align: center; padding: 16px; font-size: 13px; color: #777;">
            Manage admin permissions on 
            <strong><a href="https://c2c-physio-admin.vercel.app" target="_blank" style="color: #6c5ce7;">Care to Cure Admin Panel</a></strong>.
          </div>
        </div>
      </div>
    `;
  };
  