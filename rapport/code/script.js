'use strict';

/* ========================================================
   1. CONFIGURATION
   (les catégories et questions sont dans questions.js)
   ======================================================== */
const DIFFICULTIES = {
    facile:    { label: "Facile",    time: 20, points: 100, level: 1 },
    moyen:     { label: "Moyen",     time: 15, points: 150, level: 2 },
    difficile: { label: "Difficile", time: 10, points: 250, level: 3 }
};

const QUESTIONS_PER_GAME = 5;
const MIXED_KEY = 'tous';
const MIXED_CATEGORY = { name: "Toutes catégories", icon: "^\texttwemoji{1f3b2}^" };
const KEY_SEPARATOR = '|'; // séparateur sûr pour "categorie|difficulte"

function getCategory(key) {
    return key === MIXED_KEY ? MIXED_CATEGORY : CATEGORIES[key];
}

/* ========================================================
   2. CLASSE : Gestion du stockage (localStorage)
   ======================================================== */
class ScoreManager {
    constructor() {
        this.storageKey = 'quizTunisieScores_v4';
    }

    getBestScores() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            const data = raw ? JSON.parse(raw) : {};
            return (data && typeof data === 'object') ? data : {};
        } catch (err) {
            // Données corrompues ou stockage indisponible
            return {};
        }
    }

    saveBestScore(categoryKey, difficultyKey, score) {
        const scores = this.getBestScores();
        const fullKey = `${categoryKey}${KEY_SEPARATOR}${difficultyKey}`;
        const currentBest = scores[fullKey] || 0;

        if (score > currentBest) {
            scores[fullKey] = score;
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(scores));
            } catch (err) {
                return false;
            }
            return true;
        }
        return false;
    }

    reset() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (err) { /* ignoré */ }
    }
}

/* ========================================================
   3. CLASSE : Chronomètre (avec pause / reprise)
   ======================================================== */
class QuizTimer {
    constructor(onTick, onEnd) {
        this.timeLeft = 0;
        this.onTick = onTick;
        this.onEnd = onEnd;
        this.intervalId = null;
    }

    start(duration) {
        this.stop();
        this.timeLeft = duration;
        this.onTick(this.timeLeft);
        this.run();
    }

    run() {
        if (this.intervalId) return;
        this.intervalId = setInterval(() => {
            this.timeLeft--;
            this.onTick(this.timeLeft);
            if (this.timeLeft <= 0) {
                this.stop();
                this.onEnd();
            }
        }, 1000);
    }

    /* Met en pause en conservant le temps restant */
    pause() {
        this.stop();
    }

    /* Reprend là où le chrono s'était arrêté (et non à zéro) */
    resume() {
        if (this.timeLeft > 0) this.run();
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

/* ========================================================
   4. CLASSE PRINCIPALE : Le Quiz
   ======================================================== */
class QuizGame {
    constructor() {
        this.scoreManager = new ScoreManager();
        this.timer = new QuizTimer(
            (time) => this.updateTimerUI(time),
            () => this.handleTimeout()
        );

        // Choix du joueur
        this.difficultyKey = 'moyen';

        // État de la partie en cours (figé au démarrage)
        this.categoryKey = null;
        this.activeDifficulty = 'moyen';
        this.maxTime = DIFFICULTIES.moyen.time;
        this.basePoints = DIFFICULTIES.moyen.points;
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.mistakes = [];
        this.isAnswered = false;

        this.cacheDOM();
        this.bindEvents();
        this.renderCategories();
        this.displayBestScores();
    }

    /* --- Initialisation & DOM --- */
    cacheDOM() {
        const $ = (id) => document.getElementById(id);
        this.screens = {
            welcome: $('welcome-screen'),
            category: $('category-screen'),
            quiz: $('quiz-screen'),
            result: $('result-screen')
        };
        this.els = {
            startBtn: $('start-btn'),
            backHomeBtn: $('back-home-btn'),
            categoriesGrid: $('categories-grid'),
            categoryBadge: $('category-badge'),
            difficultyBadge: $('difficulty-badge'),
            questionText: $('question-text'),
            answersContainer: $('answers-container'),
            explanation: $('explanation'),
            questionCounter: $('question-counter'),
            scoreDisplay: $('score-display'),
            progressBar: $('progress-bar'),
            progressFill: $('progress-fill'),
            timerText: $('timer-text'),
            timerBox: document.querySelector('.timer'),
            timeFill: $('time-fill'),
            nextBtn: $('next-btn'),
            quitBtn: $('quit-btn'),
            finalScoreValue: $('final-score-value'),
            resultCategory: $('result-category'),
            resultMessage: $('result-message'),
            correctCount: $('correct-count'),
            wrongCount: $('wrong-count'),
            percentage: $('percentage'),
            replayCategoryBtn: $('replay-category-btn'),
            changeCategoryBtn: $('change-category-btn'),
            bestScoresContainer: $('best-scores-container'),
            bestScoresList: $('best-scores-list'),
            resetScoresBtn: $('reset-scores-btn'),
            newRecordMsg: $('new-record-msg'),
            reviewContainer: $('review-container'),
            reviewList: $('review-list'),
            diffBtns: document.querySelectorAll('.diff-btn')
        };
    }

    bindEvents() {
        this.els.startBtn.addEventListener('click', () => this.showScreen('category'));
        this.els.backHomeBtn.addEventListener('click', () => this.showScreen('welcome'));
        this.els.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.els.quitBtn.addEventListener('click', () => this.quitGame());
        this.els.replayCategoryBtn.addEventListener('click', () => this.startGame(this.categoryKey));
        this.els.changeCategoryBtn.addEventListener('click', () => this.showScreen('category'));

        this.els.resetScoresBtn.addEventListener('click', () => {
            if (window.confirm("Effacer tous vos meilleurs scores ?")) {
                this.scoreManager.reset();
                this.displayBestScores();
            }
        });

        // Boutons de difficulté (avec état ARIA)
        this.els.diffBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.els.diffBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
                this.difficultyKey = btn.dataset.diff;
            });
        });

        // Pause du chrono si l'onglet est masqué, reprise (sans remise à zéro) au retour
        document.addEventListener('visibilitychange', () => {
            const inQuestion = this.screens.quiz.classList.contains('active') && !this.isAnswered;
            if (!inQuestion) return;
            if (document.hidden) this.timer.pause();
            else this.timer.resume();
        });

        // Raccourcis clavier : 1-4 ou A-D pour répondre (Entrée active "Suivante", déjà focalisé)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (!this.screens.quiz.classList.contains('active') || this.isAnswered) return;

            const key = e.key.toUpperCase();
            let index = '1234'.indexOf(key);
            if (index === -1) index = 'ABCD'.indexOf(key);
            if (index === -1) return;

            const buttons = this.els.answersContainer.querySelectorAll('.answer-btn');
            if (buttons[index]) buttons[index].click();
        });
    }

    showScreen(name) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[name].classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (name === 'welcome') this.displayBestScores();
    }

    quitGame() {
        if (!window.confirm("Quitter le quiz ? Votre progression sera perdue.")) return;
        this.timer.stop();
        this.showScreen('category');
    }

    /* --- Meilleurs scores --- */
    displayBestScores() {
        const scores = this.scoreManager.getBestScores();
        const entries = Object.entries(scores).filter(([fullKey]) => {
            const [catKey, diffKey] = fullKey.split(KEY_SEPARATOR);
            return getCategory(catKey) && DIFFICULTIES[diffKey];
        });

        if (entries.length === 0) {
            this.els.bestScoresContainer.classList.add('hidden');
            return;
        }

        this.els.bestScoresContainer.classList.remove('hidden');
        this.els.bestScoresList.textContent = '';

        entries.forEach(([fullKey, value]) => {
            const [catKey, diffKey] = fullKey.split(KEY_SEPARATOR);
            const cat = getCategory(catKey);
            const li = document.createElement('li');
            li.textContent = `${cat.icon} ${cat.name} (${DIFFICULTIES[diffKey].label}) : ${value} pts`;
            this.els.bestScoresList.appendChild(li);
        });
    }

    /* --- Rendu des catégories --- */
    renderCategories() {
        this.els.categoriesGrid.textContent = '';

        const entries = [
            [MIXED_KEY, MIXED_CATEGORY],
            ...Object.entries(CATEGORIES)
        ];

        entries.forEach(([key, cat]) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'category-tile';

            const icon = document.createElement('span');
            icon.className = 'cat-icon';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = cat.icon;

            const name = document.createElement('span');
            name.className = 'cat-name';
            name.textContent = cat.name;

            btn.append(icon, name);
            btn.addEventListener('click', () => this.startGame(key));
            this.els.categoriesGrid.appendChild(btn);
        });
    }

    updateTimerUI(time) {
        this.els.timerText.textContent = `${time}s`;
        this.els.timeFill.style.width = `${Math.max(0, (time / this.maxTime) * 100)}%`;

        this.els.timerBox.classList.remove('warning', 'danger');
        // Alertes à 50 % et 20 % du temps total
        if (time <= this.maxTime * 0.2) {
            this.els.timerBox.classList.add('danger');
        } else if (time <= this.maxTime * 0.5) {
            this.els.timerBox.classList.add('warning');
        }
    }

    /* --- Logique du jeu --- */
    startGame(categoryKey) {
        const diff = DIFFICULTIES[this.difficultyKey];

        // On fige les paramètres de la partie
        this.categoryKey = categoryKey;
        this.activeDifficulty = this.difficultyKey;
        this.maxTime = diff.time;
        this.basePoints = diff.points;

        this.currentIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.mistakes = [];
        this.isAnswered = false;

        const pool = categoryKey === MIXED_KEY
            ? Object.values(CATEGORIES).flatMap(c => c.questions)
            : CATEGORIES[categoryKey].questions;
        this.questions = this.pickQuestions(pool);

        const cat = getCategory(categoryKey);
        this.els.categoryBadge.textContent = `${cat.icon} ${cat.name}`;
        this.els.difficultyBadge.textContent = diff.label;
        this.els.difficultyBadge.className = `difficulty-badge diff-${this.activeDifficulty}`;

        this.showScreen('quiz');
        this.renderQuestion();
    }

    /* Choisit des questions dont le niveau est le plus proche de la difficulté demandée */
    pickQuestions(pool) {
        const target = DIFFICULTIES[this.activeDifficulty].level;
        const selected = this.shuffleArray(pool)
            .map(q => ({ q, gap: Math.abs((q.level || 2) - target) }))
            .sort((a, b) => a.gap - b.gap)
            .slice(0, QUESTIONS_PER_GAME)
            .map(item => item.q);
        return this.shuffleArray(selected);
    }

    renderQuestion() {
        const q = this.questions[this.currentIndex];
        this.isAnswered = false;

        this.els.questionCounter.textContent = `Question ${this.currentIndex + 1} / ${this.questions.length}`;
        this.els.scoreDisplay.textContent = `Score : ${this.score} pts`;

        const progress = (this.currentIndex / this.questions.length) * 100;
        this.els.progressFill.style.width = `${progress}%`;
        this.els.progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));

        this.els.questionText.textContent = q.q;

        // Relance l'animation CSS pour la nouvelle question
        this.els.questionText.style.animation = 'none';
        this.els.answersContainer.style.animation = 'none';
        void this.els.questionText.offsetWidth; // force le reflow
        this.els.questionText.style.animation = '';
        this.els.answersContainer.style.animation = '';

        // Réponses : mélangées pour les QCM, ordre fixe (Vrai puis Faux) pour les Vrai/Faux
        const indexed = q.answers.map((text, i) => ({ text, isCorrect: i === q.correct }));
        const ordered = q.type === 'vf' ? indexed : this.shuffleArray(indexed);

        this.els.answersContainer.textContent = '';
        const letters = ['A', 'B', 'C', 'D'];

        ordered.forEach((item, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'answer-btn';
            btn.dataset.correct = String(item.isCorrect);

            const letter = document.createElement('span');
            letter.className = 'answer-letter';
            letter.setAttribute('aria-hidden', 'true');
            letter.textContent = letters[idx];

            const label = document.createElement('span');
            label.textContent = item.text;

            btn.append(letter, label);
            btn.addEventListener('click', () => this.handleAnswer(btn, item.isCorrect, item.text));
            this.els.answersContainer.appendChild(btn);
        });

        this.els.explanation.classList.add('hidden');
        this.els.explanation.textContent = '';
        this.els.nextBtn.classList.add('hidden');

        this.timer.start(this.maxTime);
    }

    showExplanation(q) {
        if (!q.explain) return;
        this.els.explanation.textContent = `^\texttwemoji{1f4a1}^ ${q.explain}`;
        this.els.explanation.classList.remove('hidden');
    }

    handleAnswer(clickedBtn, isCorrect, chosenText) {
        if (this.isAnswered) return;
        this.isAnswered = true;
        this.timer.stop();

        const q = this.questions[this.currentIndex];
        const buttons = this.els.answersContainer.querySelectorAll('.answer-btn');
        buttons.forEach(btn => { btn.disabled = true; });

        if (isCorrect) {
            clickedBtn.classList.add('correct');
            this.correctCount++;

            // Points de base + bonus de rapidité (jusqu'à +50 % si réponse immédiate)
            const ratio = this.timer.timeLeft / this.maxTime;
            const pointsEarned = Math.round(this.basePoints * (1 + 0.5 * ratio));
            this.score += pointsEarned;
            this.els.scoreDisplay.textContent = `Score : ${this.score} pts`;
        } else {
            clickedBtn.classList.add('wrong');
            this.wrongCount++;
            buttons.forEach(btn => {
                if (btn.dataset.correct === 'true') btn.classList.add('correct');
            });
            this.mistakes.push({
                question: q.q,
                chosen: chosenText,
                correct: q.answers[q.correct],
                explain: q.explain
            });
        }

        this.showExplanation(q);
        this.els.nextBtn.classList.remove('hidden');
        this.els.nextBtn.focus();
    }

    handleTimeout() {
        if (this.isAnswered) return;
        this.isAnswered = true;
        this.wrongCount++;

        const q = this.questions[this.currentIndex];
        const buttons = this.els.answersContainer.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.correct === 'true') btn.classList.add('correct');
        });

        this.mistakes.push({
            question: q.q,
            chosen: null, // temps écoulé
            correct: q.answers[q.correct],
            explain: q.explain
        });

        this.showExplanation(q);
        this.els.nextBtn.classList.remove('hidden');
        this.els.nextBtn.focus();
    }

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex >= this.questions.length) {
            this.els.progressFill.style.width = '100%';
            this.els.progressBar.setAttribute('aria-valuenow', '100');
            setTimeout(() => this.showResults(), 300);
        } else {
            this.renderQuestion();
        }
    }

    showResults() {
        this.timer.stop();
        const total = this.questions.length;
        const percentage = Math.round((this.correctCount / total) * 100);

        // Record par catégorie ET par difficulté
        const isRecord = this.scoreManager.saveBestScore(this.categoryKey, this.activeDifficulty, this.score);
        this.els.newRecordMsg.classList.toggle('hidden', !isRecord);

        this.els.finalScoreValue.textContent = this.score;
        this.els.correctCount.textContent = this.correctCount;
        this.els.wrongCount.textContent = this.wrongCount;
        this.els.percentage.textContent = `${percentage}%`;

        const cat = getCategory(this.categoryKey);
        this.els.resultCategory.textContent =
            `${cat.icon} ${cat.name} - Niveau ${DIFFICULTIES[this.activeDifficulty].label}`;

        let msg;
        if (percentage === 100) msg = '^\texttwemoji{1f3c6}^ Parfait ! Vous maîtrisez le sujet !';
        else if (percentage >= 80) msg = '^\texttwemoji{1f31f}^ Excellent travail !';
        else if (percentage >= 60) msg = '^\texttwemoji{1f44d}^ Bien joué, continuez comme ça !';
        else if (percentage >= 40) msg = '^\texttwemoji{1f4aa}^ Pas mal, encore un effort !';
        else msg = '^\texttwemoji{1f4da}^ Continuez à vous entraîner !';
        this.els.resultMessage.textContent = msg;

        this.renderReview();
        this.showScreen('result');
    }

    /* Récapitulatif des questions ratées */
    renderReview() {
        this.els.reviewList.textContent = '';

        if (this.mistakes.length === 0) {
            this.els.reviewContainer.classList.add('hidden');
            return;
        }

        this.mistakes.forEach(m => {
            const li = document.createElement('li');

            const question = document.createElement('strong');
            question.textContent = m.question;

            const yours = document.createElement('span');
            yours.className = 'review-yours';
            yours.textContent = m.chosen === null
                ? '^\texttwemoji{23f1}^ Temps écoulé'
                : `^\ding{55}^ Votre réponse : ${m.chosen}`;

            const good = document.createElement('span');
            good.className = 'review-good';
            good.textContent = `^$\checkmark$^ Bonne réponse : ${m.correct}`;

            li.append(question, yours, good);

            if (m.explain) {
                const note = document.createElement('span');
                note.className = 'review-explain';
                note.textContent = `^\texttwemoji{1f4a1}^ ${m.explain}`;
                li.appendChild(note);
            }

            this.els.reviewList.appendChild(li);
        });

        this.els.reviewContainer.classList.remove('hidden');
    }

    /* --- Utilitaires --- */
    shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }
}

/* ========================================================
   5. LANCEMENT DE L'APPLICATION
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
});