//Array to store all books
const myLibrary = [];

//I will use this to randomly select a style for each book
const myStyles = ['shadowOne', 'shadowTwo', 'shadowThree'];

//Get the form nodes to use in functions later
const formBackdrop = document.querySelector('#formBackdrop');
const formWindow = document.querySelector('#formWindow');

//Make it so submitting the form sends the info to the javascript code.
const submitBtn = document.querySelector('.submit');
submitBtn.addEventListener('click', addBookToLibrary);

//This allows the button on the main page to open up the form to add book
const openFormButton = document.querySelector('.bubble');
openFormButton.addEventListener('click', displayForm);

//Enable users to quit out of the form
const closeFormButton = document.querySelector('#closeForm');
closeFormButton.addEventListener('click', closeForm);

//Create a div to report user mistakes
const errorReportDiv = document.createElement('div');
errorReportDiv.classList.add('errorReport');
const divToAppendTo = document.querySelector('#settings');

//Constructor for books
function Book (name, pages, read) {
    this.name = name;
    this.pages = pages;
    this.read = read;
}

//This function extracts the content of the form, sends it to be verified, then adds it to the array.
function addBookToLibrary () {

    const form = document.querySelector('#bookinfo');
    let title = form.elements[0].value;
    let pagesTotal = form.elements[1].value;
    let pagesRead = form.elements[2].value;

    //create an object with the data and pass it to the function to check
    const data = {'name': title, 
    'pagesTotal': pagesTotal,
    'pagesRead': pagesRead,
    'finished': "",
    }

    //This returns an object with the verified data
    const verifiedData = checkFormContent(data);

    //If missinginput is present, it means something went wrong, so return if it happens.
    if(verifiedData.missinginput !== undefined){
        closeForm();
        return;
    }

    //Create this field to be displayed to users.
    verifiedData.progress = verifiedData.pagesRead + "/" + verifiedData.pagesTotal;

    //Call the constructor
    const newObject = new Book(verifiedData.name, verifiedData.progress, verifiedData.finished);
    newObject.pagesRead = Number(verifiedData.pagesRead);
    newObject.pagesTotal = Number(verifiedData.pagesTotal);

    //Store it in the array of books
    myLibrary.push(newObject);

    //Generate the library
    displayBooks(myLibrary);

    //Resets the form;
    form.reset();

    closeForm();

}

//Loops through the array of objects and calls createBookDivs for each one.
function displayBooks(arrayOfBooks) {

    clearLibrary();

    for(let i = 0; i < arrayOfBooks.length; i++) {
        
        createBookDivs (myStyles, arrayOfBooks[i], i);
        
    }

}

//This function is responsible for creating the whole 'book' div to be displayed on the page.
function createBookDivs (arrayOfStyles, book, arrayIndex) {
    const library = document.querySelector('#library')

    //Generate the main container
    const newBook = document.createElement('div');
    newBook.setAttribute('data-bookindex', `${arrayIndex}`)
    newBook.classList.add('book');

    //If the book has already been assigned a style, use that one, otherwise get a random one.
    if (book.style) {
        newBook.classList.add(book.style);
    }
    else {
    const randomNumber = Math.floor(Math.random() * 3);
    book.style = arrayOfStyles[randomNumber]
    newBook.classList.add(book.style);
    }

    //Now create the contents of the book

    //Delete Button 
    const deleteButton = document.createElement('div');
    deleteButton.classList.add('deleteBook');
    deleteButton.textContent = 'x';
    newBook.appendChild(deleteButton);

    //Add functionality to delete book
    deleteButton.addEventListener('click', () => {deleteBook(arrayIndex)})

    //Title section
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('center');
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

    const progressElements = [increaseButton, progressParagraph, decreaseButton];

    //Status section
    const statusContainer = document.createElement('p');
    statusContainer.classList.add('status');

    const mainContainers = [titleContainer, progressContainer, statusContainer];

    //Put together the whole book
    mainContainers.forEach(container => newBook.appendChild(container));

    titleElements.forEach(node => titleContainer.appendChild(node));
    titleParagraph.textContent = book.name;
    if (book.name.split("").length > 17) {
        titleParagraph.setAttribute('style', 'font-size: 22px;');
    }

    //TODO: Prepare to add the event listeners for the buttons
    progressElements.forEach(node => progressContainer.appendChild(node));
    progressParagraph.textContent = book.pages;
    
    increaseButton.addEventListener('click', () => alterProgress(1, book, progressParagraph, statusContainer))
    decreaseButton.addEventListener('click', () => alterProgress(2, book, progressParagraph, statusContainer))

    
    if(book.read === true) {
        statusContainer.textContent = 'Finished';
    }
    else statusContainer.textContent = 'Unfinished';

    //Finally append the book
    library.appendChild(newBook);
}

//Paired with the button on the main page through event listener to open the form.
function displayForm () {
    const form = [formBackdrop, formWindow]
    form.forEach(node => node.setAttribute('style', 'display: block;'))
    removeErrorDiv();
}

//As it stands, I do not just append the new books but recreate the display on each go.
//This clears the whole library section of the page.
function clearLibrary () {
    const allBooks = Array.from(document.querySelectorAll('.book'))
    allBooks.forEach(node => node.remove())
    
}

//This function checks the input to verify no data is missing.
function checkFormContent (data) {

    if (data.name === "" || data.pagesTotal === "" || data.pagesRead === "") {
            data.missinginput = 1;
            errorReportDiv.textContent = "For a book to be added, all input fields have to be filled"
            divToAppendTo.appendChild(errorReportDiv);
            return data;
    }

    if(isNaN(Number(data.pagesTotal)) || Number(data.pagesTotal) < Number(data.pagesRead)) {
            data.missinginput = 1;
            errorReportDiv.textContent = "Number of total pages has to be a number and cannot be less than the number of pages read"
            divToAppendTo.appendChild(errorReportDiv);
            return data;
    }
    
    if (Number(data.pagesRead) === NaN){
            data.missinginput = 1;
            errorReportDiv.textContent = "Number of pages read must be a number"
            divToAppendTo.appendChild(errorReportDiv);
            return data;

    }

    //Get information on the book's progress and store it
    if(data.pagesRead === data.pagesTotal) {
        data.finished = true;
    }
    else data.finished = false;

    //This means everything is okay
    return data;

}

//This function is used to remove the form upon adding a book or closing the form window.
function closeForm () { 
    const form = [formBackdrop, formWindow];
    form.forEach(node => { node.style.display = "none"; }
    )
}

//This function removes the Error Div upon opening the form.
function removeErrorDiv () {
    const errorDiv = document.querySelector('.errorReport');
    if (errorDiv) {
        divToAppendTo.removeChild(errorReportDiv)
    }
    else return;
}

function deleteBook (arrayIndex) {
    myLibrary.splice(arrayIndex, 1);

    if(!Array.isArray(myLibrary) && !myLibrary.length){
        return;
    }

    displayBooks(myLibrary);
}

function alterProgress(operator, bookObject, paragraphNode, StatusContainerNode) {
    
    if (operator === 1) {
        if (bookObject.pagesRead !== bookObject.pagesTotal) {
            bookObject.pagesRead += 1
        }

    }
    else if(operator === 2) {
        if (bookObject.pagesRead === 0) {
            return;
        }
        else {
            bookObject.pagesRead -= 1
        }
    }

    paragraphNode.textContent = bookObject.pagesRead + "/" + bookObject.pagesTotal;
    bookObject.pages = bookObject.pagesRead + "/" + bookObject.pagesTotal

    if (bookObject.pagesRead === bookObject.pagesTotal) {
        bookObject.read = true
        StatusContainerNode.textContent = "Finished"
    }
    else {
        bookObject.read = false;
        StatusContainerNode.textContent = "Unfinished"
    }


}