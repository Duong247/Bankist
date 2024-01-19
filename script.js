'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// alert("USER: JS, PIN: 1111 ")

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
/////////////////////////////////////////////////

/////////////////////////////////////////////////


// let arr= ['a','b','c','d','e']


//splice
// console.log(arr.splice(-1));
// console.log(arr)

//for each
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


 
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// currencies.forEach(function(value,key,map){
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD','GBP','USD','EUR','EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function(value,key,map){
//   console.log(`${key}: ${value}`);
// });


// map

const eurToUsd = 1.1;
const movementsUSD =  movements.map(function(mov){
  return mov*eurToUsd;
})


// console.log(movements);
// console.log(movementsUSD);
//Computing userName

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

// console.log(withdrawal)

//reduce

// const balance = movements.reduce(function(acc, cur, i, arr){
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc+ cur
// },0);

// console.log(balance)

// const calcPrintBalance = function(movements){
//   const balance = movements.reduce((acc,mov)=> acc+mov,0);
//   labelBalance.textContent=`${balance} EUR`;
// }

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

// const sta


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


// ===============practice==================

// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

// Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

// 1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
// 4. Run the function for both test datasets

// HINT: Use tools from all lectures in this section so far 😉

// TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// chalenge #1
const JuliaData=[3, 5, 2, 12, 7];
const KateData = [4, 1, 15, 8, 3]
function checkDogs(dogsJulia,dogsKate){  
  const dogsJuliaCorected = dogsJulia.slice();
  dogsJuliaCorected.splice(0,1);
  dogsJuliaCorected.splice(-2);

  const dogs = dogsJuliaCorected.concat(dogsKate);
  console.log(dogs)
  
  dogs.forEach(function(dog,i){
    if (dog>=3 ){
      console.log(`Dog number ${i+1} is an adult, and is ${dog} years old`)
    }else{
      console.log(`Dog number ${i+1} is still a puppy 🐶`)
    }
  })

}

// checkDogs(JuliaData,KateData);


for(const [i,moverment] of movements.entries()){

}

// movements.forEach(function(moverment,index,array){
//   console.log(index+1)
// })

// array.forEach(element => {
// });
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// function calcAverageHumanAge(ages){
//   const humanAges = ages.map(function(age){
//     if (age <=2){
//       return 2*age
//     }else{
//       return 16+ age*4
//     }
//   })

//   console.log(humanAges);
//   const humanAgeAdult=humanAges.filter(humanAge=> humanAge >= 18);
//   console.log(humanAgeAdult);

//   const average = humanAgeAdult.reduce((age,cur)=> age + cur,0) / humanAgeAdult.length;
//   return average;
// }

const dogAge=[5, 2, 4, 1, 15, 8, 3];
// console.log(calcAverageHumanAge(dogAge));

/* coding chalenge #3
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

function calcAverageHumanAge(ages){
  const humanAges = ages.map(function(age){
    if (age <=2){
      return 2*age
    }else{
      return 16+ age*4
    }
  })

  // console.log(humanAges);
  const humanAgeAdult=humanAges.filter(humanAge=> humanAge >= 18);
  // console.log(humanAgeAdult);

  const average = humanAgeAdult.reduce((age,cur)=> age + cur,0) / humanAgeAdult.length;
  return average;
}

// function calcAverageHumanAge = age =>
//   age.map(age =>(map <= 2 ? 2*age :16+age*4))
//      .filter(age => age>18)
//     .reduce((age,cur,i,arr)=> age+cur / arr.length ,0) 

