'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data;
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-04-26T17:01:17.194Z',
    '2022-04-27T23:36:17.929Z',
    '2022-04-29T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Waleeyah Olalekan',
  movements: [20, -455.23, -306.5, 2500, -642.21, -133.9, 79.97, 1600],
  interestRate: 1.2, // %
  pin: 2000,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'NGN',
  locale: navigator.language, // de-DE
};

const account4 = {
  owner: 'Rashidat Adekunle',
  movements: [20, -455.23, -36.5, 2500, -642.21, -133.9, 79.97, 160],
  interestRate: 1.2, // %
  pin: 1234,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'NGN',
  locale: navigator.language, // de-DE
};
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// ---------------------------------
const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(date, new Date());
  // console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  if (daysPassed > 7) {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = `${date.getFullYear()}`.padStart(2, 0);

    // return `${day}/ ${month}/ ${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formattedNum = (acc, num) => {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency', // also unit / percentage
    currency: acc.currency,
  }).format(num);
};
// -----------------------------------------------------------
const startLogOutTimer = () => {
  let time = 120;
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    // console.log(min);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = '';
    // console.log(min, sec);
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    time--;
    return (labelTimer.textContent = `${min}:${sec}`);
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// --------------------------------------------
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((value, index) => {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    // ----
    const date = new Date(acc.movementsDates[index]);
    const displayDate = formatMovementDate(date, acc.locale);
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedNum(acc, value)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// ---------------------------------------------------------------
const createDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = formattedNum(acc, acc.balance);
};

// ---------------------------------------------------------------

const createDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedNum(acc, incomes);

  const expenditures = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = formattedNum(acc, expenditures);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => (acc += int), 0);
  labelSumInterest.textContent = formattedNum(acc, interest);
};

// ----------------------------------------------
const createUsername = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(letter => letter[0])
      .join('');
  });
};

createUsername(accounts);
// -----------------------------------------------------
const updateUI = function (acc) {
  createDisplayBalance(acc);

  createDisplaySummary(acc);

  displayMovements(acc);
};

// ---EVENT HANDLER----

// implementing the login
let currentAccount, timer;

// // FAKE LOGIN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // display welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //-------------IMPLEMENTING TIMER----------
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // display UI
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);

    // display date

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = `${now.getFullYear()}`.padStart(2, 0);
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const mins = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${mins}`;

    // Int'l API
    const now = new Date();
    // const locale = navigator.language; // for getting the time and date format from browser
    // You can get the different language from (iso language code: www.lingoes.net)
    const locale = currentAccount.locale;
    const options = {
      minute: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );
  }
});

// -----IMPLEMENTING TRANSFER -----------
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAccount &&
    receiverAccount.username !== currentAccount.username
  ) {
    // sorting the balance
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Adding Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // UPDATE UI
    updateUI(currentAccount);

    // RESETTING TIMER
    clearInterval(timer);
    timer = startLogOutTimer();

    // clearing input
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});

// --------REQUESTING FOR A LOAN------------
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    setTimeout(() => {
      // Add loan
      currentAccount.movements.push(amount);

      // Adding Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset Timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);

    // Clearing Input
    inputLoanAmount.value = '';
  }
});

// -----SORTING THE MOVEMENTS-------
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// ------CLOSING THE ACCOUNT---------
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // remove UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;

    // delete current account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
  }

  // clearing input
  inputTransferAmount.value = inputTransferTo.value = '';
});

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Simple array methods(you can always check MDN documentation or this video)

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // slice
// console.log(arr.slice(2));
// console.log(arr.slice(2, -1));
// console.log(arr.slice(-1));

// // splice (it affects the original array)
// console.log(arr.splice(2, 2));
// console.log(arr);

// // reverse (it affects the original array)
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // concat
// console.log(arr.concat(arr2));
// console.log([...arr, ...arr2]);

// // join
// console.log(arr.concat(arr2).join('-'));
// console.log(arr.concat(arr2).join(' '));

// ------looping over arrays with FOR EACH LOOP---------

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// movements.forEach(function (mov, i) {
//   if (mov > 0) {
//     console.log(`Transaction ${i + 1}: You deposited $${mov}`);
//   } else {
//     console.log(`Transaction ${i + 1}: You withdrew $${Math.abs(mov)}`);
//   }
// });

// ------LOOPING OVER SETS AND MAPS USING FOR EACH LOOP----------

// ---MAP--
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach((value, key) => {
//   console.log(`${key}: ${value}`);
// });

// // --SET---
// const currenciesNew = new Set(['USD', 'EUR', 'USD', 'GBP', 'GBP']);

// console.log(currenciesNew);
// currenciesNew.forEach(value => {
//   console.log(`${value}: ${value}`);
// });

// -----USING THE MAP ARRAY METHOD---------

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// const movementsUsd = movements.map(mov => mov * eurToUsd);
// console.log(movements);
// console.log(movementsUsd);

// const movementsNew = [];
// for (const mov of movements) {
//   movementsNew.push(mov * eurToUsd);
// }

// console.log(movementsNew);

// ---------------------------------------------------

// const movementDescription = movements.map(
//   (mov, i) =>
//     `Transaction ${i + 1}: You ${
//       mov > 0 ? `deposited` : `withdrew`
//     } $${Math.abs(mov)}`
// );

// console.log(movementDescription);

// -----------THE FILTER ARRAY METHOD--------------
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// ---------THE REDUCE ARRAY METHOD---------------
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce((acc, curr, i, arr) => acc + curr, 0);
// console.log(balance);

// ------USING REDUCE METHOD TO CALCULATE THE MAXIMUM ELEMENT OF AN ARRAY
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else return mov;
// });
// console.log(max);

// ----------USING THE FIND ARRAY METHOD(IT ONLY RETURNS THE FIRST VALUE THAT SATISFIES THE CONDITON)----------------------------

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// EX 2
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(accounts);
// console.log(account);
// ----------USING FOR OF LOOP--------
// let accountFor;
// for (const acc of accounts) {
//   accountFor = acc.owner === 'Jessica Davis' ? acc : '';
//   console.log(accountFor);
// }
// // console.log(accounts);

// -----THE SOME ARRAY METHOD-------------
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

//---------The every array method----------
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const allDeposits = movements.every(mov => mov > 0);
// console.log(allDeposits);

// // Ex 2
// const deposit = mov => mov > 0;
// console.log(account4.movements.every(deposit));

// // ------The flat array method-------------
// const arr = [1, [2, 3], 4, [5, 6, 7]];
// console.log(arr.flat());
// // -----for more than one level nested array; you specify the level
// const arrDeep = [1, [2, 3], 4, [5, [6, 7], 8]];
// console.log(arrDeep.flat(2));

// // Ex 2
// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance);

// // ------The flatMap array method(it only goes one level deep)-------
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance2);

// ------sorting array----------

// //------- for strings
// const randomNames = ['yinka', 'nimot', 'alhasur', 'ibraheem', 'ameer'];
// console.log(randomNames.sort());

// // -------for numbers
// const randomNum = [1, 6, 3, -9, 3, -1, 2, 12, 6, -3, 6, 10, 20, 15];

// //----- ascending order
// // console.log(
// //   randomNum.sort((a, b) => {
// //     if (a > b) {
// //       return 1;
// //     }
// //     if (a < b) {
// //       return -1;
// //     }
// //   })
// // );
// // ------OR------
// console.log(randomNum.sort((a, b) => a - b));

// // ------descending order
// // console.log(
// //   randomNum.sort((a, b) => {
// //     if (a > b) {
// //       return -1;
// //     }
// //     if (a < b) {
// //       return 1;
// //     }
// //   })
// // );
// // ------OR---------
// console.log(randomNum.sort((a, b) => b - a));

// -----PROGRAMMATICALLY CREATING AN ARRAY--------

// // Empty array + fill
// const x = new Array(7);
// x.fill(1, 2, 6); // the first arg is the content,the second is the starting index and the third is the finishing index
// console.log(x);

// // Array.from

// console.log(Array.from({ length: 7 }, () => 1));

// const y = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(y);

// // Ex 2 (100 random dice roll)
// const z = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 6) + 1);
// console.log(z);

// // ------another example-----
// labelBalance.addEventListener('click', function () {
//   const movementUI = Number(
//     Array.from(document.querySelectorAll('.movements__value'), el =>
//       el.textContent.replace('₤', '')
//     )
//   );
//   console.log(movementUI);
// });

// SECTION 12

// 1

// This ection is about how numbers behave in javascript e.g
// 0.1 + 0.2 === 0.3 gives false because javascript works in binary and the result of the addition is decimal that's why.

// 2. Other ways of converting strings to number

// a. using "+"
// console.log(+'23');

// // b. Parsing
// console.log(Number.parseInt('60px', 10)); // Provided that the string starts with a number, it converts it to number and remove the non-numerical part

// console.log(Number.parseFloat('2.5rem')); //for decimals (use mostly when working with css values)

// // To check if value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));

// // To check if value is an integer
// console.log(Number.isInteger(20));
// console.log(Number.isInteger('20'));
// console.log(Number.isInteger(20.5));

// // To check if value is not a number
// console.log(Number.isNaN(20));

// ------MATH AND ROUNDING--------
// console.log(Math.PI);
// console.log(Math.trunc(50.7));
// console.log(Math.floor(50.7)); // diff btwn .trunc and .floor is when used on negative value

// console.log(Math.ceil(50.7));
// console.log(Math.round(50.5));

// console.log((50.3945866).toFixed(3)); // roundind up to a specified  decimal number

// // find max and min
// console.log(Math.max(2, 6, 2, 9, 5, 3, 19));
// console.log(Math.min(2, 6, 2, 9, 5, 3, 19));

// const randomInt = function (min, max) {
//   console.log(Math.trunc(Math.random() * (max - min) + min + 1));
// };
// randomInt(10, 60);

// ---------REMAINDER OPERATOR--------------
// console.log(5 % 3);

// Ex 2(when you need to do something every nth time)
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'red';
//     }
//   });
// });

// ------BigInt--------
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 - 1);
// console.log(84737487474847478474824862484624n);
// console.log(BigInt(676637373737337));

// ---------DATES-------------
// console.log(new Date());
// console.log(new Date(2020, 11, 9, 13, 45));
// console.log(new Date('Aug 10, 2022'));

// const future = new Date(2022, 4, 29);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getDate());
// console.log(future.getHours());
// console.log(future.getMinutes());
// future.setFullYear(2022);
// console.log(`The future is ${future.toISOString()}`);

// console.log(new Date(0));
// console.log(Date.now());
// console.log(new Date(1651012257122));

// console.log(+future);
// console.log(+new Date());
// console.log(
//   Math.round((new Date(2022, 4, 30) - future) / (1000 * 60 * 60 * 24))
// );

//--------TIMERS-------
// 1.setTimeout
// const items = ['pen', 'pencil', 'biro'];
// const itemTimer = setTimeout(
//   (item1, item2, item3) =>
//     console.log(`Appeared after some secs with ${item1} ,${item2}and ${item3}`),
//   2000,
//   ...items
// );
// if (items.includes('pen')) clearTimeout(itemTimer);

// 2.setInterval

// console.log(formatNow);
// setInterval(() => {
//   const now = new Date();
//   const formatNow = new Intl.DateTimeFormat(navigator.language, {
//     second: 'numeric',
//     minute: 'numeric',
//     hour: 'numeric',
//     day: 'numeric',
//     month: 'numeric',
//     year: 'numeric',
//   }).format(now);
//   console.log(formatNow);
// }, 1000);
