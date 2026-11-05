import type { TrainerSelection } from "@/lib/types";

export interface Topic {
  slug: string;
  title: string;
  heading: string;
  description: string;
  level: string;
  tenseIds: string[];
  mode?: TrainerSelection["mode"];
  practiceId?: string;
  intro: string;
  rules: { heading: string; text: string }[];
  examples: [string, string, string][];
  mistakes: string[];
  faq: { question: string; answer: string }[];
  related: string[];
}

export const topics: Topic[] = [
  {
    slug: "present-simple", title: "Present Simple: упражнения онлайн с проверкой и объяснениями",
    heading: "Present Simple: упражнения с ответами и проверкой",
    description: "30 упражнений на Present Simple: do/does, окончание -s, вопросы и отрицания. Короткое правило, проверка первого ответа и разбор ошибок онлайн.",
    level: "A1–A2", tenseIds: ["present_simple"],
    intro: "Present Simple нужен, когда мы говорим о привычках, регулярных событиях и общих фактах. В этой теме потренируй окончание -s, вспомогательные do и does, вопросы и отрицания. В наборе 30 разных заданий: короткую сессию можно повторить с новыми примерами.",
    rules: [
      { heading: "Утверждение: кто выполняет действие?", text: "После I, you, we и they ставим основную форму глагола: I work, they read. После he, she и it обычно добавляем -s: she works. После -sh, -ch, -s, -x обычно нужно -es: he watches. Если перед конечной y стоит согласная, получается -ies: study → studies. Особые формы: have → has, go → goes, do → does." },
      { heading: "Вопрос: Do или Does?", text: "С I, you, we, they начинаем вопрос с Do; с he, she, it — с Does. Смысловой глагол после них остаётся в основной форме: Does your brother play chess? В специальном вопросе сначала идёт вопросительное слово: Where does she work?" },
      { heading: "Отрицание: do not / does not + глагол", text: "С he, she, it используем does not; с остальными местоимениями — do not. Окончание -s у смыслового глагола уже не нужно: She does not drink coffee. В обычной речи do not сокращают до don't, does not — до doesn't." },
      { heading: "Не путай обычный глагол и to be", text: "У be собственные формы am, is и are. Для предложения She is tired не нужны do или does: вопрос Is she tired?, отрицание She is not tired. Для обычного действия схема другая: Does she work? Слова usually, often и every day помогают заметить регулярность, но сначала проверяй смысл предложения." },
    ],
    examples: [["Утверждение", "My brother reads before bed.", "Мой брат читает перед сном."], ["Отрицание", "My brother does not read on the bus.", "Мой брат не читает в автобусе."], ["Вопрос", "Does your brother read in English?", "Твой брат читает по-английски?"]],
    mistakes: ["She work → She works: в утверждении после she нужно -s.", "Does he likes it? → Does he like it?: после does нужна основная форма.", "She don't play → She doesn't play: с she выбираем does not.", "Do you are ready? → Are you ready?: с be не используем do."],
    faq: [
      { question: "Как выбрать do или does?", answer: "Does используем с he, she, it и одним человеком или предметом: Does Anna work? Do — с I, you, we, they и множественным числом: Do your friends work?" },
      { question: "Нужно ли -s после does?", answer: "Нет. В вопросе и отрицании грамматическую форму уже показывает does. Правильно: Does she play? и She does not play." },
      { question: "Как заниматься с этим тренажёром?", answer: "Начни с 6 вопросов без подсказок. После ответа прочитай разбор. Затем выбери обычную тренировку или вернись к ошибочным навыкам через режим «Слабые места»." },
    ], related: ["present-simple-vs-present-continuous", "to-be", "past-simple"],
  },
  {
    slug: "present-continuous", title: "Present Continuous: упражнения онлайн с ответами и проверкой",
    heading: "Present Continuous: упражнения на am, is, are и -ing",
    description: "30 упражнений на Present Continuous с проверкой: am/is/are, форма -ing, вопросы и отрицания. Правила, примеры и объяснение каждой ошибки.",
    level: "A1–A2", tenseIds: ["present_continuous"],
    intro: "Present Continuous помогает описать действие, которое происходит сейчас, или временную ситуацию вокруг настоящего момента. В 30 заданиях этой темы нужно выбрать am/is/are, образовать -ing, задать вопрос или построить отрицание.",
    rules: [
      { heading: "Формула: am / is / are + V-ing", text: "После I ставим am, после he, she, it — is, после you, we, they — are. Затем идёт смысловой глагол с -ing: I am reading; she is reading; they are reading. Нельзя пропускать ни be, ни окончание: She reading и She is read не подходят." },
      { heading: "Вопрос и отрицание", text: "Для вопроса переставь форму be перед подлежащим: Are they waiting? Is he working? Для отрицания добавь not после be: They are not waiting. Вспомогательные do и does здесь не нужны. Специальный вопрос начинается с вопросительного слова: What are you doing?" },
      { heading: "Как присоединить -ing", text: "Чаще всего добавляем -ing: play → playing, read → reading. Конечную немую e обычно убираем: make → making, write → writing. В коротких глаголах с ударной гласной перед конечной согласной согласная может удваиваться: run → running, sit → sitting. Не удваиваем конечные w, x и y: snow → snowing." },
      { heading: "Сейчас, временно или обычно?", text: "Now, right now, at the moment и Look! часто сопровождают процесс в момент речи. Но Continuous может описывать и временный режим: She is working from home this week. Для постоянной привычки нужен Present Simple: She usually works in an office. Глаголы состояния вроде know и like в их обычных значениях чаще используются в Simple." },
    ],
    examples: [["Сейчас", "I am looking for my notebook.", "Я сейчас ищу свою тетрадь."], ["Отрицание", "She is not watching TV at the moment.", "Она сейчас не смотрит телевизор."], ["Вопрос", "Are you waiting for the teacher?", "Вы ждёте учителя?"]],
    mistakes: ["He playing → He is playing: добавь форму be.", "They is working → They are working: с they нужна are.", "Does she reading? → Is she reading?: вопрос строится с be.", "Makeing → Making: конечную немую e убираем перед -ing."],
    faq: [
      { question: "В чём разница между is и are?", answer: "Is используется с he, she, it и единственным числом. Are — с you, we, they и множественным числом. После I нужна am." },
      { question: "Всегда ли Present Continuous означает «прямо сейчас»?", answer: "Нет. Он также может описывать временную ситуацию в текущий период, например работу из дома на этой неделе. У этого времени есть и другие употребления, но здесь мы тренируем текущие процессы и временные ситуации." },
      { question: "Можно ли сравнить его с Present Simple?", answer: "Да. Перейди к смешанным упражнениям Present Simple vs Present Continuous: там нужно выбрать форму по контексту, а не только образовать -ing." },
    ], related: ["present-simple-vs-present-continuous", "present-simple", "to-be"],
  },
  {
    slug: "past-simple", title: "Past Simple: упражнения с ответами и проверкой онлайн",
    heading: "Past Simple: упражнения на прошедшее время",
    description: "30 упражнений на Past Simple: did, was/were, правильные и неправильные глаголы. Проверка ответов онлайн, короткие правила и разбор ошибок.",
    level: "A1–A2", tenseIds: ["past_simple"],
    intro: "Past Simple описывает завершённые события и состояния в прошлом. Здесь 30 заданий на вторую форму глагола, вопросы с did, отрицания с did not и формы was/were. Сначала попробуй короткую сессию, затем повтори правило, которое вызвало трудности.",
    rules: [
      { heading: "Утверждение: V2 или -ed", text: "У правильных глаголов добавляем -ed: open → opened. У неправильных нужна отдельная вторая форма: go → went, see → saw, buy → bought. В отличие от Present Simple форма смыслового глагола не меняется в зависимости от he, she или they: she worked, they worked." },
      { heading: "Вопрос: Did + подлежащее + V1", text: "Вопрос с обычным глаголом начинается с did. После него нужна основная форма: Did she call? Did they go? Для специального вопроса добавь вопросительное слово: When did you arrive? В таких вопросах не нужно второй раз показывать прошлое формой went или окончанием -ed." },
      { heading: "Отрицание: did not + V1", text: "После did not или didn't ставим исходную форму глагола: We did not see him. She didn't finish the task. Нельзя писать didn't saw или didn't finished: прошедшее время уже выражено словом did." },
      { heading: "Was и were — отдельная схема", text: "У be в прошлом две основные формы: was с I/he/she/it и were с you/we/they. Вопрос: Was she at home? Отрицание: They were not late. Did для этих предложений не нужен. Yesterday, last week и two days ago часто обозначают завершённое время; смысл прошлого может быть понятен и из контекста." },
    ],
    examples: [["Утверждение", "We visited the museum yesterday.", "Вчера мы посетили музей."], ["Отрицание", "We did not take a taxi.", "Мы не поехали на такси."], ["Вопрос", "Did you enjoy the visit?", "Тебе понравилось посещение?"]],
    mistakes: ["Did she went? → Did she go?: после did нужна V1.", "He didn't called → He didn't call: не добавляй -ed после didn't.", "They was tired → They were tired: с they выбираем were.", "Did he was at home? → Was he at home?: с be не нужен did."],
    faq: [
      { question: "Когда использовать did, а когда was или were?", answer: "Did помогает задать вопрос или построить отрицание с обычным глаголом: Did he work? Was и were — формы самого be: Was he tired? They were at school." },
      { question: "Какая форма глагола идёт после did?", answer: "Основная форма, V1: did go, did see, did work. Вопросы Did you went? и Did you worked? неверны." },
      { question: "Почему не всегда подходит Present Perfect?", answer: "Если указан завершённый момент вроде yesterday или in 2022, обычно нужен Past Simple. Для результата к настоящему и опыта без такого указания часто нужен Present Perfect. Сравнение есть в отдельной тренировке." },
    ], related: ["past-simple-vs-present-perfect", "to-be", "present-simple"],
  },
  {
    slug: "present-simple-vs-present-continuous", title: "Present Simple vs Present Continuous: упражнения с проверкой",
    heading: "Present Simple или Present Continuous: смешанные упражнения",
    description: "24 смешанных упражнения Present Simple vs Present Continuous: привычки, процессы сейчас и временные ситуации. Выбор формы по контексту и разбор ответа.",
    level: "A1–A2", tenseIds: ["present_simple", "present_continuous"], practiceId: "present-simple-vs-present-continuous",
    intro: "Оба времени говорят о настоящем, но показывают ситуацию по-разному. В этом наборе из 24 заданий нужно вставить форму по смыслу: регулярная привычка, общий факт, текущий процесс или временная ситуация. Подсказку можно открыть, если контекста пока недостаточно.",
    rules: [
      { heading: "Привычка и факт → Present Simple", text: "Для обычного режима и повторяющихся действий выбираем Simple: Ben takes the bus every morning. Для общеизвестного факта тоже нужен Simple: Water freezes at zero degrees Celsius. В вопросах с обычным глаголом используй do/does, в отрицаниях — do not/does not." },
      { heading: "Процесс и временная ситуация → Present Continuous", text: "Если действие разворачивается сейчас, нужна форма be + V-ing: Ben is taking a taxi right now. Временный режим тоже может выражаться через Continuous: He is working from home this week. Важно, как говорящий представляет ситуацию: как обычную или временную." },
      { heading: "Читай контекст, а не только отдельное слово", text: "Слова now, usually и every day помогают, но не заменяют понимание. Вопрос What do you do? обычно о работе или занятиях вообще, What are you doing? — о действии сейчас. С глаголами состояния есть ограничения: I know the answer, а не I am knowing the answer." },
      { heading: "Как получить полезный результат", text: "Сначала реши 6 вопросов без подсказок и прочитай объяснения после ответов. Если ошибаешься в формах am/is/are или do/does, повтори отдельную тему. Если формы понятны, но путается смысл, вернись к смешанной практике. Точность считается по первой отправленной попытке." },
    ],
    examples: [["Обычно", "She reads before bed.", "Она читает перед сном — это привычка."], ["Прямо сейчас", "She is reading on the sofa now.", "Она сейчас читает на диване — это процесс."], ["Временно", "She is staying with her aunt this week.", "Она живёт у тёти на этой неделе — временная ситуация."]],
    mistakes: ["I am knowing → I know: know в значении знания обычно не употребляется в Continuous.", "He working now → He is working now: у Continuous два элемента.", "Does she working? → Is she working?: не смешивай схемы двух времён.", "Every day и now — подсказки к смыслу, а не универсальный способ угадать форму."],
    faq: [
      { question: "Почему now не всегда требует Continuous?", answer: "Смысл и тип глагола важнее одного маркера. Например, I understand now описывает состояние понимания; в обычном употреблении здесь Simple." },
      { question: "Чем эта тренировка отличается от отдельных тем?", answer: "В отдельной теме известно, какое время строить. Здесь нужно сначала определить смысл ситуации, а затем выбрать подходящую форму из нескольких вариантов." },
    ], related: ["present-simple", "present-continuous", "to-be"],
  },
  {
    slug: "past-simple-vs-present-perfect", title: "Past Simple vs Present Perfect: упражнения с объяснениями",
    heading: "Past Simple или Present Perfect: упражнения на разницу",
    description: "24 упражнения Past Simple vs Present Perfect: завершённое прошлое, опыт, since/for и результат сейчас. Онлайн-проверка и объяснение выбора времени.",
    level: "A2–B1", tenseIds: ["past_simple", "present_perfect"], practiceId: "past-simple-vs-present-perfect",
    intro: "Оба времени могут относиться к уже произошедшему событию. Разница в том, как оно связано с настоящим и задан ли завершённый период в прошлом. В 24 заданиях нужно выбрать форму для конкретного контекста: yesterday, жизненный опыт, результат сейчас, since или for.",
    rules: [
      { heading: "Завершённое прошлое → Past Simple", text: "Если важно, когда произошло событие в закончившемся периоде, обычно нужен Past Simple: I visited Rome in 2022. Слова yesterday, last month и two hours ago задают такой контекст. В вопросе используем did + V1: When did you start?" },
      { heading: "Связь с настоящим → Present Perfect", text: "Present Perfect строится как have/has + V3. Он может показывать актуальный результат: She has lost her keys, so she cannot open the door. Также он используется для опыта до настоящего момента: Have you ever tried skiing? Точное завершённое время при этом не называется." },
      { heading: "Since, for и незавершённый период", text: "Состояние, начавшееся раньше и продолжающееся сейчас, часто выражаем через Present Perfect: They have lived here since 2020. Since указывает начало, for — длительность. В выражениях so far this month или today период может ещё продолжаться. Но выбор зависит от контекста: говорящий может считать конкретную ситуацию уже завершённой." },
      { heading: "Не превращай разницу в механическое правило", text: "Past Simple тоже может описывать событие с результатом сейчас; употребление зависит от контекста и варианта английского. В этих упражнениях используются явные указатели завершённого времени и типичные учебные ситуации для Present Perfect. На странице не требуется угадывать единственный вариант там, где естественны оба." },
    ],
    examples: [["Когда именно", "I saw this film last weekend.", "Я посмотрел этот фильм в прошлые выходные."], ["Опыт", "I have seen this film before.", "Я уже видел этот фильм раньше."], ["До сих пор", "We have known each other for five years.", "Мы знакомы пять лет и продолжаем общаться."]],
    mistakes: ["I have seen him yesterday → I saw him yesterday: yesterday задаёт завершённое прошлое.", "Did you saw? → Did you see?: после did нужна V1.", "She has went → She has gone: после has нужна третья форма.", "Since five years → For five years: длительность вводится через for."],
    faq: [
      { question: "Можно ли использовать Present Perfect с yesterday?", answer: "В обычном предложении о событии вчера нужен Past Simple: I finished it yesterday. Present Perfect здесь не сочетается с прямым указанием такого завершённого времени." },
      { question: "Чем отличаются since и for?", answer: "Since указывает начальную точку: since 2020, since Monday. For обозначает длительность: for two years, for a week. Само слово for встречается с разными временами — нужно учитывать всю ситуацию." },
      { question: "Почему today бывает с разными временами?", answer: "Говорящий может рассматривать сегодняшний день как продолжающийся период или выделять уже завершённую ситуацию внутри него. Смотри на контекст, а не только на слово today." },
    ], related: ["past-simple", "present-simple-vs-present-continuous", "present-simple"],
  },
  {
    slug: "to-be", title: "To be: упражнения на am, is, are, was, were с проверкой",
    heading: "Глагол to be: упражнения на am, is, are, was и were",
    description: "16 упражнений на to be: am/is/are в настоящем и was/were в прошлом. Таблица форм, вопросы, отрицания и проверка ответов онлайн.",
    level: "A1", tenseIds: [], mode: "tobe_warmup",
    intro: "Глагол be нужен, чтобы сказать, кто человек, где он находится или в каком состоянии. Сначала различи настоящее и прошлое, затем посмотри на подлежащее. В наборе 16 вопросов; отдельная разминка выбирает 12 из них.",
    rules: [
      { heading: "Настоящее: I am, he/she/it is, you/we/they are", text: "Форма be зависит от того, о ком мы говорим: I am ready; she is ready; they are ready. В русском переводе отдельное слово «есть» часто пропадает, но в английском форму be нужно сохранить: My brother is at school." },
      { heading: "Прошлое: was и were", text: "После I, he, she и it в прошлом используем was; после you, we и they — were. Время подсказывает контекст: I was tired yesterday. We were at the library last week. Если речь о прошлом, не оставляй форму am/is/are." },
      { heading: "Вопрос и отрицание без do/did", text: "Для вопроса вынеси be перед подлежащим: Are you ready? Was she at home? Для отрицания добавь not: I am not late; they were not at school. С обычными утверждениями о состоянии или месте не нужны do, does и did." },
      { heading: "Be как часть другого времени", text: "В предложении She is reading форма is помогает построить Present Continuous, а reading называет действие. В предложении She is tired форма is связывает человека с состоянием. Если путаются is и are, начни с этой разминки, затем переходи к упражнениям на процессы." },
    ],
    examples: [["Сейчас", "I am ready. She is ready. They are ready.", "Я готов. Она готова. Они готовы."], ["В прошлом", "I was at home. We were at school.", "Я был дома. Мы были в школе."], ["Вопрос", "Were you tired yesterday?", "Ты вчера устал?"]],
    mistakes: ["I is → I am: после I в настоящем нужна am.", "They was → They were: с they в прошлом используем were.", "She not ready → She is not ready: не пропускай be.", "Did he was tired? → Was he tired?: с be вопрос строится без did."],
    faq: [
      { question: "Почему с you всегда are или were?", answer: "You сочетается с are в настоящем и were в прошлом независимо от того, обращаемся мы к одному человеку или нескольким." },
      { question: "Когда нужен do, а когда be?", answer: "Состояние или место часто описываются через be: Are you tired? Do используется с обычным глаголом в Present Simple: Do you work? Это разные схемы." },
      { question: "Разминка включает другие времена?", answer: "Отдельный режим to be содержит только задания на формы am, is, are, was и were. Для основной практики выбери отдельное время или вернись к общей таблице." },
    ], related: ["present-simple", "present-continuous", "past-simple"],
  },
];
export const topicMap = Object.fromEntries(topics.map((topic) => [topic.slug, topic]));
