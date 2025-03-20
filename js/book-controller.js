'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    var books = getBooks()
    var strHTMLs = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
                <button onclick="onReadBook('${book.id}')">Read</button>
                <button onclick="onUpdateBook('${book.id}')">Update</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
        </tr>
        `)
        document.querySelector('tbody').innerHTML = strHTMLs.join('')
}

function onRemoveBook(bookid) {
    removeBook(bookid)
    renderBooks()
}

function onUpdateBook(bookid) {
    updateBook(bookid)
    renderBooks()
}

function onAddBook() {
    addBook()
    renderBooks()
}

function onReadBook(bookid) {
    var book = getBookById(bookid)
    if(!book) return console.log('Error: book not found!')

    document.querySelector('#modalTitle').innerText = book.title
    document.querySelector('#modalPrice').innerText = 'Price: ' + book.price
    document.querySelector('#modalImg').src = book.imgUrl || 'default.png'

    document.querySelector('#bookDetailsModal').style.display = 'flex';
    
}

function closeModal() {
    document.querySelector('#bookDetailsModal').style.display = 'none'
}