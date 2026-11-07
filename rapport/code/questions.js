'use strict';

/* ========================================================
   BANQUE DE QUESTIONS
   --------------------------------------------------------
   type    : "qcm" (4 réponses) ou "vf" (Vrai / Faux)
   level   : 1 = facile, 2 = moyen, 3 = difficile
   correct : index de la bonne réponse dans "answers"
             (pour "vf" : 0 = Vrai, 1 = Faux)
   explain : courte explication affichée après la réponse
   ======================================================== */
const CATEGORIES = {
    histoire: {
        name: "Histoire", icon: "^\texttwemoji{1f3db}^",
        questions: [
            { type: "qcm", level: 1, q: "En quelle année la Tunisie a-t-elle obtenu son indépendance ?",
              answers: ["1954", "1956", "1962", "1970"], correct: 1,
              explain: "L'indépendance a été proclamée le 20 mars 1956." },
            { type: "qcm", level: 1, q: "Qui a été le premier président de la République tunisienne ?",
              answers: ["Habib Bourguiba", "Zine El Abidine Ben Ali", "Mohamed V", "Ahmed Sékou Touré"], correct: 0,
              explain: "Habib Bourguiba est devenu président en 1957, à la proclamation de la République." },
            { type: "qcm", level: 1, q: "Quelle grande civilisation antique a fondé Carthage ?",
              answers: ["Les Romains", "Les Phéniciens", "Les Grecs", "Les Perses"], correct: 1,
              explain: "Carthage a été fondée par des Phéniciens venus de Tyr." },
            { type: "vf", level: 1, q: "Hannibal a traversé les Alpes avec des éléphants.",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "En 218 av. J.-C., Hannibal a franchi les Alpes avec son armée et des éléphants de guerre." },
            { type: "qcm", level: 2, q: "En quelle année la République tunisienne a-t-elle été proclamée ?",
              answers: ["1956", "1957", "1959", "1987"], correct: 1,
              explain: "La République a été proclamée le 25 juillet 1957, mettant fin à la monarchie beylicale." },
            { type: "qcm", level: 2, q: "Quelle ville a vu naître le soulèvement de la révolution tunisienne, en décembre 2010 ?",
              answers: ["Sidi Bouzid", "Gafsa", "Kasserine", "Sfax"], correct: 0,
              explain: "Le mouvement est parti de Sidi Bouzid. Le président Ben Ali a quitté le pays le 14 janvier 2011." },
            { type: "qcm", level: 2, q: "En quelle année le protectorat français a-t-il été établi en Tunisie ?",
              answers: ["1830", "1881", "1912", "1939"], correct: 1,
              explain: "Le traité du Bardo, signé en 1881, a instauré le protectorat français." },
            { type: "vf", level: 2, q: "La ville de Kairouan a été fondée au VIIe siècle.",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "Kairouan a été fondée vers 670 par Oqba ibn Nafi. C'est l'une des villes saintes de l'islam." },
            { type: "qcm", level: 2, q: "En 2015, quel prix Nobel a été attribué au Quartet du dialogue national tunisien ?",
              answers: ["Prix Nobel de la paix", "Prix Nobel de littérature", "Prix Nobel d'économie", "Prix Nobel de chimie"], correct: 0,
              explain: "Le Quartet a été récompensé pour son rôle dans la transition démocratique après 2011." },
            { type: "qcm", level: 3, q: "En quelle année Carthage a-t-elle été détruite par Rome ?",
              answers: ["264 av. J.-C.", "218 av. J.-C.", "202 av. J.-C.", "146 av. J.-C."], correct: 3,
              explain: "Carthage fut détruite en 146 av. J.-C., à la fin de la troisième guerre punique." },
            { type: "qcm", level: 3, q: "Selon la tradition, qui a fondé Carthage ?",
              answers: ["Hannibal", "Élissa (Didon)", "Scipion l'Africain", "Massinissa"], correct: 1,
              explain: "La légende attribue la fondation de Carthage à la princesse tyrienne Élissa, appelée Didon par les Romains." }
        ]
    },

    geographie: {
        name: "Géographie", icon: "^\texttwemoji{1f5fa}^",
        questions: [
            { type: "qcm", level: 1, q: "Quelle est la capitale de la Tunisie ?",
              answers: ["Sfax", "Sousse", "Tunis", "Bizerte"], correct: 2,
              explain: "Tunis est la capitale et la plus grande ville du pays." },
            { type: "qcm", level: 1, q: "Quels pays partagent une frontière terrestre avec la Tunisie ?",
              answers: ["L'Algérie et la Libye", "L'Algérie et le Maroc", "La Libye et l'Égypte", "Le Maroc et la Libye"], correct: 0,
              explain: "La Tunisie est bordée par l'Algérie à l'ouest et par la Libye au sud-est." },
            { type: "qcm", level: 1, q: "Quelle mer borde les côtes nord et est de la Tunisie ?",
              answers: ["La mer Méditerranée", "La mer Rouge", "L'océan Atlantique", "La mer Noire"], correct: 0,
              explain: "Toutes les côtes tunisiennes donnent sur la Méditerranée." },
            { type: "qcm", level: 2, q: "Quel est le point culminant de la Tunisie ?",
              answers: ["Djebel Chambi", "Djebel Zaghouan", "Djebel Boukornine", "Djebel Semmama"], correct: 0,
              explain: "Le Djebel Chambi, près de Kasserine, culmine à environ 1 544 m." },
            { type: "vf", level: 2, q: "Djerba est la plus grande île d'Afrique du Nord.",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "Djerba, dans le golfe de Gabès, est généralement citée comme la plus grande île d'Afrique du Nord." },
            { type: "qcm", level: 2, q: "Quel est le plus long cours d'eau de Tunisie ?",
              answers: ["La Medjerda", "Le Miliane", "Le Zeroud", "La Nebhana"], correct: 0,
              explain: "La Medjerda traverse le nord-ouest du pays et se jette dans le golfe de Tunis." },
            { type: "qcm", level: 2, q: "Combien de gouvernorats compte la Tunisie ?",
              answers: ["18", "24", "26", "30"], correct: 1,
              explain: "La Tunisie est divisée en 24 gouvernorats." },
            { type: "qcm", level: 2, q: "Quelle est la deuxième plus grande ville de Tunisie ?",
              answers: ["Sfax", "Sousse", "Kairouan", "Bizerte"], correct: 0,
              explain: "Sfax est la deuxième agglomération du pays, après Tunis." },
            { type: "vf", level: 2, q: "Le Chott el-Djerid est un grand lac salé du sud tunisien.",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "Le Chott el-Djerid est le plus grand lac salé du Sahara, entre Tozeur et Kébili." },
            { type: "qcm", level: 3, q: "Où se trouve le point le plus septentrional du continent africain ?",
              answers: ["Ras Angela (région de Bizerte)", "Cap Bon (région de Nabeul)", "Tabarka (région de Jendouba)", "Ras Kapoudia (région de Mahdia)"], correct: 0,
              explain: "Ras Angela (Ras Ben Sakka), près de Bizerte, est le point le plus au nord de l'Afrique." }
        ]
    },

    informatique: {
        name: "Informatique", icon: "^\texttwemoji{1f4bb}^",
        questions: [
            { type: "qcm", level: 1, q: "Quel langage est principalement utilisé pour rendre une page web interactive côté navigateur ?",
              answers: ["Python", "JavaScript", "C++", "SQL"], correct: 1,
              explain: "JavaScript s'exécute dans le navigateur et gère l'interactivité des pages." },
            { type: "qcm", level: 1, q: "Que signifie HTML ?",
              answers: ["HyperText Markup Language", "High Tech Modern Language", "Hyper Tool Markup Language", "Hyperlinks Text Markup Language"], correct: 0,
              explain: "HTML est le langage de balisage qui structure le contenu des pages web." },
            { type: "vf", level: 1, q: "Le CSS sert à structurer le contenu d'une page (titres, paragraphes, listes).",
              answers: ["Vrai", "Faux"], correct: 1,
              explain: "C'est le HTML qui structure le contenu. Le CSS s'occupe de la mise en forme (couleurs, polices, disposition)." },
            { type: "qcm", level: 1, q: "Que signifie CSS ?",
              answers: ["Cascading Style Sheets", "Computer Style Systems", "Creative Style Syntax", "Colorful Style Sheets"], correct: 0,
              explain: "CSS signifie « feuilles de style en cascade »." },
            { type: "qcm", level: 2, q: "Quelle balise HTML sert à créer un lien hypertexte ?",
              answers: ["<link>", "<a>", "<href>", "<url>"], correct: 1,
              explain: "La balise <a> (anchor) crée un lien, avec l'attribut href pour la destination." },
            { type: "qcm", level: 2, q: "Que signifie HTTP ?",
              answers: ["HyperText Transfer Protocol", "High Transfer Text Process", "HyperText Transmission Program", "Host Transfer Task Protocol"], correct: 0,
              explain: "HTTP est le protocole de communication utilisé par le Web." },
            { type: "vf", level: 2, q: "Java et JavaScript sont le même langage.",
              answers: ["Vrai", "Faux"], correct: 1,
              explain: "Ce sont deux langages distincts, malgré la ressemblance des noms." },
            { type: "vf", level: 2, q: "Git est un outil de gestion de versions.",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "Git permet de suivre l'historique des modifications d'un projet et de collaborer." },
            { type: "qcm", level: 2, q: "Combien de bits contient un octet ?",
              answers: ["4", "8", "16", "32"], correct: 1,
              explain: "Un octet est composé de 8 bits." },
            { type: "qcm", level: 3, q: "Que signifie SQL ?",
              answers: ["Structured Query Language", "Simple Question Language", "System Quality Logic", "Standard Query Library"], correct: 0,
              explain: "SQL est le langage standard pour interroger et manipuler les bases de données relationnelles." }
        ]
    },

    comedie: {
        name: "Comédie", icon: "^\texttwemoji{1f3ad}^",
        questions: [
            { type: "vf", level: 1, q: "Le Festival international de Carthage accueille uniquement des spectacles d'humour.",
              answers: ["Vrai", "Faux"], correct: 1,
              explain: "Le festival programme de la musique, du théâtre, de la danse et de l'humour." },
            { type: "qcm", level: 1, q: "Comment appelle-t-on un spectacle d'humour joué par un seul artiste sur scène ?",
              answers: ["Un one-man-show", "Un opéra", "Une comédie musicale", "Un ballet"], correct: 0,
              explain: "Le one-man-show (ou seul-en-scène) repose sur un unique interprète." },
            { type: "qcm", level: 1, q: "Quel est le surnom français du célèbre personnage de Charlie Chaplin ?",
              answers: ["Charlot", "Pierrot", "Guignol", "Arlequin"], correct: 0,
              explain: "En France, le vagabond de Chaplin est connu sous le nom de Charlot." },
            { type: "qcm", level: 1, q: "Les Journées cinématographiques de Carthage sont un festival dédié à quel art ?",
              answers: ["Le cinéma", "La danse", "La peinture", "La poésie"], correct: 0,
              explain: "Les JCC, créées en 1966, sont l'un des plus anciens festivals de cinéma d'Afrique et du monde arabe." },
            { type: "qcm", level: 2, q: "Quel festival tunisien est consacré au théâtre ?",
              answers: ["Les Journées théâtrales de Carthage", "Les Journées cinématographiques de Carthage", "Le Festival de la Médina", "Le Festival du Sahara"], correct: 0,
              explain: "Les Journées théâtrales de Carthage (JTC) sont le grand rendez-vous théâtral tunisien." },
            { type: "qcm", level: 2, q: "De quel pays est originaire l'humoriste Fellag ?",
              answers: ["L'Algérie", "La Tunisie", "Le Maroc", "L'Égypte"], correct: 0,
              explain: "Mohamed Fellag est un humoriste et écrivain algérien, installé en France." },
            { type: "qcm", level: 2, q: "Dans quelle ville est né l'humoriste et acteur Michel Boujenah ?",
              answers: ["Tunis", "Paris", "Alger", "Casablanca"], correct: 0,
              explain: "Michel Boujenah est né à Tunis en 1952 avant de faire carrière en France." },
            { type: "vf", level: 2, q: "Charlie Chaplin a réalisé le film « Le Dictateur » (1940).",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "Chaplin a réalisé, écrit et joué dans ce film, satire du nazisme." },
            { type: "qcm", level: 3, q: "Dans quel type de site antique se déroulent les concerts du Festival international de Carthage ?",
              answers: ["Le théâtre romain de Carthage", "Le port punique", "Les thermes d'Antonin", "Le tophet"], correct: 0,
              explain: "Le festival se tient dans le théâtre romain de Carthage." }
        ]
    },

    culture: {
        name: "Culture générale", icon: "^\texttwemoji{1f1f9-1f1f3}^",
        questions: [
            { type: "qcm", level: 1, q: "Quel plat emblématique du Maghreb est à base de semoule ?",
              answers: ["Le couscous", "Le brik", "Le lablabi", "La mloukhia"], correct: 0,
              explain: "Le couscous, à base de semoule de blé, est classé au patrimoine immatériel de l'UNESCO (2020)." },
            { type: "qcm", level: 1, q: "Quelle est la monnaie officielle de la Tunisie ?",
              answers: ["Dirham", "Dinar tunisien", "Livre", "Euro"], correct: 1,
              explain: "Le dinar tunisien (TND) est la monnaie nationale." },
            { type: "vf", level: 1, q: "La harissa est une pâte à base de piments.",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "La harissa est préparée avec des piments, de l'ail, des épices et de l'huile d'olive." },
            { type: "qcm", level: 1, q: "Quelles sont les couleurs du drapeau tunisien ?",
              answers: ["Rouge et blanc", "Vert et blanc", "Rouge et noir", "Bleu et blanc"], correct: 0,
              explain: "Le drapeau est rouge, avec un disque blanc contenant un croissant et une étoile rouges." },
            { type: "qcm", level: 1, q: "Quelle fleur est l'un des symboles de la Tunisie ?",
              answers: ["Le jasmin", "La rose", "La tulipe", "Le lotus"], correct: 0,
              explain: "La Tunisie est surnommée « le pays du jasmin »." },
            { type: "qcm", level: 1, q: "Quel plat est une fine feuille de pâte frite, fourrée d'un œuf et souvent de thon ?",
              answers: ["Le brik", "Le lablabi", "L'ojja", "Le makroudh"], correct: 0,
              explain: "Le brik est un incontournable de la cuisine tunisienne, surtout pendant le ramadan." },
            { type: "vf", level: 1, q: "Sidi Bou Saïd est célèbre pour ses maisons blanches aux portes et fenêtres bleues.",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "Ce village perché au-dessus du golfe de Tunis est connu pour son architecture blanche et bleue." },
            { type: "vf", level: 2, q: "Le site archéologique de Dougga est classé au patrimoine mondial de l'UNESCO.",
              answers: ["Vrai", "Faux"], correct: 0,
              explain: "Dougga est classé depuis 1997. C'est l'un des sites romains les mieux conservés d'Afrique du Nord." },
            { type: "qcm", level: 2, q: "Dans quelle ville se trouve un amphithéâtre romain parmi les mieux conservés au monde, classé à l'UNESCO ?",
              answers: ["El Jem", "Sousse", "Dougga", "Kairouan"], correct: 0,
              explain: "L'amphithéâtre d'El Jem, construit au IIIe siècle, pouvait accueillir des dizaines de milliers de spectateurs." },
            { type: "qcm", level: 2, q: "Comment appelle-t-on le dialecte arabe parlé en Tunisie ?",
              answers: ["Le tunisien (derja)", "Le hassaniya", "Le kabyle", "Le maltais"], correct: 0,
              explain: "Le tunisien, ou « derja », est la langue du quotidien, à côté de l'arabe standard et du français." }
        ]
    }
};