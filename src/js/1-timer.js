import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const query = {
  text: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),

  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
query.btnStart.disabled = true;
let userSelectedDate = null;
let timeInterval = null;

query.btnStart.addEventListener('click', onStart);

function onStart() {
  query.btnStart.disabled = true;
  query.text.disabled = true;
  timeInterval = setInterval(() => {
    const remainingTime = userSelectedDate - Date.now();

    if (remainingTime <= 0) {
      clearInterval(timeInterval);
      query.text.disabled = false;
      query.text.value = '';
      iziToast.success({
        title: 'OK',
        message: ' Time is up',
        position: 'topRight',
      });
      return;
    }
    const timeArr = convertMs(remainingTime);
    const { days, hours, minutes, seconds } = timeArr;
    query.days.textContent = String(days).padStart(2, '0');
    query.hours.textContent = String(hours).padStart(2, '0');
    query.minutes.textContent = String(minutes).padStart(2, '0');
    query.seconds.textContent = String(seconds).padStart(2, '0');

    if (seconds <= 9) {
      query.seconds.classList.add('last-secounds');
    } else {
      query.seconds.classList.remove('last-secounds');
    }
  }, 1000);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0].getTime();

    // Проверяем, не выбрана ли дата в прошлом
    if (selectedDate <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future!',
        position: 'topRight',
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        iconColor: '#fff',
        titleColor: '#fff',
        close: true,
        closeColor: '#fff',
      });
      query.btnStart.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    query.btnStart.disabled = false;
  },
};

flatpickr(query.text, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
