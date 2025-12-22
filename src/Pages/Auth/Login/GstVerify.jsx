

export default function GstVerify({ gstDetails, onClose, onVerify }) {
  
console.log("gst gstDetails", gstDetails)
  if (!gstDetails) return null;

  return (
    <div className="modal show d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 rounded-4 text-center">
    <h5 className="fw-bold mb-3 text-center fs-3">GST Verification Details</h5>

         <div className="gst-details">


  <div className="gst-section">
    <p><b>Trade Name:</b> {gstDetails?.gst_response?.taxpayerInfo?.tradeNam}</p>
  </div>
  <hr />
  <div className="gst-section">
    <h6><b>Principal Address</b></h6>
    <p>
      {gstDetails?.gst_response?.taxpayerInfo?.pradr?.addr?.flno},{" "}
      {gstDetails?.gst_response?.taxpayerInfo?.pradr?.addr?.bno},{" "}
      {gstDetails?.gst_response?.taxpayerInfo?.pradr?.addr?.st},{" "}
      {gstDetails?.gst_response?.taxpayerInfo?.pradr?.addr?.loc}
    {/* </p>
    <p> */}
      {gstDetails?.gst_response?.taxpayerInfo?.pradr?.addr?.dst},{" "}
      {gstDetails?.gst_response?.taxpayerInfo?.pradr?.addr?.stcd} -{" "}
      {gstDetails?.gst_response?.taxpayerInfo?.pradr?.addr?.pncd}
    </p>

  </div>


</div>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success" onClick={onVerify}>
              Confirm
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
