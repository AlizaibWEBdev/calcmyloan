document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loan-form');
    const amountInput = document.getElementById('amount');
    const interestInput = document.getElementById('interest');
    const termInput = document.getElementById('term');
    const typeSelect = document.getElementById('type');
    const scheduleTable = document.getElementById('schedule').getElementsByTagName('tbody')[0];
    const loanGraphCanvas = document.getElementById('loan-graph');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseFloat(amountInput.value);
        const annualInterestRate = parseFloat(interestInput.value) / 100;
        const termInYears = parseInt(termInput.value);
        const loanType = typeSelect.value;
        
        const totalPayments = termInYears * 12;
        let monthlyPayment;
        const monthlyInterestRate = annualInterestRate / 12;
        
        if (loanType === 'fixed') {
            monthlyPayment = (amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
        } else {
            // Simple approximation for adjustable rate
            monthlyPayment = (amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
        }
        
        let balance = amount;
        scheduleTable.innerHTML = '';
        
        for (let i = 1; i <= totalPayments; i++) {
            const interestPayment = balance * monthlyInterestRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            
            const row = scheduleTable.insertRow();
            row.insertCell(0).textContent = i;
            row.insertCell(1).textContent = monthlyPayment.toFixed(2);
            row.insertCell(2).textContent = principalPayment.toFixed(2);
            row.insertCell(3).textContent = interestPayment.toFixed(2);
            row.insertCell(4).textContent = balance.toFixed(2);
        }
        
        renderGraph(amount, annualInterestRate, termInYears);
    });

    function renderGraph(amount, annualInterestRate, termInYears) {
        const ctx = loanGraphCanvas.getContext('2d');
        const totalPayments = termInYears * 12;
        const monthlyInterestRate = annualInterestRate / 12;
        const data = [];
        let balance = amount;
        
        for (let i = 1; i <= totalPayments; i++) {
            const interestPayment = balance * monthlyInterestRate;
            const principalPayment = (amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments)) - interestPayment;
            balance -= principalPayment;
            data.push({
                x: i,
                y: balance.toFixed(2)
            });
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Loan Balance Over Time',
                    data: data,
                    borderColor: '#007bff',
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Payment Number'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Remaining Balance'
                        }
                    }
                }
            }
        });
    }

  

    document.getElementById('print-schedule').addEventListener('click', function() {
        window.print();
    });
});
