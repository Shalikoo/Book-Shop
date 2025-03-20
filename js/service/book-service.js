'use strict'


const STORAGE_KEY = 'bookShopDB'


var gBooks = [
    { id: 'bg4J78', title: 'The Adventures of Lori IpsiA', price: 129, imgUrl: 'img/lori-ipsi.jpg' },
    { id: 'gh6K89', title: 'JavaScript for BeginnersA', price: 99, imgUrl: 'img/js-beginners.jpg' }
];

function _createBooks() {
    var storedBooks = loadFromStorage(STORAGE_KEY)

    if (!storedBooks || storedBooks.length === 0) { 
        saveToStorage(STORAGE_KEY, gBooks)
    } else {
        gBooks = storedBooks;
    }
}

_createBooks()
renderBooks()

function _createBook(title, price, imgUrl) {
    return {
        id: makeId(),
        title,
        price,
        imgUrl
    }
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBooks() {
    return gBooks
}

function removeBook(bookid) {
    var bookIdx = gBooks.findIndex(book => book.id === bookid)

    if(bookIdx !== -1){
        gBooks.splice(bookIdx, 1)
        _saveBooks()
        renderBooks()
    }
}

function updateBook(bookid, newPrice){
    var newPrice = +prompt('Enter New Price')
    var bookIdx = gBooks.findIndex(book => book.id === bookid)

    if(!newPrice || newPrice <= 0) return console.log('Error: please enter valid price!')

    gBooks[bookIdx].price = newPrice
    _saveBooks()
    renderBooks()
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
    _saveBooks()
    renderBooks()
}

function getBookById(bookid) {
    return gBooks.find(book => book.id === bookid)
}