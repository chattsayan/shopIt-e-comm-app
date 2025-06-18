import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword?.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex items-center w-full">
      <input
        type="text"
        placeholder="Search products..."
        name="keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="h-9 sm:h-10 p-2 sm:p-3 bg-white text-black rounded-l-full w-full text-sm sm:text-base"
      />
      <button
        type="submit"
        className="h-9 sm:h-10 bg-amber-500 p-2 sm:p-2.5 rounded-r-full hover:bg-amber-600"
      >
        <IoSearchOutline size={18} />
      </button>
    </form>
  );
};

export default Search;
