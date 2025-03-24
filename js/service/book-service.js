'use strict'


const STORAGE_KEY = 'bookShopDB'

var gFilterBy = {
    filterBy: {title: '', minRating: 0},
    sortBy: {},
    page: { idx: 0, size: 5 }
}

var gBooks = [
    { id: 'bg4J78', title: 'The Adventures of Lori IpsiA', price: 129, rating: 2, imgUrl: 'img/lori-ipsi.jpg' },
    { id: 'gh6K89', title: 'JavaScript for BeginnersA', price: 99, rating: 5, imgUrl: 'img/js-beginners.jpg' }
];

function _createBooks() {
    var storedBooks = loadFromStorage(STORAGE_KEY)

    if (!storedBooks || storedBooks.length === 0) { 
        _saveBooks()
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
    const filterBy = gFilterBy.filterBy
    const sortBy = gFilterBy.sortBy
    const page = gFilterBy.page

    var books = gBooks

    books = books.filter(book =>
        book.title.toLowerCase().includes(filterBy.title.toLowerCase()) &&
        book.rating >= filterBy.minRating
    )

    if (sortBy.prop) {
        const { prop, dir } = sortBy
        if (prop === 'title') {
            books.sort((a, b) => a.title.localeCompare(b.title) * dir)
        } else {
            books.sort((a, b) => (a[prop] - b[prop]) * dir)
        }
    }

    const startIdx = page.idx * page.size
    books = books.slice(startIdx, startIdx + page.size)

    return books
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

function getPageCount() {
    const { filterBy, page } = gFilterBy
    const books = gBooks.filter(book =>
        book.title.toLowerCase().includes(filterBy.title.toLowerCase()) &&
        book.rating >= filterBy.minRating
    )
    return Math.ceil(books.length / page.size)
}

// function getPageCount(options) {
//     const page = options.page
//     const filterBy = options.filterBy

//     const books = _filterBooks(filterBy)

//     const pageCount = Math.ceil(books.length / page.size)

//     return pageCount
// }