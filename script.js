const input = document.querySelector('.input-value');
const submit = document.querySelector('.input-submit');
const post = document.querySelector('.post__info');
const errorWrap = document.querySelector('.error');
const errorText = document.querySelector('.error__text');
const comments = document.querySelector('.comments');
const loader = document.querySelector('.loader');
let inputValue;

function toggleLoader(show) {
	if (show) {
		loader.classList.add('loader--active');
	} else {
		loader.classList.remove('loader--active');
	}
}

function makeRequestWithTimeout(url, timeout) {
	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => {
			reject('Request timed out');
		}, timeout);
	});

	return Promise.race([
		fetch(url),
		timeoutPromise,
	]);
}

function getPosts() {
	inputValue = input.value;
	if (inputValue >= 1 && inputValue <= 100) {
		toggleLoader(true);

		makeRequestWithTimeout(`https://jsonplaceholder.typicode.com/posts/${input.value}`, 5000)
			.then((response) => response.json())
			.then((data) => {
				renderPost(data);
			})
			.catch((e) => {
				toggleLoader(false);
				renderError(e);
			})
			.finally(() => {
				toggleLoader(false);
			});
	} else {
		renderError('invalidValue');
	}
}

function renderPost(data) {
	post.classList.add('post__info--active');
	post.innerHTML = `
	<h2 class="post__id" >POST ID: ${data.id}</h2>
	<h2 class="post__title" >${data.title}</h2>
	<p class="post__text" >${data.body}</p>
	<button class="post__button" id="btn-comment">Get comments</button>
	`;

	inputValue = input.value;
	input.value = '';
}

function clearPost() {
	post.classList.remove('post__info--active');
	post.innerHTML = '';
}

post.addEventListener('click', (event) => {
	if (event.target.id === 'btn-comment') {
		getComments(inputValue);
	}
});

function getComments(id) {
	toggleLoader(true);

	makeRequestWithTimeout(`https://jsonplaceholder.typicode.com/posts/${id}/comments`, 5000)
		.then((response) => response.json())
		.then((data) => {
			renderComments(data);
		})
		.catch((e) => {
			toggleLoader(false);
			renderError(e);
		})
		.finally(() => {
			toggleLoader(false);
		});
}

function renderComments(data) {
	comments.classList.add('comments--active');
	comments.innerHTML = '';
	comments.innerHTML = data.map(element => `
	<div class="comment">
			<h3 class="comment__id">Comment ID: ${element.id}</h3>
			<h3 class="comment__text">${element.email}</h3>
			<h3 class="comment__title">${element.name}</h3>
			<p class="comment__text">${element.body}</p>
	</div>`
	).join('');
}

function clearComments() {
	comments.classList.remove('comments--active');
	comments.innerHTML = '';
}

submit.addEventListener('click', () => {
	getPosts();
	clearComments()
});

function renderError(error) {
	toggleLoader(false);
	errorWrap.classList.add('error--active');

	clearPost()
	clearComments()

	switch (error) {
		case 'invalidValue':
			input.value = '';
			inputValue = null;
			errorText.innerHTML = 'Enter a number from 1 to 100';
			break;
		case 'TypeError: Failed to fetch':
			errorText.innerHTML = 'Error 404';
			break;
		default:
			errorText.innerHTML = error;
			break;
	}


	setTimeout(() => {
		errorWrap.classList.remove('error--active');
	}, 1700);
}
