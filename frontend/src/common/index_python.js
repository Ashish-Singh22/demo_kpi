const backendDomain = "http://127.0.0.1:5000";

const SummaryApiPython = {
  sum: {
    url: `${backendDomain}/api/sum`,
    method: "post",
  },
  workerPickingUpload: {
    url: `${backendDomain}/api/workerPickingUpload`,
    method: "post",
  },
  workerPackingUpload: {
    url: `${backendDomain}/api/upload/worker-packing`,
    method: "post",
  },
  dpmoUpload: {
    url: `${backendDomain}/api/upload/dpmo`,
    method: "post",
  },
  dnShipmentUpload: {
    url: `${backendDomain}/api/upload/dn-shipment`,
    method: "post",
  },
  dnProductivityUpload: {
    url: `${backendDomain}/api/upload/dn-productivity`,
    method: "post",
  },
  fsfFafUpload: {
    url: `${backendDomain}/api/upload/fsf-faf`,
    method: "post",
  },
  filterWorkerController: {
    url: `${backendDomain}/api/filter-worker`,
    method: "post",
  },
};

export default SummaryApiPython;
