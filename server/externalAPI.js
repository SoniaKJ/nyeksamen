// Aner ikke om det er sådan man fetcher en api.. Hvordan får jeg JSON dataen? Og hvornår bruger jeg apien?

var JSONAPI = (function () {
     let baseUrl = 'https://dog.ceo/api/breeds/image/random'
     let module = {}
     module.getMessages = function () {
       let url = `${baseUrl}/posts`
       return fetch(url)
     }
     module.getMessage = function (id) {
       let url = `${baseUrl}/messages/${id}`
       return fetch(url)
     }
     return module
   })()
   // Get all posts
   JSONAPI.getMessages()
   .then(response => response.json())
   .then(json => {
     console.log('Messages', json)
   })
   // Get a specific post
   JSONAPI.getMessage(2)
   .then(response => response.json())
   .then(json => {
     console.log('Messages ID #2', json)
   })
