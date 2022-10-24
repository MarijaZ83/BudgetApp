import { Expense } from "./expense.js";
import { expenseType } from "./expenseType.js";

const expenseColor = " #eb166b";
const incomeColor = " rgb(17, 142, 158)";

export class Budget {
  constructor(totalBudget) {
    this.totalBudget = totalBudget;
    this.expences = new Array();
    this.incomeArray = [];
    this.expensesArray = [];
    this.expenseElements = [];
    this.expenseSignAndValue;
  }

  render(parent) {
    const container = this.createNewElement("div", "budget__container", parent);

    const header = this.createNewElement("div", "budget__header", container);
    this.headerRender(header);

    const budgetForm = this.createNewElement("div", "budget__form", container);
    this.formRender(budgetForm);

    const table = this.createNewElement("div", "budget__table", container);
    this.incomeExpensesRender(table);
  }

  headerRender(header) {
    const backgroundDiv = this.createNewElement(
      "div",
      "header__background",
      header
    );
    backgroundDiv.style.backgroundImage = "url('images/calc.jpg')";
    const heading = this.createNewElement(
      "h2",
      "header__heading",
      backgroundDiv
    );
    var dateNow = new Date();
    var month = dateNow.getMonth();
    var year = dateNow.getFullYear();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    heading.textContent =
      "Available Budget in " + monthNames[month] + ` ${year}:`;
    const totalAmount = this.createNewElement(
      "div",
      "header__total_amount",
      backgroundDiv
    );
    const incomeDiv = this.createNewElement(
      "div",
      "header__incomeDiv",
      backgroundDiv
    );
    const headerIncomeText = this.createNewElement("p", "", incomeDiv);
    headerIncomeText.textContent = "INCOME";
    const headerIncomeSignValue = this.createNewElement(
      "div",
      "header__income_sign_value",
      incomeDiv
    );
    const headerIncomeSign = this.createNewElement(
      "p",
      "",
      headerIncomeSignValue
    );
    headerIncomeSign.textContent = "+";
    const headerIncomeValue = this.createNewElement(
      "p",
      "header__income_value",
      headerIncomeSignValue
    );
    const expensesDiv = this.createNewElement(
      "div",
      "header__expensesDIv",
      backgroundDiv
    );
    const headerExpensesText = this.createNewElement("p", "", expensesDiv);
    headerExpensesText.textContent = "EXPENSES";
    const headerExpenseSignValue = this.createNewElement(
      "div",
      "header__expense_sign_value",
      expensesDiv
    );
    const headerExpenseSign = this.createNewElement(
      "p",
      "",
      headerExpenseSignValue
    );
    headerExpenseSign.textContent = "-";
    const headerExpensesValue = this.createNewElement(
      "p",
      "header__expenses_value",
      headerExpenseSignValue
    );
    const totalExpensesPercentage = this.createNewElement(
      "p",
      "header__total_expenses_percentage",
      headerExpenseSignValue
    );
  }

  formRender(container) {
    const form = this.createNewElement("div", "form", container);
    const formElements = this.createNewElement("div", "form_elements", form);
    const select = this.createNewElement(
      "select",
      "form__select",
      formElements
    );
    const plus = this.createNewElement("option", "", select);
    plus.value = expenseType.Income;
    plus.defaultSelected = true;
    const p = document.createTextNode("+");
    plus.appendChild(p);
    const minus = this.createNewElement("option", "", select);
    minus.value = expenseType.Expense;
    const m = document.createTextNode("-");
    minus.appendChild(m);
    const inputFieldText = this.createNewElement(
      "input",
      "form__input_text",
      formElements
    );
    inputFieldText.placeholder = "Add description";
    const inputFieldValue = this.createNewElement(
      "input",
      "form__input_number",
      formElements
    );
    inputFieldValue.type = "number";
    inputFieldValue.min = "0.5";
    inputFieldValue.step = "0.5";
    inputFieldValue.placeholder = "Value";
    const submitBtn = this.createNewElement(
      "button",
      "form__submit",
      formElements
    );
    const checkSign = this.createNewElement(
      "i",
      "fa-solid fa-check",
      submitBtn
    );
    const formExtension = this.createNewElement("div", "form__alert", form);

    var sumExpenses = 0;
    var sumIncome = 0;

    submitBtn.onclick = () => {
      const selectedIndex = select.selectedIndex;
      const indexValue =
        select.getElementsByTagName("option")[selectedIndex].value;

      if (this.inputDescriptionRequirements(inputFieldText.value.length)) {
        const alertDescription = this.createNewElement(
          "li",
          "form__alert",
          formExtension
        );
        alertDescription.textContent = "Please enter some description";
        alertDescription.style.padding = "5px 0 0 0";
        form.style.height = "70px";
        return;
      }
      if (
        this.inputValueRequirements(
          inputFieldValue.value,
          inputFieldValue.value.length
        )
      ) {
        const alertValue = this.createNewElement(
          "li",
          "form__alert",
          formExtension
        );
        alertValue.textContent = "Please enter some value";
        alertValue.style.padding = "5px 0 0 0";
        form.style.height = "70px";
        return;
      }

      inputFieldValue.value = Number(inputFieldValue.value).toFixed(2);

      if (indexValue !== expenseType.Expense) {
        this.incomeCaseRender(inputFieldText.value, inputFieldValue.value);

        this.incomeArray.push(
          new Expense("+", inputFieldText.value, inputFieldValue.value)
        );
        sumIncome = this.incomeArray.reduce(
          (acc, incomeElement) => acc + Number(incomeElement.amount),
          0
        );
        document.querySelector(".header__income_value").textContent =
          Math.ceil(sumIncome).toFixed(2);
      } else {
        this.expensesCaseRender(inputFieldText.value, inputFieldValue.value);

        this.expensesArray.push(
          new Expense("-", inputFieldText.value, inputFieldValue.value)
        );
        sumExpenses = this.expensesArray.reduce(
          (acc, expenseElement) => acc + Number(expenseElement.amount),
          0
        );
        document.querySelector(".header__expenses_value").textContent =
          sumExpenses.toFixed(2);

        const inputValue = Number(inputFieldValue.value);
        this.calculateAndUpdatePercentage(inputValue, sumIncome);
      }

      this.updateExpenses(sumIncome);

      const totalAmountEver = (sumIncome - sumExpenses).toFixed(2);

      document.querySelector(".header__total_amount").textContent =
        totalAmountEver > 0 ? "+" + totalAmountEver : totalAmountEver;

      const totalExpensesPercentage = (sumExpenses / sumIncome) * 100;
      document.querySelector(".header__total_expenses_percentage").textContent =
        parseInt(Math.ceil(totalExpensesPercentage)) + "%";

      inputFieldText.value = "";
      inputFieldText.focus();
      inputFieldValue.value = "";
      inputFieldValue.focus();
    };

    select.onchange = () => {
      const selectedIndex = select.selectedIndex;
      const optionsFromSelector = Object.values(expenseType);
      const selectedOption = optionsFromSelector[selectedIndex];

      submitBtn.style.backgroundColor =
        selectedOption === expenseType.Expense ? expenseColor : incomeColor;
    };
  }

  inputDescriptionRequirements(descriptionLength) {
    return descriptionLength < 1 || descriptionLength > 50;
  }

  inputValueRequirements(valueNumber) {
    return valueNumber.length < 1 || Number(valueNumber) === 0;
  }

  updateExpenses(sumIncome) {
    for (let i = 0; i < this.expenseElements.length; i++) {
      const value = Number(
        this.expenseElements[i].querySelector(".table__value_expenses_table")
          .textContent
      );
      const updatedPercentage = (value / sumIncome) * 100;
      this.expenseElements[i].querySelector(
        ".table__expenses_percentage"
      ).textContent = parseInt(Math.ceil(updatedPercentage)) + "%";
    }
  }

  calculateAndUpdatePercentage(inputValue, sumIncome) {
    const expensesPercentageValue = (inputValue / sumIncome) * 100;
    this.expenseSignAndValue.querySelector(
      ".table__expenses_percentage"
    ).textContent = expensesPercentageValue + "%";
  }

  incomeExpensesRender(table) {
    const incomeUl = this.createNewElement("ul", "table__income_ul", table);
    const income = this.createNewElement(
      "li",
      "table__income_heading",
      incomeUl
    );
    income.textContent = "INCOME";

    const expensesUl = this.createNewElement("ul", "table__expenses_ul", table);
    const expenses = this.createNewElement(
      "li",
      "table__expenses_heading",
      expensesUl
    );
    expenses.id = "red";
    expenses.textContent = "EXPENSES";
  }

  incomeCaseRender(description, value) {
    const newIncomeUl = document.querySelector(".table__income_ul");
    const newIncomeLine = this.createNewElement(
      "li",
      "table__new_line",
      newIncomeUl
    );

    const incomeDescription = this.createNewElement(
      "div",
      "table__income_description",
      newIncomeLine
    );
    incomeDescription.innerText = description;

    const incomeSignAndValue = this.createNewElement(
      "div",
      "table__income_sign_value",
      newIncomeLine
    );
    const signInIncomeTable = this.createNewElement(
      "p",
      "",
      incomeSignAndValue
    );
    signInIncomeTable.textContent = "+";
    const valueIncomeTable = this.createNewElement(
      "p",
      "table__value_income_table",
      incomeSignAndValue
    );
    valueIncomeTable.innerText = value;
  }

  expensesCaseRender(description, value) {
    const newExpensesUl = document.querySelector(".table__expenses_ul");
    const newExpenseLine = this.createNewElement(
      "li",
      "table__new_line",
      newExpensesUl
    );

    this.expenseElements.push(newExpenseLine);

    const expenseDescription = this.createNewElement(
      "div",
      "table__expense_description",
      newExpenseLine
    );
    expenseDescription.innerText = description;
    this.expenseSignAndValue = this.createNewElement(
      "div",
      "table__expense_sign_value",
      newExpenseLine
    );
    this.expenseSignAndValue.id = "red";
    const signInExpensesTable = this.createNewElement(
      "p",
      "",
      this.expenseSignAndValue
    );
    signInExpensesTable.textContent = "-";
    var valueExpensesTable = this.createNewElement(
      "p",
      "table__value_expenses_table",
      this.expenseSignAndValue
    );
    valueExpensesTable.innerText = value;
    const expensesPercentage = this.createNewElement(
      "p",
      "table__expenses_percentage",
      this.expenseSignAndValue
    );
  }

  createNewElement(tagName, className, parentElement) {
    const newElement = document.createElement(tagName);
    newElement.className = className;
    parentElement.appendChild(newElement);
    return newElement;
  }
}
