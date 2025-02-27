import Social from "../common/footer/Social";

const AddressSidebar = () => {
  return (
    <div className="contact_localtion">
      <h4>Contactează-ne</h4>
      {/* <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In gravida quis
        libero eleifend ornare. habitasse platea dictumst.
      </p> */}
      <div className="content_list">
        <h5>Adresa</h5>
        <p>
          Bucurest, str. Cernauti, <br />
          nr.1B
        </p>
      </div>
      <div className="content_list">
        <h5>Numar de telefon</h5>
        <p>0999888777</p>
      </div>
      <div className="content_list">
        <h5>Mail</h5>
        <p>info@gmail.com</p>
      </div>
      {/* <h5>Urmărește-ne</h5> */}
      {/* <ul className="contact_form_social_area">
        <Social />
      </ul> */}
    </div>
  );
};

export default AddressSidebar;
