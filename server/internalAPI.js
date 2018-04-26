//This should be the api that allows the user information and quizresults to be displayed at the home page

var Quiz = (function () {
  let quizResults = []
  // Front end related

  // Elements
  const userBoxElement = document.querySelector('#user-box')

  // Templates
  const userTemplate = ({ username }) => `
    <li class="media my-2">
      <div class="media-body">
        <b class="text-secondary">${username}</b>
      </div>
    </li>
  `

  // Private frontend module - only available within the chat module
  let frontend = {}

  // Method to display the users previus quiz results in the user box.
  frontend.displayQuizResults = function (quizResults) {
    userBoxElement.innerHTML = frontend.getQuizResultsHTML(quizResults)
  }

  //Maybe this is better?

  // Initializing an empty object via object literal notation
  let module = {}

  // Load all quiz results and display them
  module.getQuizResults()
  .then(allQuizResults => {
      quizResults = allQuizResults

      frontend.displayQuizResults(quizResults)
   })
  }


//Real time feature

  // Function which sets up listeners for Socket.io events
  // And loads initial quiz results to the user box
  function initialize() {
    // Setup the socket
    let socket = io()

    // What to do when the "new quiz result" event is received
    socket.on('new quizResult', quizResult => {
        // Push the quiz result to our internal array (used for local search)
        quizResults.push(quizResult)

        // Add the quiz result to the user box
        frontend.addQuizResult(quizResult)
    })

  // Run the initialize function
  initialize()

  return module
})()

function UserQuizResult (text) {
  this.text = text
}

document.querySelector('#user-box').addEventListener('submit', event => {
  event.preventDefault()

  let input = document.querySelector('#qResults') // ID for the place i want all of the quiz results to be postet /////

  let text = input.value
  let newQuizResultObject = new qResults(text)

  Chat.sendQuizResult(newQuizResultObject)

  input.value = ''
})
