document.querySelectorAll(".drop_input").forEach((InputElement) => {
  const d_zone = InputElement.closest(".drop_zone");

  d_zone.addEventListener("click", (e) => {
    InputElement.click();
  });

  InputElement.addEventListener("click", (e) => {
    if (InputElement.files.length) {
      updatethumbnail(d_zone, InputElement.files[0]);
    }
  });

  d_zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    d_zone.classList.add("drop_zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    d_zone.addEventListener(type, (e) => {
      d_zone.classList.remove("drop_zone--over");
    });
  });

  d_zone.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      InputElement.files = e.dataTransfer.files;

      updatethumbnail(d_zone, e.dataTransfer.files[0]);
    }

    d_zone.classList.remove("drop_zone--over");
  });
});

/**

 * @param {HTMLElement} d_zone

 * @param {File} file

 */

function updatethumbnail(d_zone, file) {
  let thumbnailelement = d_zone.querySelector("drop_zone__thumb");

  if (d_zone.querySelector(".prompt")) {
    d_zone.querySelector(".prompt").remove();
  }

  if (!thumbnailelement) {
    thumbnailelement = document.createElement("div");

    thumbnailelement.classList.add("drop_zone__thumb");

    d_zone.appendChild(thumbnailelement);
  }

  thumbnailelement.dataset.label = file.name;

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      thumbnailelement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailelement.style.backgroundImage = null;
  }
}

function getcaptions() {
  var imgInput = document.getElementById("img_input");

  var statHead = document.getElementById("stathead");

  var childRight = document.getElementById("right_child");

  if (imgInput.files.length != 0) {
    statHead.innerHTML = "processing";

    var h1 = document.createElement("h1");

    h1.innerHTML = "Captions aree as follows:-";

    h1.setAttribute("id", "dyHead");

    var caplist = document.createElement("div");

    caplist.classList.add("capList");

    var formData = new FormData();

    formData.append("file", imgInput.file[0]);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",

      headers: { "Content-Type": "multipart/form-data" },

      body: formData,
    }).then(async (response) => {
      response = await response.json();

      var Captions = response["captions"];

      for (let index = 0; index < Captions.length; index++) {
        var cap = Captions[index];

        var listItem = document.createElement("div");

        listItem.classList.add("listit");

        listItem.innerHTML = cap.caption;

        caplist.appendChild(listItem);
      }
    });

    childRight.appendChild(h1);

    childRight.appendChild(caplist);

    statHead.style = "display:none";
  } else {
    alert("Please Upload an image");
  }
}
