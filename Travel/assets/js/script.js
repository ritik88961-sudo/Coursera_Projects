const search_input =  document.querySelector("#search");
const clear_btn = document.querySelector(".clear_btn");

// Function to fetch Data from the server
async function fetchData() {
    try {
        // Make the API call and wait for the response
        let res = await fetch("assets/data/places.json");
        
        // Check if the response is successful
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Parse the response JSON and return the result
        let result = await res.json();
        return result;
    } catch (error) {
        // Catch and handle any errors
        console.error("Error fetching data:", error);
        return null; // Or return a fallback value
    }
}
console.log(fetchData())
const resut = document.querySelector(".result");
function createCard(image,name,about,city,country,timeZoneOfCountry){
    
    const currentTime = new Date();
    const timeZoneAndFormat = {
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hoour12:true,
        timeZone:timeZoneOfCountry
    }
    const time = new Intl.DateTimeFormat('en-US',timeZoneAndFormat).format(currentTime);
    const showTime = document.createElement("h3");
    showTime.classList.add("timeZone");
    showTime.textContent = `Current Time: ${time}`;
    const card = document.createElement("div");
    card.classList.add("card");
    card.appendChild(showTime);
    const card_header = document.createElement("div");
    card_header.classList.add("card_header");
    const img = document.createElement("img");
    const imageUrl = image + ".jpeg";
    img.setAttribute("src",imageUrl);
    card_header.appendChild(img);
    card.appendChild(card_header);
    const card_footer = document.createElement("div");
    card_footer.classList.add("card_footer");
    const place_name = document.createElement("h2");
    place_name.textContent = name;
    const hr = document.createElement("hr");
    card_footer.appendChild(hr);
    card_footer.appendChild(place_name);
    const place_city_country = document.createElement("h3");
    place_city_country.textContent = `${city},${country}`;
    card_footer.appendChild(place_city_country);
    card_footer.appendChild(hr);
    const about_place = document.createElement("p");
    about_place.textContent = about;
    card_footer.appendChild(about_place);
    const button = document.createElement("button");
    button.textContent = "Book Now";
    card_footer.appendChild(button);
    card.appendChild(card_footer)
    resut.appendChild(card);
    scrollToBottom()
}

// Function to show result in a card
const show_result = (data)=>{
    const image = data.img;
    const about = data.about;
    const city = data.city;
    const country = data.country;
    const place_name = data.name;
    const timeZone = data.timeZone;
    createCard(image,place_name,about,city,country,timeZone);
}


// Function to Create and Filter data
const createAndFilterData = async () => {
    const data = await fetchData();
    
    const searchTerm = search_input.value.toLowerCase();
    
    // If the search term is empty, show all the results
    if (searchTerm === "") {
        clearResults();
        return;
    }

    // Filter results based on the real-time search (partial search)
    const filteredData = data.filter(val => {
        // Match the name, city, or country with the search term (partial match)
        return val.name.toLowerCase().includes(searchTerm) || 
               val.city.toLowerCase().includes(searchTerm) || 
               val.country.toLowerCase().includes(searchTerm);
    });

    clearResults();  // Clear previous results

    // Display filtered results only if the search term is complete (no partial results)
    if (searchTerm.length === search_input.value.length) {
        if (filteredData.length === 0) {
            resut.innerHTML = "<h2>No results found. Please try another search term.</h2>";
        }
        else{
            filteredData.forEach(element => {
                show_result(element);  // Display the filtered results
            });
        }

    }
}

// Function to clear previous search results
function clearResults() {
    const resultContainer = document.querySelector(".result");
    resultContainer.innerHTML = '';  // Clears previous results
}

// Declare a variable to store the debounce timer
let debounceTimer; 

// Add an event listener to the search input field to listen for the "input" event (when the user types)
search_input.addEventListener("input", () => { 
    // Clear any existing timer to prevent the previous function call from executing
    clearTimeout(debounceTimer); 

    // Set a new timer to delay the function call by 300 milliseconds
    debounceTimer = setTimeout(() => createAndFilterData(), 300); 
    // After 300ms of no new input, the createAndFilterData function will be executed
});


document.querySelector(".clear_btn").addEventListener("click",()=>{
    search_input.value = "";
    resut.innerHTML = ""
})
function scrollToBottom(){
    window.scrollTo({
        top: document.body.scrollHeight,  // Scroll to the bottom of the body
        behavior: 'smooth'                // Smooth scroll animation
      });
}