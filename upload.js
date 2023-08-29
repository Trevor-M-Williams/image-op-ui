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
});

document
  .querySelector("#addKeywordGroup")
  .addEventListener("click", addKeywordGroup);

function addKeyword(parentDiv) {
  const keywordDiv = document.createElement("div");
  keywordDiv.classList.add("flex", "mb-1");

  const input = document.createElement("input");
  input.classList.add("grow", "border", "min-w-0", "p-2", "rounded");
  input.type = "text";
  input.placeholder = "Enter keyword";
  keywordDiv.appendChild(input);

  const removeButton = document.createElement("button");
  removeButton.innerHTML = `
      <svg class="ml-2" height="20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    `;
  removeButton.type = "button";
  removeButton.addEventListener("click", function () {
    keywordDiv.remove();
  });
  keywordDiv.appendChild(removeButton);

  parentDiv.appendChild(keywordDiv);
}

function addKeywordGroup() {
  const keywordGroupDiv = document.createElement("div");
  keywordGroupDiv.classList.add(
    "keyword-group",
    "border",
    "p-2",
    "my-2",
    "flex",
    "flex-col",
    "rounded"
  );

  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("flex", "justify-between", "mb-1");
  keywordGroupDiv.appendChild(buttonsDiv);

  const addKeywordButton = document.createElement("button");
  addKeywordButton.innerHTML = `
    <svg height="20" width="20" fill="green" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g data-name="add" id="add-2"> <g> <line fill="none" stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="19" y2="5"></line> <line fill="none" stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" x2="19" y1="12" y2="12"></line> </g> </g> </g> </g></svg>
  `;
  addKeywordButton.type = "button";
  addKeywordButton.addEventListener("click", function () {
    addKeyword(keywordGroupDiv);
  });
  buttonsDiv.appendChild(addKeywordButton);

  const removeGroupButton = document.createElement("button");
  removeGroupButton.innerHTML = `
  <svg height="20" width="20" fill="#c00" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path></g></svg>
  `;
  removeGroupButton.type = "button";
  removeGroupButton.addEventListener("click", function () {
    keywordGroupDiv.remove();
  });
  buttonsDiv.appendChild(removeGroupButton);

  document.getElementById("keywordGroups").appendChild(keywordGroupDiv);
  addKeyword(keywordGroupDiv);
}

function updateStatus(fileCount) {
  let dropzone = document.getElementById("dropzone");
  let status = document.getElementById("status");
  status.textContent = `${
    fileCount > 1 ? fileCount + " files" : "1 file"
  } selected.`;
  dropzone.classList.remove("error");
}

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

  const latitude = document.querySelector("#latitude").value;
  const longitude = document.querySelector("#longitude").value;
  const variance = document.querySelector("[type='checkbox']").checked;
  const location = document.querySelector("#location").value;
  const keywordGroups = document.querySelectorAll(".keyword-group");
  const allKeywords = Array.from(keywordGroups).map((group) => {
    const keywordInputs = group.querySelectorAll("input");
    return Array.from(keywordInputs).map((input) => input.value);
  });

  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("variance", variance);
  formData.append("location", location);
  formData.append("keywords", JSON.stringify(allKeywords));

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
  const dropzone = document.getElementById("dropzone");
  dropzone.classList.remove("dropped");
  const status = document.getElementById("status");
  status.textContent = "";

  const keywordGroups = document.querySelectorAll(".keyword-group");
  keywordGroups.forEach((group) => group.remove());
}
