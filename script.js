/* ==================================================
   ÚTILHUB V6
   JAVASCRIPT
================================================== */

"use strict";


/* ==================================================
   ELEMENTOS
================================================== */

const modal =
    document.getElementById("toolModal");

const modalContent =
    document.getElementById("modalContent");

const globalSearch =
    document.getElementById("globalSearch");

const toolsGrid =
    document.getElementById("toolsGrid");

const noResults =
    document.getElementById("noResults");


/* ==================================================
   NAVEGACIÓN MÓVIL
================================================== */

const mobileMenu =
    document.getElementById("mobileMenu");

const mainNav =
    document.getElementById("mainNav");


if (mobileMenu) {

    mobileMenu.addEventListener("click", () => {

        mainNav.classList.toggle("open");

    });

}


document.querySelectorAll(".nav-link")
.forEach(link => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("open");

    });

});


/* ==================================================
   SCROLL RÁPIDO
================================================== */

document.querySelectorAll("[data-scroll]")
.forEach(button => {

    button.addEventListener("click", () => {

        const id =
            button.dataset.scroll;

        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* ==================================================
   TEMA
================================================== */

const themeButton =
    document.getElementById("themeButton");


const savedTheme =
    localStorage.getItem("utilhub-theme");


if (savedTheme === "light") {

    document.body.classList.add("light");

    themeButton.textContent = "🌙";

}


themeButton?.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const light =
        document.body.classList.contains("light");

    localStorage.setItem(
        "utilhub-theme",
        light ? "light" : "dark"
    );

    themeButton.textContent =
        light ? "🌙" : "☀️";

});


/* ==================================================
   BUSCADOR DE HERRAMIENTAS
================================================== */

function searchTools() {

    const query =
        globalSearch.value
            .trim()
            .toLowerCase();

    const cards =
        document.querySelectorAll(".tool-card");

    let visible = 0;

    cards.forEach(card => {

        const name =
            card.dataset.name
                .toLowerCase();

        const visibleCard =
            !query ||
            name.includes(query);

        card.style.display =
            visibleCard ? "" : "none";

        if (visibleCard) {

            visible++;

        }

    });


    if (noResults) {

        noResults.style.display =
            visible === 0 && query
                ? "block"
                : "none";

    }


    if (query && visible > 0) {

        document
            .getElementById("herramientas")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }

}


document
    .getElementById("globalSearchButton")
    ?.addEventListener(
        "click",
        searchTools
    );


globalSearch?.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchTools();

        }

    }
);


/* ==================================================
   TARJETAS
================================================== */

document
    .querySelectorAll(".tool-card")
    .forEach(card => {

        card.addEventListener("click", event => {

            if (
                event.target.tagName === "BUTTON"
            ) {

                openTool(
                    card.dataset.tool
                );

            } else {

                openTool(
                    card.dataset.tool
                );

            }

        });

    });


/* ==================================================
   MODAL
================================================== */

function openTool(tool) {

    const creators = {

        calculator: createCalculator,
        percentage: createPercentage,
        discount: createDiscount,
        average: createAverage,
        converter: createConverter,
        temperature: createTemperature,
        date: createDateTool,
        timer: createTimer,
        stopwatch: createStopwatch,
        expenses: createExpenses,
        budget: createBudget,
        password: createPassword,
        qr: createQR,
        dictionary: createDictionary,
        random: createRandom,
        dice: createDice,
        notes: createNotes,
        tasks: createTasks,
        "shopping-list": createShoppingList,
        study: createStudy

    };


    if (!creators[tool]) {

        return;

    }


    modalContent.innerHTML =
        creators[tool]();

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


function closeTool() {

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    if (window.timerInterval) {

        clearInterval(
            window.timerInterval
        );

        window.timerInterval = null;

    }

}


modal?.addEventListener("click", event => {

    if (event.target === modal) {

        closeTool();

    }

});


document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        modal.classList.contains("show")
    ) {

        closeTool();

    }

});


/* ==================================================
   HELPERS
================================================== */

function modalHeader(title, description) {

    return `
        <h2 class="modal-title">
            ${escapeHTML(title)}
        </h2>

        <p class="modal-description">
            ${escapeHTML(description)}
        </p>
    `;

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function numberValue(id) {

    const element =
        document.getElementById(id);

    const value =
        Number(element?.value);

    return Number.isFinite(value)
        ? value
        : null;

}


/* ==================================================
   CALCULADORA SEGURA
================================================== */

function createCalculator() {

    return `
        ${modalHeader(
            "🧮 Calculadora",
            "Realiza operaciones matemáticas básicas."
        )}

        <div class="tool-form">

            <input
                id="calcDisplay"
                type="text"
                placeholder="Ejemplo: 25 + 15 × 2"
                autocomplete="off"
            >

            <button onclick="calculateExpression()">
                Calcular
            </button>

            <div
                id="calcResult"
                class="result-box"
            >
                Escribe una operación.
            </div>

        </div>
    `;

}


function calculateExpression() {

    const input =
        document.getElementById(
            "calcDisplay"
        ).value.trim();


    const result =
        safeCalculate(input);


    document.getElementById(
        "calcResult"
    ).textContent =
        result === null
            ? "Operación no válida."
            : `Resultado: ${result}`;

}


/*
    Parser sencillo.
    No utiliza Function() ni eval().
*/

function safeCalculate(expression) {

    if (!expression) return null;


    let exp =
        expression
            .replaceAll(",", ".")
            .replaceAll("×", "*")
            .replaceAll("÷", "/")
            .replaceAll("−", "-")
            .replace(/\s+/g, "");


    if (!/^[0-9+\-*/().%]+$/.test(exp)) {

        return null;

    }


    try {

        const tokens =
            tokenize(exp);

        const parser =
            new ExpressionParser(tokens);

        const result =
            parser.parse();

        if (
            !Number.isFinite(result) ||
            parser.position !== tokens.length
        ) {

            return null;

        }

        return Number(
            result.toFixed(10)
        );

    } catch {

        return null;

    }

}


function tokenize(input) {

    const regex =
        /(\d+(?:\.\d+)?|\+|\-|\*|\/|\(|\)|%)/g;

    const tokens =
        input.match(regex);

    return tokens || [];

}


class ExpressionParser {

    constructor(tokens) {

        this.tokens = tokens;

        this.position = 0;

    }


    peek() {

        return this.tokens[
            this.position
        ];

    }


    consume() {

        return this.tokens[
            this.position++
        ];

    }


    parse() {

        return this.expression();

    }


    expression() {

        let value =
            this.term();


        while (
            this.peek() === "+" ||
            this.peek() === "-"
        ) {

            const operator =
                this.consume();

            const right =
                this.term();

            value =
                operator === "+"
                    ? value + right
                    : value - right;

        }


        return value;

    }


    term() {

        let value =
            this.factor();


        while (
            this.peek() === "*" ||
            this.peek() === "/"
        ) {

            const operator =
                this.consume();

            const right =
                this.factor();


            if (
                operator === "/" &&
                right === 0
            ) {

                throw new Error(
                    "División por cero"
                );

            }


            value =
                operator === "*"
                    ? value * right
                    : value / right;

        }


        return value;

    }


    factor() {

        let token =
            this.peek();


        if (token === "+") {

            this.consume();

            return this.factor();

        }


        if (token === "-") {

            this.consume();

            return -this.factor();

        }


        let value;


        if (token === "(") {

            this.consume();

            value =
                this.expression();

            if (this.consume() !== ")") {

                throw new Error(
                    "Paréntesis"
                );

            }

        } else {

            this.consume();

            value =
                Number(token);

        }


        if (this.peek() === "%") {

            this.consume();

            value =
                value / 100;

        }


        return value;

    }

}


/* ==================================================
   PORCENTAJES
================================================== */

function createPercentage() {

    return `
        ${modalHeader(
            "📊 Porcentajes",
            "Calcula cuánto representa un porcentaje de una cantidad."
        )}

        <div class="tool-form">

            <label>Porcentaje</label>

            <input
                id="percentValue"
                type="number"
                placeholder="Ejemplo: 20"
            >

            <label>Cantidad</label>

            <input
                id="percentTotal"
                type="number"
                placeholder="Ejemplo: 500"
            >

            <button onclick="calculatePercentage()">
                Calcular
            </button>

            <div
                id="percentResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function calculatePercentage() {

    const percent =
        numberValue("percentValue");

    const total =
        numberValue("percentTotal");


    if (
        percent === null ||
        total === null
    ) {

        return;

    }


    const result =
        total * percent / 100;


    document.getElementById(
        "percentResult"
    ).textContent =
        `${percent}% de ${total} = ${result}`;

}


/* ==================================================
   DESCUENTOS
================================================== */

function createDiscount() {

    return `
        ${modalHeader(
            "🏷️ Descuento",
            "Calcula el precio final después de un descuento."
        )}

        <div class="tool-form">

            <label>Precio original</label>

            <input
                id="discountPrice"
                type="number"
                min="0"
                placeholder="Ejemplo: 100"
            >

            <label>Descuento (%)</label>

            <input
                id="discountPercent"
                type="number"
                min="0"
                max="100"
                placeholder="Ejemplo: 20"
            >

            <button onclick="calculateDiscount()">
                Calcular
            </button>

            <div
                id="discountResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function calculateDiscount() {

    const price =
        numberValue("discountPrice");

    const percent =
        numberValue("discountPercent");


    if (
        price === null ||
        percent === null ||
        percent < 0 ||
        percent > 100
    ) {

        return;

    }


    const saving =
        price * percent / 100;

    const finalPrice =
        price - saving;


    document.getElementById(
        "discountResult"
    ).innerHTML =

        `
        <strong>Ahorras:</strong>
        ${saving.toFixed(2)}
        <br><br>
        <strong>Precio final:</strong>
        ${finalPrice.toFixed(2)}
        `;

}


/* ==================================================
   PROMEDIO
================================================== */

function createAverage() {

    return `
        ${modalHeader(
            "📊 Promedio",
            "Escribe varios números separados por comas."
        )}

        <div class="tool-form">

            <input
                id="averageNumbers"
                type="text"
                placeholder="10, 15, 18, 20"
            >

            <button onclick="calculateAverage()">
                Calcular promedio
            </button>

            <div
                id="averageResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function calculateAverage() {

    const input =
        document.getElementById(
            "averageNumbers"
        ).value;


    const numbers =
        input
            .split(",")
            .map(x => Number(x.trim()))
            .filter(Number.isFinite);


    if (!numbers.length) {

        return;

    }


    const average =
        numbers.reduce(
            (a,b) => a + b,
            0
        ) / numbers.length;


    document.getElementById(
        "averageResult"
    ).textContent =
        `Promedio: ${average.toFixed(2)}`;

}


/* ==================================================
   CONVERSOR
================================================== */

function createConverter() {

    return `
        ${modalHeader(
            "🔄 Conversor",
            "Convierte diferentes unidades."
        )}

        <div class="tool-form">

            <select id="conversionType">
                <option value="km-m">Kilómetros → metros</option>
                <option value="m-km">Metros → kilómetros</option>
                <option value="kg-g">Kilogramos → gramos</option>
                <option value="g-kg">Gramos → kilogramos</option>
                <option value="l-ml">Litros → mililitros</option>
                <option value="ml-l">Mililitros → litros</option>
            </select>

            <input
                id="conversionValue"
                type="number"
                placeholder="Cantidad"
            >

            <button onclick="convertUnits()">
                Convertir
            </button>

            <div
                id="conversionResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function convertUnits() {

    const value =
        numberValue("conversionValue");

    const type =
        document.getElementById(
            "conversionType"
        ).value;


    if (value === null) return;


    const conversions = {

        "km-m": [
            value * 1000,
            "metros"
        ],

        "m-km": [
            value / 1000,
            "kilómetros"
        ],

        "kg-g": [
            value * 1000,
            "gramos"
        ],

        "g-kg": [
            value / 1000,
            "kilogramos"
        ],

        "l-ml": [
            value * 1000,
            "mililitros"
        ],

        "ml-l": [
            value / 1000,
            "litros"
        ]

    };


    const result =
        conversions[type];


    document.getElementById(
        "conversionResult"
    ).textContent =
        `${result[0]} ${result[1]}`;

}


/* ==================================================
   TEMPERATURA
================================================== */

function createTemperature() {

    return `
        ${modalHeader(
            "🌡️ Temperatura",
            "Convierte Celsius, Fahrenheit y Kelvin."
        )}

        <div class="tool-form">

            <select id="tempType">
                <option value="c-f">
                    Celsius → Fahrenheit
                </option>

                <option value="f-c">
                    Fahrenheit → Celsius
                </option>

                <option value="c-k">
                    Celsius → Kelvin
                </option>

                <option value="k-c">
                    Kelvin → Celsius
                </option>
            </select>

            <input
                id="tempValue"
                type="number"
                placeholder="Temperatura"
            >

            <button onclick="convertTemperature()">
                Convertir
            </button>

            <div
                id="tempResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function convertTemperature() {

    const value =
        numberValue("tempValue");

    const type =
        document.getElementById(
            "tempType"
        ).value;


    if (value === null) return;


    let result;


    switch(type) {

        case "c-f":
            result =
                value * 9 / 5 + 32;
            break;

        case "f-c":
            result =
                (value - 32) * 5 / 9;
            break;

        case "c-k":
            result =
                value + 273.15;
            break;

        case "k-c":
            result =
                value - 273.15;
            break;

    }


    document.getElementById(
        "tempResult"
    ).textContent =
        `Resultado: ${result.toFixed(2)}`;

}


/* ==================================================
   FECHAS
================================================== */

function createDateTool() {

    return `
        ${modalHeader(
            "📅 Contador de días",
            "Calcula la diferencia entre dos fechas."
        )}

        <div class="tool-form">

            <label>Fecha inicial</label>

            <input
                id="dateOne"
                type="date"
            >

            <label>Fecha final</label>

            <input
                id="dateTwo"
                type="date"
            >

            <button onclick="calculateDays()">
                Calcular días
            </button>

            <div
                id="dateResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function calculateDays() {

    const first =
        new Date(
            document.getElementById(
                "dateOne"
            ).value
        );


    const second =
        new Date(
            document.getElementById(
                "dateTwo"
            ).value
        );


    if (
        Number.isNaN(first.getTime()) ||
        Number.isNaN(second.getTime())
    ) {

        return;

    }


    const difference =
        Math.abs(
            second - first
        );


    const days =
        Math.round(
            difference /
            86400000
        );


    document.getElementById(
        "dateResult"
    ).textContent =
        `Hay ${days} día(s) de diferencia.`;

}


/* ==================================================
   TEMPORIZADOR
================================================== */

function createTimer() {

    return `
        ${modalHeader(
            "⏳ Temporizador",
            "Configura minutos y segundos."
        )}

        <div class="tool-form">

            <input
                id="timerMinutes"
                type="number"
                min="0"
                placeholder="Minutos"
            >

            <input
                id="timerSeconds"
                type="number"
                min="0"
                max="59"
                placeholder="Segundos"
            >

            <div
                id="timerDisplay"
                class="timer-display"
            >
                00:00
            </div>

            <button onclick="startTimer()">
                Iniciar
            </button>

            <button onclick="stopTimer()">
                Detener
            </button>

        </div>
    `;

}


function startTimer() {

    stopTimer();


    const minutes =
        Number(
            document.getElementById(
                "timerMinutes"
            ).value
        ) || 0;


    const seconds =
        Number(
            document.getElementById(
                "timerSeconds"
            ).value
        ) || 0;


    let remaining =
        minutes * 60 + seconds;


    if (remaining <= 0) return;


    updateTimerDisplay(
        remaining
    );


    window.timerInterval =
        setInterval(() => {

            remaining--;

            updateTimerDisplay(
                remaining
            );


            if (remaining <= 0) {

                stopTimer();

                alert(
                    "⏰ ¡El tiempo terminó!"
                );

            }

        },1000);

}


function updateTimerDisplay(seconds) {

    const min =
        Math.floor(seconds / 60);

    const sec =
        seconds % 60;


    const display =
        document.getElementById(
            "timerDisplay"
        );


    if (!display) return;


    display.textContent =
        `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

}


function stopTimer() {

    if (window.timerInterval) {

        clearInterval(
            window.timerInterval
        );

        window.timerInterval =
            null;

    }

}


/* ==================================================
   CRONÓMETRO
================================================== */

let stopwatchStart = 0;
let stopwatchElapsed = 0;
let stopwatchInterval = null;


function createStopwatch() {

    return `
        ${modalHeader(
            "⏱️ Cronómetro",
            "Mide el tiempo transcurrido."
        )}

        <div class="tool-form">

            <div
                id="stopwatchDisplay"
                class="timer-display"
            >
                00:00:00
            </div>

            <button onclick="startStopwatch()">
                Iniciar
            </button>

            <button onclick="pauseStopwatch()">
                Pausar
            </button>

            <button onclick="resetStopwatch()">
                Reiniciar
            </button>

        </div>
    `;

}


function formatStopwatch(ms) {

    const totalSeconds =
        Math.floor(ms / 1000);

    const hours =
        Math.floor(
            totalSeconds / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    return [
        hours,
        minutes,
        seconds
    ]
    .map(
        value =>
            String(value).padStart(2,"0")
    )
    .join(":");

}


function updateStopwatch() {

    const display =
        document.getElementById(
            "stopwatchDisplay"
        );


    if (!display) return;


    const elapsed =
        Date.now() -
        stopwatchStart +
        stopwatchElapsed;


    display.textContent =
        formatStopwatch(elapsed);

}


function startStopwatch() {

    if (stopwatchInterval) return;


    stopwatchStart =
        Date.now();


    stopwatchInterval =
        setInterval(
            updateStopwatch,
            200
        );

}


function pauseStopwatch() {

    if (!stopwatchInterval) return;


    stopwatchElapsed +=
        Date.now() -
        stopwatchStart;


    clearInterval(
        stopwatchInterval
    );


    stopwatchInterval =
        null;

}


function resetStopwatch() {

    clearInterval(
        stopwatchInterval
    );


    stopwatchInterval =
        null;

    stopwatchElapsed =
        0;

    stopwatchStart =
        0;


    const display =
        document.getElementById(
            "stopwatchDisplay"
        );


    if (display) {

        display.textContent =
            "00:00:00";

    }

}


/* ==================================================
   GASTOS
================================================== */

function createExpenses() {

    return `
        ${modalHeader(
            "💰 Gastos",
            "Introduce varios gastos para obtener el total."
        )}

        <div class="tool-form">

            <input
                id="expenseList"
                type="text"
                placeholder="10, 25.50, 8, 14"
            >

            <button onclick="calculateExpenses()">
                Sumar gastos
            </button>

            <div
                id="expenseResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function calculateExpenses() {

    const input =
        document.getElementById(
            "expenseList"
        ).value;


    const values =
        input
            .split(",")
            .map(
                value =>
                    Number(value.trim())
            )
            .filter(
                value =>
                    Number.isFinite(value)
            );


    const total =
        values.reduce(
            (a,b) => a + b,
            0
        );


    document.getElementById(
        "expenseResult"
    ).textContent =
        `Total de gastos: S/ ${total.toFixed(2)}`;

}


/* ==================================================
   PRESUPUESTO
================================================== */

function createBudget() {

    return `
        ${modalHeader(
            "💳 Presupuesto",
            "Calcula cuánto dinero queda disponible."
        )}

        <div class="tool-form">

            <input
                id="budgetIncome"
                type="number"
                placeholder="Dinero disponible"
            >

            <input
                id="budgetExpenses"
                type="number"
                placeholder="Gastos"
            >

            <button onclick="calculateBudget()">
                Calcular
            </button>

            <div
                id="budgetResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function calculateBudget() {

    const income =
        numberValue("budgetIncome");

    const expenses =
        numberValue("budgetExpenses");


    if (
        income === null ||
        expenses === null
    ) return;


    const remaining =
        income - expenses;


    document.getElementById(
        "budgetResult"
    ).textContent =
        `Disponible: S/ ${remaining.toFixed(2)}`;

}


/* ==================================================
   CONTRASEÑA
================================================== */

function createPassword() {

    return `
        ${modalHeader(
            "🔐 Generador de contraseñas",
            "Genera una contraseña aleatoria. No se guarda."
        )}

        <div class="tool-form">

            <input
                id="passwordLength"
                type="number"
                min="8"
                max="64"
                value="16"
            >

            <button onclick="generatePassword()">
                Generar
            </button>

            <input
                id="generatedPassword"
                readonly
                placeholder="Aquí aparecerá"
            >

        </div>
    `;

}


function randomSecure(max) {

    const array =
        new Uint32Array(1);

    crypto.getRandomValues(array);

    return array[0] % max;

}


function generatePassword() {

    const length =
        Math.min(
            64,
            Math.max(
                8,
                Number(
                    document.getElementById(
                        "passwordLength"
                    ).value
                ) || 16
            )
        );


    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ" +
        "abcdefghijkmnopqrstuvwxyz" +
        "23456789" +
        "!@#$%^&*";


    let password = "";


    for (
        let i = 0;
        i < length;
        i++
    ) {

        password +=
            chars[
                randomSecure(
                    chars.length
                )
            ];

    }


    document.getElementById(
        "generatedPassword"
    ).value =
        password;

}


/* ==================================================
   QR
================================================== */

function createQR() {

    return `
        ${modalHeader(
            "▦ Generador QR",
            "Escribe un texto o enlace para generar un código QR."
        )}

        <div class="tool-form">

            <input
                id="qrText"
                type="text"
                placeholder="https://ejemplo.com"
            >

            <button onclick="generateQR()">
                Generar QR
            </button>

            <div id="qrContainer"></div>

        </div>
    `;

}


function generateQR() {

    const text =
        document.getElementById(
            "qrText"
        ).value.trim();


    if (!text) return;


    const image =
        document.createElement("img");


    image.className =
        "qr-image";


    image.alt =
        "Código QR generado";


    image.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
        encodeURIComponent(text);


    const container =
        document.getElementById(
            "qrContainer"
        );


    container.innerHTML = "";

    container.appendChild(
        image
    );

}


/* ==================================================
   DICCIONARIO
================================================== */

function createDictionary() {

    return `
        ${modalHeader(
            "📖 Diccionario",
            "Consulta el significado de una palabra en español."
        )}

        <div class="tool-form">

            <input
                id="dictionaryWord"
                type="text"
                placeholder="Ejemplo: aprender"
            >

            <button onclick="searchDictionary()">
                Buscar
            </button>

            <div
                id="dictionaryResult"
                class="result-box"
            >
                Escribe una palabra.
            </div>

        </div>
    `;

}


async function searchDictionary() {

    const word =
        document.getElementById(
            "dictionaryWord"
        ).value.trim();


    if (!word) return;


    const result =
        document.getElementById(
            "dictionaryResult"
        );


    result.textContent =
        "Buscando...";


    try {

        const response =
            await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/es/${encodeURIComponent(word)}`
            );


        if (!response.ok) {

            throw new Error();

        }


        const data =
            await response.json();


        const entry =
            data[0];


        const meanings =
            entry.meanings || [];


        const definitions =
            meanings
                .slice(0,3)
                .map(
                    meaning =>
                        meaning.definitions
                            ?.slice(0,2)
                            .map(
                                d =>
                                    `<p>• ${escapeHTML(d.definition)}</p>`
                            )
                            .join("") || ""
                )
                .join("");


        result.innerHTML =
            `<strong>${escapeHTML(word)}</strong><br><br>${definitions}`;

    } catch {

        result.textContent =
            "No se encontró la palabra o el servicio no está disponible.";

    }

}


/* ==================================================
   NÚMERO ALEATORIO
================================================== */

function createRandom() {

    return `
        ${modalHeader(
            "🎯 Número aleatorio",
            "Elige un rango y genera un número."
        )}

        <div class="tool-form">

            <input
                id="randomMin"
                type="number"
                value="1"
                placeholder="Mínimo"
            >

            <input
                id="randomMax"
                type="number"
                value="100"
                placeholder="Máximo"
            >

            <button onclick="generateRandomNumber()">
                Generar
            </button>

            <div
                id="randomResult"
                class="big-result"
            >
                —
            </div>

        </div>
    `;

}


function generateRandomNumber() {

    let min =
        numberValue("randomMin");

    let max =
        numberValue("randomMax");


    if (
        min === null ||
        max === null
    ) return;


    if (min > max) {

        [min,max] =
            [max,min];

    }


    const result =
        Math.floor(
            Math.random() *
            (max - min + 1)
        ) + min;


    document.getElementById(
        "randomResult"
    ).textContent =
        result;

}


/* ==================================================
   DADO
================================================== */

function createDice() {

    return `
        ${modalHeader(
            "🎲 Dado",
            "Lanza un dado virtual."
        )}

        <div class="tool-form">

            <div
                id="diceResult"
                class="big-result"
            >
                🎲
            </div>

            <button onclick="rollDice()">
                Lanzar dado
            </button>

        </div>
    `;

}


function rollDice() {

    const result =
        Math.floor(
            Math.random() * 6
        ) + 1;


    const faces = [
        "⚀",
        "⚁",
        "⚂",
        "⚃",
        "⚄",
        "⚅"
    ];


    document.getElementById(
        "diceResult"
    ).textContent =
        faces[result - 1] +
        " " +
        result;

}


/* ==================================================
   NOTAS
================================================== */

function createNotes() {

    const notes =
        localStorage.getItem(
            "utilhub-notes"
        ) || "";


    return `
        ${modalHeader(
            "📝 Notas",
            "Tus notas se guardan en este navegador."
        )}

        <div class="tool-form">

            <textarea
                id="notesText"
                placeholder="Escribe aquí..."
            >${escapeHTML(notes)}</textarea>

            <button onclick="saveNotes()">
                Guardar nota
            </button>

            <button onclick="clearNotes()">
                Borrar nota
            </button>

            <div
                id="notesResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function saveNotes() {

    const text =
        document.getElementById(
            "notesText"
        ).value;


    localStorage.setItem(
        "utilhub-notes",
        text
    );


    document.getElementById(
        "notesResult"
    ).textContent =
        "✓ Nota guardada en este dispositivo.";

}


function clearNotes() {

    localStorage.removeItem(
        "utilhub-notes"
    );


    document.getElementById(
        "notesText"
    ).value = "";


    document.getElementById(
        "notesResult"
    ).textContent =
        "Nota eliminada.";

}


/* ==================================================
   TAREAS
================================================== */

function getTasks() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "utilhub-tasks"
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveTasks(tasks) {

    localStorage.setItem(
        "utilhub-tasks",
        JSON.stringify(tasks)
    );

}


function createTasks() {

    return `
        ${modalHeader(
            "✅ Tareas",
            "Organiza tus pendientes."
        )}

        <div class="tool-form">

            <input
                id="taskInput"
                type="text"
                placeholder="Nueva tarea..."
            >

            <button onclick="addTask()">
                Añadir tarea
            </button>

            <div
                id="tasksContainer"
                class="list-container"
            ></div>

        </div>
    `;

}


function addTask() {

    const input =
        document.getElementById(
            "taskInput"
        );


    const text =
        input.value.trim();


    if (!text) return;


    const tasks =
        getTasks();


    tasks.push({

        id:
            Date.now(),

        text,

        done:
            false

    });


    saveTasks(tasks);


    input.value = "";

    renderTasks();

}


function toggleTask(id) {

    const tasks =
        getTasks();


    const task =
        tasks.find(
            item =>
                item.id === id
        );


    if (task) {

        task.done =
            !task.done;

    }


    saveTasks(tasks);

    renderTasks();

}


function deleteTask(id) {

    const tasks =
        getTasks()
            .filter(
                task =>
                    task.id !== id
            );


    saveTasks(tasks);

    renderTasks();

}


function renderTasks() {

    const container =
        document.getElementById(
            "tasksContainer"
        );


    if (!container) return;


    const tasks =
        getTasks();


    container.innerHTML =
        tasks.length
            ? tasks.map(task => `

                <div
                    class="list-item ${
                        task.done
                            ? "done"
                            : ""
                    }"
                >

                    <span>
                        ${escapeHTML(task.text)}
                    </span>

                    <div>

                        <button
                            onclick="toggleTask(${task.id})"
                        >
                            ✓
                        </button>

                        <button
                            onclick="deleteTask(${task.id})"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `).join("")

            : `<p style="color:var(--text-soft)">
                No tienes tareas todavía.
               </p>`;

}


setTimeout(
    renderTasks,
    100
);


/* ==================================================
   LISTA DE COMPRAS
================================================== */

function getShoppingList() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "utilhub-shopping"
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveShoppingList(list) {

    localStorage.setItem(
        "utilhub-shopping",
        JSON.stringify(list)
    );

}


function createShoppingList() {

    return `
        ${modalHeader(
            "🛒 Lista de compras",
            "Organiza los productos que necesitas comprar."
        )}

        <div class="tool-form">

            <input
                id="shoppingItem"
                type="text"
                placeholder="Ejemplo: arroz"
            >

            <button onclick="addShoppingItem()">
                Añadir producto
            </button>

            <div
                id="shoppingContainer"
                class="list-container"
            ></div>

        </div>
    `;

}


function addShoppingItem() {

    const input =
        document.getElementById(
            "shoppingItem"
        );


    const value =
        input.value.trim();


    if (!value) return;


    const list =
        getShoppingList();


    list.push({

        id:
            Date.now(),

        text:
            value,

        done:
            false

    });


    saveShoppingList(list);

    input.value = "";

    renderShoppingList();

}


function toggleShoppingItem(id) {

    const list =
        getShoppingList();


    const item =
        list.find(
            x =>
                x.id === id
        );


    if (item) {

        item.done =
            !item.done;

    }


    saveShoppingList(list);

    renderShoppingList();

}


function deleteShoppingItem(id) {

    const list =
        getShoppingList()
            .filter(
                x =>
                    x.id !== id
            );


    saveShoppingList(list);

    renderShoppingList();

}


function renderShoppingList() {

    const container =
        document.getElementById(
            "shoppingContainer"
        );


    if (!container) return;


    const list =
        getShoppingList();


    container.innerHTML =
        list.length
            ? list.map(item => `

                <div
                    class="list-item ${
                        item.done
                            ? "done"
                            : ""
                    }"
                >

                    <span>
                        ${escapeHTML(item.text)}
                    </span>

                    <div>

                        <button
                            onclick="toggleShoppingItem(${item.id})"
                        >
                            ✓
                        </button>

                        <button
                            onclick="deleteShoppingItem(${item.id})"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `).join("")

            : `<p style="color:var(--text-soft)">
                Tu lista está vacía.
               </p>`;

}


setTimeout(
    renderShoppingList,
    100
);


/* ==================================================
   ORGANIZADOR DE ESTUDIO
================================================== */

function createStudy() {

    const saved =
        localStorage.getItem(
            "utilhub-study"
        ) || "";


    return `
        ${modalHeader(
            "🎓 Organizador de estudio",
            "Planifica lo que quieres estudiar."
        )}

        <div class="tool-form">

            <input
                id="studySubject"
                type="text"
                placeholder="Curso o tema"
                value="${escapeHTML(saved)}"
            >

            <input
                id="studyTime"
                type="text"
                placeholder="Tiempo disponible"
            >

            <textarea
                id="studyPlan"
                placeholder="¿Qué quieres estudiar?"
            ></textarea>

            <button onclick="saveStudy()">
                Guardar planificación
            </button>

            <div
                id="studyResult"
                class="result-box"
            ></div>

        </div>
    `;

}


function saveStudy() {

    const subject =
        document.getElementById(
            "studySubject"
        ).value;


    const time =
        document.getElementById(
            "studyTime"
        ).value;


    const plan =
        document.getElementById(
            "studyPlan"
        ).value;


    localStorage.setItem(
        "utilhub-study",
        subject
    );


    document.getElementById(
        "studyResult"
    ).innerHTML = `

        <strong>Plan guardado</strong>

        <br><br>

        Curso:
        ${escapeHTML(subject)}

        <br>

        Tiempo:
        ${escapeHTML(time)}

        <br><br>

        ${escapeHTML(plan)}

    `;

}


/* ==================================================
   COMIDA
================================================== */

function searchFood() {

    const query =
        document.getElementById(
            "foodSearch"
        ).value.trim();


    if (!query) {

        alert(
            "Escribe qué comida buscas."
        );

        return;

    }


    searchOnMaps(
        `${query} restaurantes`
    );

}


function searchFoodCategory(category) {

    searchOnMaps(
        `${category} restaurantes`
    );

}


/* ==================================================
   COMPRAS
================================================== */

function searchShopping() {

    const query =
        document.getElementById(
            "shoppingSearch"
        ).value.trim();


    if (!query) {

        alert(
            "Escribe qué producto buscas."
        );

        return;

    }


    searchOnMaps(
        `${query} tiendas`
    );

}


function searchShoppingCategory(category) {

    searchOnMaps(
        category
    );

}


/* ==================================================
   CERCA DE MÍ
================================================== */

function findNearby(type) {

    const status =
        document.getElementById(
            "locationStatus"
        );


    if (
        !navigator.geolocation
    ) {

        status.textContent =
            "Tu navegador no permite ubicación.";

        searchOnMaps(
            type
        );

        return;

    }


    status.textContent =
        "Solicitando permiso de ubicación...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            status.textContent =
                `Ubicación obtenida. Buscando ${type}...`;


            const url =
                `https://www.google.com/maps/search/${encodeURIComponent(type)}/@${lat},${lng},14z`;


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        },

        () => {

            status.textContent =
                "No se obtuvo la ubicación. Puedes buscar manualmente.";

            searchOnMaps(
                type
            );

        },

        {

            enableHighAccuracy:
                false,

            timeout:
                10000,

            maximumAge:
                300000

        }

    );

}


/* ==================================================
   MAPAS
================================================== */

function searchOnMaps(query) {

    const url =
        "https://www.google.com/maps/search/" +
        encodeURIComponent(query);


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* ==================================================
   INICIALIZACIÓN
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "ÚtilHub V6 iniciado correctamente."
        );

    }
);
