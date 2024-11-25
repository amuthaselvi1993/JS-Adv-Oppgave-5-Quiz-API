const baseUrl = "https://opentdb.com/api.php";

fetch("https://opentdb.com/api.php?amount=10")
  .then((res) => {
    res.json().then((data) => {
      console.log(data);
    });
  })

  .catch((err) => {
    console.log(err);
  });
