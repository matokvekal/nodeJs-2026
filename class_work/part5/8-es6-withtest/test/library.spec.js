import app, { Library } from '../server.js';

describe('Library System', () => {

  describe('Managing Books', () => {
    let library;

    beforeEach(() => {
      library = new Library();
      library.addBook('The Great Gatsby');
      library.addBook('1984');
      library.addBook('To Kill a Mockingbird');
    });

    it('The book exists in the library', () => {
      expect(library.findBook('The Great Gatsby')).toBe(true);
    });

    it('The book does not exist in the library', () => {
      expect(library.findBook('Moby Dick')).toBe(false);
    });

    it('Checks the number of books in the library', () => {
      expect(library.books.length).toEqual(3);
    });

    it('The library books should be stored in an array', () => {
      expect(Array.isArray(library.books)).toBe(true);
    });

    it('The library should have specific books', () => {
      expect(library.books).toEqual(['The Great Gatsby', '1984', 'To Kill a Mockingbird']);
    });

    it('The library should have a property named books', () => {
      expect(library).toHaveProperty('books');
    });

    it('Checks that the number of books in the library is > 0', () => {
      expect(library.books.length).toBeGreaterThan(0);
    });

    it('Checks that the number of books in the library is 3', () => {
      expect(library.books.length).toEqual(3);
    });
  });

});
