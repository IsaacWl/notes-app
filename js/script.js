const localNotes = localStorage.getItem('notes') !== null ? 
JSON.parse(localStorage.getItem('notes')) : [];

(function() {
    addPostsToDocument(localNotes)
})()

function openModal() {
    const modal = document.querySelector('#modal');
    const modalOpen = document.querySelector('#modalOpen');
    modal.style.display = 'block';
    modal.classList.contains('none') && modal.classList.remove('none')
    modalOpen.style.display = 'block';
}

function closeModal() {
    const modal = document.querySelector('#modal');
    document.querySelector('#modalOpen').style.display = 'none';
    modal.classList.add('none');
    modal.style.display = 'none'
}

document.querySelector('#addPost').onclick = (e) => {
    const form = document.querySelector('form')
    const title = form.task.value;
    const content = form.post.value;

    if (!title.trim()) {
        return console.error({error: 'must provide a text...'})
    }
    const post = {
        title,
        content,
        id: Math.random().toString().slice(2)
    }
    localNotes.push(post)
    localStorage.setItem('notes', JSON.stringify(localNotes))
    addPostToDocument(post)
    closeModal()
    form.reset()
}

function addPostToDocument(post) {
    const card = document.createElement('div');
    const h5 = document.createElement('h5');
    const p = document.createElement('p');
    const contentDiv = document.createElement('div');
    const titleDiv = document.createElement('div');
    const close = document.createElement('span');
    // const menu = createCardMenu(post.title);
    
    close.textContent = 'x';
    h5.textContent = post.title;
    p.textContent = post.content;
    h5.addEventListener('click', handleEdit)
    p.addEventListener('click', handleEdit)
    h5.setAttribute('key', post.id);
    p.setAttribute('key', post.id);
    h5.setAttribute('id', post.title);
    p.setAttribute('id', post.content);
    titleDiv.append(h5, close);
    contentDiv.appendChild(p);

    close.className = 'close-note';
    card.classList.add('card');
    contentDiv.classList.add('note-content')
    titleDiv.classList.add('note-title')
    titleDiv.setAttribute('key', post.title)
    contentDiv.setAttribute('key', post.content)
    card.append(titleDiv, contentDiv);
    
    document.querySelector('#posts').append(card);
    close.setAttribute('data-id', post.title)
    close.addEventListener('click', handleDelete)
}

function addPostsToDocument(posts) {
    posts.forEach(post => {
        addPostToDocument(post)
    })
}

function handleDelete(e) {
    const id = e.target.dataset.id
    for (const note of localNotes) {
        if (note.title === id) {
            localNotes.splice(localNotes.indexOf(note), 1)
            localStorage.setItem('notes', JSON.stringify(localNotes))
        }
    }
    location.reload()
}

function handleEdit(e) {
    const element = e.target;
    const text = e.target.textContent;
    const key = e.target.getAttribute('key');
    const id = e.target.getAttribute('id');
    element.contentEditable = true;
    element.setAttribute('spellcheck', false);
    element.addEventListener('blur', function() {
        this.contentEditable = false;
        if (!this.textContent) {
            this.textContent = text;
            return;
        }
        const notes = localNotes.map((note, index) => {
            if (note.id === key) {
                if (note.title === id) {
                    return {...note, title: this.textContent}
                }
                if (note.content === id) {
                    return {...note, content: this.textContent}
                }
            } 
            else {
                return note;
            }
        })
        console.log(notes)
        localStorage.setItem('notes', JSON.stringify(notes))
    })
}