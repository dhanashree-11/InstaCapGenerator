document.querySelectorAll(".drop_input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop_zone");
  
    dropZoneElement.addEventListener("click", (e) => {
      inputElement.click();
    });
  
    inputElement.addEventListener("change", (e) => {
      if (inputElement.files.length) {
        updateThumbnail(dropZoneElement, inputElement.files[0]);
      }
    });
  
    dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneElement.classList.add("drop_zone--over");
    });
  
    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("drop_zone--over");
      });
    });
  
    dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
  
      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
        updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
      }
  
      dropZoneElement.classList.remove("drop_zone--over");
    });
  });
  
  /**
   * Updates the thumbnail on a drop zone element.
   *
   * @param {HTMLElement} dropZoneElement
   * @param {File} file
   */
  function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop_zone--thumb");
  
    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
      dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }
  
    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop_zone--thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }
  
    thumbnailElement.dataset.label = file.name;
  
    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      };
    } else {
      thumbnailElement.style.backgroundImage = null;
    }
  }
  
  function getCaptions() {
    var image_input = document.getElementById("image_input");
    var static_heading = document.getElementById("static_heading");
    var child_right = document.getElementById("child_right");
  
    if (image_input.files.length != 0) {
      static_heading.innerHTML = "Processing...";
  
      // creating dynamic h1 for heading
      var h1 = document.createElement("h1");
      h1.innerHTML = "Captions aree as follows:-";
      h1.setAttribute("id", "dynamic_heading");
  
      var caption_list = document.createElement("div");
      caption_list.classList.add("caption_list");
  
      var formData = new FormData();
      formData.append("file", image_input.files[0]);
  
      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      }).then(async (response) => {
        response = await response.json();
        console.log(response);
        var captions = response["captions"];
        for (let index = 0; index < captions.length; index++) {
          var caption = captions[index];
          var list_item = document.createElement("div");
          list_item.classList.add("listit");
  
          list_item.innerHTML = caption.caption;
  
          caption_list.appendChild(list_item);
        }

      });
  
      child_right.appendChild(h1);
      child_right.appendChild(caption_list);
  
      static_heading.style = "display: none";
    } else {
      alert("Please upload an image!");
    }
  }
  