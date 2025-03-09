// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', submitForm);

function submitForm(event) {
  event.preventDefault();
  const delay = Number(event.target.delay.value);
  const state = event.target.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(result => {
      console.log(`Promise fulfilled after ${result} ms`);
      iziToast.success({
        title: 'OK',
        message: `Promise fulfilled after ${result} ms`,
        position: 'topRight',
      });
    })
    .catch(error => {
      console.log(`Promise rejected after ${error} ms`);
      iziToast.error({
        title: 'Error',
        message: `Promise rejected after ${error} ms`,
        position: 'topRight',
      });
    });
}
