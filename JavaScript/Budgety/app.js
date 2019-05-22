//3 Modules: UI Module, Data Module, Controller Module
//UI Module: Get input values, Add the new item to the UI, Update UI
//Data Module: Add the new item to structure, Calculate budget
//Controller Module: Add event handler.

/*eslint-env browser*/

var budgetController = (function () {
    var Expense = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
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
        addItem: function (type, des, val) {
            var newItem, ID;
            ID = data.allItems[type].length !== 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;
            newItem = type === 'exp' ? new Expense(ID, des, val) : new Income(ID, des, val);
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function (type, id) {
            var index;
            index = data.allItems[type].map(function (current) {
                return current.id
            }).indexOf(id);
            //index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                perc: data.percentage
            };
        },
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            data.percentage = data.totals.inc > 0 ? Math.round((data.totals.exp / data.totals.inc) * 100) : -1;
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            })
        },
        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });
            return allPercentages;

        }
    };
})();


var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }
    var formatNumber = function (num, type) {
        /*
                    var numSplit,int,dec;
                    num = Math.abs(num);
                    num = num.toFixed(2);
                    numSplit = num.split('.');
                    
                    int = numSplit[0];
                    
                    if(int.length > 3) {
                        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3,int.length);
                    }
                    dec = numSplit[1];
                    var numSplit,int,dec;
                    num = Math.abs(num);
                    num = num.toFixed(2);
                    numSplit = num.split('.');
                    
                    int = numSplit[0];
                    
                    if(int.length > 3) {
                        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3,int.length);
                    }
                    dec = numSplit[1];
        */
        return type === 'exp' ? '- ' + num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) :
            '+ ' + num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
    };
    var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            }
    //Ask what do we need to update a certain UI element.
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                desc: document.querySelector(DOMstrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListITem: function (obj, type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace('%id%', obj.id).replace('%desc%', obj.desc).replace('%value%', formatNumber(obj.value));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function () {
            var fieldsList = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);
            fieldsList.forEach(function (current) {
                current.value = "";
            });
            fieldsList[0].focus();
        },
        displayBudget: function (obj) {
            var type = obj.budget > 0 ? 'inc' : 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.perc > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.perc + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },
        displayMonth: function () {
            var now, year, month;
            now = new Date();
            const months = now.toLocaleString('en-us', { month: 'long' });
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months + ' ' + year;

        },
        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ', ' + 
                DOMstrings.inputDesc + ', ' + 
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            })
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    var input, newItem;

    var updateBudget = function () {
        var budget;
        budgetCtrl.calculateBudget();
        budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        var percentages;
        budgetCtrl.calculatePercentages();
        percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        input = UICtrl.getInput();
        if (input.desc !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
            UICtrl.addListITem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (e) {
        var itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };

    var setEvents = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        //"which" for older browsers.
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    return {
        init: function () {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                perc: 0
            });
            setEvents();
        }
    };

})(budgetController, UIController);

controller.init();
