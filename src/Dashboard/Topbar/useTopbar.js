import { useState } from "react";

const useTopbar = () => {
  const [search, setSearch] = useState("");

  const data = {
    search,
  };

  const meth = {
    handleSearch: (e) => setSearch(e.target.value),
  };

  const result = { ...data, ...meth };
  return result;
};

export default useTopbar;