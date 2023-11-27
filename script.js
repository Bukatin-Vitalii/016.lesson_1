const input = document.querySelector('.input-value');
const submit = document.querySelector('.input-submit');
const post = document.querySelector('.post__info');
const errorWrap = document.querySelector('.error');
const errorText = document.querySelector('.error__text');
const comments = document.querySelector('.comments');
const loader = document.querySelector('.loader');
let inputValue;

function showLoader() {
	loader.classList.add('loader--active');
}

function hideLoader() {
	loader.classList.remove('loader--active');
}

function getPosts() {
	inputValue = input.value;
	if (inputValue >= 1 && inputValue <= 100) {
		showLoader();

		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject('Request timed out');
			}, 5000);
		});

		Promise.race([
			fetch(`https://jsonplaceholder.typicode.com/posts/${input.value}`),
			timeoutPromise,
		])
			.then((response) => response.json())
			.then((data) => {
				renderPost(data);
			})
			.catch((e) => {
				hideLoader();
				renderError(e);
			})
			.finally(() => {
				hideLoader();
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

	let btnComment = document.querySelector('#btn-comment');
	btnComment.addEventListener('click', () => {
		getComments(inputValue);
	})
}

function clearPost() {
	post.classList.remove('post__info--active');
	post.innerHTML = '';
}

function getComments(id) {
	showLoader();

	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => {
			reject('Request timed out');
		}, 5000);
	});

	Promise.race([
		fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`),
		timeoutPromise,
	])
		.then((response) => response.json())
		.then((data) => {
			renderComments(data);
		})
		.catch((e) => {
			hideLoader();
			renderError(e);
		})
		.finally(() => {
			hideLoader();
		});
}

function renderComments(data) {
	console.log(data);
	comments.classList.add('comments--active');
	comments.innerHTML = '';
	data.forEach((element) => {
		comments.innerHTML += `
		<div class="comment">
			<h3 class="comment__id">Comment ID: ${element.id}</h3>
			<h3 class="comment__text">${element.email}</h3>
			<h3 class="comment__title">${element.name}</h3>
			<p class="comment__text">${element.body}</p>
		</div>`;
	});
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
