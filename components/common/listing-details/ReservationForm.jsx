import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ReservationForm = ({ slot, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    telefon: "",
    email: "" // câmpul nou pentru email
  });
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validare simplă: toate câmpurile trebuie completate
    if (
      !formData.nume.trim() ||
      !formData.prenume.trim() ||
      !formData.telefon.trim() ||
      !formData.email.trim() // verificăm și emailul
    ) {
      showAlert("Te rog completează toate câmpurile!", "danger");
      return;
    }
    // Apelăm funcția onSubmit din componenta părinte, trimițând datele formularului și informațiile despre slot
    onSubmit({ ...formData, slot });
  };

  return (
    <div className="reservation-dialog-overlay">
      <div className="reservation-dialog">
        <div
          className="reservation-dialog-header mt-3"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <h2>Finalizează Rezervarea</h2>
          <button className="btn btn-danger" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>
        <div className="reservation-summary" style={{ marginBottom: "20px" }}>
          <p>
            <strong>Data:</strong> {slot.start.split("T")[0]}
          </p>
          <p>
            <strong>Interval orar:</strong> {slot.title.replace("Slot: ", "")}
          </p>
        </div>
        <form className="contact_form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  type="text"
                  name="nume"
                  className="form-control"
                  placeholder="Nume"
                  value={formData.nume}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* End col-md-6 */}
            <div className="col-md-6">
              <div className="form-group">
                <input
                  type="text"
                  name="prenume"
                  className="form-control"
                  placeholder="Prenume"
                  value={formData.prenume}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* End col-md-6 */}
            <div className="col-md-12 my-3">
              <div className="form-group">
                <input
                  type="tel"
                  name="telefon"
                  className="form-control"
                  placeholder="Număr de telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* End col-md-12 */}
            <div className="col-md-12 my-3">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* End câmp email */}
            <div className="col-md-12">
              <div className="form-group mb0">
                <button type="submit" className="btn btn-lg btn-thm">
                  Confirmă Rezervarea
                </button>
              </div>
            </div>
          </div>
        </form>
        {alert.message && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationForm;
