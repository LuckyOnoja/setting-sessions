"use client";

import { useForm } from "react-hook-form";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";

export default function BookingForm() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(null);

  const onSubmit = (data) => {
    setFormData(data); // Set form data for modal display
    setModalOpen(true); // Open the modal
  };

  const downloadPdf = async () => {
    const modalElement = document.getElementById("modal-content");

    if (!modalElement) return;

    // Hide the buttons before taking the screenshot
    const buttons = modalElement.querySelectorAll("button");
    buttons.forEach((button) => {
      button.style.display = "none"; // Hide button
    });

    const canvas = await html2canvas(modalElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("booking-summary.pdf");

    // Show the buttons again after the screenshot
    buttons.forEach((button) => {
      button.style.display = ""; // Restore button visibility
    });
  };

  const confirmAndSend = async () => {
    setLoading(true);
    setMessage("");
  
    const emailContent = `
      THE SPACE STUDIOS
      23 Nsefik Eyo Close, Calabar

      
      Booking Summary:

      Client Info:      
      Name: ${formData.clientInfo?.name}
      Phone: ${formData.clientInfo?.phone}
      Email: ${formData.clientInfo?.email}
      City: ${formData.clientInfo?.city}
  
      Session Info:
      Type: ${formData.sessionInfo?.type}
      Date: ${formData.sessionInfo?.date}
      Start Time: ${formData.sessionInfo?.startTime}
      End Time: ${formData.sessionInfo?.endTime}
      Number of Photos: ${formData.sessionInfo?.photos}
      Number of People: ${formData.sessionInfo?.people}
  
      Fees & Charges:
      Session Fee: ₦${formData.feesAndCharges?.sessionFee}
      Balance: ₦${formData.feesAndCharges?.balance}
      Delivery Date: ${formData.feesAndCharges?.addOns}

      Terms & Conditions:
      Session time starts counting from the scheduled time. Shoot
      ends at the expected time as noted on the booking form. Extra
      minute added to shoot time attracts a fee of #700 per minute and ₦7000 for each extra picture
  
      Agreement:
      I/we do hereby agree to pay a booking deposit of ${formData.clientInfo?.amount} naira. 
      I understand this fee is non-refundable and that the balance must be paid prior to or on the day of the photo session. 
      All parties agree to the terms stated above and hereby accept the amounts charged.
      
      Signee: ${formData.clientInfo?.name}
      Date: ${formData.clientInfo?.date}

      Thank You!
      We appreciate you choosing GlobalPerks to capture your moments. Your support means the world!
    `;
  
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent, // Send the email content
          recipientEmail: formData.clientInfo?.email, // Send the client's email address
        }),
      });
  
      if (response.ok) {
        alert("Email sent successfully!");
        reset();
        setModalOpen(false); // Close the modal
      } else {
        setMessage("Failed to send email.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[80%] mx-auto p-6 bg-pink-400 border border-gray-300 rounded-lg mt-10 font-sans"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl text-center font-bold text-gray-700 uppercase tracking-wide">
            Booking Form
          </h1>
          <p>@GlobalPerks</p>
          <p>23 Nsefik Eyo Close, Calabar</p>
        </div>

        {/* Client Info */}
        <section className="mb-8">
          <h2 className="text-lg text-black font-semibold mb-4 uppercase tracking-wider">
            Client Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              {...register("clientInfo.name", { required: true })}
              type="text"
              placeholder="Name"
              className="p-3 border border-black rounded"
            />
            <input
              {...register("clientInfo.phone", { required: true })}
              type="tel"
              placeholder="Phone"
              className="p-3 border border-black rounded"
            />
            <input
              {...register("clientInfo.email", { required: true })}
              type="email"
              placeholder="Email"
              className="p-3 border border-black rounded"
            />
            <input
              {...register("clientInfo.city")}
              type="text"
              placeholder="City"
              className="p-3 border border-gray-300 rounded"
            />
          </div>
        </section>

        {/* Session Info */}
        <section className="mb-8">
          <h2 className="text-lg text-black font-semibold mb-4 uppercase tracking-wider">
            Session Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              {...register("sessionInfo.type", { required: true })}
              type="text"
              placeholder="Type of Session"
              className="p-3 border border-gray-300 rounded"
            />
            <input
              {...register("sessionInfo.date", { required: true })}
              type="text"
              placeholder="Shoot Date"
              className="p-3 border border-gray-300 rounded"
            />
            <div className="flex flex-col  gap-3">
              <p>Start Time:</p>
            <input
              {...register("sessionInfo.startTime", { required: true })}
              type="time"
              className="p-3 border border-gray-300 rounded"
            />
            </div>

            <div className="flex flex-col  gap-3">
              <p>End Time:</p>
            <input
              {...register("sessionInfo.endTime", { required: true })}
              type="time"
              className="p-3 border border-gray-300 rounded"
            />
            </div>
            
            <input
              {...register("sessionInfo.photos")}
              type="number"
              placeholder="Number of Photos"
              className="p-3 border border-gray-300 rounded"
            />
            <input
              {...register("sessionInfo.people")}
              type="number"
              placeholder="Number of Persons"
              className="p-3 border border-gray-300 rounded"
            />
          </div>
        </section>

        {/* Fees & Charges */}
        <section className="mb-8">
          <h2 className="text-lg text-black font-semibold mb-4 uppercase tracking-wider">
            Fees & Charges
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              {...register("feesAndCharges.sessionFee", { required: true })}
              type="text"
              placeholder="Session Fee"
              className="p-3 border border-gray-300 rounded"
            />
            {/* <input
              {...register("feesAndCharges.tax", { required: true })}
              type="number"
              placeholder="Tax"
              className="p-3 border border-gray-300 rounded"
            /> */}
            <input
              {...register("feesAndCharges.balance", { required: true })}
              type="text"
              placeholder="Balance"
              className="p-3 border border-gray-300 rounded"
            />
            <div className=" flex flex-col  gap-3">

            Delivery Date:
            <input
              {...register("feesAndCharges.addOns")}
              type="text"
              placeholder="Delivery Date"
              className="p-3 border border-gray-300 rounded"
            />
            </div>
           
          </div>
        </section>

        {/* Agreement */}
        <section className="mb-8">
          <p className="italic">
            I/we do hereby agree to pay a booking deposit of{" "}
            <span>
              ₦ {" "}
              <input
                {...register("clientInfo.amount", { required: true })}
                type="number"
                placeholder="Amount"
                className="px-3 border border-black rounded"
              />
            </span>{" "}
             I understand this fee is non-refundable and that the balance
            must be paid prior to or on the day of the photo session. All
            parties agree to the terms stated above and hereby accept the
            amounts charged.
          </p>
          <div className="flex justify-between">
            <p>
              Signee FullName:{" "}
              <input
                {...register("clientInfo.name", { required: true })}
                type="text"
                placeholder="Signee"
                className="px-3 mt-4 border border-black rounded"
              />
            </p>
            <p className="flex gap-4 mt-4">
              Signed Date:
              <span>
                <input
                  {...register("clientInfo.date", { required: true })}
                  type="text"
                  placeholder="Name"
                  className="px-3 border border-black rounded"
                />
              </span>
            </p>
          </div>
        </section>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit Booking"}
          </button>
          {/* {message && <p className="mt-4 text-gray-600">{message}</p>} */}
        </div>
      </form>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            id="modal-content"
            className="bg-white rounded-lg overflow-y-auto w-[90%]  p-6 py-4"
          >
            <div className="text-center mb-4 flex flex-col items-center">
              <h2 className="text-xl font-bold ">Booking Summary</h2>
              <p>@GlobalPerks</p>
              <p>23 Nsefik Eyo Close, Calabar</p>
              <h3 className="font-semibold mt-4 mb-2">Terms & Conditions:</h3>
              <p className="max-w-[50%] text-center font-bold">
                Session time starts counting from the scheduled time. Shoot
                ends at the expected time as noted on the booking form. Extra
                minute added to shoot time attracts a fee of ₦700 per minute and ₦7000 for each extra picture
              </p>
            </div>
            <div className="text-left">
              <div className="grid grid-cols-3 items-center">
                <div>
                  <h3 className="font-semibold mb-2">Client Info:</h3>
                  <p>Name: {formData.clientInfo?.name}</p>
                  <p>Phone: {formData.clientInfo?.phone}</p>
                  <p>Email: {formData.clientInfo?.email}</p>
                  <p>City: {formData.clientInfo?.city}</p>
                </div>

                <div>
                  <h3 className="font-semibold mt-4 mb-2">Session Info:</h3>
                  <p>Type: {formData.sessionInfo?.type}</p>
                  <p>Date: {formData.sessionInfo?.date}</p>
                  <p>Start Time: {formData.sessionInfo?.startTime}</p>
                  <p>End Time: {formData.sessionInfo?.endTime}</p>
                  <p>Number of Photos: {formData.sessionInfo?.photos}</p>
                  <p>Number of Persons: {formData.sessionInfo?.people}</p>
                </div>

                <div>
                  <h3 className="font-semibold mt-4 mb-2">Fees & Charges:</h3>
                  <p>Session Fee: ₦{formData.feesAndCharges?.sessionFee}</p>
                  {/* <p>Tax: ${formData.feesAndCharges?.tax}</p> */}
                  <p>Balance: ₦{formData.feesAndCharges?.balance}</p>
                  <p>Delivery Date: {formData.feesAndCharges?.addOns}</p>
                </div>
              </div>

              <p className="italic mt-4">
                I/we do hereby agree to pay a booking deposit of {""}
               {formData.clientInfo?.amount} naira. I understand this fee is
                non-refundable and that the balance must be paid prior to or on
                the day of the photo session. All parties agree to the terms
                stated above and hereby accept the amounts charged.
              </p>
              <p className="flex flex-col justify-start mt-4">
                Signee: {formData.clientInfo?.name}
              </p>
              <p className="flex flex-col justify-start mt-4">
                Date: {formData.clientInfo?.date}
              </p>
            </div>
            <div className=" mt-4">
            Thank You!
            We appreciate you choosing <span className="font-[600]">GlobalPerks</span> to capture your moments. Your support means the world!
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Edit
              </button>
                <button
            onClick={downloadPdf} // Call downloadPdf to generate PDF
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading} // Disable when loading
          >
            Download PDF
          </button>
              <button
                onClick={confirmAndSend}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Sending..." : "Confirm and Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
