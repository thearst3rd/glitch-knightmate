// Client-side js, loaded by index.html
// Run by the browser each time the page is loaded

console.log("hello world :o")

// Define variables that reference elements on our page
const dreamsList = document.getElementById("dreams")
const dreamsForm = document.querySelector("form")

// A helper function that creates a list item for a given dream
function appendNewDream(dream)
{
	const newListItem = document.createElement("li")
	newListItem.innerText = dream
	dreamsList.appendChild(newListItem)
}

// Fetch the initial list of dreams
fetch("/dreams")
	.then(response => response.json()) 	// Parse the JSON from the server
	.then(dreams =>
	{
		// Remove the loading text
		dreamsList.firstElementChild.remove()

		// Iterate through every dream and add it to our page
		dreams.forEach(appendNewDream)

		// Listen for the form to be submitted and add a new dream when it is
		dreamsForm.addEventListener("submit", event =>
		{
			// Stop our form submission from refreshing the page
			event.preventDefault()

			// Get dream value and add it to the list
			let newDream = dreamsForm.elements.dream.value
			dreams.push(newDream)
			appendNewDream(newDream)

			// Reset form
			dreamsForm.reset()
			dreamsForm.elements.dream.focus()
		})
	})
