

const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const clearAllBtn = document.querySelector("#clear-all-btn");


let notes = [];


function loadNotes() {
    const savedNotes = localStorage.getItem("quickNotes");

    if (savedNotes) {
        try {
            notes = JSON.parse(savedNotes);
        } catch (error) {
            notes = [];
            console.error("Could not load saved notes:", error);
        }
    }
}



function saveNotes() {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}



function updateNoteCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}




function getCategoryClass(category) {
    return `category-${category.toLowerCase()}`;
}




function render() {

    // Remove existing list items
    notesList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function(note) {
        return note.text.toLowerCase().includes(searchTerm);
    });


    if (filteredNotes.length === 0 && searchTerm !== "") {

        const emptyMessage = document.createElement("li");

        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No notes match your search.";

        notesList.appendChild(emptyMessage);

    } else {

        filteredNotes.forEach(function(note) {

            
            const listItem = document.createElement("li");

            listItem.className =
                `note-card ${getCategoryClass(note.category)}`;


            
            const noteText = document.createElement("p");

            noteText.className = "note-content";
            noteText.textContent = note.text;


            
            const metadata = document.createElement("div");

            metadata.className = "note-meta";


            
            const categoryLabel = document.createElement("span");

            categoryLabel.className = "category-label";
            categoryLabel.textContent = note.category;


            
            const dateElement = document.createElement("span");

            dateElement.textContent = note.createdAt;


            
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteNote(note.id);
            });


            
            metadata.appendChild(categoryLabel);
            metadata.appendChild(dateElement);
            metadata.appendChild(deleteButton);


            
            listItem.appendChild(noteText);
            listItem.appendChild(metadata);


        
            notesList.appendChild(listItem);
        });
    }


    updateNoteCount();
}

noteForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;


    
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        noteInput.focus();
        return;
    }


    
    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";

        noteInput.focus();
        return;
    }


    
    errorMessage.textContent = "";


    
    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };


    
    notes.push(newNote);


    
    saveNotes();



    noteInput.value = "";


    
    render();



    noteInput.focus();
});

function deleteNote(id) {

    notes = notes.filter(function(note) {
        return note.id !== id;
    });

    saveNotes();

    render();
}

searchInput.addEventListener("input", function() {
    render();
});


clearAllBtn.addEventListener("click", function() {

    if (notes.length === 0) {
        return;
    }

    const confirmed = confirm("Delete all notes?");

    if (confirmed) {
        notes = [];

        saveNotes();

        render();
    }
});

loadNotes();

render();