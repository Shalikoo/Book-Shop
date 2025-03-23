'use strict'


const STORAGE_KEY = 'bookShopDB'

var gFilterBy = {
    title: '',
    minRating: 0
}

var gBooks = [
    { id: 'bg4J78', title: 'The Adventures of Lori IpsiA', price: 129, rating: 2, imgUrl: 'img/lori-ipsi.jpg' },
    { id: 'gh6K89', title: 'JavaScript for BeginnersA', price: 99, rating: 5, imgUrl: 'img/js-beginners.jpg' }
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

function _createBook(title, price, rating, imgUrl) {
    return {
        id: makeId(),
        title,
        price,
        rating,
        imgUrl
    }
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBooks() {
    return gBooks.filter(book =>
        book.title.toLowerCase().includes(gFilterBy.title.toLowerCase()) &&
        book.rating >= gFilterBy.minRating
    );
}

function removeBook(bookid) {
    var bookIdx = gBooks.findIndex(book => book.id === bookid)

    if(bookIdx !== -1){
        gBooks.splice(bookIdx, 1)
        _saveBooks()
        renderBooks()
        renderStats()
        showMsg('Book removed successfully', false)
    }
}

function updateBook(bookid, newPrice){
    var newPrice = +prompt('Enter New Price')
    var bookIdx = gBooks.findIndex(book => book.id === bookid)

    if(!newPrice || newPrice <= 0) return console.log('Error: please enter valid price!')

    gBooks[bookIdx].price = newPrice
    _saveBooks()
    renderBooks()
    renderStats()
    showMsg('Book updated successfully', false)
}

function addBook() {
    var newBookTitle = prompt('Please enter title')
    var newBookPrice = +prompt('Please enter price')
    
    var newBook = {
        id: makeId(),
        title: newBookTitle,
        price: newBookPrice,
        rating: Math.floor(Math.random() * 5) + 1,
        imgUrl: 'img/default.png'
    }

    if (!newBookTitle || !newBookPrice || newBookPrice <= 0 ) return console.log('Error: please try again!')
    gBooks.push(newBook)
    _saveBooks()
    renderBooks()
    renderStats()
    showMsg('Book added successfully', false)
}

function getBookById(bookid) {
    return gBooks.find(book => book.id === bookid)
}

function showMsg(txt, isError = true){
    const elMsg = document.getElementById('msg')

    elMsg.innerText = txt
    elMsg.classList.remove('error', 'success')
    elMsg.classList.remove('hidden')
    

    if(isError){
        elMsg.classList.add('error')
    } else {
        elMsg.classList.add('success')
    }

    setTimeout(() => {
        elMsg.classList.add('hidden')
    }, 2000);
    
}