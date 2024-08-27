import Image from "next/image";

const PropertyLocation = ({ coordonate }) => {
  // Construiește URL-ul de embed pentru harta Google Maps cu coordonatele specificate
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${
    coordonate?.lng
  }!3d${
    coordonate?.lat
  }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2z44Cw55'48.0%22N+25Cw26'51.2%22E!5e0!3m2!1sen!2sro!4v${Date.now()}!5m2!1sen!2sro`;

  return (
    <>
      <div className="thumb">
        <div className="h400" id="map-canvas">
          <div className="gmap_canvas ">
            <iframe title="map" className="gmap_iframe" src={mapSrc}></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyLocation;
