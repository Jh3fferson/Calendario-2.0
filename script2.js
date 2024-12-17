const corpo = document.getElementById('corpo');
let Sala1, Sala2, Sala3, Sala4, Sala5;
const salas = [[[], [], [], [], []], [[], [], [], [], []], [[], [], [], [], []], [[], [], [], [], []], [[], [], [], [], []]];
const state = {};

const curso1 = localStorage.getItem("NomeDoCurso");
const sala1 = localStorage.getItem("NomeDaSala");
const hora1 = localStorage.getItem("HORARIO");

const info1 = localStorage.getItem("item1");
const ano1 = parseInt(localStorage.getItem("ano"));
const mes1 = parseInt(localStorage.getItem("mes")) - 1;

let salaN = parseInt(sala1), cursoN = parseInt(curso1), cor, dia;

document.addEventListener("DOMContentLoaded", () => {
    generateTableForMonth(mes1, ano1);
});

function getNumberOfDays(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function generateTableForMonth(month, year) {
    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const daysInMonth = getNumberOfDays(year, month);
    const table = document.getElementById("mes");
    table.innerHTML = "";

    const headerRow = document.createElement("tr");
    diasSemana.forEach(dia => {
        const th = document.createElement("th");
        th.innerHTML = `<button class="dias">${dia}</button>`;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInPreviousMonth = getNumberOfDays(year, month - 1);

    let row = document.createElement("tr");

    for (let i = firstDay - 1; i >= 0; i--) {
        const td = document.createElement("td");
        td.innerHTML = `<button class="diasM">${daysInPreviousMonth - i}</button>`;
        row.appendChild(td);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const td = document.createElement("td");
        const key = `${i}/${month + 1}/${year}`;
        const color = state[key] ? state[key][salaN] || "black" : "black";
        td.innerHTML = `<button class="dias" id="${i}" onclick="insert(${i}, ${month}, ${year})" style="color:${color};">${i}</button>`;
        row.appendChild(td);

        if ((i + firstDay) % 7 === 0) {
            table.appendChild(row);
            row = document.createElement("tr");
        }
    }

    let nextMonthDay = 1;
    while (row.children.length < 7 && row.children.length > 0) {
        const td = document.createElement("td");
        td.innerHTML = `<button class="diasM">${nextMonthDay}</button>`;
        row.appendChild(td);
        nextMonthDay++;
    }
    table.appendChild(row);
    applyStyles();
    updateCourses();
    let hor = document.getElementById("horario");
    hor.textContent+=" "+hora1; 
}

function applyStyles() {
    const colors = ['rgb(126, 112, 112)', 'rgb(205, 179, 236)', 'rgb(179, 220, 236)', 'rgb(181, 236, 179)', 'rgb(236, 236, 179)'];

    for (let i = 1; i <= 31; i++) {
        const dia = document.getElementById(`${i}`);
        if (dia) dia.style.color = "black";
    }

    const saas = document.getElementById("sala");
    saas.textContent += " "+salaN;

    corpo.style.background = colors[salaN - 1];
}

function setColorForDay(s, n, l, j, t) {
    const dia = document.getElementById(`${t}`);
    const colors = ["green", "yellow", "blue", "purple", "orange"];
    dia.style.color = (n === j && s === l) ? colors[n - 1] || "red" : "red";
}

function updateCourses() {
    const month = mes1;
    const year = ano1;
    document.getElementById("curso").textContent += " "+cursoN;

    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 5; i++) {
            for (let l = 0; l < 31; l++) {
                for (let t = 1; t <= 31; t++) {
                    if (`${t}/${month + 1}/${year}` === salas[j][i][l]) {
                        setColorForDay(salaN, cursoN, j + 1, i + 1, t);
                    }
                }
            }
        }
    }

    const colors = ["green", "yellow", "blue", "purple", "orange"];
    cor = colors[cursoN - 1];
}

function insert(day, month, year) {
    month++;
    const dia = document.getElementById(`${day}`);
    const key = `${day}/${month}/${year}`;
    let valid = true;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            for (let l = 0; l <= 31; l++) {
                if (`${day}/${month}/${year}` === salas[i][j][l]) {
                    if (salaN === i + 1 && cursoN === j + 1) {
                        valid = true;
                        day = 0;
                        salas[i][j].splice(l, 1);
                        dia.style.color = "black";
                        if (state[key] && state[key][salaN]) {
                            delete state[key][salaN];
                        }
                        break;
                    } else if (salaN === i + 1 && cursoN !== j + 1) {
                        alert("A data selecionada pertence a outro curso na mesma sala.");
                        return;
                    }
                }
            }
        }
    }

    if (valid && salaN && cursoN) {
        if (day > 0) {
            dia.style.color = cor;
            salas[salaN - 1][cursoN - 1].push(`${day}/${month}/${year}`);
            salas[salaN - 1][cursoN - 1].sort((a, b) => a - b);
            if (!state[key]) {
                state[key] = {};
            }
            state[key][salaN] = cor; 
        }
    } else if (day === 0) {
        if (state[key]) {
            delete state[key][salaN];
        }
    }

   // mostrar();
    console.clear();
    console.table(salas);
}

function mostrar() {
    [Sala1, Sala2, Sala3, Sala4, Sala5] = [document.querySelector('#Sala1'), document.querySelector('#Sala2'), document.querySelector('#Sala3'), document.querySelector('#Sala4'), document.querySelector('#Sala5')];

    for (let i = 0; i < 5; i++) {
        const sala = document.querySelector(`#Sala${i + 1}`);
        sala.textContent = `Sala ${i + 1}: \n Curso 1: ${salas[i][0]}`;
        for (let j = 1; j < 5; j++) {
            sala.textContent += ` \n--------------Curso ${j + 1}: ${salas[i][j]}`;
        }
    }
}
