let localStorage = window.localStorage;

const [left, right] = [0, 1];
let range = Array.from(Array(11).keys()).slice(1);
let elements = Array.prototype.slice.call(document.querySelectorAll(".row:not(.header):not(.footer)"));


class Currency {

    constructor(code = "") {
        console.log("Creating new currency");

        this.code = code;
        this.data = {};
        this.updateAmount();
    }

    updateAmount() {
        fetch(`https://api.exchangeratesapi.io/latest?base=${this.code}`)
            .then((raw) => raw.json())
            .then((json) => {

                this.data = json;
                localStorage.setItem(this.code, json);

                console.log(`Currency ${this.code} was created!`);
            });
    }
}


class Sohaty {

    constructor(from, to) {
        this.from = from;
        this.to = to;

        this.data = [];

        new Currency(from);
        new Currency(to);

        this.setFlags();

        this.multiply = 10;
        this.update()
    }

    left() {
        if (this.multiply <= 1) {
            return 1
        }
        this.multiply *= 0.1;
        this.update()
    }

    right() {
        this.multiply *= 10;
        this.update()
    }

    update() {
        this.data = range.map((x) => {
            return [x * this.multiply, (x * this.multiply * localStorage.getItem(this.from)['rates'][this.to]).toFixed(2)]
        });

        let rows = zip(elements.map(row => row.children), this.data);

        for (let row of rows) {
            let [target, data] = row;
            target[right].innerHTML = pretifier(data[right]);
            target[left].innerHTML = pretifier(data[left]);
        }
    }

    setFlags() {
        let flags = document.querySelectorAll('.header .left>img, .header .right>img');
        flags[left].src = `images/${this.from}.png`;
        flags[right].src = `images/${this.to}.png`;
    }
}


let sohaty = new Sohaty('ISK', 'EUR');

let touch = new TouchEvents(50);
touch.on("left", () => sohaty.left());
touch.on("right", () => sohaty.right());
touch.configure(document.querySelector('.screen'));