//Budget controller
const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function(type) {
    let sum = 0;

    data.allItems[type].forEach(cur => (sum += cur.value));
    data.totals[type] = sum;
  };

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: (type, des, val) => {
      let newItem, id;
      //create new ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else id = 0;

      //create new item
      if (type === "exp") {
        newItem = new Expense(id, des, val);
      } else if (type === "inc") {
        newItem = new Income(id, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: (type, id) => {
      let ids = data.allItems[type].map(current => current.id);
      const index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: () => {
      // calculate total inc and exp
      calculateTotal("exp");
      calculateTotal("inc");

      // calculate the budget
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the % of the income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: () => {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: () => {
      console.log(data);
    }
  };
})();

//User interface controller
const uiController = (function() {
  const domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetValue: ".budget__value",
    budgetInc: ".budget__income--value",
    budgetExp: ".budget__expenses--value",
    budgetPercentage: ".budget__expenses--percentage",
    container: ".container"
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value)
      };
    },
    addListItem: (obj, type) => {
      let html = "";
      let element = "";
      if (type === "inc") {
        element = domStrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-${
          obj.id
        }"><div class="item__description">${
          obj.description
        }</div><div class="right clearfix"><div class="item__value">${
          obj.value
        }</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === "exp") {
        element = domStrings.expenseContainer;

        html = `<div class="item clearfix" id="exp-${
          obj.id
        }"><div class="item__description">${
          obj.description
        }</div><div class="right clearfix"><div class="item__value">${
          obj.value
        }</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      document.querySelector(element).insertAdjacentHTML("beforeend", html);
    },

    deleteListItem: selectorID => {
      const element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    clearFields: () => {
      const fields = document.querySelectorAll(
        domStrings.inputDescription + ", " + domStrings.inputValue
      );

      fields.forEach(field => (field.value = ""));
      fields[0].focus();
    },
    showBudget: budget => {
      document.querySelector(domStrings.budgetValue).innerHTML = budget.budget;
      document.querySelector(domStrings.budgetInc).innerHTML = `+ ${
        budget.totalIncome
      }`;
      document.querySelector(domStrings.budgetExp).innerHTML = `- ${
        budget.totalExp
      }`;
      if (budget.percentage > 0) {
        document.querySelector(domStrings.budgetPercentage).innerHTML = `${
          budget.percentage
        }%`;
      } else
        document.querySelector(domStrings.budgetPercentage).innerHTML = "---";
    },

    getDomStrings: () => domStrings
  };
})();

//Global APP controller
const controller = (function(budgetCtrl, uiCtrl) {
  const setupEventListeners = () => {
    const DOM = uiCtrl.getDomStrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  const updateBudget = () => {
    // calc the budget
    budgetCtrl.calculateBudget();

    // return the budget
    const budget = budgetCtrl.getBudget();

    // display the budget
    uiCtrl.showBudget(budget);
  };

  const ctrlAddItem = () => {
    // get the field input data
    const input = uiCtrl.getInput();

    if (!isNaN(input.value) && input.value > 0 && input.description !== "") {
      // add the item to the budget controller
      const newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );

      // add the item to the ui
      uiCtrl.addListItem(newItem, input.type);

      // clear the input fields
      uiCtrl.clearFields();

      // calculate and update the budget
      updateBudget();
    }
  };

  const ctrlDeleteItem = e => {
    const itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      const type = itemID.split("-")[0];
      const ID = +itemID.split("-")[1];
      budgetCtrl.deleteItem(type, ID);
      uiCtrl.deleteListItem(itemID);
      updateBudget();
    }
  };

  return {
    init: () => {
      uiCtrl.showBudget({
        budget: 0,
        totalIncome: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
