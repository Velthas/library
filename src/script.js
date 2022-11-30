import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithGoogle, db, auth } from './firebase-config';

import divider from './images/divider.svg';
import cross from './images/Flat_cross_icon.svg';
import './style.css';

const Book = (bname, tot, read, pstyle) => {
  const name = bname;
  const pageTot = Number(tot);
  let pageRead = Number(read);

  const readPage = () => { pageRead = pageRead < pageTot ? pageRead += 1 : pageRead; };
  const unreadPage = () => { pageRead = pageRead === 0 ? pageRead : pageRead -= 1; };
  const getName = () => name.slice();
  const getTot = () => pageTot;
  const getRead = () => pageRead;
  const setStyle = () => {
    const selectors = ['shadowOne', 'shadowTwo', 'shadowThree']; // these are css class selectors
    const randomNumber = Math.floor(Math.random() * 3); // find them in style.css for more info
    const check = randomNumber === 3 ? 2 : randomNumber;
    return selectors[check];
  };

  const style = pstyle || setStyle();
  const getStyle = () => style;

  return { getName, getTot, getRead, getStyle, readPage, unreadPage };
};

const Library = (books) => {
  const library = books || [];

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
    const loginButton = document.querySelector('#login');

    loginButton.addEventListener('click', () => signInWithGoogle(App.onLoginSuccess, showErrorDiv));
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

  const createBookDiv = (book) => {
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

    newBook.classList.add('book');
    newBook.classList.add(book.getStyle());
    deleteButton.classList.add('deleteBook');
    titleContainer.classList.add('center');
    titleParagraph.classList.add('title');
    if (book.getName().split('').length > 17) titleParagraph.setAttribute('style', 'font-size: 22px;');
    fancyDivider.setAttribute('src', divider);
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
  };

  const displayUserInfo = (data) => {
    const loginBtn = document.querySelector('#login');
    loginBtn.setAttribute('style', 'display: none');

    const { photoUrl, name } = data;
    const userInfo = document.createElement('div');
    const userImg = document.createElement('img');
    const userWelcome = document.createElement('p');

    userInfo.setAttribute('id', 'user-info');
    userImg.src = photoUrl;
    userWelcome.textContent = `${name.split(' ')[0]}'s Library`;

    userInfo.appendChild(userImg);
    userInfo.appendChild(userWelcome);
    document.querySelector('#header').appendChild(userInfo);
  };

  document.querySelector('#closeForm').setAttribute('src', cross); // Setting up cross icon of form.
  setupListeners();

  return { getBookData, isInputComplete, showErrorDiv, hideErrorDiv, toggleForm, createBookDiv, resetLibrary, displayUserInfo };
})();

const Database = (() => {
  const getUserLibrary = async () => {
    const userAuthId = auth.currentUser.uid;
    const docRef = doc(db, 'users', userAuthId);
    const userLibrary = await getDoc(docRef);
    return userLibrary.data(); // extracts library from the response object
  };

  const convertLibrary = (library) => {
    const convertedLib = library.getBooks().map((book) => {
      const name = book.getName();
      const pageTot = book.getTot();
      const pageRead = book.getRead();
      const style = book.getStyle();

      return { name, pageTot, pageRead, style };
    });
    return convertedLib;
  };

  const updateLibrary = async (library) => {
    const userAuthId = auth.currentUser.uid;
    const docRef = doc(db, 'users', userAuthId);
    const convertedLib = convertLibrary(library);
    setDoc(docRef, { library: convertedLib }, { merge: true });
  };

  return { getUserLibrary, updateLibrary };
})();

const App = (() => {
  let library = Library();

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
    if (auth.currentUser) Database.updateLibrary(library);
    showProjects();
  };

  const removeBook = (book) => {
    library.remove(book);
    DomElements.resetLibrary();
    showProjects();
  };

  const loadUserLibrary = (userLibrary) => {
    const updatedLibrary = userLibrary.library
      .map((book) => Book(book.name, book.pageTot, book.pageRead, book.style));
    const loadedLibrary = Library(updatedLibrary);
    library = loadedLibrary;
  };

  const onLoginSuccess = async (response) => {
    const name = response.user.displayName;
    const photoUrl = response.user.photoURL;
    const profileId = response.user.uid;

    DomElements.displayUserInfo({ name, photoUrl });
    const userLibrary = await Database.getUserLibrary(profileId);
    loadUserLibrary(userLibrary);
    showProjects();
  };

  return { addBook, removeBook, onLoginSuccess };
})();
