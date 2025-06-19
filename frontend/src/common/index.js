
const backendDomain = "http://localhost:8080"

const SummaryApi = {

  workerPickingUpload: {
    url: `${backendDomain}/api/workerPickingUpload`,
    method: "post",
  },
  workerPackingUpload: {
    url: `${backendDomain}/api/worker-packing`,
    method: "post",
  },
  dpmoUpload: {
    url: `${backendDomain}/api/dpmo`,
    method: "post",
  },
  dnShipmentUpload: {
    url: `${backendDomain}/api/dn-shipment`,
    method: "post",
  },
  dnProductivityUpload: {
    url: `${backendDomain}/api/dn-productivity`,
    method: "post",
  },
  fsfFafUpload: {
    url: `${backendDomain}/api/fsf-faf`,
    method: "post",
  },
  findPicker: {
    url: `${backendDomain}/api/find-picker`,
    method: "post",
  },
};
export default SummaryApi