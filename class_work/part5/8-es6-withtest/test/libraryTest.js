import { expect } from 'chai';
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

    it('.true - The book exists in the library', () => {
      expect(library.findBook('The Great Gatsby')).to.be.true;
    });

    it('.false - The book does not exist in the library', () => {
      expect(library.findBook('Moby Dick')).to.be.false;
    });

    it('.lengthOf - Checks the number of books in the library', () => {
      expect(library.books).to.have.lengthOf(1);
    });

    it('.type - The library books should be stored in an array', () => {
      expect(library.books).to.be.an('array');
    });

    it('eql() - The library should have specific books', () => {
      library.addBook('1984');
      expect(library.books).to.eql(['The Great Gatsby', '1984']);
    });

    it('property() - The library should have a property named books', () => {
      expect(library).to.have.property('books');
    });
    it('.above - Checks that the number of books in the library is > 0', () => {
      expect(library.books).to.have.lengthOf.above(0);
    });
    
    it('.equal - Checks that the number of books in the library is 3', () => {
      expect(library.books).to.have.lengthOf(3);
    });
  });

});
