import { usersComments, updateUsersComments } from "./main.js";
import { renderUsersComments } from "./render.js";
// import { format } from "date-fns";

const listElement = document.getElementById("list");

const host = 'https://webdev-hw-api.vercel.app/api/v2/kostasdvor/comments';

export const fetchAndRenderTasks = (token) => {
    return fetch(
        host,
        {
            method: "GET",
            headers: {
                Authorization: token,
            },
        }
    )
        .then((response) => response.json())
        .then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                // const createDate = format(new Date(comment.created_at), 'dd/MM/yyyy hh:mm');
                // const commentDate = new Date(comment.date);
                // const day = commentDate.getDate();
                // const month = commentDate.getMonth() + 1;
                // const year = commentDate.getFullYear();
                // const formattedDate = `${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}.${year}`;
                // const hours = commentDate.getHours();
                // const minutes = commentDate.getMinutes();
                // const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
                // const formattedDateTime = `${formattedDate} ${formattedTime}`;

                return {
                    name: comment.author.name,
                    // date: createDate,
                    text: comment.text,
                    likes: comment.likes,
                    isLikes: false,
                };
            });
            updateUsersComments(appComments);
            renderUsersComments(appComments, listElement);
        }).catch((error) => {
            alert("Что-то пошло не так, повторите попытку позже.");
            console.warn(error);
        });
}

export const fetchComments = (text, name, token) => {
    return fetch(
        host,
        {
            method: "POST",
            headers: {
                Authorization: token,
            },
            body: JSON.stringify({
                text: text,
                name: name,
            }),
        }
    ).then((response) => {
        if (response.status === 500) {
            throw new Error("Сервер упал");
        } else if (response.status === 400) {
            let loadingForm = document.querySelector('.form-loading');
            loadingForm.style.display = 'none';
            throw new Error("Плохой запрос");
        } else {
            return response.json();
        }
    }).then((responseData) => {
        return fetchAndRenderTasks();
    }).then(() => {
        renderUsersComments(usersComments, listElement);
    }).catch((error) => {
        if (error.message === "Сервер упал") {
            alert("Сервер упал, повторите попытку позже");
        } else if (error.message === "Плохой запрос") {
            alert("Поля ввода должны содержать минимум 3 символа");
        } else {
            alert("Нет доступа к интернету");
        }
        console.warn(error);
    });
};

export function login({ login, password }) {
    return fetch("https://wedev-api.sky.pro/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error("Неверный логин или пароль")
        }
        return response.json();
    }).then((user) => {
        renderUsersComments(usersComments, listElement);
        return user;
    });
}






