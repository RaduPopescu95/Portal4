import Image from "next/image";
// import ArticleEditor from "./QuillForm";

const GalerieFotoSection = ({
  // handleInputChange,
  // formValues,
  propertySelectedImgs,
  multipleImage,
  deleteImage,
  isEdit,
  isNewImage,
}) => {
  return (
    <>
      {/* End .col */}

      <div className="col-lg-12">
        <ul className="mb-0">
          {propertySelectedImgs.length > 0
            ? propertySelectedImgs?.map((item, index) => (
                <li key={index} className="list-inline-item">
                  <div className="portfolio_item">
                    <Image
                      width={200}
                      height={200}
                      className="img-fluid cover"
                      src={
                        item instanceof File
                          ? URL.createObjectURL(item)
                          : item.finalUri
                      }
                      alt="fp1.jpg"
                    />

                    <div
                      className="edu_stats_list"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Delete"
                      data-original-title="Delete"
                    >
                      <a onClick={() => deleteImage(item)}>
                        <span className="flaticon-garbage"></span>
                      </a>
                    </div>
                  </div>
                </li>
              ))
            : undefined}

          {/* End li */}
        </ul>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="portfolio_upload">
          <input
            type="file"
            onChange={multipleImage}
            multiple
            accept="image/png, image/gif, image/jpeg"
          />
          <div className="icon">
            <span className="flaticon-download"></span>
          </div>
          <p>Drag and drop imagini aici</p>
        </div>
      </div>
      {/* End .col */}
    </>
  );
};

export default GalerieFotoSection;
