'use strict'

function onInit() {
    renderBooks()
    renderStats()
}

function renderBooks() {
    var books = getBooks()

    if(books.length === 0){
        showMsg('Error: no search results!', true)
    }

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

function renderStats() {
    const books = getBooks()

    const expensiveCount = books.filter(book => book.price > 200).length
    const averageCount = books.filter(book => book.price >= 80 && book.price <= 200).length
    const cheapCount = books.filter(book => book.price < 80).length

    const elStats = document.getElementById('stats')
    elStats.innerText = `Expensive: ${expensiveCount} | Average: ${averageCount} | Cheap: ${cheapCount}`
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
