/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      bookItem: '#template-book',
    },
    books: {
      dataId: 'data-id',
      bookImg: 'book__image',
    },
    booksClass: {
      list: '.books-list',
      bookImg: '.book__image',
    }
  };

  const classNames = {
    favoriteBook: 'favorite',
    visible: 'hidden',
    filterBooks: '.filters',
  };

  const ratingSettings = {
    poor: 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)',
    medium: 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)',
    good: 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)',
    excellent: 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)',
  };


  class BooksList {
    constructor(){
      const thisBook = this;
      thisBook.favoriteBooks = [];
      thisBook.filters = [];
      thisBook.renderBooks();
      thisBook.getElements();
      thisBook.initActions();
    }

    renderBooks() {
      const thisBook = this;
      //Find the books list
      const booksList = document.querySelector(select.booksClass.list);
      // Compile the Handlebars template
      const template = Handlebars.compile(document.querySelector(select.templateOf.bookItem).innerHTML);
      // for all of the books
      for (const book of dataSource.books) {
      // Calculate width of the rating 
        const ratingWidth = (book.rating / 10) * 100; 
        // Get the background color based on the rating
        const ratingBgc = thisBook.getRatingColor(book.rating); 
        // Generate HTML 
      
        const html = template(Object.assign({}, book, { ratingWidth, ratingBgc }));
        // Insert the HTML into the books list
        booksList.insertAdjacentHTML('beforeend', html);
      }
    }

    getElements() {
      const thisBook = this;
      thisBook.dom ={};
      // Find references to specific elements inside the book element
      thisBook.dom.bookList = document.querySelector(select.booksClass.list);
      thisBook.dom.bookImage = document.querySelectorAll(select.booksClass.bookImg);
    }

    getRatingColor(rating) {
      if (rating < 6) {
        return(ratingSettings.poor);
      } else if (rating > 6 && rating <= 8) {
        return(ratingSettings.medium);
      } else if (rating > 8 && rating <= 9) {
        return(ratingSettings.good);
      } else if (rating > 9) {
        return(ratingSettings.excellent);
      } 
    }

    filterBooks() {
      const thisBook = this;
      // Get all book image elements
      const books = thisBook.dom.bookImage;

      books.forEach(book => {
        // Get the book ID from the data-id attribute
        const bookId = parseInt(book.getAttribute(select.books.dataId));
        // Find the book data object based on the ID
        const bookData = dataSource.books.find(item => item.id === bookId);

        if (thisBook.filters.length === 0) {
          // Remove the 'visible' class if no filters are applied
          book.classList.remove(classNames.visible);
        } else {
          if (bookData.details && thisBook.filters.some(filter => bookData.details[filter])) {
            // Remove the 'visible' class if the book matches any of the filters
            book.classList.remove(classNames.visible);
          } else {
            // Add the 'visible' class if the book doesn't match any filters
            book.classList.add(classNames.visible);
          }
        }
      });
    }

    initActions() {
      const thisBook = this;
      // Get the book list container element
      const bookContainer = thisBook.dom.bookList;

      bookContainer.addEventListener('dblclick',  (event) => {
        // Get the parent container of the clicked book image
        const bookImageContainer = event.target.offsetParent;
        //console.log('book',bookContainer);
        if (bookImageContainer.classList.contains(select.books.bookImg)) {
          event.preventDefault();
          // Toggle the 'favorite' class on double-click
          bookImageContainer.classList.toggle(classNames.favoriteBook);
          // Get the book ID from the data-id attribute
          const bookId = bookImageContainer.getAttribute(select.books.dataId);
          // Find the index of the book ID in the favorite books array
          const index = thisBook.favoriteBooks.indexOf(bookId);
          if (index !== -1) {
            // Remove the book ID from the favorite books array
            thisBook.favoriteBooks.splice(index, 1); 
          } else {
            // Add the book ID to the favorite books array
            thisBook.favoriteBooks.push(bookId); 
          }
        }
      });
      // Get the filters form element
      const filtersForm = document.querySelector(classNames.filterBooks);
      filtersForm.addEventListener('click', function(event) {
        // Get the clicked element
        const clickedElement = event.target;
        if (
          clickedElement.tagName === 'INPUT' &&
      clickedElement.type === 'checkbox' &&
      clickedElement.name === 'filter'
        ) {
          // console.log(clickedElement.value); 

          if (clickedElement.checked) {
            // Add the clicked filter to the filters array
            thisBook.filters.push(clickedElement.value);
          } else {
            // Find the index of the clicked filter in the filters
            const index = thisBook.filters.indexOf(clickedElement.value);
            if (index !== -1) {
              // Remove the clicked filter from the filters array
              thisBook.filters.splice(index, 1);
            }
          }
          thisBook.filterBooks();
        }
      });
    }
  }

  const app = new BooksList();
  console.log(app);
}