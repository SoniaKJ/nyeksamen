var Quiz = (function () {
  let quizobjs = []
  // Front end related

  const userBoxElement = document.querySelector('#user-box')

  const userTemplate = ({ username }) => `
    <li class="media my-2">
      <div class="media-body">
        <b class="text-secondary">${username}</b>
      </div>
    </li>
  `

  let frontend = {}

  // Method to display the users previus quiz results in the user box.
  frontend.displayQuizobjs = function (quizobjs) {
    userBoxElement.innerHTML = frontend.getQuizobjsHTML(quizobjs)
  }


//Real time feature

  function initialize() {
    let socket = io()

    socket.on('new quizobj', quizobj => {

        quizobjs.push(quizobj)

       // Add the quiz result to the user box
        frontend.addQuizobj(quizobj)
    })

  initialize()

  return module
})()

function UserQuizobj (text) {
  this.text = text
}

document.querySelector('#users').addEventListener('submit', event => {
  event.preventDefault()

  let input = document.querySelector('#users') // ID for the place i want all of the quiz results to be postet /////

  let text = input.value
  let newQuizResultObject = new quizobj(text)

  Chat.sendQuizobj(newQuizResultObject)

  input.value = ''
})
