// button.addEventListener("click", function() {
//     write_html();
// });

// don't delete
console.log("here");

class Interface {
    constructor() {
        this._output = document.getElementById("output");
        this._b1 = document.querySelector("#b1");
        this._b2 = document.querySelector("#b2");
        this._b3 = document.querySelector("#b3");
        this._words = null;
    }

    main(words) {
        this._words = words;
        this._output.innerHTML = this._words.snake_case();
        const entries = this._prepare_output();
        let answer = null;
        entries.forEach((val, key) => {
            if (val[1]) {
                answer = key + 1;
            }
        });
        this._b1.innerHTML = entries[0][0];
        this._b2.innerHTML = entries[1][0];
        this._b3.innerHTML = entries[2][0];
        return answer;
    }

    user_input(answer) {
        result = null;
    result = this._b1.addEventListener("click", function () {
            answer === 1 ? true : false;
        });
        this._b2.addEventListener("click", function () {
            answer === 2 ? true : false;
        });
        this._b3.addEventListener("click", function () {
            answer === 2 ? true : false;
        });
        return result ? true : false;
    }

    _prepare_output() {
        let tmp_1 = "";
        let tmp_2 = "";
        let tmp_3 = this._words.words_simple.join(" ");
        let first = true;
        let flip = Math.floor(Math.random() * 2);
        for (const [key, value] of Object.entries(this._words.words)) {
            if (first) {
                tmp_1 += key + " ";
                tmp_2 += key + " ";
                first = false;
                continue;
            }
            if (flip == 0) {
                tmp_1 += key + " ";
                tmp_2 += value[0] + " ";
                flip = 1;
            } else {
                tmp_1 += value[0] + " ";
                tmp_2 += key + " ";
                flip = 0;
            }
        }
        let entries = [
            [tmp_1, false],
            [tmp_2, false],
            [tmp_3, true],
        ];
        return this._shuffle(entries);
    }

    _shuffle([...arr]) {
        let current_index = arr.length - 1;
        let random_index;
        for (let i = current_index; i > 0; i--) {
            random_index = Math.floor(Math.random() * (current_index + 1));
            [arr[current_index], arr[random_index]] = [
                arr[random_index],
                arr[current_index],
            ];
        }
        return arr;
    }
}

class Questions {
    constructor(question_count, words_all) {
        this.words_all = words_all;
        this.words_grouped = this.group_words();
        this.question_count = question_count;
        this.questions = this.collect_word_groups();
    }

    collect_word_groups() {
        let arr_return = [];
        for (let i = 1; i <= this.question_count; i++) {
            arr_return.push(new WordGroup(this.words_all, this.words_grouped));
        }
        return arr_return;
    }

    group_words() {
        const words_grouped = {};
        this.words_all.forEach((word) => {
            const length = word.length;
            if (typeof words_grouped[length] === "undefined") {
                words_grouped[length] = [];
            }
            words_grouped[length].push(word);
        });
        return words_grouped;
    }
}

class WordGroup {
    constructor(words_all, words_grouped) {
        this.count = Math.floor(Math.random() * 3) + 3;
        this.words_all = words_all;
        this.words_grouped = words_grouped;
        this.words_simple = this.collect_words();
        this.words = this.collect_similar();
    }

    random_word() {
        const word_return =
            this.words_all[Math.floor(Math.random() * this.words_all.length)];
        return word_return;
    }

    collect_words() {
        const words_tmp = [];
        for (let i = 1; i <= this.count; i++) {
            while (true) {
                const word_tmp = this.random_word(this.words_all);
                if (!words_tmp.includes(word_tmp)) {
                    words_tmp.push(word_tmp);
                    break;
                }
            }
        }
        return words_tmp;
    }

    collect_similar() {
        const words_return = {};
        this.words_simple.forEach((word) => {
            words_return[word] = [];
            let distance = 1;
            // monkeyfind
            let tries = 0;
            while (true) {
                tries += 1;
                const word_rnd = this.find_levenshtein(word, distance);
                if (tries % 50 === 0) {
                    distance += 1;
                } else if (tries > 500) {
                    words_return[word].push(word_rnd);
                    break;
                }
                if (!word_rnd) {
                    continue;
                }
                if (!words_return[word].includes(word_rnd)) {
                    words_return[word].push(word_rnd);
                    break;
                }
            }
        });
        return words_return;
    }

    camelCase() {
        let words_tmp = [...this.words_simple].map((val, i) => {
            if (i > 0) {
                return val.substring(0, 1).toUpperCase() + val.substring(1);
            } else {
                return val;
            }
        });
        return words_tmp.join("");
    }

    snake_case() {
        return this.words_simple.join("_");
    }

    find_levenshtein(word, distance) {
        const length = this.words_grouped[word.length].length;
        const word_rnd =
            this.words_grouped[word.length][Math.floor(Math.random() * length)];
        if (word_rnd === word) {
            return false;
        }
        if (this.levenshtein(word, word_rnd) <= distance) {
            return word_rnd;
        }
        return false;
    }

    // https://www.30secondsofcode.org/js/s/levenshtein-distance
    levenshtein(s, t) {
        if (!s.length) return t.length;
        if (!t.length) return s.length;
        const arr = [];
        for (let i = 0; i <= t.length; i++) {
            arr[i] = [i];
            for (let j = 1; j <= s.length; j++) {
                arr[i][j] =
                    i === 0
                        ? j
                        : Math.min(
                              arr[i - 1][j] + 1,
                              arr[i][j - 1] + 1,
                              arr[i - 1][j - 1] +
                                  (s[j - 1] === t[i - 1] ? 0 : 1)
                          );
            }
        }
        return arr[t.length][s.length];
    }
}

function main() {
    const count = 20;
    const questions = new Questions(count, words_all);
    const interface = new Interface();
    let counter = document.getElementById("counter");
    let snake_count = 0;
    let camel_count = 0;
    let count_tmp = 0;
    for (let i = 0; i < 20; i++) {
        let result = interface.main(questions.questions[i]);
        if (result) {
            count_tmp += 1;
        }
        counter.innerHTML = `${count_tmp}`;
    }
}

main();
