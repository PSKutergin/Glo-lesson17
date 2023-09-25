'use strict'

const name = document.querySelector('#name');
const surname = document.querySelector('#surname');
const birthday = document.querySelector('#birthday');
const email = document.querySelector('#email');
const city = document.querySelector('#city');
const familyStatus = document.querySelector('#family-status');
const experience = document.querySelector('#experience');
const major = document.querySelector('#major');
const job = document.querySelector('#job');
const dateEmployment = document.querySelector('#date-employment');
const availabilityWork = document.querySelectorAll('[name="works"]');
const dateDismissal = document.querySelector('#date-dismissal');
const btnSave = document.querySelector('.button')

if (!localStorage.getItem('persons')) {
    localStorage.setItem('persons', JSON.stringify([]))
};

class Person {
    constructor(name, surname, birthday, email, city, familyStatus) {
        this.name = name
        this.surname = surname
        this.birthday = birthday
        this.email = email
        this.city = city
        this.familyStatus = familyStatus
    }

    getAge() {
        const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        const birthdayNow = new Date(today.getFullYear(), this.birthday.getMonth(), this.birthday.getDate());
        let age = 0

        if (today < birthdayNow) {
            age = today.getFullYear() - this.birthday.getFullYear() - 1;
        } else {
            age = today.getFullYear() - this.birthday.getFullYear();
        }
        console.log(`Меня зовут ${this.name} и мне ${age} лет`)
    }
};

class Employee extends Person {
    constructor(name, surname, birthday, email, city, familyStatus, experience, major, job, dateEmployment, dateDismissal) {
        super(name, surname, birthday, email, city, familyStatus)
        this.experience = experience
        this.major = major
        this._job = job
        this.dateEmployment = dateEmployment
        this.dateDismissal = dateDismissal
    }

    get job() {
        return this.job
    }

    set job(str) {
        this.job = str
    }

};

class Doctor extends Employee {
    constructor(name, surname, birthday, email, city, familyStatus, experience, major, job, dateEmployment, dateDismissal, skills = []) {
        super(name, surname, birthday, email, city, familyStatus, experience, major, job, dateEmployment, dateDismissal)
        this._skills = skills
    }

    get skills() {
        return this._skills
    }

    set skills(str) {
        this.skills.push(str)
    }
};

class Teacher extends Employee {
    constructor(name, surname, birthday, email, city, familyStatus, experience, major, job, dateEmployment, dateDismissal, skills = []) {
        super(name, surname, birthday, email, city, familyStatus, experience, major, job, dateEmployment, dateDismissal)
        this._skills = skills
    }

    get skills() {
        return this._skills
    }

    set skills(str) {
        this.skills.push(str)
    }
};

const render = function () {
    const table = document.querySelector('.table');
    const bodyTable = document.querySelector('table tbody');
    let personsData = JSON.parse(localStorage.getItem('persons'));

    bodyTable.innerHTML = "";

    if (personsData.length > 0) {
        table.style.display = 'block'

        personsData.forEach((item, index) => {
            bodyTable.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${item.name}</td>
                <td>${item.surname}</td>
                <td>${item.birthday}</td>
                <td>${item.email}</td>
                <td>${item.city}</td>
                <td>${item.familyStatus}</td>
                <td>${item.experience}</td>
                <td>${item.major}</td>
                <td>${item.job}</td>
                <td>${item.dateEmployment}</td>
                <td>${item.dateDismissal}</td>
                <td>${item._skills.join(', ')}</td>
                <td><button class="btn-remove" value="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 30 30">
                            <path fill="#f78f8f" d="M15 17.722L6.429 26.293 3.707 23.571 12.278 15 3.707 6.429 6.429 3.707 15 12.278 23.571 3.707 26.293 6.429 17.722 15 26.293 23.571 23.571 26.293z"></path><path fill="#c74343" d="M23.571,4.414l2.014,2.014l-7.864,7.864L17.014,15l0.707,0.707l7.864,7.864l-2.014,2.014 l-7.864-7.864L15,17.014l-0.707,0.707l-7.864,7.864l-2.014-2.014l7.864-7.864L12.986,15l-0.707-0.707L4.414,6.429l2.014-2.014 l7.864,7.864L15,12.986l0.707-0.707L23.571,4.414 M23.571,3L15,11.571L6.429,3L3,6.429L11.571,15L3,23.571L6.429,27L15,18.429 L23.571,27L27,23.571L18.429,15L27,6.429L23.571,3L23.571,3z"></path>
                        </svg>
                    </button>
                </td>
            </tr>`)
        })

        document.querySelectorAll('.btn-remove').forEach((elem) => {
            elem.addEventListener('click', function () {
                personsData.splice(elem.value, 1)
                localStorage.setItem('persons', JSON.stringify(personsData))
                render()
            })
        })

    } else {
        table.style.display = 'none'
    };

    document.querySelector('#availability-work').addEventListener('change', () => {
        availabilityWork.forEach((elem) => {
            if (elem.checked) {
                if (elem.value === 'no') {
                    dateDismissal.removeAttribute('disabled');
                    dateDismissal.focus()
                } else {
                    dateDismissal.setAttribute("disabled", "true");
                }
            }
        });
    });

    major.addEventListener('change', (e) => {
        if (e.target.value === 'doctor') {
            document.querySelector('.form').style.width = '800px'
            document.querySelector('.specializations').style.display = 'flex'
            document.querySelector('.subjects').style.display = 'none'
        } else if (e.target.value === 'teacher') {
            document.querySelector('.form').style.width = '800px'
            document.querySelector('.subjects').style.display = 'flex'
            document.querySelector('.specializations').style.display = 'none'
        } else {
            document.querySelector('.form').style.width = '550px'
            document.querySelector('.subjects').style.display = 'none'
            document.querySelector('.specializations').style.display = 'none'
        }
    });
};

btnSave.addEventListener('submit', function (event) {
    event.preventDefault()  // отключили стандартное поведение формы

    const specializations = document.querySelectorAll('[name="specializations[]"]:checked');
    const subjects = document.querySelectorAll('[name="subjects[]"]:checked');
    const selectMajor = major.options[major.selectedIndex].textContent
    let personsData = JSON.parse(localStorage.getItem('persons'))
    let dateDismissalValue = ''

    availabilityWork.forEach((elem) => {
        if (elem.checked && elem.value === 'yes') {
            dateDismissalValue = 'Работает по настоящее время'
        }
    });

    if (selectMajor === "Врач") {
        const newPerson = new Doctor(
            name.value,
            surname.value,
            birthday.value,
            email.value,
            city.value,
            familyStatus.value === 'married' ? 'Женат/Замужем' : 'Холост/Не замужем',
            experience.value,
            selectMajor,
            job.value,
            dateEmployment.value,
            dateDismissalValue = '' ? dateDismissal.value : dateDismissalValue,
            Array.from(specializations).map(cb => cb.value)
        )
        console.log(newPerson);
        personsData.push(newPerson);
        localStorage.setItem('persons', JSON.stringify(personsData));

    } else if (selectMajor === "Учитель") {
        const newPerson = new Teacher(
            name.value,
            surname.value,
            birthday.value,
            email.value,
            city.value,
            familyStatus.value === 'married' ? 'Женат/Замужем' : 'Холост/Не замужем',
            experience.value,
            selectMajor,
            job.value,
            dateEmployment.value,
            dateDismissalValue = '' ? dateDismissal.value : dateDismissalValue,
            Array.from(subjects).map(cb => cb.value)
        )

        personsData.push(newPerson)
        localStorage.setItem('persons', JSON.stringify(personsData))
    }

    document.querySelectorAll('input').forEach((e) => {
        e.value = ''
    })
    specializations.forEach((e) => {
        e.checked = false
    })
    subjects.forEach((e) => {
        e.checked = false
    })
    major.selectedIndex = 0;
    document.querySelector('.form').style.width = '550px'
    document.querySelector('.subjects').style.display = 'none'
    document.querySelector('.specializations').style.display = 'none'

    dateDismissal.setAttribute("disabled", "true");

    render();
});

render()