import "./invoice.css";
import MetaData from "../Layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { ImPrinter } from "react-icons/im";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import Loader from "../Layout/Loader";
import { useEffect } from "react";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Invoice = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
  } = order;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  const handleDownload = () => {
    const input = document.getElementById("order-invoice");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });
      // const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`invoice_${order?._id}.pdf`);
    });
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="Invoice" />
      <div className="flex items-center min-h-[80vh] bg-white justify-center">
        <div className="order-invoice my-5 max-w-[800px] w-[100%] bg-white p-8">
          <div className="flex items-center justify-center mb-5">
            <button
              className="flex items-center justify-center gap-4 bg-green-600 border border-bg-green-600 hover:bg-green-700 text-white px-6 py-1 rounded transition cursor-pointer"
              onClick={handleDownload}
            >
              <ImPrinter size={22} className="text-white" />
              <p className="text-white">Download Invoice</p>
            </button>
          </div>
          <div id="order-invoice" className="p-3 border text-left">
            <header className="clearfix">
              <div id="logo" className="flex items-center justify-center">
                <img src="/images/invoice-logo.png" alt="Company Logo" />
              </div>
              <h1>INVOICE # {order?._id}</h1>
              <div id="company" className="clearfix">
                <div>ShopIT</div>
                <div>
                  455 Foggy Heights,
                  <br />
                  AZ 85004, US
                </div>
                <div>(602) 519-0450</div>
                <div>
                  <Link to="mailto:info@shopit.com">info@shopit.com</Link>
                </div>
              </div>
              <div id="project">
                <div>
                  <span>Name</span> {user?.name}
                </div>
                <div>
                  <span>EMAIL</span> {user?.email}
                </div>
                <div>
                  <span>PHONE</span> {shippingInfo?.phoneNo}
                </div>
                <div>
                  <span>ADDRESS</span>{" "}
                  {`${shippingInfo?.address}, ${shippingInfo?.city}, ${shippingInfo?.zipCode}, ${shippingInfo?.country}`}
                </div>
                <div>
                  <span>DATE</span>{" "}
                  {new Date(order?.createdAt).toLocaleString("en-US")}
                </div>
                <div>
                  <span>Status</span> {paymentInfo?.status?.toUpperCase()}
                </div>
              </div>
            </header>
            <main>
              <table>
                <thead>
                  <tr>
                    <th className="service">ID</th>
                    <th className="desc">NAME</th>
                    <th>PRICE</th>
                    <th>QTY</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems?.map((item, idx) => (
                    <tr key={item?.product || idx}>
                      <td className="service">{item?.product}</td>
                      <td className="desc">{item?.name}</td>
                      <td className="unit">${item?.price}</td>
                      <td className="qty">{item?.quantity}</td>
                      <td className="total">${item?.price * item?.quantity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4">
                      <b>SUBTOTAL</b>
                    </td>
                    <td className="total">${order?.itemsPrice}</td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      <b>TAX 15%</b>
                    </td>
                    <td className="total">${order?.taxAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      <b>SHIPPING</b>
                    </td>
                    <td className="total">${order?.shippingAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="grand total">
                      <b>GRAND TOTAL</b>
                    </td>
                    <td className="grand total">${order?.totalAmount}</td>
                  </tr>
                </tbody>
              </table>
              <div id="notices" style={{ marginTop: '32px', textAlign: 'left' }}>
                <div className="font-bold">NOTICE:</div>
                <div className="notice">
                  A finance charge of 1.5% will be made on unpaid balances after
                  30 days.
                </div>
              </div>
            </main>
            <footer>
              This is a computer generated invoice and is valid without the
              signature.
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
