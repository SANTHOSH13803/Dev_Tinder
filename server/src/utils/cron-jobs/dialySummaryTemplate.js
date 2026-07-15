function generateDailySummaryEmail({
  firstName,
  receivedRequests,
  acceptedRequests,
  sentRequests
}) {
  return `<!DOCTYPE html>
      <html>
        <body
          style="
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 40px 20px;
          "
        >
          <div
            style="
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            "
          >
            <h2 style="margin-top: 0; color: #222;">
              Hello ${firstName} 👋,
            </h2>
      
            <p style="font-size: 16px; color: #555;">
              Here's your <strong>DevTinder Daily Summary</strong> for yesterday.
            </p>
      
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      
            <p style="font-size: 16px; margin: 16px 0;">
              📩 <strong>New Connection Requests:</strong> ${receivedRequests}
            </p>
      
            <p style="font-size: 16px; margin: 16px 0;">
              🤝 <strong>Accepted Connections:</strong> ${acceptedRequests}
            </p>
      
            <p style="font-size: 16px; margin: 16px 0;">
              📤 <strong>Requests Sent:</strong> ${sentRequests}
            </p>
      
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      
            <p style="font-size: 16px; color: #555;">
              Keep networking and discover more amazing people on <strong>DevTinder</strong>. ❤️
            </p>
      
            <p style="margin-top: 30px; color: #777;">
              Happy Networking,<br />
              <strong>Team DevTinder</strong>
            </p>
          </div>
        </body>
      </html>`;
}

module.exports = { generateDailySummaryEmail };
