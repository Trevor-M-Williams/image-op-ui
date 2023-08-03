// let url = "http://localhost:5000/api/upload";
let url = "https://image-op-server-production.up.railway.app/api/upload";

document.addEventListener("DOMContentLoaded", function () {
  let dropzone = document.getElementById("dropzone");
  let fileInput = document.getElementById("file");

  dropzone.ondragover = function () {
    dropzone.classList.add("dragover");
    return false;
  };

  dropzone.ondragleave = function () {
    dropzone.classList.remove("dragover");
    return false;
  };

  dropzone.ondrop = function (e) {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    dropzone.classList.add("dropped");
    let status = document.getElementById("status");
    status.classList.remove("error");
    fileInput.files = e.dataTransfer.files;
    updateStatus(fileInput.files.length);
  };

  dropzone.onclick = function () {
    fileInput.click();
  };

  fileInput.onchange = function () {
    updateStatus(this.files.length);
  };

  function updateStatus(fileCount) {
    let dropzone = document.getElementById("dropzone");
    let status = document.getElementById("status");
    status.textContent = `${
      fileCount > 1 ? fileCount + " files" : "1 file"
    } selected.`;
    dropzone.classList.remove("error");
  }
});

document.querySelector("#form").addEventListener("submit", function (event) {
  event.preventDefault();

  let formData = new FormData();
  let files = document.querySelector("#file").files;

  if (files.length === 0) {
    let status = document.getElementById("status");
    status.textContent = "No files selected.";
    status.classList.add("error");
    return;
  }

  // Get latitude, longitude, and variance
  let latitude = document.querySelector("#latitude").value;
  let longitude = document.querySelector("#longitude").value;
  let variance = document.querySelector("[type='checkbox']").checked;

  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("variance", variance);

  for (let i = 0; i < files.length; i++) {
    formData.append("image", files[i]);
  }

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "images.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      resetForm();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function resetForm() {
  document.querySelector("#form").reset();
  let dropzone = document.getElementById("dropzone");
  dropzone.classList.remove("dropped");
  let status = document.getElementById("status");
  status.textContent = "";
}
