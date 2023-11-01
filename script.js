// Sélection des éléments du DOM nécessaires
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
