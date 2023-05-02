const todoUlDOM = document.querySelector('.todo-ul');
const todoInputDOM = document.querySelector('.todo-input');
const itemsLeftDOM = document.querySelector('.items-left');

//singleSourceOfTruth
let todoData = [];
let isCompleted = true;

// document.addEventListener("DOMContentLoaded", setTodoDataFromStorage);

(function setTodoDataFromStorage() {
	if (localStorage) {
		for (let index = 0; index < localStorage.length; index++) {
			let key = localStorage.key(index);
			if (key.includes('todoer-rak-'))
				todoData.push(JSON.parse(localStorage.getItem(key)));
		}
	}
	if (todoData.length > 0) createUI();
})();

function randomIdGenerator(size = 10) {
	let randomId = 'todoer-rak-';
	let digits = '0123456789';
	for (let i = 0; i < size; i++) {
		randomId += digits[Math.floor(Math.random() * size)];
	}
	return randomId;
}

function taskButtonRefresh() {
	document.querySelector('.all-todos').style.background = '#d8e6ad';
	document.querySelector('.active-todos').style.background = '#d8e6ad';
	document.querySelector('.completed-todos').style.background = '#d8e6ad';
	document.querySelector('.clear-completed-todos').style.background =
		'#d8e6ad';
}

function toggleIndividualCheckbox(event) {
	const getId = this.parentElement.parentElement.dataset.id;
	todoData = todoData.map((todo) => {
		if (todo.id === getId) {
			if (localStorage)
				localStorage.setItem(
					todo.id,
					JSON.stringify({ ...todo, isDone: !todo.isDone })
				);
			return { ...todo, isDone: !todo.isDone };
		} else {
			return todo;
		}
	});
	createUI(todoData);
}

function handleTodoClose(event) {
	const getId = this.parentElement.dataset.id;
	todoData = todoData.filter((todo) => todo.id !== getId);
	if (localStorage) localStorage.removeItem(getId);
	createUI(todoData);
}

function createUI(todos = todoData, event, root = todoUlDOM) {
	taskButtonRefresh();
	root.innerHTML = '';
	todos.forEach((todo) => {
		const liDOM = document.createElement('li');
		liDOM.className = 'todo-item';
		liDOM.setAttribute('data-id', todo.id);

		const divCheckboxDOM = document.createElement('div');
		divCheckboxDOM.className = 'checkbox-div';
		const inputCheckboxDOM = document.createElement('input');
		inputCheckboxDOM.className = 'checkbox-input';
		inputCheckboxDOM.type = 'checkbox';
		inputCheckboxDOM.checked = todo.isDone;

		//addEventListener to checkbox
		inputCheckboxDOM.addEventListener('click', toggleIndividualCheckbox);
		divCheckboxDOM.append(inputCheckboxDOM);

		const todoTextDivDOM = document.createElement('div');
		todoTextDivDOM.className = 'todo-text';
		todoTextDivDOM.innerText = todo.todoText;

		const clearCloseDivDOM = document.createElement('div');
		clearCloseDivDOM.className = 'clear-close';
		clearCloseDivDOM.innerHTML = '&times';
		//addEventlistener to close
		clearCloseDivDOM.addEventListener('click', handleTodoClose);

		if (todo.isDone) {
			todoTextDivDOM.style.textDecoration = 'line-through';
			todoTextDivDOM.style.opacity = '0.5';
			clearCloseDivDOM.style.opacity = '0.5';
			liDOM.classList.add('todo-done-marker');
		} else {
			todoTextDivDOM.style.textDecoration = 'none';
			todoTextDivDOM.style.opacity = '1';
			clearCloseDivDOM.style.opacity = '1';
			liDOM.classList.remove('todo-done-marker');
		}
		liDOM.append(divCheckboxDOM, todoTextDivDOM, clearCloseDivDOM);
		root.append(liDOM);
	});

	if (event && todoData.length) {
		if (event.target.classList[0] !== 'clear-completed-todos')
			event.target.style.background = '#ffc600';
	}

	itemsLeftDOM.textContent = `${todoData.reduce(
		(itemsLeft, todo) => (todo.isDone ? itemsLeft : ++itemsLeft),
		0
	)} items left`;
}

function addTodo(e) {
	if (e.keyCode === 13) {
		const todoText =
			todoInputDOM.value[0].toUpperCase() + todoInputDOM.value.slice(1);
		const id = randomIdGenerator();
		const isDone = false;
		const todoItem = { todoText, id, isDone };
		todoData.push(todoItem);
		todoInputDOM.value = '';
		createUI(todoData);
		if (localStorage) {
			localStorage.setItem(id, JSON.stringify(todoItem));
		}
	}
}

todoInputDOM.addEventListener('keyup', addTodo);

function handleClickOnAllTodosButton(event) {
	if (!event.target.closest('.all-todos')) return;
	createUI(todoData, event);
}

function handleClickOnActiveTodosButton(event) {
	if (!event.target.closest('.active-todos')) return;
	const activeTodos = todoData.filter((todo) => !todo.isDone);
	createUI(activeTodos, event);
}

function handleClickOnCompletedTodosButton(event) {
	if (!event.target.closest('.completed-todos')) return;
	const completedTodos = todoData.filter((todo) => todo.isDone);
	createUI(completedTodos, event);
}

function handleClickOnClearCompletedButton(event) {
	if (!event.target.closest('.clear-completed-todos')) return;
	todoData = todoData.filter((todo) => {
		if (todo.isDone && localStorage) localStorage.removeItem(todo.id);
		return !todo.isDone;
	});
	createUI(todoData, event);
}

function handleClickOnToggler(event) {
	if (!event.target.closest('.toggler')) return;
	if (todoData.length) {
		todoData = todoData.map((todo) => {
			if (localStorage)
				localStorage.setItem(
					todo.id,
					JSON.stringify({ ...todo, isDone: isCompleted })
				);
			return { ...todo, isDone: isCompleted };
		});
		createUI(todoData);
		isCompleted = !isCompleted;
	}
}

document.addEventListener('click', function (event) {
	handleClickOnAllTodosButton(event);
	handleClickOnActiveTodosButton(event);
	handleClickOnCompletedTodosButton(event);
	handleClickOnClearCompletedButton(event);
	handleClickOnToggler(event);
});

document.addEventListener('dblclick', function (event) {
	if (!event.target.closest('.todo-text')) return;
	let element = event.target.closest('.todo-text');
	const getId = element.parentElement.dataset.id;
	let liElementDOM = document.querySelector(`li[data-id=${getId}]`);

	let updateInputDOM = document.createElement('input');
	updateInputDOM.value = element.textContent;
	updateInputDOM.className = 'double-click-input';
	liElementDOM.style.padding = '0';
	liElementDOM.replaceChild(updateInputDOM, element);
});

function handleEnterOnDoubleClickInput(event) {
	let dblClickInput = event.target.closest('.double-click-input');
	let getId = dblClickInput.parentElement.dataset.id;
	let todoText = dblClickInput.value;
	let index = todoData.findIndex((todo) => todo.id === getId);
	todoData[index] = { ...todoData[index], todoText: todoText };
	createUI(todoData);
	// TODO: Handle session storage for this case
}

document.addEventListener('keyup', function (event) {
	if (event.keyCode !== 13) return;
	if (!event.target.closest('.double-click-input')) return;
	handleEnterOnDoubleClickInput(event);
});
