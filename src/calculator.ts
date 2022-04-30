const billInput = document.querySelector('[data-bill-amount]') as HTMLInputElement
const tipPercentageButtons = [...document.querySelectorAll('[data-tip-percentage]')]
const peopleInput = document.querySelector('[data-number-of-people]') as HTMLInputElement
const customTipInput = document.querySelector('[data-custom-tip-percentage]') as HTMLInputElement
const tipAmountPerPerson = document.querySelector('[data-tip-amount-per-person]') as HTMLElement
const totoalBillAmountAfterTipPerPerson = document.querySelector('[data-bill-after-tip-per-person]') as HTMLElement
const calculatorResetButton = document.querySelector('[data-reset-calculator]') as HTMLButtonElement

type TipCalculator = {
    [key: string]: null|number,
    billTotalAmountBeforeTip: null | number,
    numberOfPeople: null | number,
    tip: null | number,
    customTip: null | number,
    tipPerPerson: null | number,
    totalAmountPerPerson: null | number,
}

const billRegEx = /^(?:0|[1-9][0-9]*)(?:\.[0-9]{1,2})?$/
const numberRegEx = /^[0-9]+$/
const percentageRegEx = /^(?:0|[1-9][0-9]*)(?:\.[0-9]{1,3})?$/

const tipCalculator: TipCalculator = {
    billTotalAmountBeforeTip: null,
    numberOfPeople: null,
    tip: null,
    customTip: null,
    tipPerPerson: null,
    totalAmountPerPerson: null,
}



const getTip = (e: Event) => {
    e.preventDefault()
    const tipButton = e.target as HTMLButtonElement
    processSelection(tipButton)
    resetCustomTip()
    calculateTipAmountPerPerson()
    calculateEachPersonBill()
}
const processSelection = (tipButton: HTMLButtonElement) => {
    if (tipButton.classList.contains('selected')) {
        tipButton.classList.remove('selected')
        tipCalculator.tip = null
        return
    }
    tipPercentageButtons.forEach(button => button.classList.remove('selected'))
    tipButton.classList.add('selected')
    tipCalculator.tip = parseInt(tipButton.innerText) / 100
}
const resetCustomTip = () => {
    customTipInput.value = ''
}

tipPercentageButtons.forEach((button) => {
    button.addEventListener('click', getTip)
})

billInput.addEventListener('input', (e: Event) => {
    if (!isValidBillAmount(billInput.value)) return
    setBillTotalAmountBeforeTip(billInput.value)
    calculateTipAmountPerPerson()
    calculateEachPersonBill()
})
const isValidBillAmount = (amount: string) => {
    return billRegEx.test(amount) && parseFloat(amount) !== 0
}
const setBillTotalAmountBeforeTip = (amount: string) => {
    tipCalculator.billTotalAmountBeforeTip = parseFloat(amount)
}
peopleInput.addEventListener('input', () => {
    if (peopleInput.value === '' || parseInt(peopleInput.value) === 0) tipCalculator.numberOfPeople = null
    if (!isNumberOfPeopleValid(peopleInput.value)) return
    setNumberOfPeople(peopleInput.value)
    calculateTipAmountPerPerson()
    calculateEachPersonBill()
})
const isNumberOfPeopleValid = (value: string) => {
    return numberRegEx.test(value)
}
const setNumberOfPeople = (value: string) => {
    tipCalculator.numberOfPeople = parseInt(value)
}

calculatorResetButton.addEventListener('click', () => {
    resetCalculatedAmounts()
    clearInputFields()
    unselectTipPercentage()
    clearElements()
})
const resetCalculatedAmounts = () => {
    Object.keys(tipCalculator).forEach(key => tipCalculator[key] = null)
}
const clearInputFields = () => {
    billInput.value = ''
    peopleInput.value = ''
}
const unselectTipPercentage = () => {
    tipPercentageButtons.forEach(button => (button.classList.remove('selected')))
}
const clearElements = () => {
    totoalBillAmountAfterTipPerPerson.innerText = ''
    tipAmountPerPerson.innerText = ''
}

customTipInput.addEventListener('input', () => {
    if (!isUserEnteredTipValid()) return
    tipCalculator.customTip = parseFloat(customTipInput.value) / 100
})
const isUserEnteredTipValid = () => {
    return percentageRegEx.test(customTipInput.value)
}
customTipInput.addEventListener('focus', () => {
    customTipInput.classList.add('selected')
    tipPercentageButtons.forEach(button => button.classList.remove('selected'))
    if (customTipInput.value && tipCalculator.customTip) {
        customTipInput.value = `${tipCalculator.customTip * 100}`
        return
    }
    tipCalculator.customTip = null
})
customTipInput.addEventListener('blur', () => {
    customTipInput.classList.remove('selected')
    if (tipCalculator.customTip) {
        customTipInput.value = `${tipCalculator.customTip * 100}%`
    }
})

const calculateTipAmountPerPerson = () => {
    if (!areCalculationVariablesAvailable()) return
    tipCalculator.tipPerPerson = (tipCalculator.billTotalAmountBeforeTip! * tipCalculator.tip!) / tipCalculator.numberOfPeople!
    tipAmountPerPerson.innerText = tipCalculator.tipPerPerson.toFixed(2)
    
}
const calculateEachPersonBill = () => {
    if (!areCalculationVariablesAvailable()) return
    tipCalculator.tipPerPerson = (tipCalculator.billTotalAmountBeforeTip! * tipCalculator.tip!) / tipCalculator.numberOfPeople!
    tipCalculator.totalAmountPerPerson = (tipCalculator.billTotalAmountBeforeTip! / tipCalculator.numberOfPeople!) + tipCalculator.tipPerPerson
    totoalBillAmountAfterTipPerPerson.innerText = tipCalculator.totalAmountPerPerson.toFixed(2)
    
}
const areCalculationVariablesAvailable = () => {
    return tipCalculator.numberOfPeople && tipCalculator.billTotalAmountBeforeTip && tipCalculator.tip
}