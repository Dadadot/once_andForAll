// button.addEventListener("click", function() {
//     write_html();
// });
console.log("here")

class Interface {
    constructor() {
        this.output = document.getElementById("output");
        this.b1 = document.querySelector("#b1");
        this.b2 = document.querySelector("#b2");
        this.b3 = document.querySelector("#b3");
    }

    write_html(words) {
        console.log(words)
        let tmp_1 = "";
        let tmp_2 = "";
        const tmp_3 = words.words_simple.join(" ")
        for (const [_, value] of Object.entries(words.words)) {
            tmp_1 += value[0] + " "
            tmp_2 += value[1] + " "
        }
        const entries = [tmp_1, tmp_2, tmp_3]
        this.output.innerHTML = words.camelCase()
        this.b1.innerHTML = this.pop_random(entries) 
        this.b2.innerHTML = this.pop_random(entries)
        this.b3.innerHTML = entries[0]
    }

    pop_random(array) {
        return array.splice(Math.floor(Math.random() * array.length), 1)
    }
}

class Questions {
    constructor(question_count, words_all) {
        this.words_all = words_all;
        this.words_grouped = this.group_words()
        this.question_count = question_count;
        this.questions = this.collect_word_groups();
    }

    collect_word_groups() {
        let arr_return = [];
        for (let i = 1; i <= this.question_count; i++) {
            arr_return.push(new WordGroup(this.words_all, this.words_grouped))
        }
        return arr_return;
    }

    group_words() {
        const words_grouped = {};
        this.words_all.forEach(word => {
            const length = word.length;
            if (typeof (words_grouped[length]) === 'undefined') {
                words_grouped[length] = [];
            }
            words_grouped[length].push(word);
        });
        return words_grouped;
    }

}

class WordGroup {
    constructor(words_all, words_grouped) {
        this.count = Math.floor(Math.random() * 3) + 2;
        this.words_all = words_all;
        this.words_grouped = words_grouped;
        this.words_simple = this.collect_words();
        this.words = this.collect_similar();
        console.log(words_grouped)
    }

    random_word() {
        const word_return = this.words_all[Math.floor(Math.random() * this.words_all.length)];
        return word_return;
    }

    collect_words() {
        const words_tmp = [];
        for (let i = 1; i <= this.count; i++) {
            while (true) {
                const word_tmp = this.random_word(this.words_all)
                if (!words_tmp.includes(word_tmp)) {
                    words_tmp.push(word_tmp);
                    break
                }
            }
        }
        return words_tmp;
    }

    collect_similar() {
        const words_return = {};
        this.words_simple.forEach(word => {
            words_return[word] = [];
            let distance = 1;
            for (let i = 0; i <= 1; i++) {
                // monkeyfind
                let tries = 0
                while (true) {
                    tries += 1
                    const word_rnd = this.find_levenshtein(word, distance);
                    if (tries % 30 === 0) {
                        distance += 1;
                    } else if (tries > 500) {
                        console.log("uwu")
                        words_return[word].push(word_rnd)
                        break
                    }
                    if (!word_rnd) { continue }
                    if (!words_return[word].includes(word_rnd)) {
                        console.log(tries)
                        words_return[word].push(word_rnd)
                        break
                    }
                }
            }
        })
        return words_return;
    }

    get_words() {

    }

    camelCase() {
        let words_tmp = [...this.words_simple].map((val, i) => {
            if (i > 0) {
                return val.substring(0, 1).toUpperCase() + val.substring(1)
            } else {
                return val
            }
        })
        return words_tmp.join("")
    }

    snake_case() {
        return this.words_simple.join("_")
    }

    find_levenshtein(word, distance) {
        const length = this.words_grouped[word.length].length
        const word_rnd = this.words_grouped[word.length][Math.floor(Math.random() * length)]
        if (word_rnd === word) {
            return false
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
                    i === 0 ? j : Math.min(
                        arr[i - 1][j] + 1,
                        arr[i][j - 1] + 1,
                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                    );
            }
        }
        return arr[t.length][s.length];
    }
}

function main() {
    const count = 20
    const questions = new Questions(count, words_all)
    const interface = new Interface()
    interface.write_html(questions.questions[0])
}

main()
