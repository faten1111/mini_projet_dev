// Vérification syntaxique des fichiers JavaScript du projet
const vm = require('vm'), fs = require('fs');
let errors = 0;
for (const f of ['questions.js', 'script.js']) {
    const src = fs.readFileSync(f, 'utf8');
    try {
        new vm.Script(src, { filename: f });
        console.log(`✔ ${f}   ${src.split('\n').length} lignes   ${Buffer.byteLength(src)} octets   Valid JavaScript — parses cleanly`);
    } catch (e) { errors++; console.log(`✘ ${f} : ${e.message}`); }
}
console.log(`\n2 fichiers analysés — ${errors} erreur`);
