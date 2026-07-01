import open from "open";

setTimeout(async () => {
  try {
    await open("http://localhost:4321/style-guide");
    console.log("Opened http://localhost:4321/style-guide");
  } catch (err) {
    console.log("Could not auto-open browser — visit http://localhost:4321/style-guide manually.");
  }
}, 1800);
