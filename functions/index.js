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

exports.sendReservationEmails = functions.firestore
    .document("UsersUber/{specialistUid}/RezervariConsultatii/{reservationId}")
    .onCreate(async (snap, context) => {
      const reservationData = snap.data();
      const clientEmail = reservationData.client.email;
      const specialistUid = reservationData.specialistId;
      const linkConectareUtilizator = reservationData.linkConectareUtilizator;
      const linkConectareSpecialist = reservationData.linkConectareSpecialist;
      const dataSiOra = reservationData.slot.start; // data/ora rezervării

      // 1. Trimitem email către client
      const mailOptionsClient = {
        from: "webdynamicx@gmail.com",
        to: clientEmail,
        subject: "Confirmare Rezervare Consultație",
        html: `
        <p>Bună,</p>
        <p>
          Rezervarea ta a fost confirmată pentru data și ora 
          <strong>${dataSiOra}</strong>!
        </p>
        <p>
          Pentru a te conecta la consultație, 
          te rugăm să accesezi următorul link:
        </p>
        <p>
          <a href="${linkConectareUtilizator}">
            ${linkConectareUtilizator}
          </a>
        </p>
        <p>
          Pentru probleme tehnice, te poți adresa la 
          <strong>webdynamicx@gmail.com</strong> (dezvoltatorul aplicației).
        </p>
        <p>Mulțumim!</p>
        `,

      };

      // 2. Trimitem email către specialist
      let specialistEmail = "";
      try {
        const specialistDoc = await admin.firestore()
            .collection("UsersUber")
            .doc(specialistUid)
            .get();

        if (specialistDoc.exists) {
          const specialistData = specialistDoc.data();
          specialistEmail = specialistData.email; // Extragem emailul
        }
      } catch (error) {
        console.error("Eroare la preluarea datelor specialistului:", error);
      }

      const mailOptionsSpecialist = {
        from: "webdynamicx@gmail.com",
        to: specialistEmail,
        subject: "Nouă rezervare în calendarul tău",
        html: `
        <p>Bună,</p>
        <p>
          A fost efectuată o nouă rezervare pentru data și ora
          <strong>${dataSiOra}</strong>.
        </p>
        <p>Linkul tău de conectare la consultație este:</p>
        <p>
          <a href="${linkConectareSpecialist}">
            ${linkConectareSpecialist}
          </a>
        </p>
        <p>
          Verifică-ți panoul de control pentru detalii despre client.
        </p>
        <p>O zi bună!</p>
      `,

      };

      try {
        await transporter.sendMail(mailOptionsClient);
        console.log("Email trimis cu succes către client:", clientEmail);

        if (specialistEmail) {
          await transporter.sendMail(mailOptionsSpecialist);
          console.log("Email trimis către specialist:", specialistEmail);
        }
      } catch (error) {
        console.error("Eroare la trimiterea email-urilor:", error);
      }

      // Ca să putem identifica ușor rezervările pentru reminder, setăm un flag:
      try {
        await snap.ref.update({reminderSent: false});
      } catch (err) {
        console.error("Eroare la setarea reminderSent:", err);
      }
    });


exports.dailyMorningReminders = functions.pubsub
    .schedule("0 8 * * *") // Rulează în fiecare zi la 08:00
    .timeZone("Europe/Bucharest") // Setează fusul orar, dacă dorești
    .onRun(async (context) => {
      const db = admin.firestore();

      // Momentul curent (ora 8:00)
      const now = new Date();

      // Startul și sfârșitul zilei curente
      const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0, 0, 0,
      );
      const endOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23, 59, 59,
      );

      try {
        const rezervariSnapshot = await db
            .collectionGroup("RezervariConsultatii")
            .where("reminderSent", "==", false)
            .get();

        const batch = db.batch();

        for (const docSnap of rezervariSnapshot.docs) {
          const rezervare = docSnap.data();
          if (!rezervare.slot || !rezervare.slot.start) continue;

          // Convertim string-ul "rezervare.slot.start" la un obiect Date
          // asigură-te că formatul este "YYYY-MM-DDTHH:mm" sau ceva compatibil
          const rezervareDate = new Date(rezervare.slot.start);

          // Verificăm dacă e în intervalul zilei de azi
          if (rezervareDate >= startOfToday && rezervareDate <= endOfToday) {
            // Trimitem reminder
            const emailClient = rezervare.client.email;
            const ora = rezervareDate.toLocaleTimeString("ro-RO", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const linkConectare = rezervare.linkConectareUtilizator || "";

            const mailOptions = {
              from: "webdynamicx@gmail.com",
              to: emailClient,
              subject: "Reminder consultație astăzi",
              html: `
              <p>Bună,</p>
              <p>
                Te reamintim că astăzi, la ora 
                <strong>${ora}</strong>, ai o consultație programată.
              </p>
              <p>Linkul tău de conectare:</p>
              <p>
                <a href="${linkConectare}">
                  ${linkConectare}
                </a>
              </p>
              <p>O zi bună!</p>
            `,

            };

            try {
              await transporter.sendMail(mailOptions);
              console.log("Reminder trimis către:", emailClient);
            } catch (error) {
              console.error("Eroare la trimiterea reminderului:", error);
            }

            // Marcăm rezervarea cu reminderSent = true
            batch.update(docSnap.ref, {reminderSent: true});
          }
        }

        // Aplicăm toate update-urile
        await batch.commit();
      } catch (error) {
        console.error("Eroare la dailyMorningReminders:", error);
      }

      return null;
    });


// Funcție care se declanșează la crearea unui document în "UsersUber"
exports.sendSpecialistSignupEmail = functions.firestore
    .document("UsersUber/{userId}")
    .onCreate(async (snap, context) => {
      const userData = snap.data();

      // Verificăm dacă utilizatorul este specialist
      if (userData.userType === "Doctor") {
        const email = userData.email;
        const numeUtilizator = userData.numeUtilizator;

        const mailOptions = {
          from: "webdynamicx@gmail.com",
          to: email,
          subject: "Cont Specialist Creat cu Succes!",
          html: `
          <p>Bună ${numeUtilizator},</p>
          <p>Contul a fost creat cu succes!</p>
          <p>
            Te poți conecta la platformă pentru a-ți administra
            programările și consultațiile.
          </p>
          <p>
            Mulțumim,<br />
            Echipa Connectify
          </p>
        `,

        };

        try {
          await transporter.sendMail(mailOptions);
          console.log("Email de înregistrare trimis către:", email);
        } catch (error) {
          console.error("Eroare trimitere email de înreg:", error);
        }
      }
      return null;
    });
