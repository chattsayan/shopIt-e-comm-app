import { useEffect } from "react";

const MetaData = ({ title }) => {
  useEffect(() => {
    document.title = `${title} - ShopIT`;
  }, [title]);

  return null;
};

export default MetaData;
