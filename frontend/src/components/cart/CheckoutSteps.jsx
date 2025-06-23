import React from "react";
import { Link, useLocation } from "react-router-dom";

const steps = [
  { label: "Shipping", path: "/shipping" },
  { label: "Confirm Order", path: "/confirm_order" },
  { label: "Payment", path: "/payment_method" },
];

const getActiveStep = (pathname) => {
  if (pathname.includes("shipping")) return 0;
  if (pathname.includes("confirm_order")) return 1;
  if (pathname.includes("payment")) return 2;
  return 0;
};

const CheckoutSteps = () => {
  const location = useLocation();
  const activeStep = getActiveStep(location.pathname);

  return (
    <div className="w-full flex justify-center items-center mb-8 mt-6 px-2 sm:px-0">
      <div className="flex flex-row items-center w-full max-w-2xl gap-0 sm:gap-2 md:gap-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <Link to={step.path} className="group flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-200
                    ${
                      idx < activeStep
                        ? "bg-orange-500 border-orange-500 text-white"
                        : idx === activeStep
                        ? "bg-white border-orange-500 text-orange-500"
                        : "bg-gray-200 border-gray-300 text-gray-400"
                    }
                  `}
                >
                  {idx + 1}
                </div>
                <span
                  className={`mt-2 text-xs sm:text-sm font-medium text-center transition-all duration-200
                    ${
                      idx === activeStep
                        ? "text-orange-600"
                        : idx < activeStep
                        ? "text-orange-500"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </span>
              </Link>
            </div>
            {idx !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition-all duration-200 self-center
                  ${
                    idx < activeStep
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }
                `}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
