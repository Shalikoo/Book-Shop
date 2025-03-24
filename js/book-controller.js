'use strict'


function onInit() {
    readQueryParams()
    renderBooks()
    renderStats()
}

function renderBooks() {
    var books = getBooks(gFilterBy)

    if(books.length === 0){
        showMsg('Error: no search results!', true)
    }

    var strHTMLs = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>$${book.price}</td>
            <td>${book.rating}</td>
            <td>
                <button onclick="onReadBook('${book.id}')">Read</button>
                <button onclick="onUpdateBook('${book.id}')">Update</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
        </tr>
        `)
        document.querySelector('tbody').innerHTML = strHTMLs.join('')
        updatePaginationDisplay()
}

function renderStats() {
    const books = getBooks(gFilterBy)

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
    const elModal = document.querySelector('.book-edit-modal')
    elModal.showModal()
}

function onCloseBookEditModal() {
    const elModal = document.querySelector('.book-edit-modal')
    elModal.close()
    resetBookEditModal()
}

function resetBookEditModal() {
    const elForm = document.querySelector('.book-edit-modal form')
    const elTitle = elForm.querySelector('input.title')
    const elPrice = elForm.querySelector('input.price')
    const elRating = elForm.querySelector('input.rating')

    elTitle.value = ''
    elPrice.value = ''
    elRating.value = ''
}

function onSaveBook() {
    const title = document.querySelector('.book-edit-modal .title').value
    const price = +document.querySelector('.book-edit-modal .price').value
    const rating = +document.querySelector('.book-edit-modal .rating').value

    if (!title || !price || price <= 0 || !rating) {
        showMsg('Error: please fill all fields correctly', true)
        return
    }

    const book = {
        id: makeId(),
        title,
        price,
        rating,
        imgUrl: 'img/default.png'
    }

    gBooks.push(book)
    _saveBooks()
    onCloseBookEditModal()
    renderBooks()
    renderStats()
    showMsg('Book added successfully', false)
}

function onReadBook(bookid) {
    var book = getBookById(bookid)
    if(!book) return console.log('Error: book not found')

    document.querySelector('#modalTitle').innerText = book.title
    document.querySelector('#modalPrice').innerText = 'Price: $' + book.price
    document.querySelector('#modalRating').innerText = 'Rating: ' + book.rating + ' ⭐';

    document.querySelector('#modalImg').src = book.imgUrl

    document.querySelector('#bookDetailsModal').style.display = 'flex';
    
}

function closeModal() {
    document.querySelector('#bookDetailsModal').style.display = 'none'
}


function onSetFilter(title) {
    gFilterBy.filterBy.title = title
    setQueryParams()
    renderBooks()
    renderStats()
}

function onSetFilterByRating(minRating){
    gFilterBy.filterBy.minRating = +minRating
    setQueryParams()
    renderBooks()
    renderStats()
}

function onSetSortBy(prop) {
    gFilterBy.sortBy.prop = prop
    setQueryParams()
    renderBooks()
}

function onSetSortDir(dir) {
    gFilterBy.sortBy.dir = +dir
    setQueryParams()
    renderBooks()
}

function onClearFilter() {
    gFilterBy = {
        filterBy: {title: '', minRating: 0},
        sortBy: {},
        page: { idx: 0, size: 5 }
    }

    document.querySelector('.search').value = ''
    document.querySelector('.min-rating').value = 0
    setQueryParams()
    renderBooks()
    renderStats()
}

function updatePaginationDisplay() {
    const pageCount = getPageCount(gFilterBy)
    const currPage = gFilterBy.page.idx + 1
    const elPage = document.querySelector('.pagination')
    elPage.innerText = `Page: ${currPage} / ${pageCount}`
}

function onNextPage() {
    const pageCount = getPageCount(gFilterBy)
    gFilterBy.page.idx = (gFilterBy.page.idx + 1) % pageCount
    renderBooks()
    renderStats()
    setQueryParams()
}

function onPrevPage() {
    const pageCount = getPageCount(gFilterBy)
    gFilterBy.page.idx = (gFilterBy.page.idx - 1 + pageCount) % pageCount
    renderBooks()
    renderStats()
    setQueryParams()
}

function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    gFilterBy.filterBy = {
        title: queryParams.get('title') || '',
        minRating: +queryParams.get('minRating') || 0
    }

    if (queryParams.get('sortBy')) {
        const prop = queryParams.get('sortBy')
        const dir = queryParams.get('sortDir')
        gFilterBy.sortBy[prop] = dir
    }

    if (queryParams.get('pageIdx')) {
        gFilterBy.page.idx = +queryParams.get('pageIdx')
        gFilterBy.page.size = +queryParams.get('pageSize')
    }
    renderQueryParams()
}

function renderQueryParams() {

    document.querySelector('.search').value = gFilterBy.filterBy.title
    document.querySelector('.min-rating').value = gFilterBy.filterBy.minRating

    //const sortKeys = Object.keys(gFilterBy.sortBy)
    // const sortBy = sortKeys[0]
    // const dir = gFilterBy.sortBy[sortKeys[0]]

    document.querySelector('.search').value = gFilterBy.filterBy.title;
    document.querySelector('.min-rating').value = gFilterBy.filterBy.minRating;
}

function setQueryParams() {
    const queryParams = new URLSearchParams()

    queryParams.set('title', gFilterBy.filterBy.title)
    queryParams.set('minRating', gFilterBy.filterBy.minRating)

    const sortKeys = Object.keys(gFilterBy.sortBy)
    if (sortKeys.length) {
        queryParams.set('sortBy', sortKeys[0])
        queryParams.set('sortDir', gFilterBy.sortBy[sortKeys[0]])
    }

    if (gFilterBy.page) {
        queryParams.set('pageIdx', gFilterBy.page.idx)
        queryParams.set('pageSize', gFilterBy.page.size)
    }

    const newUrl =
        window.location.protocol + "//" +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}