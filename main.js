const balance = document.getElementById('balance'),
      income = document.getElementById('income'),
      expense = document.getElementById('expense'),
      text = document.getElementById('text'),
      amount = document.getElementById('amount'),
      addBtn = document.getElementById('addBtn'),
      history = document.getElementById('history');

let totalBalance = 0,
    totalExpense = 0,
    totalIncome = 0,
    inputAmount = 0, 
    inputText = '',
    id = -1;


addBtn.addEventListener('click', addTransaction);
history.addEventListener('click', deleteHistory);
displayFromLS();


//ADD TRANSACTION
function addTransaction(e){
  e.preventDefault();
    // console.log(text.value);
    // console.log(amount.value);
    if(text.value==='' || amount.value==='' || amount.value==='0'){
      alert('Enter Values!!')
    }
    else{
      id++;
      inputText = text.value;
      inputAmount = +amount.value;
      calculateBalance(inputAmount);
      calculateIncomeExpense(inputAmount, false);
      createHistory(id, inputText, inputAmount);
      storeToLS(id, inputText, inputAmount);
      //CLEAR INPUT
      text.value='';
      amount.value='';
    }
}

//CALCULATE BALANCE
function calculateBalance(inputAmt){
  totalBalance += inputAmt;
  // console.log(totalBalance.toFixed(2));
  balance.innerHTML = `₹ ${totalBalance.toFixed(2)}`;
}

//CALCULATE INCOME AND EXPENSE
function calculateIncomeExpense(inputAmt , dlt){
  if(!dlt){
    if(inputAmt > 0){
      totalIncome += inputAmt;
      income.innerHTML = `₹ ${totalIncome.toFixed(2)}`;
    }
    else {
      totalExpense += inputAmt;
      expense.innerHTML = `₹ ${totalExpense.toFixed(2)}`;
    }
  }
  else{
    if(inputAmt > 0){
      totalIncome -= inputAmt;
      income.innerHTML = `₹ ${totalIncome.toFixed(2)}`;
    }
    else {
      totalExpense -= inputAmt;
      expense.innerHTML = `₹ ${totalExpense.toFixed(2)}`;
    }
  }
}

//CREATE HISTORY
function createHistory(id ,inputTxt, inputAmt){
  let ele = document.createElement('p');
  ele.className="income-source";
  ele.id = id;
  if(inputAmt>0) {
    ele.classList.add('profit');
    ele.innerHTML = `<span>${inputTxt}</span>
                     <span>+${inputAmt}</span>
                     <button class="delete">X</button>`;
  } 
  else {
    ele.classList.add('loss');
    ele.innerHTML = `<span>${inputTxt}</span>
                     <span>${inputAmt}</span>
                     <button class="delete">X</button>`;
  }
  
  history.appendChild(ele);
}

//DELETE HISTORY
function deleteHistory(e){
  if(e.target.classList.contains('delete')){
    e.target.parentElement.remove();
    const amt= e.target.previousElementSibling.textContent;
    calculateBalance(-parseInt(amt));
    calculateIncomeExpense(parseInt(amt), true);
    // console.log(e.target.parentElement.id);
    deleteFromLS(e.target.parentElement.id);
  }
}

//LOCALSTORAGE 
function storeToLS(id, inputTxt, inputAmt){
  let Transactions;

    if(localStorage.getItem('Transactions')===null){
      Transactions = [];
    }
    else{
      Transactions = JSON.parse(localStorage.getItem('Transactions'));
    }

    Transactions.push({'Id': id, 'Amt': inputAmt, 'Txt': inputTxt });

    localStorage.setItem('Transactions', JSON.stringify(Transactions));

}

//DISPLAY FROM LS
function displayFromLS(){
  let Transactions = JSON.parse(localStorage.getItem('Transactions'));

  if(Transactions!==null){
    Transactions.forEach(transaction => {
      calculateBalance(transaction.Amt);
      calculateIncomeExpense(transaction.Amt, false);
      createHistory(transaction.Id, transaction.Txt, transaction.Amt);
      id++;
  });
  }
}
function deleteFromLS(id){
  let Transactions = JSON.parse(localStorage.getItem('Transactions'));


  Transactions.forEach((transaction, index) => {
    // console.log(transaction.Id);
    if(transaction.Id==id){
      Transactions.splice(index, 1);
    }
  });

  localStorage.setItem('Transactions', JSON.stringify(Transactions));
}
