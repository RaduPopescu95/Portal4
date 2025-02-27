const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configurații pentru Nodemailer cu contul de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "webdynamicx@gmail.com",
    pass: "ypeb yvmi ygat lahn",
  },
});

exports.sendReservationEmail = functions.firestore
  .document("UsersUber/{specialistUid}/RezervariConsultatii/{reservationId}")
  .onCreate(async (snap, context) => {
    const reservationData = snap.data();
    const email = reservationData.client.email;
    const linkConectareUtilizator = reservationData.linkConectareUtilizator;
    // Presupunem că în reservationData.slot.start avem data și ora rezervării
    const dataSiOra = reservationData.slot.start;

    // Compoziția email-ului, inclusiv detaliile despre data/ora și mesajul de suport tehnic
    const mailOptions = {
      from: "webdynamicx@gmail.com",
      to: email,
      subject: "Confirmare Rezervare Consultație",
      html: `
        <p>Bună,</p>
        <p>Rezervarea ta a fost confirmată pentru data și ora <strong>${dataSiOra}</strong>!</p>
        <p>Pentru a te conecta la consultație, te rugăm să accesezi următorul link:</p>
        <p><a href="${linkConectareUtilizator}">${linkConectareUtilizator}</a></p>
        <p>Pentru probleme tehnice, te poți adresa la <strong>webdynamicx@gmail.com</strong> (dezvoltatorul aplicației).</p>
        <p>Mulțumim!</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email trimis cu succes către:", email);
    } catch (error) {
      console.error("Eroare la trimiterea email-ului:", error);
    }
  });
