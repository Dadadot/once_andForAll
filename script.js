const output = document.getElementById("output");
const button = document.querySelector("#button");
console.log("here")
button.addEventListener("click", function() {
    write_html();
});

function write_html() {
    // const text = new WordsConstruct(words_all);
    const questions = new Questions(25, words_all)
    // questions.print_questions()
    // delete text;
    console.log(questions.questions)
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
        this.words = this.collect_words();
    }

    random_word() {
        const word_return = this.words_all[Math.floor(Math.random() * this.words_all.length)];
        return word_return;
    }

    collect_words() {
        const words_tmp = [];
        const words_return = {};
        for (let i = 1; i <= this.count; i++) {
            while (true) {
                const word_tmp = this.random_word(this.words_all)
                if (!words_tmp.includes(word_tmp)) {
                    words_tmp.push(word_tmp);
                    break
                }
            }
        }
        words_tmp.forEach(word => {
            words_return[word] = [];
            let distance = 3;
            for (let i = 0; i <= 2; i++) {
                let tries = 0
                while (true) {
                    const word_rnd = this.find_levenshtein(word, distance);
                    if (tries % 10 === 0) {
                        distance += 1;
                    } else if (tries > 100) {
                        words_return[word].push(word_rnd)
                        break
                    }
                    if (!words_return[word].includes(word_rnd)) {
                        words_return[word].push(word_rnd)
                        break
                    }
                    tries += 1
                }
            }
        })
        return words_return;
    }

    camelCase() {
        let words_tmp = [...this.words].map((val, i) => {
            if (i > 0) {
                return val.substring(0, 1).toUpperCase() + val.substring(1)
            } else {
                return val
            }
        })
        console.log(this.words)
        return words_tmp.join("")
    }

    snake_case() {
        return this.words.join("_")
    }

    // monkeyfind
    find_levenshtein(word, distance) {
        const length = this.words_grouped[word.length].length
        while (true) {
            const word_rnd = this.words_grouped[word.length][Math.floor(Math.random() * length)]
            if (this.levenshtein(word, word_rnd) <= distance) {
                return word_rnd
            }
        }
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
