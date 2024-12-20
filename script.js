document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit");
  const fileInput = document.getElementById("dropzone-file");
  const filenames = document.getElementById("filenames");

  submitButton.addEventListener("click", startConvert);

  fileInput.addEventListener("change", () => {
    // reset filenames
    // only reset the new uploaded files not the converted ones
    filenames.querySelectorAll(".uploads").forEach((upload) => {
      if (!upload.classList.contains("download")) {
        upload.remove();
      }
    });

    // add filenames to DOM
    for (let i = 0; i < fileInput.files.length; i++) {
      addFileNamesToDOM(fileInput.files[i].name);
    }
  });
});

function addFileNamesToDOM(filename) {
  // create a div for the filename and add it to the DOM
  const container = document.createElement("div");
  container.classList.add("uploads");
  container.setAttribute("id", filename);

  // create a p tag for the filename and add it to the div
  const names = document.createElement("p");
  names.innerHTML = filename;

  // create an x button to remove the file and add it to the div
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("transition");
  removeBtn.innerHTML = "x";

  // add event listener to remove the file
  removeBtn.addEventListener("click", () => {
    removeFile(filename);
  });

  // add the elements to the DOM
  container.appendChild(names);
  container.appendChild(removeBtn);
  filenames.appendChild(container);
}

function removeFile(filename) {
  const fileinput = document.getElementById("dropzone-file");
  // remove file from fileinput
  const filteredFiles = [...fileinput.files].filter((file) => file.name !== filename);

  // add the old remaining files to the fileinput
  const dataTransfer = new DataTransfer();
  filteredFiles.forEach((file) => dataTransfer.items.add(file));
  fileinput.files = dataTransfer.files;

  // remove the file container from DOM
  const container = document.getElementById(filename);
  container.remove();
}

function startConvert(e) {
  e.preventDefault(); // Prevent default form submission

  let convertmode = document.querySelector('input[name="converttype"]:checked').value;
  let fileInput = document.getElementById("dropzone-file");
  let file = fileInput.files;

  // check if file is selected
  if (file.length === 0) {
    alert("Please select a file");
    return;
  }

  // check if one of the file is not the same format as the other (VALIDATION)
  const fileFormats = [...file].map((file) => file.name.split(".").pop());
  if (fileFormats.some((format) => format !== fileFormats[0])) {
    if (convertmode === "pdf") alert("Please select only pdf files");
    else alert("Please select only txt files");
    return;
  } else {
    if (convertmode === "pdf" && fileFormats[0] !== "pdf")
      return alert("Please select only pdf files");
    if (convertmode === "txt" && fileFormats[0] !== "txt")
      return alert("Please select only txt files");
  }

  disableUpload();

  // Send the file data to the server using a post request
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/converter.php", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Handle the response if needed
      if (xhr.responseText === "error") {
        alert("Error");
        return;
      }

      // log response to console and enable upload button
      logReponse(xhr);
      enableUpload();
    }
  };

  // Create a new FormData instance and append files to send to the server
  var formData = new FormData();
  for (var i = 0; i < file.length; i++) {
    formData.append("files[]", file[i]);
  }
  // console.log(formData.getAll("files[]"));
  formData.append("query", convertmode);

  xhr.send(formData);
}

// enable upload button and remove toast
function disableUpload() {
  const box = document.getElementById("box");
  box.classList.add("disabled");
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = `<svg aria-hidden="true" id = "loadingsvg" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg><p class="text-cs-black2 text-sm md:text-base font-bold">Converting...</p>`;
  document.body.appendChild(toast);
}

// enable upload button and remove toast
function enableUpload() {
  const box = document.getElementById("box");
  box.classList.remove("disabled");
  const toast = document.querySelector(".toast");
  toast.remove();
}

function logReponse(xhr) {
  const formats = ["pdf", "txt"];
  // split response into filenames and status (success or error)
  const responses = xhr.responseText.split("\n").filter(Boolean);
  const filenames = responses
    .map(
      // if found the format name in the response, return the filename
      (response) => (formats.some((format) => response.includes(format)) ? response : null)
    )
    .filter(Boolean);
  const status = filenames.map((filename) => filename.split(" ")[1]);

  // merge filenames and status into an object
  const files = filenames.map((filename, index) => ({
    filename: filename.split(":")[0],
    status: status[index],
  }));

  // create links for each file
  files.map((file) => {
    // console.log(file);
    const link = document.createElement("a");
    link.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>`;
    link.href = "files/import/" + file.filename.split(":")[0];
    link.download = file.filename;
    link.setAttribute("title", "Download file");

    const filename = file.filename;
    const oldconvertmode = filename.split(".")[1] === "pdf" ? "txt" : "pdf";
    const filenamediv = document.getElementById(filename.split(".")[0] + "." + oldconvertmode);

    // add the download class to show that it is downloadable
    filenamediv.classList.add("download");
    // remove the x button
    filenamediv.lastChild.remove();
    //remove the old filename
    filenamediv.lastChild.remove();
    // add the new filename
    const name = document.createElement("p");
    name.innerHTML = file.filename;
    filenamediv.appendChild(name);
    // add the link to the div
    filenamediv.appendChild(link);
  });

  // alert user that conversion is done
  // console.log(files);
  // alert("done");
}
