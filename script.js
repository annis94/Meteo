// Sélection des éléments du DOM nécessaires
<<<<<<< HEAD
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;  // Variable pour stocker le message de l'utilisateur
const API_KEY = "API";  // Clé API
const inputInitHeight = chatInput.scrollHeight;  // Hauteur initiale de la zone de texte

// Fonction pour créer un élément li de chat
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");  // Création d'un nouvel élément li
    chatLi.classList.add("chat", `${className}`);  // Ajout des classes CSS
    // Contenu conditionnel basé sur le type de message (entrant ou sortant)
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;  // Insérer le message dans l'élément p
    return chatLi;  // Retourner l'élément li créé
}

// Fonction pour générer une réponse via l'API
const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Configuration de la requête API
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    }

    // Envoi de la requête, traitement de la réponse et gestion des erreurs
    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content.trim();  // Mettre à jour le contenu du message avec la réponse de l'API
        })
        .catch(() => {
            messageElement.classList.add("error");  // Ajouter une classe d'erreur en cas d'échec
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));  // Scroller vers le bas après la réponse ou l'erreur
}

// Fonction pour gérer les interactions de chat
const handleChat = () => {
    userMessage = chatInput.value.trim();  // Récupérer et nettoyer le message de l'utilisateur
    if(!userMessage) return;  // S'arrêter si aucun message n'est entré

    chatInput.value = "";  // Réinitialiser la zone de texte
    chatInput.style.height = `${inputInitHeight}px`;  // Réinitialiser la hauteur de la zone de texte

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));  // Ajouter le message de l'utilisateur à la chatbox
    chatbox.scrollTo(0, chatbox.scrollHeight);  // Scroller vers le bas

    // Générer et afficher une réponse après un délai
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");  // Créer un élément li pour la réponse entrante
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);  // Générer une réponse
    }, 600);
}

// Gestionnaires d'événements pour les interactions utilisateur
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;  // Réinitialiser la hauteur, puis l'ajuster en fonction du contenu
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // Gérer l'envoi du chat avec la touche Entrée (sans la touche Maj), si la largeur de la fenêtre est supérieure à 800px
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);  // Gérer le clic sur le bouton d'envoi
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));  // Fermer le chatbot
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));  // Basculer la visibilité du chatbot
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

// Définition de la clé d'API
const API_KEY = "API"; 

// Fonction pour créer une carte météo HTML
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { 
        // Création de HTML pour la météo actuelle
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { 
        // Création de HTML pour les prévisions météorologiques des jours suivants
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

// Fonction pour obtenir les détails météorologiques en utilisant l'API OpenWeatherMap
const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Réinitialisation des champs de saisie et des conteneurs HTML
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Remplissage des conteneurs HTML avec des cartes météo
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

// Fonction pour obtenir les coordonnées de la ville entrée par l'utilisateur
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

// Fonction pour obtenir les coordonnées de l'utilisateur et chercher les détails météorologiques
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; 
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { 
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

// Ajout des gestionnaires d'événements pour les boutons et le champ de saisie
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
>>>>>>> b0d6932ad21d6be92df85c9c1c359bd3ca21a716
