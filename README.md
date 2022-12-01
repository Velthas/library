
# <img src="https://cdn-icons-png.flaticon.com/512/167/167756.png" height="70px" width="70px"> </img>Library  <img src="https://cdn-icons-png.flaticon.com/512/167/167756.png" height="70px" width="70px"> </img>

**Live at:** https://vel-library-app.web.app/

### Overview

A library app allowing you to keep tracks of the books you are reading and have read.

As of the day of remaking this document (01/12/22), I have updated project to support Firebase backend services and make use of Google Authentication and Firestore to store user libraries. This was amazing practice for the tough projects ahead.

### Functionality
  
Upon opening the page, the user is presented with the header, a Sign In button and a circular button with a plus sign on it: by clicking it, a form will show up, asking the user for info about the book they wish to store: a name, the amount of total pages and the amount of pages read. By clicking on the small button at the end of the form, the user can then store the book.

An error will occur if: the user specifies a number of pages (either total or read) that is not a number, or if the user specifies a higher amount of pages read than the page total, or if the user specifies a negative number. Any of these conditions will prompt an error div to appear with a descriptive error log.

If every field matches the desired input, the book's data will be processed by a book factory function. Through DOM Manipulation, the relevant frame to house the data will be generated, and Event Listeners will be added to its buttons.

One of two operations can be performed on each existing book:

+ **Eliminate**: each book will have a small circular icon on the top right of its display with a 'X' on it. By clicking it, the user can delete a book from their library permanently. I imagine this might need a further confirmation pop-up later down the line to make it more user friendly, but for now it works as intended.

+ **Manipulate Pages Read**: As you sink your teeth into a book you have stored, you may want to increase the amount of pages read you had previously specified. That's what the two buttons on either side of the progress paragraph are for. By clicking the plus icon, you increase the amount of pages read by one, and by clicking the minus icon you decrease instead. When the amount of pages read matches the amount of total pages, the 'status' paragraph below will update itself to state 'Finished', meaning you have completed the book.

By default, the app's library will be reset every time the page is refreshed. If you want your data to be stored permanently, you can use the Google Authentication service provided by Firebase.

You can login by clicking on the 'Login' button right below the logo. If you're using a computer, a popup with the login will show up, otherwise you'll be momentarily redirected to Google Authentication services. 

Once you are logged in you will be able to see your Google Profile Pic along with your name right above the new entry button. To sign out, click the 'Sign Out' link under your user info. 

### Technologies:

 - HTML, CSS, JavaScript
 - Webpack
 - Eslint
 - Firebase

### Credits
**Fonts Used:** Bebas Neue, Lobster (Imported from Google Fonts)
**Icons:** 

 - Bookmark from  VeryIcon.com
 - Cross Icon on add book form from Wikipedia Commons (https://tinyurl.com/wikicrossicon)
 - Books from README title from Freepik (Flaticon)
