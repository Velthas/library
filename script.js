/* eslint-disable linebreak-style */
const Book = (bname, tot, read) => {
  const name = bname;
  const pageTot = Number(tot);
  let pageRead = Number(read);
  let style = false; // Will be assigned a string in DomElements.createBookDiv

  const readPage = () => { pageRead = pageRead < pageTot ? pageRead += 1 : pageRead; };
  const unreadPage = () => { pageRead = pageRead === 0 ? pageRead : pageRead -= 1; };
  const getName = () => name.slice();
  const getTot = () => pageTot;
  const getRead = () => pageRead;

  return { getName, getTot, getRead, style, readPage, unreadPage };
};

const Library = () => {
  const library = [];

  const add = (book) => library.push(book);
  const remove = (book) => library.splice(library.indexOf(book), 1);
  const getBooks = () => library;

  return { add, remove, getBooks };
};

const DomElements = (() => {
  const getBookData = () => Array.from(document.querySelectorAll('#bookinfo input')).map((input) => input.value);

  const isInputComplete = (data) => {
    const [name, total, read] = data;
    let msg = false;
    if (name === '' || total === '' || read === '') {
      msg = 'Please fill all input fields.';
      return msg;
    } if (Number(total) < Number(read)) {
      msg = 'Pages read cannot exceed pages total';
      return msg;
    } if (isNaN(Number(read)) || isNaN(Number(total))) {
      msg = 'Pages must be a number';
      return msg;
    } if (total < 0 || read < 0) {
      msg = 'Pages must be a positive number';
      return msg;
    }
    return msg;
  };

  const setupListeners = () => {
    const openFormButton = document.querySelector('.bubble');
    const closeFormButton = document.querySelector('#closeForm');
    const addBookButton = document.querySelector('#submit-book');

    closeFormButton.addEventListener('click', toggleForm);
    openFormButton.addEventListener('click', () => {
      toggleForm();
      hideErrorDiv();
    });
    addBookButton.addEventListener('click', (e) => {
      e.preventDefault();
      App.addBook();
      toggleForm();
    });
  };

  const showErrorDiv = (message) => {
    const errorDiv = document.querySelector('#error');
    errorDiv.textContent = message;
    errorDiv.setAttribute('class', '');
  };

  const hideErrorDiv = () => document.querySelector('#error').setAttribute('class', 'hidden');

  const resetForm = () => document.querySelectorAll('#bookinfo input').forEach((node) => node.value = '');

  const toggleForm = () => {
    resetForm();
    document.querySelector('#formBackdrop').classList.toggle('hidden');
  };

  const resetLibrary = () => document.querySelectorAll('.book').forEach(node => node.remove());

  const updateProgress = (progressNode, statusNode, book) => {
    progressNode.textContent = `${book.getRead()}/${book.getTot()}`;
    if (book.getRead() === book.getTot()) statusNode.textContent = 'Finished';
    else statusNode.textContent = 'Unfinished';
  };

  function createBookDiv(book) {
    const style = ['shadowOne', 'shadowTwo', 'shadowThree']; // these are equivalent to a class
    const library = document.querySelector('#library');

    const newBook = document.createElement('div'); // main container
    const deleteButton = document.createElement('div');
    const titleContainer = document.createElement('div');
    const titleParagraph = document.createElement('p');
    const fancyDivider = document.createElement('img');
    const progressContainer = document.createElement('div');
    const progressParagraph = document.createElement('p');
    const increaseButton = document.createElement('button');
    const decreaseButton = document.createElement('button');
    const statusContainer = document.createElement('p');

    const randomNumber = Math.floor(Math.random() * 3);

    newBook.classList.add('book');
    if (!book.style) book.style = style[randomNumber];
    newBook.classList.add(book.style);
    deleteButton.classList.add('deleteBook');
    titleContainer.classList.add('center');
    titleParagraph.classList.add('title');
    if (book.getName().split('').length > 17) titleParagraph.setAttribute('style', 'font-size: 22px;');
    fancyDivider.setAttribute('src', './images/divider.svg');
    fancyDivider.setAttribute('alt', 'a fancy divider');
    progressParagraph.classList.add('progress');
    statusContainer.classList.add('status');

    deleteButton.addEventListener('click', () => { App.removeBook(book); });
    increaseButton.addEventListener('click', () => {
      book.readPage();
      updateProgress(progressParagraph, statusContainer, book);
    });
    decreaseButton.addEventListener('click', () => {
      book.unreadPage();
      updateProgress(progressParagraph, statusContainer, book);
    });

    deleteButton.textContent = 'x';
    increaseButton.textContent = '+';
    decreaseButton.textContent = '-';
    titleParagraph.textContent = book.getName();
    progressParagraph.textContent = `${book.getRead()}/${book.getTot()}`;
    if (book.getRead() === book.getTot()) statusContainer.textContent = 'Finished';
    else statusContainer.textContent = 'Unfinished';

    const titleElements = [titleParagraph, fancyDivider];
    const progressElements = [increaseButton, progressParagraph, decreaseButton];
    const mainContainers = [titleContainer, progressContainer, statusContainer];
    newBook.appendChild(deleteButton);
    titleElements.forEach((node) => titleContainer.appendChild(node));
    progressElements.forEach((node) => progressContainer.appendChild(node));
    mainContainers.forEach((container) => newBook.appendChild(container));

    library.appendChild(newBook);
  }

  setupListeners();

  return { getBookData, isInputComplete, showErrorDiv, hideErrorDiv, toggleForm, createBookDiv, resetLibrary };
})();

const App = (() => {
  const library = Library();

  const showProjects = () => {
    const books = library.getBooks();
    for (let i = 0; i < books.length; i++) {
      DomElements.createBookDiv(books[i]);
    }
  };

  const addBook = () => {
    const data = DomElements.getBookData();
    const somethingWrong = DomElements.isInputComplete(data);
    if (somethingWrong) {
      DomElements.showErrorDiv(somethingWrong);
      return;
    }
    const [name, total, read] = data;
    const book = Book(name, total, read);
    library.add(book);
    DomElements.resetLibrary();
    showProjects();
  };

  const removeBook = (book) => {
    library.remove(book);
    DomElements.resetLibrary();
    showProjects();
  };

  return { addBook, removeBook };
})();
