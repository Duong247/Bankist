'use strict';


alert("USER: JS, PIN: 1111 ")

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

/////////////////////////////////////////////////

//for each
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


 
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// map

const eurToUsd = 1.1;
const movementsUSD =  movements.map(function(mov){
  return mov*eurToUsd;
})


// console.log(movements);
// console.log(movementsUSD);

const user = 'Steven Thomas Williams';

const createUsernames=function (accs){
  accs.forEach(function(acc){
    acc.userName = acc.owner
                      .toLowerCase()
                      .split(' ')
                      .map(name=>name[0])
                      .join('');
  });
}


createUsernames(accounts);
// console.log(account2)
// filter
const withdrawal = movements.filter(mov=> mov<0)


// calcPrintBalance(account1.movements)

const max = movements.reduce((acc,mov)=>{
  if (acc>mov){
    return acc
  }else{
    return mov
  }
},movements[0]);



//Bankist APP

function displayMoverment(movements,stored = false){
  containerMovements.innerHTML='';

  const movs= sorted ? currentAccount.movements.slice().sort((a,b)=> a-b): movements; 
  movs.forEach(function(mov,i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date"> 3 Days ago</div>
      <div class="movements__value">${mov} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin',html);
  });
}

// displayMoverment(account1.movements)


const calcDisplayBalance = function(acc){
  const balance = acc.movements.reduce((acc,mov)=> acc+mov,0);
  acc.balance = balance;
  labelBalance.textContent= `${acc.balance} EUR`;
  console.log(labelBalance.textContent)
}


const calcDisplaySumanary = function(acc){
  const incomes = acc.movements.filter(mov=> mov > 0)
                                  // .map(mov=> mov*eurToUsd)
                                  .reduce((mov,cur)=> mov + cur ,0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements.filter(mov=>mov <0).reduce((mov,cur)=> mov+cur);
  labelSumOut.textContent = `${out*-1} €`;

  const interest= acc.movements.filter(mov=> mov>0)
                           .map(deposite => (deposite*acc.interestRate)/100)
                           .filter((int)=>{
                              return int>=1;
                           })
                           .reduce((acc,int)=>acc+int,0);
  labelSumInterest.textContent = `${interest} €`;
}
// calcDisplaySumanary(account1);

function UpdateUI(acc){
// Display moverment
    displayMoverment(acc.movements,sorted);
    // Display balance
    calcDisplayBalance(acc);
    // Display summary
    calcDisplaySumanary(acc)
}


// Event handle
let currentAccount;
let timer
let startMinutes;
let time;

btnLogin.addEventListener('click',function(event){
  event.preventDefault();

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value );

  if (currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    UpdateUI(currentAccount)
  }else{
    alert('wrong user name or password')
  }
  clearInterval(timer);
  startMinutes = 5;
  time = startMinutes*60;
  timer=setInterval(timerCountdown,1000)
})

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  console.log(receiverAcc);
  inputTransferAmount.value = inputTransferTo.value= '';
  if(receiverAcc){
    if(amount > 0 && currentAccount.balance >= amount && receiverAcc?.userName !== currentAccount.userName){
      console.log('oke');
    }else{
      console.log('not ok');
    }
  }
  // transfer
  receiverAcc.movements.push(+amount);
  currentAccount.movements.push(-amount);

  UpdateUI(currentAccount);

})


// close account

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc=> acc.userName === currentAccount.userName);
    console.log(index);
    accounts.splice(index,1);
    // hide UI
    containerApp.style.opacity = 0;
    inputClosePin.textContent = inputCloseUsername.textContent = '';
  }

})

// Request Loan

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value)

  if(amount >0 && currentAccount.movements.some(mov => mov >= amount*0.1)){
    currentAccount.movements.push(amount);
    UpdateUI(currentAccount);
  }

  inputLoanAmount.value = '';
})

// Ascending
// movements.sort((a,b)=> {
//   if(a > b) return 1;
//   if(a < b) return -1;
// })
movements.sort((a,b)=> a-b)
// Desending
movements.sort((a,b)=> b-a)
console.log(movements)

let sorted = false;

btnSort.addEventListener('click',function(e){
  e.preventDefault();

  sorted = !sorted;
  displayMoverment(currentAccount.movements,sorted);
  console.log(sorted);
});


const y = Array.from({length:7},()=> 1);
console.log(y);
const z = Array.from({length: 7 },(_,i)=> i+1);
console.log(z)

const randomEroll = Array.from({length:100},()=>Math.round(Math.random()*5+1 ) )
console.log(randomEroll);

labelBalance.addEventListener('click',function(){
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUI.map(el => el.textContent.replace('€','')));
});



function timerCountdown(){
  let minutes = Math.floor(time /60) 
  let second = time %60;
  second = second <10? `0${second}`: second;
  labelTimer.innerHTML = `${minutes}:${second}`;
  // console.log(`${minutes}:${second}`);
  time--;

  if (time == 0){
    clearInterval(timer);
    containerApp.style.opacity = 0;
  }
}
