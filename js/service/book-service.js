'use strict'


var gBooks = [
    { id: 'bg4J78', title: 'The Adventures of Lori Ipsi', price: 120, imgUrl: 'lori-ipsi.jpg' },
    { id: 'gh6K89', title: 'JavaScript for Beginners', price: 95, imgUrl: 'js-beginners.jpg' }
];

function getBooks() {
    return gBooks;
}

function removeBook(bookid) {
    var bookIdx = gBooks.findIndex(book => book.id === bookid)

    if(bookIdx !== -1){
        gBooks.splice(bookIdx, 1)
    }
}

function updateBook(bookid, newPrice){
    var newPrice = +prompt('Enter New Price')
    var bookIdx = gBooks.findIndex(book => book.id === bookid)

    if(!newPrice || newPrice <= 0) return console.log('Error: please enter valid price!')

    gBooks[bookIdx].price = newPrice
}

function addBook() {
    var newBookTitle = prompt('Please enter title')
    var newBookPrice = +prompt('Please enter price')
    
    var newBook = {
        id: makeId(),
        title: newBookTitle,
        price: newBookPrice,
        imgUrl: 'default.png'
    }

    if (!newBookTitle || !newBookPrice || newBookPrice <= 0 ) return console.log('Error: please try again!')
    gBooks.push(newBook)
}