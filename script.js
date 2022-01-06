const myLibrary = [{'name': 'The Hobbit', 'pages': '280/300', 'read': 'yes'}];
//I will use this to randomly select a style later
const myStyles = ['shadowOne', 'shadowTwo', 'shadowThree'];

//Constructor for books
function Book (name, pages, read) {
    this.name = name;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary () {
    //TODO: Get the information from a form and use it to create a book, then use that info to create a book card
}

function displayBooks(arrayOfBooks) {
    for(let i = 0; i < arrayOfBooks.length; i++) {
        
        createBookDivs (myStyles, arrayOfBooks[i]);
        
    }

}

function createBookDivs (arrayOfStyles, book) {
    const library = document.querySelector('#library')

    //Generate the main container
    const newBook = document.createElement('div');
    newBook.classList.add('book')

    //Calculate a random number and use it to determine a style
    const randomNumber = Math.floor(Math.random() * 3);
    newBook.classList.add(arrayOfStyles[randomNumber]);

    //Now create the contents of the book
    //Title section
    const titleContainer = document.createElement('div');
    const titleParagraph = document.createElement('p');
    titleParagraph.classList.add('title');

    const fancyDivider = document.createElement('img');
    fancyDivider.setAttribute('src', './images/divider.svg');
    fancyDivider.setAttribute('alt', 'a fancy divider');
    const titleElements = [titleParagraph, fancyDivider];

    //Progress section
    const progressContainer = document.createElement('div');
    const progressParagraph = document.createElement('p');
    progressParagraph.classList.add('progress');

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+'
    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-'

    const buttons = [increaseButton, decreaseButton];
    buttons.forEach(button => button.classList.add('submit'));

    const progressElements = [increaseButton, progressParagraph, decreaseButton]

    //Status section
    const statusContainer = document.createElement('p');
    statusContainer.classList.add('status');

    const mainContainers = [titleContainer, progressContainer, statusContainer]

    //Put together the whole book
    mainContainers.forEach(container => newBook.appendChild(container))

    titleElements.forEach(node => titleContainer.appendChild(node));
    titleParagraph.textContent = book.name;

    //TODO: Prepare to add the event listeners for the buttons
    progressElements.forEach(node => progressContainer.appendChild(node));
    progressParagraph.textContent = book.pages;

    let pageString = book.pages
    const pages = pageString.split('/');
    if(pages[0] === pages[1]) {
        statusContainer.textContent = 'Finished'
    }
    else statusContainer.textContent = 'Unfinished';

    //Finally append the book
    library.appendChild(newBook);
}