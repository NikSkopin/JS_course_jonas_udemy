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

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    inputBtn: ".add__btn"
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: document.querySelector(domStrings.inputValue).value
      };
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
  };

  const ctrlAddItem = () => {
    // get the field input data
    const input = uiCtrl.getInput();

    // add the item to the budget controller
    const newItem = budgetCtrl.addItem(
      input.type,
      input.description,
      input.value
    );

    // add the item to the ui
    // calc the budget
    // display the budget
  };

  return {
    init: () => {
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
