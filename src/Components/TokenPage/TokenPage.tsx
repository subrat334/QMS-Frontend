
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/utkal.png";

interface Subcategory {
  id: number;
  name: string;
  description?: string;
}

const TokenPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { subcategory, tokenResponse } =
    (location.state as {
      subcategory: Subcategory;
      tokenResponse: any;
    }) || {};

  const [dateTime, setDateTime] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now
      .toLocaleString("en-GB", { hour12: false })
      .replace(",", " /");
    setDateTime(formatted);

    // ⭐ USE API TOKEN
    if (tokenResponse?.Token) {
      setTokenNumber(tokenResponse.Token);
    }
  }, [tokenResponse]);

  useEffect(() => {
    if (!subcategory) return;

    setTimeout(() => window.print(), 300);

    const afterPrint = () => navigate("/Kiosk");
    window.addEventListener("afterprint", afterPrint);

    return () => window.removeEventListener("afterprint", afterPrint);
  }, [subcategory, navigate]);

  if (!subcategory) return null;

  return (
    <div className="bg-white flex items-center justify-center min-h-screen">

      {/* OUTER PAPER WIDTH (79mm) */}
      <div
        style={{
          width: "79mm",
          padding: "2mm",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* TOKEN BORDER BOX (70mm) */}
        <div
          id="print-area"
          style={{
            width: "70mm",
            padding: "12px",
            paddingTop: "18px",
            border: "2px solid #000",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* LOGO */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: "150px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* SUBCATEGORY */}
          <div style={{ fontSize: "17px", fontWeight: "bold" }}>
            {subcategory.name.toUpperCase()}
          </div>

          {/* TOKEN NUMBER from API */}
          <div
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            TOKEN NO.: {tokenNumber}
          </div>

          {/* DATE */}
          <div
            style={{
              fontSize: "11px",
              marginTop: "15px",
            }}
          >
            {dateTime}
          </div>
        </div>
      </div>

      {/* PRINT CSS */}
      <style>
        {`
          @media print {
            @page {
              size: 79mm auto;
              margin: 0;
            }

            body * {
              visibility: hidden;
            }

            #print-area, #print-area * {
              visibility: visible;
            }

            #print-area {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              margin: auto;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TokenPage;
