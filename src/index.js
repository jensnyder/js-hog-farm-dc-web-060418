document.addEventListener('DOMContentLoaded', function() {
  getHogs()
  let hogForm = document.querySelector('#hog-form')
  hogForm.addEventListener('submit', addNewHog)
})

function getHogs() {
  fetch('http://localhost:3000/hogs')
  .then(response => response.json())
  .then(hogsData => {
    hogsData.forEach(hog => renderHog(hog))
  })
}

function addNewHog(event) {
  event.preventDefault()
  let newHogName = event.target[0].value
  let newHogSpecialty = event.target[1].value
  let newHogMedal = event.target[2].value
  let newHogWeight = event.target[3].value
  let newHogImage = event.target[4].value
  let newHogGreased = event.target[5].checked
  let newHogData = {'name': newHogName, 'specialty': newHogSpecialty, 'greased': newHogGreased, "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": newHogWeight, "highest medal achieved": newHogMedal, "image": newHogImage}
  fetch('http://localhost:3000/hogs', {
    method: 'POST',
    body: JSON.stringify(newHogData),
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    }
  })
  .then(response => response.json())
  .then(newHog => renderHog(newHog))
  event.target.reset()
}

function renderHog(hog) {
  let hogContainer = document.querySelector('#hog-container')
  let hogDiv = document.createElement('div')
  let hogName = document.createElement('h2')
  let hogImage = document.createElement('img')
  let hogSpecialty = document.createElement('p')
  let hogWeight = document.createElement('p')
  let hogMedal = document.createElement('p')
  let hogGreasedLabel = document.createElement('label')
  let hogGreased = document.createElement('input')
  let lineBreak = document.createElement('br')
  let deleteButton = document.createElement('button')
  hogDiv.id = `hog-${hog.id}`
  hogDiv.className = 'hog-card'
  hogName.innerText = hog.name
  hogImage.src = `${hog.image}`
  hogSpecialty.innerText = `Specialty: ${hog.specialty}`
  hogWeight.innerText = `Weight: ${hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']}`
  hogMedal.innerText = `Highest Medal Achieved: ${hog['highest medal achieved']}`
  hogGreasedLabel.innerText = 'Greased?'
  hogGreased.type = 'checkbox'
  if (hog.greased) {
    hogGreased.checked = true
  }
  hogGreased.id = `grease-hog-${hog.id}`
  hogGreased.addEventListener('click', toggleGreased)
  deleteButton.innerText = 'Delete Hog'
  deleteButton.addEventListener('click', deleteHog)
  deleteButton.id = `delete-hog-${hog.id}`
  hogDiv.appendChild(hogName)
  hogDiv.appendChild(hogImage)
  hogDiv.appendChild(hogSpecialty)
  hogDiv.appendChild(hogWeight)
  hogDiv.appendChild(hogMedal)
  hogDiv.appendChild(hogGreasedLabel)
  hogDiv.appendChild(hogGreased)
  hogDiv.appendChild(lineBreak)
  hogDiv.appendChild(deleteButton)
  hogContainer.appendChild(hogDiv)
}

function deleteHog() {
  let hogId = event.target.id.split("-")[2]
  fetch(`http://localhost:3000/hogs/${hogId}`,{
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(json => {
    document.querySelector(`#hog-${hogId}`).remove()
  })
}

function toggleGreased(event) {
  let id = event.target.id.split("-")[2]
  let newGreasedStatus = event.target.checked
  fetch(`http://localhost:3000/hogs/${id}`,{
    method: 'PATCH',
    body: JSON.stringify({greased: newGreasedStatus}),
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    }
  })
  .then(response => response.json())
  .then(json => json)
}
