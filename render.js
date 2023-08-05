import { toggleLike, checkCommentFields, addCommentReplyHandlers } from "./main.js";
import { fetchAndRenderTasks, fetchComments, login } from './api.js';
import { format } from "date-fns";


let token;
let logged = false;
let commentAuthor = "";

export const renderUsersComments = (usersComments, listElement) => {

    const appEl = document.getElementById("app");

    function renderLoginForm() {
        if (!token) {
            const appHtml = `
            <div class="container"> 
            <div id="add-form-login" class="add-form">
                <h3>Форма входа</h3>
                <input id="login-name" type="text" class="add-form-name" placeholder="Логин" /><br>
                <input id="login-password" type="password" class="add-form-name" placeholder="Пароль" />
                <div class="add-form-row">
                <button id="login-button" class="adds-button">Войти</button>
                </div>
            </div>
            </div>
        `;
            appEl.innerHTML = appHtml;

            document.getElementById("login-button").addEventListener('click', () => {

                const loginUser = document.getElementById("login-name").value;
                const password = document.getElementById("login-password").value;

                if (!loginUser) {
                    alert('Введите логин');
                    return;
                }

                if (!password) {
                    alert('Введите пароль');
                    return;
                }

                login({
                    login: loginUser,
                    password: password,
                }).then((user) => {
                    token = `Bearer ${user.user.token}`;
                    logged = true;
                    commentAuthor = loginUser;
                    fetchAndRenderTasks(token);
                }).catch(error => {
                    alert(error.message);
                })
            });
        }
    }

    renderLoginForm(token);

    const usersCommentsHTML = usersComments.map((usersComment, index) => {

        const createDate = format(new Date(usersComments.created_at), "dd/MM/yyyy hh:mm");
        return `<ul id="list" class="comment">
        <div class="comment-header">
        <div>${usersComment.name}</div>
        <div>${usersComment.date}</div>
        </div>
        <div class="comment-body">
        <div class="comment-text">
            ${usersComment.text}
        </div>
        </div>
        <div class="comment-footer">
        <div class="likes">
            <span id="like-count" class="likes-counter">${usersComment.likes}</span>
            <button id="like" data-index="${index}" class="like-button liked ${usersComment.isLiked ? '-active-like' : ''}"></button>
            <p><i>Комментарий создан: ${createDate}</i></p>
        </div>
        </div>
    </ul>`;
    }).join('');

    const appHtml = `    <div class="container">
    <div id="loader" class="loader">Пожалуйста, подождите, загружаю комментарии...</div>
    <ul id="list" class="comments">
    ${usersCommentsHTML}
    </ul>
    <div class="form-loading" id="loadingForm">
        Комментарий добавляется...
    </div>
    <div id="add-form-block" class="add-form">
        <input value=${commentAuthor} disabled id="name" type="text" class="add-form-name" placeholder="Введите ваше имя" />
        <textarea id="comment-text" type="textarea" class="add-form-text" placeholder="Введите ваш коментарий"
            rows="4"></textarea>
        <div class="add-form-row">
            <button id="add-button" class="add-form-button">Написать</button>
        </div>
    </div>
    <p id="authorization">Чтобы добавить комментарий, <span id="auth">авторизуйтесь</span>.</p>
</div>
`
    appEl.innerHTML = appHtml;

    const authSpan = document.getElementById("auth");
    authSpan.addEventListener("click", function (token) {
        renderLoginForm();
    });

    const addForm = document.getElementById("add-form-block");
    const auth = document.getElementById("authorization");

    function updateAddForm(logged) {
        if (!logged) {
            addForm.style.display = 'none';
        } else {
            addForm.style.display = 'block';
        }
    }

    function updateAuth(logged) {
        if (logged) {
            auth.style.display = 'none';
        } else {
            auth.style.display = 'block';
        }
    }

    updateAddForm(logged);
    updateAuth(logged);

    const buttonElement = document.getElementById("add-button");
    const inputNameElement = document.getElementById("name");
    const inputTextElement = document.getElementById("comment-text");

    toggleLike();
    addCommentReplyHandlers();

    buttonElement.addEventListener("click", () => {

        let text = inputTextElement.value;
        let name = inputNameElement.value;

        fetchComments(text, name, token);

        const addForm = document.getElementById("add-form-block");
        let loadingForm = document.querySelector('.form-loading');
        loadingForm.style.display = 'block';

        inputNameElement.classList.remove('error');
        inputTextElement.classList.remove('error');
        buttonElement.classList.remove('error-button');

        if (inputNameElement.value === "" && inputTextElement.value === "") {
            inputNameElement.classList.add('error');
            inputTextElement.classList.add('error');
            buttonElement.classList.add('error-button');
            return;
        } else if (inputNameElement.value === " " || inputTextElement.value === "") {
            inputTextElement.classList.add('error');
            buttonElement.classList.add('error-button');
            return;
        } else if (inputNameElement.value === "" || inputTextElement.value === " ") {
            inputNameElement.classList.add('error');
            buttonElement.classList.add('error-button');
            return;
        }

        // Функция текущей даты и времени

        // function formatDateTime(date) {
        //     const day = date.getDate().toString().padStart(2, '0');
        //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
        //     const year = date.getFullYear().toString().slice(-2);
        //     const hours = date.getHours().toString().padStart(2, '0');
        //     const minutes = date.getMinutes().toString().padStart(2, '0');
        //     const timeString = hours + ':' + minutes;
        //     const formatedDate = `${day}.${month}.${year} ${timeString}`;
        //     return formatedDate;
        // }

        // const currentDate = new Date();
        // formatDateTime(currentDate);

        // Пуш комментариев пользователя в массив с заменой html символов 

        // usersComments.push({
        //   name: inputNameElement.value
        //     .replaceAll("&", "&amp;")
        //     .replaceAll("<", "&lt;")
        //     .replaceAll(">", "&gt;")
        //     .replaceAll('"', "&quot;"),
        //   comment: inputTextElement.value
        //     .replaceAll("&", "&amp;")
        //     .replaceAll("<", "&lt;")
        //     .replaceAll(">", "&gt;")
        //     .replaceAll('"', "&quot;"),
        //   time: formatDateTime(currentDate),
        //   likes: 0,
        //   isLiked: false,
        // });

        // checkCommentFields();
    });


};

