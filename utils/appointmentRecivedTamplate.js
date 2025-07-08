module.exports = (appointment) => {
    const appointmentDate = new Date(appointment.preferredDate).toDateString();
    const bookingDate = new Date(appointment.createdAt).toDateString();
    return `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; padding: 12px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #00b894; padding: 8px; color: white; text-align: center;">
            <h2 style="margin: 0;">🗓️ New Appointment Booked</h2>
          </div>
          <div style="padding: 12px; font-size: 15px; color: #333;">
            <p><strong>👤 Name:</strong> ${appointment.name}</p>
            <p><strong>📞 Phone:</strong><a href="tel:${appointment.phone}"> ${appointment.phone} </a></p>
            <p><strong>📧 Email:</strong> <a href="mailto:${appointment.email}"> ${appointment.email}</a></p>
            <p><strong>👫 Gender:</strong> ${appointment.gender}</p>
            <p><strong>📅 Date:</strong> ${appointmentDate}</p>
            <p><strong>⏰ Time:</strong> ${appointment.preferredTime}</p>
            <p><strong>💆‍♂️ Service:</strong> ${appointment.selectedServices}</p>
            ${
              appointment.message
                ? `<p><strong>📝 Message:</strong> ${appointment.message}</p>`
                : ''
            }
            <hr/>
           <p style="text-align: center; color: #777;">Booked on: ${bookingDate}</p>

          </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 16px; font-size: 13px; color: #777;">
            Manage your appointments on <a href = "c2c-physio-admin.vercel.app"><strong>Care to Cure Physiotherapy</strong>.</a>
          </div>
        </div>
      </div>
    `;
  };
  