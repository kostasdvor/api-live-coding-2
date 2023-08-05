import { fetchAndRenderTasks, fetchComments } from './api.js';
import { renderUsersComments } from "./render.js";


const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");

const inputNameElement = document.getElementById("name");

const addForm = document.getElementById("add-form-block");
let currenDate = new Date();

export let usersComments = [

];

export function updateUsersComments(newComments) {
    usersComments = newComments;
};

fetchAndRenderTasks();

//Хорошая функция добавления лайка с использованием stopPropagation

export function toggleLike() {

    const likeButtons = document.querySelectorAll('.like-button');
    // addCommentReplyHandlers();

    for (const button of likeButtons) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const index = button.dataset.index;
            if (usersComments[index].isLiked) {
                usersComments[index].likes--
            } else {
                usersComments[index].likes++
            }

            usersComments[index].isLiked = !usersComments[index].isLiked;
            renderUsersComments(usersComments, listElement);
        })
    }
};

// Функция отключения кнопки "написать" при незаполненных input

export function checkCommentFields() {

    function togglePublishButton(buttonElement) {
        if (inputNameElement.value.trim() === "" || inputTextElement.value.trim() === "") {
            buttonElement.disabled = true;
        } else {
            buttonElement.disabled = false;
        }
    }

    inputNameElement.addEventListener('input', togglePublishButton);
    inputTextElement.addEventListener('input', togglePublishButton);
}

// Функция для ответа на комментарий

export function addCommentReplyHandlers() {
    const commentElements = document.querySelectorAll(".comment");
    const inputTextElement = document.getElementById("comment-text");

    for (const commentElement of commentElements) {
        commentElement.addEventListener("click", (event) => {
            const author = commentElement.querySelector(".comment-header div:first-child").textContent;
            const text = commentElement.querySelector(".comment-text").textContent;

            inputTextElement.value = `>${text.trim()}\n@${author}, `;
            inputTextElement.focus();
        });
    }
}



// export function addCommentReplyHandlers() {
//     const commentElements = document.querySelectorAll(".comment");

//     for (const commentElement of commentElements) {
//         commentElement.addEventListener("click", (event) => {
//             const authorElement = commentElement.querySelector(".comment-header div:first-child");
//             const textElement = commentElement.querySelector(".comment-text");

//             const author = authorElement.textContent.trim();
//             const text = textElement.textContent.trim();

//             inputTextElement.value = `>${text}\n@${author}, `;
//             inputTextElement.focus();
//         });
//     }
// }

// ... (остальной код main.js)

// Функция для ответа на комментарий

// export function addCommentReplyHandlers() {
//     const commentElements = document.querySelectorAll(".comment");

//     if (!inputTextElement) {
//         console.error("Element with id 'comment-text' not found!");
//         return;
//     }

//     for (const commentElement of commentElements) {
//         commentElement.addEventListener("click", (event) => {
//             const authorElement = commentElement.querySelector(".comment-header div:first-child");
//             const textElement = commentElement.querySelector(".comment-text");

//             const author = authorElement.textContent.trim();
//             const text = textElement.textContent.trim();

//             inputTextElement.value = `>${text}\n@${author}, `;
//             inputTextElement.focus();
//         });
//     }
// }



toggleLike();
// addCommentReplyHandlers();

