// Aner ikke om det er sådan man fetcher en api.. Hvordan får jeg JSON dataen? Og hvornår bruger jeg apien?

const express = require('express')

const fetch = require('node-fetch')

const app = express()

//My kode////////////////////////////////////////////////////

var giphy = require('giphy-api')('rKTdIyLMETSBNOLUIMX1d2zHIG040j5b'); //// Not sure if I need this?////

var giphy = require('giphy-api')({
    let url = 'http://api.giphy.com/v1/gifs/search?q=good+job&api_key=rKTdIyLMETSBNOLUIMX1d2zHIG040j5b'

    // Search with a plain string using callback
giphy.search('good job', function (err, res) {
    // Res contains gif data!
    .then((response) => {

  })
  .catch((err) => {

  })

  app.listen(3000, () => {

  })

});
});

//HTML code for the Giph API//////////////////////

function displayGiph (giph) {

  const giphTemplate = ({name, login: username, avatar_url, html_url: profile_url, public_repos  }) => `
    <div class="card">
      <div class="card-body">
        <div class="media">
          <img src="${avatar_url}" class="mr-3 rounded" width="80">
          <div class="media-body">
            <h5>${username}</h5>
            <h6 class="text-muted">${name}</h6>
            <p>
              Public repositories: ${public_repos}
            </p>
            <a href="${profile_url}" target="_blank">View profile</a>
          </div>
        </div>
      </div>
    </div>
  `
  // Call the arrow function
  let html = userTemplate(giph)
  // Set the HTML of the #single-user element
  document.querySelector('#single-user').innerHTML = html
}

//Hennings kode///////////////////////////////////////

app.get('/photo', (req, res) => {
    let url = 'https://api.unsplash.com/photos/random'

    let options = {
        headers: {
            'Authorization': 'Client-ID 25e7d080b38d27769e31f282614342f2c493bc2a5d2359f543f8412440598f68'
        }
    }

    fetch(url, options)
    .then(response => response.json())
    .then(json => {
        res.json(json)
    })
})

app.listen(3000, () => {
    console.log('Server started')
})
