import binance from 'node-binance-api';
import nodemailer from 'nodemailer';

const binanceClient = binance();

const args = process.argv.slice(2);
const symbol = args[0] || 'BTCUSDT';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your_email_address@gmail.com',
    pass: 'your_password'
  }
});

const emailOptions = (to, subject, body) => {
  return {
    from: 'your_email_address@gmail.com',
    to,
    subject,
    text: body
  };
};

function identifyBuyPoints(symbol, email) {
  let redCandleCount = 0;

  binanceClient.websockets.candlesticks(symbol, "1h", (candlesticks) => {
    const { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    const { o:open, h:high, l:low, c:close } = ticks;

    if (close < open) {
      redCandleCount++;
    } else {
      redCandleCount = 0;
    }

    if (redCandleCount === 5) {
      const subject = `Buy signal for ${symbol}`;
      const message = `The price of ${symbol} has seen 5 consecutive red hourly candles. Consider buying now.`;

      const mailOptions = emailOptions(email, subject, message);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

      redCandleCount = 0;
    }
  });
  console.log("Sending E-Mail");
}

identifyBuyPoints(symbol, 'receiver_email_address@example.com');
