import Link from "next/link";
import Form from "./Form";
import Image from "next/image";

const ErrorPageContent = () => {
  return (
    <div className="error_page footer_apps_widget">
      <Image
        width={266}
        height={200}
        className="img-fluid img-thumb contain"
        src="/assets/images/resource/error.png"
        alt="error.png"
      />
      <div className="erro_code">
        <h1>Pagina nu a fost gasita</h1>
        <h1>Pagina nu a fost gasita</h1>
        <h1>Pagina nu a fost gasita</h1>
        <h1>Pagina nu a fost gasita</h1>
      </div>
      {/* <p>We can’t seem to find the page you’re looking for</p> */}

      {/* <Form /> */}
      {/* End form */}

      <Link href="/" className="btn btn_error btn-thm">
        Acasa
      </Link>
    </div>
  );
};

export default ErrorPageContent;
