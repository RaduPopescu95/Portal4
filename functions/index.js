const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: "mail.creditemedicale.ro",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "exclusivmd@creditemedicale.ro",
    pass: "vtn0079su8dh",
  },
});

exports.notifyDoctorsOnNewAnunt = functions.firestore
  .document("UsersUber/{userId}/Anunturi/{offerId}")
  .onCreate(async (snap, context) => {
    const newAnunt = snap.data();

    try {
      const judetAnunt = newAnunt.judet;
      const collectionId = newAnunt.collectionId;

      if (!collectionId) {
        console.log("Anunțul nu are collectionId, emailul nu va fi trimis.");
        return null;
      }

      // Căutare userType "Partener" și user_uid egal cu collectionId
      const partnerRef = admin
        .firestore()
        .collection("UsersUber")
        .where("userType", "==", "Partener")
        .where("user_uid", "==", collectionId);

      const partnerSnapshot = await partnerRef.get();

      if (partnerSnapshot.empty) {
        console.log("Nu s-a găsit Partener cu user_uid corespunzător.");
        return null;
      }

      // Căutare utilizatori cu userType "Doctor" și judet corespunzător
      const usersRef = admin.firestore().collection("UsersUber");
      const doctorQuerySnapshot = await usersRef
        .where("userType", "==", "Doctor")
        .where("judet", "==", judetAnunt)
        .get();

      const emailsToSend = [];

      doctorQuerySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.email) {
          emailsToSend.push(userData.email);
        }
      });

      if (emailsToSend.length > 0) {
        const text =
          `Un nou anunț pentru ${newAnunt.titluOferta}` +
          ` a fost publicat în județul dvs., ${judetAnunt}.` +
          `Pentru detalii suplimentare accesați www.jobsmd.ro`;

        // Trimitere email către toți utilizatorii Doctor din același judet
        const mailOptions = (email) => ({
          from: "exclusivmd@creditemedicale.ro",
          to: email,
          subject: `Anunț nou în județul ${judetAnunt}`,
          text,
        });

        for (const email of emailsToSend) {
          try {
            await transporter.sendMail(mailOptions(email));
            console.log(`Email trimis cu succes la: ${email}`);
          } catch (error) {
            console.error(`Eroare trimiterea emailului la ${email}: `, error);
          }
        }
      } else {
        console.log(
          "Nu s-au găsit utilizatori Doctor pentru a trimite emailuri."
        );
      }
    } catch (error) {
      console.error(
        "Eroare la prelucrarea anunțului și trimiterea emailurilor: ",
        error
      );
    }

    return null;
  });

exports.sendInformareEmailsCereriAnunturi = functions.firestore
  .document("UsersUber/{userId}/Cereri/{offerId}")
  .onUpdate(async (change, context) => {
    const newV = change.after.data();
    const oldV = change.before.data();

    try {
      const partRef = admin
        .firestore()
        .doc(`UsersUber/${newV.partener.user_uid}`);

      const [partener] = await Promise.all([partRef.get()]);

      const emails = [partener.data().email];
      const text =
        `A fost înregistrată o nouă cerere de către` +
        ` ${oldV.utilizator.numeUtilizator}, ` +
        `din ${oldV.utilizator.localitate}, ${oldV.utilizator.judet}.` +
        `pentru anuntul ${oldV.oferta.titluOferta}` +
        `Pentru detalii suplimentare accesați www.jobsmd.ro`;

      const mailOptions = (email) => ({
        from: "exclusivmd@creditemedicale.ro",
        to: email,
        subject: `Noua cerere pentru ${oldV.oferta.titluOferta}`,
        text,
      });

      for (const email of emails) {
        try {
          await transporter.sendMail(mailOptions(email));
          console.log(`Email trimis cu succes la: ${email}`);
        } catch (error) {
          console.error(`Eroare trimiterea emailului la ${email}: `, error);
        }
      }
    } catch (error) {
      console.error("Eroare la preluarea datelor utilizatorilor: ", error);
    }

    return null;
  });

exports.sendDeactivationEmailsAnunturi = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("Europe/Bucharest")
  .onRun(async (context) => {
    const today = new Date().toISOString().slice(0, 10);
    const usersRef = admin.firestore().collection("UsersUber");

    const querySnapshot = await usersRef.get();
    const emailsToSend = [];

    for (const doc of querySnapshot.docs) {
      const oR = doc.ref.collection("Anunturi");
      const oS = await oR.where("dataDezactivare", "==", today).get();
      if (!oS.empty) {
        const userData = doc.data();
        const userEmail = userData.email;
        oS.forEach((offerDoc) => {
          emailsToSend.push({
            email: userEmail,
            offerTitle: offerDoc.data().titluOferta,
          });
        });
      }
    }

    for (const { email, offerTitle } of emailsToSend) {
      const cText = "Pentru detalii suplimentare accesați www.jobsmd.ro";
      const text = `Anuntul ${offerTitle} a expirat astăzi. ${cText}`;
      const mailOptions = {
        from: "exclusivmd@creditemedicale.ro",
        to: email,
        subject: `Expirare anunt ${offerTitle}`,
        text,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email trimis cu succes la: ${email}`);
      } catch (error) {
        console.error(`Eroare la trimiterea emailului la ${email}: `, error);
      }
    }

    return null;
  });
