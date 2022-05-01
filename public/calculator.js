"use strict";
const billInput = document.querySelector('[data-bill-amount]');
const tipPercentageButtons = [...document.querySelectorAll('[data-tip-percentage]')];
const peopleInput = document.querySelector('[data-number-of-people]');
const customTipInput = document.querySelector('[data-custom]');
const tipAmountPerPerson = document.querySelector('[data-tip-amount-per-person]');
const totoalBillAmountAfterTipPerPerson = document.querySelector('[data-bill-after-tip-per-person]');
const calculatorResetButton = document.querySelector('[data-reset-calculator]');
const RegExPatterns = {
    bill: /^(?:0|[1-9][0-9]*)(?:\.[0-9]{1,2})?$/,
    split: /^[0-9]+$/,
    tip: /^(?:0|[1-9][0-9]*)(?:\.[0-9]{1,3})?$/
};
const initialBill = {
    amount: null,
    tip: null,
    splitCount: null
};
const finalBill = {
    amount: null,
    totalTip: null,
    totalTipPerPerson: null,
    totalAmountPerPerson: null
};
billInput.addEventListener('input', () => {
    initialBill.amount = RegExPatterns.bill.test(billInput.value) ? parseFloat(billInput.value) : null;
    calculateFinalBill();
});
peopleInput.addEventListener('input', () => {
    initialBill.splitCount = RegExPatterns.split.test(peopleInput.value) ? parseInt(peopleInput.value) : null;
    calculateFinalBill();
});
tipPercentageButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const tipButton = e.target;
        if (tipButton.hasAttribute('data-custom')) {
            initialBill.tip = null;
            return;
        }
        if (tipButton.classList.contains('selected')) {
            tipButton.classList.remove('selected');
            initialBill.tip = null;
            return;
        }
        tipPercentageButtons.forEach(item => item.classList.remove('selected'));
        tipButton.classList.add('selected');
        customTipInput.value = '';
        const tipAmount = parseFloat(tipButton.innerText.slice(0, -1)) / 100;
        initialBill.tip = tipAmount;
        calculateFinalBill();
    });
});
customTipInput.addEventListener('input', () => {
    if (initialBill.tip)
        initialBill.tip = null;
    initialBill.tip = RegExPatterns.tip.test(customTipInput.value) ? parseFloat(customTipInput.value) / 100 : null;
    calculateFinalBill();
});
customTipInput.addEventListener('focus', () => {
    tipPercentageButtons.forEach(item => item.classList.remove('selected'));
    customTipInput.classList.add('selected');
});
customTipInput.addEventListener('blur', () => {
    customTipInput.classList.remove('selected');
    if (initialBill.tip) {
        customTipInput.value = `${(initialBill.tip * 100).toFixed(2)}%`;
    }
    else {
        customTipInput.value = '';
    }
});
const calculateFinalBill = () => {
    const { amount, tip, splitCount } = initialBill;
    if (amount && tip && splitCount) {
        finalBill.amount = amount + (amount * tip);
        finalBill.totalTip = amount * tip;
        finalBill.totalAmountPerPerson = finalBill.amount / splitCount;
        finalBill.totalTipPerPerson = finalBill.totalTip / splitCount;
        displayFinalBillInfo();
    }
};
const displayFinalBillInfo = () => {
    const { amount, totalTip, totalAmountPerPerson, totalTipPerPerson } = finalBill;
    if (amount && totalTip && totalAmountPerPerson && totalTipPerPerson) {
        totoalBillAmountAfterTipPerPerson.innerText = totalAmountPerPerson.toFixed(2);
        tipAmountPerPerson.innerText = totalTipPerPerson.toFixed(2);
    }
};
const resetCalculator = () => {
    clearBills();
    clearFields();
    clearElements();
};
const clearBills = () => {
    Object.keys(initialBill).forEach(key => initialBill[key] = null);
    Object.keys(finalBill).forEach(key => finalBill[key] = null);
};
const clearFields = () => {
    peopleInput.value = '';
    billInput.value = '';
    customTipInput.value = '';
    tipPercentageButtons.forEach(button => button.classList.remove('selected'));
};
const clearElements = () => {
    totoalBillAmountAfterTipPerPerson.innerText = '';
    tipAmountPerPerson.innerText = '';
};
calculatorResetButton.addEventListener('click', resetCalculator);
