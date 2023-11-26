document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit");
  const convertType = document.getElementsByName("converttype");

  submitButton.addEventListener("click", startConvert);
  convertType.forEach((radio) => {
    radio.addEventListener("change", resetFileInput);
  });
});

function startConvert(e) {
  e.preventDefault(); // Prevent default form submission

  let convertmode = document.querySelector('input[name="converttype"]:checked').value;
  let fileInput = document.getElementById("file");
  let file = fileInput.files;

  // check if file is selected
  if (file.length === 0) {
    alert("Please select a file");
    return;
  }

  // check if one of the file is not the same format as the other
  const fileFormats = [...file].map((file) => file.name.split(".").pop());
  if (fileFormats.some((format) => format !== fileFormats[0])) {
    if(convertmode === 'pdf' ) alert("Please select only pdf files");
    else alert("Please select only txt files");
    return;
  }

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/converter.php", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Handle the response if needed
      if (xhr.responseText === "error") {
        alert("Error");
        return;
      }

      logReponse(xhr);
    }
  };

  var formData = new FormData();
  for (var i = 0; i < file.length; i++) {
    formData.append("files[]", file[i]);
  }
  console.log(formData.getAll("files[]"));
  formData.append("query", convertmode);

  xhr.send(formData);
}

function logReponse(xhr) {
  // split response into filenames and status (success or error)
  const responses = xhr.responseText.split("\n").filter(Boolean);
  responses.pop(); // remove last empty element
  const filenames = responses.map((response) => response.split(":")[0]);
  const status = responses.map((response) => response.split(":")[1]);

  // merge filenames and status into an object
  const files = filenames.map((filename, index) => ({
    filename,
    status: status[index],
  }));

  // create links for each file
  files.map((file) => {
    const link = document.createElement("a");
    link.innerHTML = file.filename;
    link.href = "files/import/" + file.filename;
    link.download = file.filename;

    const output = document.getElementById("outputlinks");
    output.appendChild(link);
  });

  // alert user that conversion is done
  console.log(files);
  alert("done");
}

function resetFileInput() {
  const fileInput = document.getElementById("file");
  fileInput.value = "";
  fileInput.files = null;
}
