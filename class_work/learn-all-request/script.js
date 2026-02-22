// Form with Fetch API
document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  fetch("http://localhost:3000/submit", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function submitForm(event, url, method) {
  event.preventDefault();
  let formData = {};

  if (method === "fetch") {
    formData = {
      first_name: document.getElementById("fname").value,
      last_name: document.getElementById("lname").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else if (method === "axios") {
    formData = {
      first_name: document.getElementById("fname2").value,
      last_name: document.getElementById("lname2").value,
      address: document.getElementById("address2").value,
      phone: document.getElementById("phone2").value,
    };

    axios
      .post(url, formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Form with Axios
document.getElementById("form3").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(this);

  //using then and catch
  axios
    .post("http://localhost:3000/submit", formData)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Form with Axios
document
  .getElementById("form3")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
      const formData = new FormData(this);
      const response = await axios.post(
        "http://localhost:3000/submit",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  });
