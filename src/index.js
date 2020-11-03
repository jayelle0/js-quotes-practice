const quoteList = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')

fetch('http://localhost:3000/quotes?_embed=likes')
.then(response => response.json())
.then(quoteArray => {
    // console.log(quoteArray)
    renderAllQuotes(quoteArray)

});


function renderAllQuotes(quoteArray) {
    quoteArray.forEach(renderOneQuote)
}

function renderOneQuote(quote){
    const quoteLi = document.createElement('li')
    const numLikes = quote.likes.length
    // console.log(numLikes)
    quoteLi.className = "quote-card"
    quoteLi.dataset.id = quote.id
    quoteLi.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0"> ${quote.quote} </p>
    <footer class="blockquote-footer"> ${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span> ${numLikes} </span></button>
    <button class='btn-danger'>Delete</button>
    <button class='btn-edit'>Edit</button>
  </blockquote>
    `
    quoteList.append(quoteLi)
}

quoteForm.addEventListener('submit',(event) => {
    event.preventDefault()
    console.log(event.target)

    quoteObj = {
        quote: event.target.quote.value,
        author: event.target.author.value,
        likes: []
    }
    // console.log(quoteObj)

    fetch('http://localhost:3000/quotes', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteObj),
    })
    .then(response => response.json())
    .then(newQuoteObj => {
        renderOneQuote(newQuoteObj)
        event.target.reset()
    })
})

quoteList.addEventListener('click', (event) => {
    if (event.target.matches('.btn-success')){
        const likeButton = event.target 
        const likedQuote = likeButton.closest('li')
        const likedId = likedQuote.dataset.id
        const likedIdNum = parseInt(likedId) 
        const likedLikes = likeButton.querySelector('span')
        const likedLikeNums = parseInt(likedLikes.innerText) + 1
        console.log(likedLikeNums)

        const likedObj = {
            quoteId: likedIdNum, 
            createdAt: Date.now
        }

        fetch('http://localhost:3000/likes', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(likedObj)
            })
            .then(response => response.json())
            .then((data) => {
               likedLikes.innerText = likedLikeNums
            })
       
      
    }
    else if (event.target.matches('.btn-danger')){
        // console.log(event.target)
        const deleteButton = event.target 
        const deletedQuote = deleteButton.closest('li')    
        const deleteId = deletedQuote.dataset.id
        // console.log (deleteId)

        fetch(`http://localhost:3000/quotes/${deleteId}`, {
            method: 'DELETE', 
        })
        .then(response => response.json())
        .then(() => deletedQuote.remove())
    }

})

