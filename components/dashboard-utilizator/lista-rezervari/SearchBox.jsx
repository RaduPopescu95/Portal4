// SearchBox.jsx
const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <form className="form-group" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <label>
        <span className="flaticon-magnifying-glass"></span>
      </label>
    </form>
  );
};

export default SearchBox;
