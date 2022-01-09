# Library
## Live at: https://velthas.github.io/library

### Overview
A library app allowing you to keep tracks of the books you are reading and have read.

This project was extremely useful to practice working with objects, adding and removing properties to achieve various results and pass around relevant data more easily. This was particularly evident in istances of functions requiring multiple parameters. 

### Functionality

As of 09/01/2022, this small library app is only a front-end project, and as such cannot permanently store the books that are added by the user. As the course progresses, I am very much sure a back-end portion will eventually be implemented, allowing for a fully functioning small application capable of storing and retrieving user data.

Upon opening the page, the user is presented with the header and a circular button with a "+" sign on it: by clicking it, a form will show up, asking the user for info about the book they wish to store: a name, the amount of total pages and the amount of pages read. By clicking on the small button at the end of the form, the user can then store the book.

An error will occur if: the user specifies a number of pages (either total or read) that is not a number, or if the user specifies a higher amount of pages read than the page total. Any of these conditions will cause the appropriate function to return and display and error div explaining where the process went wrong. 

If every field matches the desired input, the book's data will be processed by an object constructor. Through DOM Manipulation, the relevant frame to house the data will be generated, and Event Listeners will be added to its buttons. A random style will also be selected and stored inside the object to maintain consistency in case of book removal. 

One of two operations can be performed on each existing book:
+ **Eliminate**: each book will have a small circular icon on the top right of its display with a "x" on it. By clicking it, the user can delete a book from their library permanently. I imagine this might need a further confirmation pop-up later down the line to make it more user friendly, but for now it works as intended.
+ **Manipulate Pages Read**: As you sink your teeth into a book you have stored, you may want to increase the amount of pages read you had previously specified. That's what the two buttons on either side of the progress paragraph are for. By clicking +, you increase the amount of pages read by one, and by clicking minus you decrease instead. When the amount of pages read matches the amount of total pages, the 'status' paragraph below will update itself to state "Finished", meaning you have completed the book. This state can be reverted by just pressing minus one more time, if the need arises.

### Design Structure

As mentioned earlier, this project is, for now, a front-end project, built using HTML, CSS and Javascript. Two fonts were imported by Google Fonts (Bebas Neue and Lobster). The file structure is as follows:
+ **images**: this time around need arose for using images. To add some flair to the books, I added a divider between the title and the progress. Another image was also used to serve as the 'close' button of the book form. Both of them are SVGs, allowing for a greater amount of versatility. The divider was taken from SVG Silh, while the cross icon was taken from Wikipedia commons (found here: https://tinyurl.com/wikicrossicon)
+ **index.html**: holds all the HTML for this project. This time around, I had some fun experiencing with divs that do not appear right away: the form is in fact present at all times, right in the middle of the page, but it cannot be seen because of the value of its display property. I initially though to do the same for the error div, but I figured it would just be better to append it under settings when needed.
+ **style.css**: stylesheet for the project. This time I took my experimentation even further by trying to mimic the appearance of a book by using the box-shadow property. I added several, providing different layers overlapping over one another, and came up with a result that I feel is almost believable. Given the nesting level of some elements, I was also able to experiment more with chained, grouped and descendant selectors, which is never bad I suppose. Media queries are present to enhance the experience on mobile, but I might want to iron out some kinks still in the near future. 
+ **script.js**: as usual, this is the most involved part of the project. The most challenging part, or rather time consuming, was creating all of the Dom Elements and their relevant event listeners, making sure everything would fall into place while trying to avoid eccessive repetition. I really enjoyed working with objects and was pleasantly surprised with their versatility, allowing me to make significant changes without really impacting the existing structure of the code.

### Challenges

As a bonus, I thought I'd list out two problems that came up while writing the code:
+ **NaN Evaluation**: while checking the input to see if the user typed a string where the number of pages should go, I had a conditional check if the result of a strict equality comparison Number(pagesRead)  and NaN returned true. It never did, even though console logging Number(pagesRead) when a string was passed revealed the result to be actually NaN. Turns out, NaN can never be equal to itself. This was circumvented by using built in isNaN function. 
+ **Style Swap**: as it stands, my application randomly selects a style to be added to the input book, making it of a random one of three colors I defined beforehand. Initially, given that my 'library' would always be deleted and recreated on each book creation/deletion, this caused existing books to change the color they had been assigned upon creation. This design flaw was fixed by adding a property of style to the book object, storing the initial style it had been assigned the first time it was generated. If no style property is found when creating the DOM elements, the function will generate one from a random number calculated using the Math.random method. 