import express from "express"; // ES6 syntax
const app = express();
const PORT = 3000;

class Library {
  constructor() {
    this.books = [];
  }

  addBook(title) {
    this.books.push(title);
  }

  removeBook(title) {
    const index = this.books.indexOf(title);
    if (index > -1) {
      this.books.splice(index, 1);
    }
  }

  totalBooks() {
    return this.books.length;
  }

  findBook(title) {
    return this.books.includes(title);
  }
}

// Exposing an endpoint to interact with the Library
app.get("/addBook/:title", (req, res) => {
  const library = new Library();
  library.addBook(req.params.title);
  res.send(`Book ${req.params.title} added!`);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

export default app; 
export { Library };
