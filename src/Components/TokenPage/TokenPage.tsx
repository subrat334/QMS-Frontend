import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/Utkal_BW_Logo.png";

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

      <div
        style={{
          width: "80mm",
          height: "80mm",
          padding: "0mm",
          display: "flex",
          justifyContent: "center",
        }}
      >
       <div
  id="print-area"
  style={{
    width: "80mm",
    height: "80mm",

    // 🔥 Adjusted padding to remove extra white space
    padding: "20px 2px 38px 2px",
    // top | right | bottom | left

    border: "3px solid #000",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
  }}
>

          {/* LOGO */}
          <div
            style={{
              width: "100%",
              // height: "auto",
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
                // height: "50px",
                fontWeight: "bold",
                objectFit: "contain",
              }}
            />
            
          </div>

          {/* SUBCATEGORY */}
          <div style={{ fontSize: "30px", marginBottom: "12px" , fontWeight: "bold"}}>
            {subcategory.name.toUpperCase()}
          </div>

          {/* TOKEN NUMBER */}
          <div
            style={{
              marginTop: "10px",
              marginBottom: "36px",
              fontWeight: "bold",
            }}
          >
            <div style={{ fontSize: "22px" }}>TOKEN NO.</div>
            <div style={{ fontSize: "34px" }}>{tokenNumber}</div>
          </div>


          {/* DATE */}
          <div
            style={{
              fontSize: "20px",
              marginTop: "35px",
              marginBottom: "0px",
              fontWeight: "bold",
            }}
          >
            {dateTime}
          </div>
        </div>
      </div>

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
