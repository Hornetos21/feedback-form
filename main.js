document.addEventListener('DOMContentLoaded', () => {
  const EMAIL_REGEXP =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu

  const maskOptions = {
    mask: '+{7} (000) 000-00-00',
  }
  const errorString = 'Поле обязательно для заполнения'

  const form = document.querySelector('.form')
  const username = form.querySelector('#name')
  const phone = form.querySelector('#phone')
  const mail = form.querySelector('#mail')

  const dialogSuccess = document.querySelector('.modal--success')
  const dialogError = document.querySelector('.modal--error')
  const btnClose = document.querySelectorAll('.btn--close')

  const wrapperSpinner = document.querySelector('.wrapper-spinner')
  const spinner = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`

  IMask(phone, maskOptions)
  //  Clear errors
  const removeErrors = (e) => {
    if (e.target.value) {
      console.log(e.target.value.length)
      e.target.classList.remove('input--error')
      e.target.nextElementSibling.nextElementSibling.innerText = ''
    }
  }

  // Validate inputs
  const isValidName = (name) => {
    return name.length > 3
  }
  const isValidEmail = (email) => {
    return EMAIL_REGEXP.test(String(email).toLowerCase())
  }
  const isValidPhone = (phone) => {
    return phone.length === 18
  }

  const validate = () => {
    const nameValue = username.value.trim()
    const phoneValue = phone.value.trim()
    const mailValue = mail.value.trim()
    const arrFalse = []

    if (!nameValue) {
      setError(username, errorString)
      arrFalse.push(false)
    } else if (!isValidName(nameValue)) {
      setError(username, 'Должно быть дольше 3 букв')
      arrFalse.push(false)
    }
    if (!phoneValue) {
      setError(phone, errorString)
      arrFalse.push(false)
    } else if (!isValidPhone(phoneValue)) {
      setError(phone, 'Некорректный номер')
      arrFalse.push(false)
    }
    if (mailValue) {
      if (!isValidEmail(mailValue)) {
        setError(mail, 'Некорректный email')
        arrFalse.push(false)
      }
    }
    return arrFalse.includes(false) ? false : true
  }
  // Set error
  const setError = (element, message) => {
    const formField = element.parentElement
    const error = formField.querySelector('.input__error')

    error.innerText = message
    element.classList.add('input--error')
  }
  // show modal
  const showModal = (modal) => {
    modal.show()
  }

  // Fetch data
  const postForm = async (data) => {
    wrapperSpinner.innerHTML = spinner
    try {
      const responce = await fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await responce.json()
      wrapperSpinner.innerHTML = ''
      showModal(dialogSuccess)
    } catch (error) {
      wrapperSpinner.innerHTML = ''
      showModal(dialogError)
    }
  }
  /*   Events */

  username.addEventListener('input', removeErrors)
  phone.addEventListener('input', removeErrors)
  mail.addEventListener('input', removeErrors)

  // Close modal
  btnClose.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.parentElement.parentElement
      modal.close()
      form.reset()
    })
  })
  // Form event
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const payload = new FormData(form)
    const data = Object.fromEntries(payload)
    if (!validate()) return

    postForm(data)
  })
})
