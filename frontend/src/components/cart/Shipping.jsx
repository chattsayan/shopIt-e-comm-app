import { useEffect, useState } from "react";
import MetaData from "../Layout/MetaData";
import { countries } from "countries-list";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../redux/slice/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";

const Shipping = () => {
  const countriesList = Object.values(countries);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state.cart);

  useEffect(() => {
    if (shippingInfo) {
      setAddress(shippingInfo?.address);
      setCity(shippingInfo?.city);
      setCountry(shippingInfo?.country);
      setZipCode(shippingInfo?.zipCode);
      setPhoneNo(shippingInfo?.phoneNo);
    }
  }, [shippingInfo]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingInfo({ address, city, country, zipCode, phoneNo }));
    navigate("/confirm_order");
  };

  return (
    <>
      <MetaData title={"Shipping"} />
      <CheckoutSteps />
      <div className="flex items-center justify-center min-h-[80vh] py-8 px-2">
        <div className="w-full max-w-md rounded-xl shadow-lg p-8">
          <form onSubmit={submitHandler}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
              Shipping Info
            </h2>
            <div className="mb-3">
              <label
                htmlFor="address_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address_field"
                placeholder="Enter your address"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="city_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                City
              </label>
              <input
                type="text"
                id="city_field"
                placeholder="Enter City"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="phone_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Phone No
              </label>
              <input
                type="tel"
                id="phone_field"
                placeholder="Enter Phone Number"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="phoneNo"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="pin_code_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                ZipCode
              </label>
              <input
                type="number"
                id="pin_code_field"
                placeholder="Enter ZipCode"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="country_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Country
              </label>
              <select
                id="country_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                {countriesList.map((country) => (
                  <option key={country?.name} value={country?.name}>
                    {country?.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors cursor-pointer mt-4"
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;
