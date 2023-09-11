//кнОпОчкИ
// всегда const. в скобках ссылка на элемент или класс из html(задаётся через точку). либо по id(через #)
const currentDate = document.querySelector(".current-date"),
daysTag = document.querySelector(".days"),
prevNextIcon = document.querySelectorAll("header .icons span");
const listItem = document.querySelectorAll("li");
const backDate = document.querySelector(".current-date-bs");
const element = document.querySelector('.wrapper'); // тут пр ссылке
const frontSide = document.querySelector('.calendar');
const backSide = document.querySelector('#back'); //жопа календаря
const backIcon = document.getElementById('back-to-the-front');
const backDone = document.querySelector("#backDone");
const backCancel = document.querySelector("#backCancel"); //тут по id
const txtArea = document.querySelector("#reasonTextField");
const goBack = document.querySelector("#goBack");

//даты и тестовыц айди

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
let dayForDone = 0;
let id = "000016"

months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
 		"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

monthsRodP = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
		"Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];


monthsEmoji = ["🌠", "🌌", "💐", "🌺", "🌳", "😊",
"🍉", "🌄", "🌾", "🍂", "❄", "🎄"];		

//эта хуйня обрабатывает даты в календаре
//показывает сегодняшнюю и выстраивает даты в календарь
//ну и обработчики событий с некоторых кнопок тут же
const renderCalendar = () => {
	let firstDateofMonth = new Date(currYear, currMonth, 1).getDay(); //1st date месяца
	let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate() ;//посл date месяца
	let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate() ;//посл день прошлого месяца
	let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth - 1).getDay() ;//посл date месяца
	let liTag = "";
	for (let i = firstDateofMonth - 1; i > 0; i--){
		liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
	
	}

	for (let i = 1; i < lastDateofMonth + 1; i++) {
		let isToday = i === date.getDate() && currMonth === new Date().getMonth()
						&& currYear === new Date().getFullYear() ? "active" : "";
		liTag += `<li class="${isToday}">${i}</li>`;

	}

	for (let i = lastDayofMonth; i < 6; i++) {
		liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
		
	}
	currentDate.innerText = `${months[currMonth]} ${currYear}`;
	daysTag.innerHTML = liTag;
	//кнопочки которые у нас даты
	const dayItems = document.querySelectorAll(".days li");
	//переходим с переда на заднюю часть по клику на дату
	//на любую дату тыкаем и календарь переворачивается
    dayItems.forEach(day => {
    	day.addEventListener("click", () => {
			dayForDone = day;
			//гениальная хуйня с classList этим. нужно когда добавляешь анимацию в класс потом её удалять
			element.classList.remove('rotBack');
			//тут в консоль писал шоб проверить как работает
      		console.log("Hey");
			console.log(day.innerText);
			element.classList.add('rotate');
			backDate.innerText = day.innerText + " " + monthsRodP[currMonth];
			frontSide.style.display = "none";
			currentDate.style.display = "none";
			prevNextIcon.forEach(icon => {
				icon.style.display = "none";
			});
			backSide.style.display = "block";


			
			backCancel.addEventListener("click", () =>{
				console.log("hi");
				backCancel.classList.add('glowingRed');
				setTimeout(() => {
					backCancel.classList.remove('glowingRed');
				  }, 1000); //функция ждёт секунду чтоб анимацию перезапустить
				txtArea.value = '';
				txtArea.placeholder = "Вы удалили отметку o текущем дне :(((";
			});
		});
  	});

	const emoji = document.querySelector("#emojiMonth");
	emoji.innerText = monthsEmoji[currMonth];
	
}

renderCalendar();


backDone.addEventListener("click", async (event) => {
	backDone.classList.add('glowingGreen');
	
	setTimeout(() => {
		backDone.classList.remove('glowingGreen');
	}, 1000);
	if(txtArea.value != ''){
		event.preventDefault();
		let DateToSend = dayForDone.innerText + '.' + (currMonth+1) + '.' + currYear;

		const data = {
			text: txtArea.value,
			date: DateToSend,
			ID: id
		};
		//отправляет данные на сервак 
		try {
			const response = await fetch('/save-text/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			const responseData = await response.json();
			console.log(responseData);
		} catch (error) {
			console.error(error);
		}
		txtArea.value = '';
		txtArea.placeholder = "Вы добавили отметку o текущем дне :)))";
	} else {
		txtArea.placeholder = "Вы не можете отправить пустое поле!";
	}
});
//это чтоб календарь листать по месяцам
prevNextIcon.forEach(icon => {
	icon.addEventListener("click", () =>{
		currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
		if(currMonth < 0 || currMonth > 11){
			date = new Date(currYear, currMonth);
			currYear = date.getFullYear();
			currMonth = date.getMonth();
		} else {
			date = new Date();
		}
		
		renderCalendar();
	});
});
//через эту кнопку разворот назад делается

backIcon.addEventListener("click", () =>{
	element.classList.remove('rotate');
	void element.offsetWidth;
	element.classList.add('rotBack');
	frontSide.style.display = "block";
	currentDate.style.display = "block";
	prevNextIcon.forEach(icon => {
		icon.style.display = "inline-block";
	});
	backSide.style.display = "none";
	renderCalendar();
});

//переход на главную страницу
goBack.addEventListener("click", () => {


	window.location.href = "http://localhost:8000/";
});
