// require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const getEmailController = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      // user: 'maye.dickinson66@ethereal.email',
      // pass: 'wyjMum1PDS7jhrspkd',
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Raghav Khandelwal 👻" <raghavk1579@gmail.com>', // sender address
    to: 'akankshakh00@gmail.com, raghavk15793@gmail.com', // list of receivers
    subject: 'Hello ✔ Akanksha and Chirkut', // Subject line
    text: 'this is text written in text key', // plain text body
    html: '<b>I am a text written in html format</b>', // html body
  });

  res.status(200).json({ info, preview: nodemailer.getTestMessageUrl(info) });
};

const getBillController = async (req, res) => {
  const { userEmail } = req.body;

  // console.log(userEmail, '---------------------------');

  let config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };

  // console.log(
  //   process.env.EMAIL,
  //   process.env.PASSWORD,
  //   '-------------------------------'
  // );

  let transporter = nodemailer.createTransport(config);

  let mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      // Appears in header & footer of e-mails
      name: 'This is a email template created by Raghav',
      link: 'https://mailgen.js/',
      // Optional product logo
      // logo: 'https://mailgen.js/img/logo.png'
    },
  });

  let email = {
    body: {
      name: ' Applause Guddan',
      intro:
        "Welcome to Khandelwal Bags! We're very excited to have you on board.",
      action: {
        instructions: 'To get started with Khandelwal Bags, please click here:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Confirm your account',
          link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010',
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  let emailBody = mailGenerator.generate(email);
  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'Place Order',
    html: emailBody,
  };
  // let emailText = mailGenerator.generatePlaintext(email);
  const info = await transporter.sendMail(message);
  res.status(200).json({ message: 'bill generated successfully', info });
};

const getSGMailController = async (req, res) => {
  const { userEmail } = req.body;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: userEmail, // Change to your recipient
    from: 'specialyoutech@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail
    .send(msg)
    .then((info) => {
      console.log('Email sent');
      res.json(info);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { getEmailController, getBillController, getSGMailController };
