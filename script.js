document.addEventListener("DOMContentLoaded", () => {
  var fileInput = document.getElementById("file");
  var submitButton = document.getElementById("submit");

  submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission

    let file = fileInput.files;
    let xhr = new XMLHttpRequest();
    let convertmode = document.querySelector('input[name="converttype"]:checked').value;
    xhr.open("POST", "/converter.php", true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // Handle the response if needed

        if (xhr.responseText === "error") {
          alert("Error");
          return;
        }

        const responses = xhr.responseText.split("\n").filter(Boolean);
        const status = responses.map((response) => response.split(":")[1]);
        console.log(status);
        alert("done");
      }
    };

    var formData = new FormData();
    for (var i = 0; i < file.length; i++) {
      formData.append("files[]", file[i]);
    }
    console.log(formData.getAll("files[]"));
    formData.append("query", convertmode);

    xhr.send(formData);
  });
});
