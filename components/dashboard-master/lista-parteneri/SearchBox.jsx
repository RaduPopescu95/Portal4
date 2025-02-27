const SearchBox = ({ onSearch }) => {
  const handleInputChange = (e) => {
    const query = e.target.value;
    onSearch(query);
  };

  return (
    <form
      className="d-flex flex-wrap align-items-center my-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        className="form-control mr-sm-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        onChange={handleInputChange}
      />
      <button className="my-2 my-sm-0" type="submit">
        <span className="flaticon-magnifying-glass"></span>
      </button>
    </form>
  );
};

export default SearchBox;
