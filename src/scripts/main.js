const sortOptions = document.querySelectorAll('.sort__option')
const option = document.querySelector('.sort__option')
const burger = document.querySelector('.header__burger')
const nav = document.querySelector('.nav')
const navLinks = document.querySelectorAll('.nav__link')
const closeMenu = document.querySelector('.close-burger')
const likes = document.querySelectorAll('.cat__like')
const upBtn = document.querySelector('.btn.btn--up')
const header = document.querySelector('.header')
const catsList = document.querySelector('.cats__list')
const catsItems = document.querySelectorAll('.cat')

let order = catsList.dataset.order

// сортировка элементов
sortOptions.forEach(option => {
  option.addEventListener('click', () => {
    sortData(option)
  })
})
// видимость и работа кнопки "наверх"
window.addEventListener('scroll', () => {
  if (window.scrollY > (header.offsetHeight + 100)) {
    upBtn.style.display = 'block'

    upBtn.addEventListener('click', () => {
      header.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  } else {
    upBtn.style.display = 'none'
  }
})
// открытие/закрытие мобильного меню
burger.addEventListener('click', () => {
  nav.classList.toggle('nav--active')
})
//скрытие мобильного меню при нажатии на ссылку
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--active')
  })
})
// добавление/удаление кота в избранное
likes.forEach(like => {
  let liked = false
  like.addEventListener('click', e => {
    if (!liked) {
      liked = true
      alert('Вы добавили кота в избранное!')
      e.target.style.fill = '#e52d2d'
    } else {
      liked = false
      e.target.style.fill = '#fff'
    }
  })
})
// скрытие меню при нажатии на крестик
closeMenu.addEventListener('click', () => {
  nav.classList.remove('nav--active')
})

// функция сортировки данных
const sortData = elem => {
  // дата атрибут с типом сортировки
  let type = elem.dataset.sort
  // иконка сортировки
  const optionIcon = elem.querySelector('.sort__icon')
  //превращение псевдомассива DOM элементов в массив
  let cats = [...catsItems]
  // сортировка
  if (order === 'asc') {
    order = 'desc'
    cats = cats.sort((a, b) => a.dataset[type] - b.dataset[type])
    optionIcon.classList.add('sort__icon--asc')
    optionIcon.classList.remove('sort__icon--desc')
  }
  else {
    order = 'asc'
    cats = cats.sort((a, b) => b.dataset[type] - a.dataset[type])
    optionIcon.classList.add('sort__icon--desc')
    optionIcon.classList.remove('sort__icon--asc')
  }
  // очищение контейнера со списком котов
  catsList.innerHTML = ''
  //замена элементов на сортированные
  cats.forEach(item => {
    catsList.appendChild(item)
  })
}