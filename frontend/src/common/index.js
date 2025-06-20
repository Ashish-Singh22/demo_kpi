
const backendDomain = "http://localhost:8080"

const SummaryApi = {

  workerPickingUpload: {
    url: `${backendDomain}/api/workerPickingUpload`,
    method: "post",
  },
  workerPackingUpload: {
    url: `${backendDomain}/api/workerPackingUpload`,
    method: "post",
  },
  dpmoUpload: {
    url: `${backendDomain}/api/dpmo`,
    method: "post",
  },
  dnShipmentUpload: {
    url: `${backendDomain}/api/shipment-upload`,
    method: "post",
  },
  dnProductivityUpload: {
    url: `${backendDomain}/api/productivity-upload`,
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
  findPacker: {
    url: `${backendDomain}/api/find-packer`,
    method: "post",
  },
  findShipment: {
    url: `${backendDomain}/api/find-shipment`,
    method: "post",
  },  
  findProductivity: {
    url: `${backendDomain}/api/find-productivity`,
    method: "post",
  },
};
export default SummaryApi