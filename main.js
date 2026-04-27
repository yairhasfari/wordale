
//  !!   listOfWords is in wordlist.js, hebWords is in hebwords.js    !! //

////////* Variables: *///////

// did user win todays game:
//localStorage.clear();
//console.log(localStorage.getItem(alreadySentKey));
let win = false;
// did user finish todays game (win or lose):
let endOfGameToday = false;
//which try am i in?
let rowCount = 1;
//wordCount - which try am i after word was guessed:
let wordCount = 0;
//saves the letters in a string until word is sent:
let currentWord = '';
//array to save the colors of guessed words' letters
let answersColors = [];
//array to save the letter of guessed words
let answersLetters = [];
//numOfWordale is calculated later by the difference from today to the launch of wordale
let numOfWordale = 0;
// the launch date of wordale
const startDate = new Date(2022, 0, 11);
const summerClockStartDate = new Date(2022,2,26)
//today:
let today = new Date();
//word index is the numOfWordale calculated later on
let pickedWord = pickWord();
//set the timer for next wordale
countDownTimer();

//load statistics:
let guessDistribution;

const stats = {
1: 2,
2: 10,
3: 20,
4: 30,
5: 25,
6: 10,
fail: 3
};
const userGuess = 3;

function pickWord() {
// //This is for WinterClock, please uncomment differenceInTime equation and also differenceInDays equation.
// var differenceInTime = today.getTime() - startDate.getTime();
// // To calculate the no. of days between two dates
// var differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); //added 74 since it screwed the 1 hour difference between gmt+3 and gmt+2; 
 //This is for SummerClock, please uncomment differenceInTime equation and also differenceInDays equation.
   
var differenceInTime = today.getTime() - summerClockStartDate.getTime();
var differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)) + 74; //added 74 since it screwed the 1 hour difference between gmt+3 and gmt+2; 
numOfWordale = differenceInDays;

return listOfWords[differenceInDays];
}

function clickLetter(value) {
if(endOfGameToday!=true){
currentRow = document.getElementById(`row${rowCount}`)
for (let i = 1; i <= 5; i++) {
    let tile = `tile${rowCount}${i}`;
    if (document.getElementById(`${tile}`).innerHTML == '') {
        value = changeToFinal(value);
        currentWord += value;//add letter to currentWord
        document.getElementById(tile).setAttribute('data-animation', 'pop');
        document.getElementById(tile).style.border = "solid rgb(34, 34, 34)";
        document.getElementById(tile).innerHTML = value;//print letter in Tile
        break;
    }
}
}
}
function changeToFinal(value) {
if (currentWord.length === 4) {
    if (value === 'פ') { value = 'ף'; };
    if (value === 'נ') { value = 'ן'; };
    if (value === 'מ') { value = 'ם'; };
    if (value === 'כ') { value = 'ך'; };
    if (value === 'צ') { value = 'ץ'; };

}
return value;
}
function sendWord() {

if (win === false) {
    let x = checkSpell(currentWord);
    if (currentWord.length === 5) {
        if (checkSpell(currentWord)) {
            if (wordCount < 7) {
                wordCount++;
            }
            console.log("sendword");
            compareWords();//compares words and does the rest fills tiles accordingly
            rowCount++;
            answersLetters.push(currentWord);//keeps the word in answers array (not the colors)
            saveUserData();//saves answers to localStorage
            currentWord = '';//in order to start new word at next line
        } else {
            animateWakeUp();
            openNotification('המילה לא קיימת');
        }
    }
    else { //checks if there are enough letters
        animateWakeUp();
        openNotification("אין מספיק אותיות")
    }

}
}
function animateWakeUp() {
for (i = 1; i <= 5; i++) {
    setAnimation(i, 'wakeup');
    function setAnimation(k, animation) { 
        document.getElementById(`tile${rowCount}${i}`).classList.add(animation) 
    };
}
setTimeout(function () {
    for (j = 1; j <= 5; j++) {
            document.getElementById(`tile${rowCount}${j}`).setAttribute('data-animation','idle');
            document.getElementById(`tile${rowCount}${j}`).classList.remove('wakeup');}        
}, 800);
}
function openNotification(message) {
document.getElementById('notify').style.height = "5%";
document.getElementById('notify').innerHTML = message;

setTimeout(function () {
    document.getElementById('notify').style.height = "0%";
}, 2000);

}

function openNotificationLong(message, bool) {
document.getElementById('notify').style.height = "5%";
if (bool === true) {
    document.getElementById('notify').style.backgroundColor = "rgb(98, 159, 91)";
}
document.getElementById('notify').innerHTML = message;
}

function openShareNotificationLong() {
document.getElementById('notify2').style.height = "5%";
document.getElementById('notify2').style.visibility = "visible"; // הוסף שורה זו
document.getElementById('shareButton').style.visibility = "visible";
}


function eraseWord() {
currentWord = '';
if (wordCount <= rowCount) {
    for (let i = 1; i <= 5; i++) {
        let tile = `tile${rowCount}${i}`;
        document.getElementById(tile).innerHTML = '';
        document.getElementById(tile).setAttribute('data-animation', 'idle');
        document.getElementById(tile).style.border = "solid rgb(212, 212, 212)";
    }
}
}

function eraseLetter() {
if (currentWord != '') {
    let tile = `tile${rowCount}${currentWord.length}`;
    document.getElementById(tile).innerHTML = '';
    document.getElementById(tile).setAttribute('data-animation', 'idle');
    document.getElementById(tile).style.border = "solid rgb(212, 212, 212)";
    currentWord = currentWord.substring(0, currentWord.length - 1);

}
//     setInterval(removeAnimation('wakeup'),5000);
//     function removeAnimation(animation){ 
//         for (i=1;i<=5;i++){
//             document.getElementById(`tile${rowCount}${i}`).setAttribute('data-animation','idle');
//             document.getElementById(`tile${rowCount}${i}`).classList.remove(animation);
//         }
// };

}
function getCurrentDateKey() {
const today = new Date();
return `wordle-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}
function handleGameEnd(result) {
const gameDateKey = getCurrentDateKey();
const alreadySentKey = `resultSent-${gameDateKey}`;
console.log(alreadySentKey);
console.log(localStorage.getItem(alreadySentKey));
console.log("afterHandle"+ result);
if (localStorage.getItem(alreadySentKey)) {
    console.log("result"+result);
    console.log("Result already sent for this game.");
    return;
}
console.log(1111);
sendResultToFirebase(result);  // זו הפונקציה שאתה צריך לכתוב/השתמש בה
console.log(22222);
localStorage.setItem(alreadySentKey, "true");
notifyRakRegaDone();
}
function compareWords() {
let answer = [];
let newWord = '';
let greenIndices = [];
let yellowIndices = [];
let greyIndices = [];
let usedYellowIndices = [];
console.log(pickedWord);
for (i = 0; i <= 4; i++) {
    //if letter exists in place:
    if (compareLetters(currentWord[i], pickedWord[i])) {
        greenIndices.push(i);
    } else {
        newWord += pickedWord[i];
    }
}

for (i = 0; i <= 4; i++) {
    if (!greenIndices.includes(i)) {
        for (j = 0; j < newWord.length; j++) {
            if (compareLetters(currentWord[i], newWord[j])) {
                yellowIndices.push(i);
                newWord = newWord.slice(0, j) + newWord.slice(j + 1);
                break;
            }
        }
    }
}
for (i = 0; i <= 4; i++) {
    if (!yellowIndices.includes(i) && !(greenIndices.includes(i))) { //if letter exists anywhere else:
        greyIndices.push(i);
        //

    }
}
//splice used green ones from yelloweIndices:
for (i = 0; i < greenIndices.length; i++) {
    if (yellowIndices.includes(greenIndices[i])) {
        let x = yellowIndices.indexOf(greenIndices[i]);
        yellowIndices.splice(x, 1);
    }
}
//color grey indices:
for (i = 0; i < greyIndices.length; i++) {
    document.getElementById(`tile${wordCount}${greyIndices[i] + 1}`).setAttribute('data-animation', 'flip-in');
    document.getElementById(`tile${wordCount}${greyIndices[i] + 1}`).style.backgroundColor = "rgb(109, 113 ,115)";//gray
    document.getElementById(`tile${wordCount}${greyIndices[i] + 1}`).style.border = "solid rgb(109, 113 ,115)";//gray border
    paintFinalLetter(currentWord[greyIndices[i]], "rgb(109, 113 ,115)");
    answer.splice(greyIndices[i], 0, '⬜');

}
//color yellow indices:
for (i = 0; i < yellowIndices.length; i++) {
    document.getElementById(`tile${wordCount}${yellowIndices[i] + 1}`).setAttribute('data-animation', 'flip-in');
    document.getElementById(`tile${wordCount}${yellowIndices[i] + 1}`).style.backgroundColor = "rgb(194, 170, 82)";//yellow
    document.getElementById(`tile${wordCount}${yellowIndices[i] + 1}`).style.border = "solid rgb(194, 170, 82)";//yellow border
    paintFinalLetter(currentWord[yellowIndices[i]], "rgb(194, 170, 82)");
    answer.splice(yellowIndices[i], 0, '🟨');

}
//color green indices on top of all else:
for (i = 0; i < greenIndices.length; i++) {
    document.getElementById(`tile${wordCount}${greenIndices[i] + 1}`).setAttribute('data-animation', 'flip-in');
    document.getElementById(`tile${wordCount}${greenIndices[i] + 1}`).style.backgroundColor = "rgb(98, 159, 91)";//green
    document.getElementById(`tile${wordCount}${greenIndices[i] + 1}`).style.border = "solid rgb(98, 159, 91)";//green border
    paintFinalLetter(currentWord[greenIndices[i]], "rgb(98, 159, 91)");
    answer.splice(greenIndices[i], 0, '🟩');

}

answer = answer.reverse();
answersColors.push(answer);
console.log(greenIndices);

// color text white
document.getElementById(`row${wordCount}`).style.color = "white";
//if sentWord is correct display final message and update win:
// if (greenIndices.length === 5 || wordCount === 6) {
if (greenIndices.length === 5) {
    win = true;
    window.finalGuessCount = wordCount;
    console.log("win");
    handleGameEnd(wordCount);
    //sendResultToFirebase(wordCount);
    showDistributionStats(wordCount);
    endOfGameToday = true;


    let winMessage = pickMessage();
    // fetchPercentile(wordCount, function(percentile, total) {
    //     openNotificationLong(`הצלחת ב-${wordCount} ניחושים! אתה באחוזון ה-${percentile} מבין ${total} שחקנים.`, true);
    // });
    openNotificationLong(winMessage, true);
    openShareNotificationLong();
}
//if ended and lost:
if (wordCount === 6 && greenIndices.length != 5) {
    console.log(wordCount);
    console.log("lose");
    wordCount=wordCount+1;
    console.log(wordCount);
    window.finalGuessCount = wordCount;
    win=false;
    console.log("beforeHandle" + wordCount);
    handleGameEnd(wordCount);
    //sendResultToFirebase(wordCount);
    showDistributionStats(999);
    endOfGameToday = true;
    let message = `המילה היא ${pickedWord} `;
    openNotificationLong(message, false);
    openShareNotificationLong();

    // fetchPercentile(wordCount, function(percentile, total) {
    //     openNotificationLong(`הצלחת ב-${wordCount} ניחושים! אתה באחוזון ה-${percentile} מבין ${total} שחקנים.`, true);
    // });
}

}
// import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
// function openStats() {
//     const statsModal = document.getElementById("statsModal");
//     statsModal.style.visibility = "visible";

//     // נניח שהניחוש האחרון שמור במשתנה גלובלי או session
//     const userGuess = window.finalGuessCount || 7; // 7 מייצג כישלון

//     const dateStr = new Date().toISOString().split('T')[0];
//     const statsRef = ref(db, 'results/' + dateStr);

//     get(statsRef).then(snapshot => {
//       if (!snapshot.exists()) {
//         renderStats({}, userGuess);
//         return;
//       }

//       const allResults = Object.values(snapshot.val());

//     //   // הוספת המשתמש לתוך ההתפלגות אם טרם נרשם
//       allResults.push({ guesses: userGuess });

//       // בניית מפת סטטיסטיקה
//       const stats = {};
//       allResults.forEach(entry => {
//         const key = entry.guesses > 6 ? 'fail' : entry.guesses;
//         stats[key] = (stats[key] || 0) + 1;
//       });

//       renderStats(stats, userGuess);
//     });
//   }

function closeStats() {
document.getElementById('statsModal').style.visibility = 'hidden';
document.getElementById('statsContent').style.visibility = 'hidden';

}
function showDistributionStats(userGuessCount) {
// תאריך לפי השעון המקומי

const dateStr = getLocalDateString();


console.log("showDist"+dateStr);
fetch(`https://yairwordale-default-rtdb.firebaseio.com/results/${dateStr}.json`)
    .then(res => res.json())
    .then(data => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 };
    const all = Object.values(data || {});
    for (const r of all) {
        const g = parseInt(r.guesses);
        if (g >= 1 && g <= 6) stats[g]++;
        else stats.fail++;
    }
    const total = all.length;
    console.log(total);
    const statsDiv = document.getElementById('statsTable');
    statsDiv.innerHTML = '';

    for (let i = 1; i <= 6; i++) {
        const percent = total ? ((stats[i] / total) * 100).toFixed(1) : 0;
        const row = document.createElement('div');
        row.classList.add('stats-row');
        if (i === userGuessCount) row.classList.add('highlight');

        const label = document.createElement('span');
        label.className = 'stats-label';
        label.textContent = `ניחוש ${i}`;

        const bar = document.createElement('div');
        bar.className = 'stats-bar';
        bar.style.width = `${percent}%`;
        bar.textContent = `${percent}%`;

        row.appendChild(label);
        row.appendChild(bar);
        statsDiv.appendChild(row);
    }

    const failPercent = total ? ((stats.fail / total) * 100).toFixed(1) : 0;
    const failRow = document.createElement('div');
    failRow.classList.add('stats-row');
    if (userGuessCount > 6) failRow.classList.add('highlight');

    const failLabel = document.createElement('span');
    failLabel.className = 'stats-label';
    failLabel.textContent = 'לא הצליחו';

    const failBar = document.createElement('div');
    failBar.className = 'stats-bar';
    failBar.style.width = `${failPercent}%`;
    failBar.textContent = `${failPercent}%`;

    failRow.appendChild(failLabel);
    failRow.appendChild(failBar);
    statsDiv.appendChild(failRow);
    });
}

function fetchPercentile(guesses, callback) {
const dateStr = getLocalDateString();


firebase.database().ref('results/' + dateStr).once('value', snapshot => {
    const allResults = Object.values(snapshot.val() || {});
    // הוספת המשתמש הנוכחי באופן מקומי
    allResults.push({ guesses }); // הוספתו באופן וירטואלי
    const total = allResults.length;
    const better = allResults.filter(r => r.guesses < guesses).length;
    const equal = allResults.filter(r => r.guesses == guesses).length;
    const percentile = Math.round(((better + equal / 2) / total) * 100);
    callback(percentile, total);
});
}
function getLocalDateString() {
const now = new Date();
const tzOffsetMinutes = now.getTimezoneOffset();
const localTime = new Date(now.getTime() - tzOffsetMinutes * 60000);
return localTime.toISOString().split('T')[0];
}

// function sendResultToFirebase(guessCount) {
//     const dateStr = new Date().toISOString().split('T')[0];
//     firebase.database().ref('results/' + dateStr).push({
//         guesses: guessCount,
//         timestamp: Date.now()
//     });
//     const allResults = Object.values(snapshot.val());

//     //   // הוספת המשתמש לתוך ההתפלגות אם טרם נרשם
//       allResults.push({ guesses: userGuess });
// }
function renderStats(stats, userGuess) {
const table = document.getElementById("statsTable");
table.innerHTML = "";

const total = Object.values(stats).reduce((a, b) => a + b, 0);

const keys = [1, 2, 3, 4, 5, 6, 'fail'];

keys.forEach(key => {
const count = stats[key] || 0;
const percent = total ? Math.round((count / total) * 100) : 0;

const row = document.createElement("div");
row.className = "statsRow" + ((userGuess == key || (key === 'fail' && userGuess === 7)) ? " highlight" : "");
const label = document.createElement("div");
label.className = "statsLabel";
label.innerText = key === 'fail' ? "לא הצליחו" : `ניחוש ${key}`;

const bar = document.createElement("div");
bar.className = "statsBar";

const fill = document.createElement("div");
fill.className = "statsFill";
fill.style.width = percent + "%";

bar.appendChild(fill);

const pct = document.createElement("div");
pct.className = "statsPercent";
pct.innerText = percent + "%";

row.appendChild(label);
row.appendChild(bar);
row.appendChild(pct);

table.appendChild(row);
});
const statsTitle = document.getElementById("statsTitle");
const today = new Date();
const formattedDate = today.toLocaleDateString('he-IL'); // למשל: 03/05/2025
statsTitle.innerText = `התפלגות ניחושים להיום - ${formattedDate}`;
document.getElementById("statsContent").style.visibility = "visible";

}
function pickMessage() {
let messageArray = [];
if (wordCount === 1) {
    messageArray = [
        'גאוני', 'אמאל׳ה הצלחת מהר', '?די נו, תוך ניחוש', 'תוצאה מוגזמת', '!!!טירוף', 'שיחקת מדהים', 'יש לך מוח עצום',
        'תוצאה מפחידה', '?וואו. תוך ניחוש. רימית', '?מי זה? אבשלום קור', 'אחד מי יודע? את/ה', 'מגניב מדי בשביל בית ספר',
        '?יש לך את זה ביותר מהר', 'פששש, כבוד', 'פתרת מהר מדי', 'בפוקס הראשון','ניחוש ראשון זה לא צחוק',
        'ציפור אחת במכה אחת','?איך הבאת את זה כל כך מהר','בטח גם עברת טסט ראשון','?הניחשת וגם הצלחת','מדובר בהצלחה מסחררת',
        'זה חוקי בכלל?', 'נראה לי שאתה בינה מלאכותית', 'הקלדת בעיניים עצומות?', 'המילה התחננה להינחש, הא?', 'כמה שילמת למילה?',
        'אם היה פרס, היית מקבל אותו פעמיים', 'מה אתה עושה כאן? לך תעבוד בגוגל', 'חד כתער!', 'תוך ניחוש? בא לי לבכות',
        'את/ה עילוי. פשוטו כמשמעו'
    ];
}
if (wordCount === 2) {
    messageArray = [
        'נסכם את ההצלחה בשתי מילים: יופי טופי','נולדת לוורדל׳ה','וורדל׳ה מודה לך על משחק מופתי',
        'טובים השניים מן האחד (ניחושים כאילו)', 'גאוני', 'אמאל׳ה הצלחת מהר', 'אחלה תוצאה שבעולם', 'נראה שהלך מדהים',
        '!!!טירוף', 'שני ניחושים? קטונתי', 'יש לך מוח ענק', 'תוצאה מפחידה', 'וואו פשוט וואו',
        'בגלגול הקודם היית מילונאי', "שני ניחושים יצאו לדרך בים בם בום", 'אין לנו מה לומר, הצלחת',
        'מזל של מתחילים', 'הלכת אול אין וזה השתלם אחושקשוקי', 'לא רואים אבל אני משתחווה','מוצלח, מאוד מאוד מוצלח',
        'חכם בלילה - וביום', 'יש לך מילים על קצה הלשון', 'עוד שניה היית מצליח בניחוש אחד', 'כמעט מושלם, רק כמעט',
        'אין לי דרך יפה להגיד את זה - הצלחת', 'שניים זה מספר המזל שלך', 'וורדל׳ה מאוהבת בך', 'לא היית רחוק מנס', 
        'זה כמו לקלוע שלשה עם הגב', 'תוצאה פוטוגנית'
    ];
}
if (wordCount === 3) {
    messageArray = [
        'אני גאה בך', 'דיייי איזו תוצאה', 'ניחשת את המילה מהר', 'שלושה ניחושים? וואו', 'משחק מדהים שלך',
        'ניחושים ופיגוזים', 'משחק הבא עלינו', 'בליגה של הגדולים/גדולות', '!טוב מאוד', 'פשוט מעולה',
        'התרשמנו לטובה ממך', 'בואנה אחלה תוצאה', 'הצלחת בגדול, הפרס: מילה חדשה מחר', 'ידענו שתצליח/י אבל הפתעת',
        'משלושה (ניחושים) יוצא אחד','שלושה ניחושים והכל יופי','בניחוץ׳ הצ׳ליצ׳י','שלושה ניחושים זה בגבוה',
        'בדיוק לפי הספר', 'שלוש פעמים קסם', 'אם הייתי צריך ניחוש שלישי – הייתי בוחר בך', 'שלוש זה מספר ראשוני. כמוך.',
        'התוצאה שלך חורגת מהסטטיסטיקה', 'את/ה ממש על זה', 'תזמון מושלם', 'מילה בשלוש פעימות', 'זה לא מזל – זה כישרון'
    ];
}
if (wordCount === 4) {
    messageArray = [
        'הצלחתך הצלחתינו', 'פשששש','לא רע בכלל','פשוט אחלה תוצאה','סחתיין עליך', 'יופי יופי יופי',
        'כפיים לך, הצלחת', 'נראה לי שיש פה ניחוש מעולה', 'נתת בראש', 'אחלה תוצאה שבעולם', 'עם התמדה מגיעים להכל',
        'פתרת כמו גדול/ה', 'אחלה בחלה', 'יופי טופי', 'משחק טוב כל הכבוד', 'שיחקת מעולה', 'נהדר ומצוין ואחלה ויופי',
        "פששש ממש סוס ארבעה",'כבוד הולך אליך על הפתירה', 'בניחוש הרביעי!!! יפה', 'ארבע זה מספר טיפולוגי',
        'כנגד ארבעה ניחושים דיברה המילה', 'זה לא היה קל – אבל הצלחת', 'כמו מרתון קצרצר', 'תוצאה ראויה להערכה',
        'נחישות ראויה לציון','המילה נכנעה אחרי כמה מכות מדויקות',  
'הגעת בדיוק לנקודה בה מתחילים להזיע',  
'היה אפשר לחתוך את המתח בסכין חמאה', 'עשית את זה ברוגע', 'זהב בקטגוריית ארבעה ניחושים','הרביעי זה הניחוש של העקשנים',  
'נו, ארבע פעמים זה בדיוק הממוצע של איינשטיין (סתם)',   'המילה לא עמדה בפניך'
    ];
}
if (wordCount === 5) {
    messageArray = [
        'ולחשוב שמישהו פקפק בך', 'לא רע', 'יפה.. קצת חששנו אבל יפה', 'יששש הצלחת', 'הידד זה עבד לך בסוף',
        'אז בסוף ניחשת נכון', 'נלחצנו לרגע', 'נפלת 4 פעמים, אבל בסוף קמת כמו גדול/ה', 'בסדר, אז הצלחת. יופי באמת',
        'הצלחת, אמא גאה בך', 'שיחקת יפה מאוד', 'יופייייי', 'ועל זה נאמר - תיסלם', 'זה שלא ויתרת זה כבר משהו',
        'שמת את האותיות במקום ובום הצלחה', 'משחק אגדה זה היה', 'מתקרב לקצה אבל לא נופל', 'עברת את זה עם סטייל',
        'עבודה יסודית', 'הקצב שלך? זהיר, אבל מדויק', 'ניצחון עם קצת מתח', 'לא מובן מאליו',
        'פתרת כמו מקצוען', 'הלב שלנו חזר לפעום'
    ];
}
if (wordCount === 6) {
    messageArray = [
        'וואו נלחצנו לרגע, כל הכבוד', 'שניה לפני הנפילה', 'הניחוש הגואל!!! כל הכבוד', 'מי חשב שלא תצליח/י? לא אנחנו',
        'פאק נפל לנו הלב לתחתון. מזל. כל הכבוד', '!!!ניחוש אחרון?? אשכרה', 'מדובר בגול בדקה התשעים',
        'ידענו שלא תוותר/י', 'אין עליך בעולם, התמדה זה הסוד', '.פאק זה היה קרוב', 'גדול!!! כמעט הפסדת ואז בסוף - לא',
        'מברוק', 'אחלה את/ה תאמין/י לי', 'וואי וואי לא הימרתי שזה יעבוד', 'פששש, חזק', '.אין לי מילים. תרתי משמע',
        'ממש ני-חוש שישי', 'פעם שישית גלידה, סתם לא', '..יפה! כלומר, נחמד', 'אה הצלחת בסוף? טוב', 'נו רואה? בסוף זה השתלם',
        'מילה שלי שהצלחת', 'כמו טלנובלה – הכל קורה ברגע האחרון', 'זה לא וורדל – זה דרמה', 'היה צמוד מדי',
        'הזעת, לא?', 'חזרנו לנשום. אתה גם?', 'היינו איתך מהניחוש הראשון ועד השישי','הניחוש האחרון זה כמו הדקה ה־90 ועוד תוספת זמן',  
'כל המשרד עצר לנשום איתך',  
'וואו, זה היה מתוח יותר מבחירות לכנסת',  
'אם זה היה עוד ניחוש אחד – המסך היה נמס',  
'העיקר שלא נשברת... חיצונית לפחות',   'זה היה מיני־מותחן'
    ];
}

const randIndex = Math.floor(Math.random() * messageArray.length);
return messageArray[randIndex];
}

function checkSpell(word) {
let wordExists = false;
splitWordsHebrew = hebWords.split(' ');
for (i = 0; i < splitWordsHebrew.length; i++) {
    if (splitWordsHebrew[i] === (word)) {
        wordExists = true;
        break;
    }
}

return wordExists;

};
function getValidDate() {
const now = new Date();
const israelTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));

// אם השעה בישראל לפני 15:30
if (israelTime.getHours() < 15 || (israelTime.getHours() === 15 && israelTime.getMinutes() < 30)) {
    // נחזיר את התאריך של אתמול
    israelTime.setDate(israelTime.getDate() - 1);
}

return israelTime.toISOString().split('T')[0];
}

function paintFinalLetter(letter, color) {
if (letter === 'ן') letter = 'נ';
if (letter === 'ם') letter = 'מ';
if (letter === 'ץ') letter = 'צ';
if (letter === 'ף') letter = 'פ';
if (letter === 'ך') letter = 'כ';
document.getElementById(letter).style.backgroundColor = color;
document.getElementById(letter).style.color = "white";


}
function shareResults() {
let shareResult = `וורדל\'ה # ${numOfWordale}` + "\n";
shareResult += `נסיון ${wordCount} מתוך 6` + "\n";

for (i = 0; i < answersColors.length; i++) {
    let tempAnswer = answersColors[i].toString();
    const result = tempAnswer.replaceAll(",", "");
    shareResult = shareResult + result + "\n";

}
shareResult = shareResult + "\n" + "וורדל בעברית:" + "\n" + "https://yairhasfari.github.io/wordale";
navigator.clipboard.writeText(shareResult);
// let shareButton = "<input id=\"shareButton\" onclick=\"shareResults()\" value=\"תוצאות הועתקו ללוח\">"
// document.getElementById('notify2').innerHTML = shareButton;
document.getElementById("shareButton").innerHTML = "תוצאות הועתקו ללוח";

}
function openInstructions() {
if (document.getElementById('instructions').style.visibility === "hidden") {
    document.getElementById('instructions').style.visibility = "visible";
}
else {
    document.getElementById('instructions').style.visibility = "hidden";
}
}
function saveUserData() {
//update statistics:
//updateStatistics();
//saves the date the user is currently on
localStorage.setItem('userDate', today);
//saves the answers arrays of today
localStorage.setItem('answersColors', answersColors);
localStorage.setItem('answersLetters', answersLetters)

}
// function saveUserDataEnd (){
//     localStorage.setItem('end', "yes");

// }
// loadUserData loads the data saved on localStorage and fills the tiles with older answers. this only happens if the day is today.
function loadUserData() {
//because localStorage only saves strings.
let savedDateString = localStorage.getItem('userDate');
let savedDate = new Date(savedDateString);
let todayNoHours = today.setHours(0, 0, 0, 0);//in order to compare date only without time
let savedDateCompare = savedDate.setHours(0, 0, 0, 0)//likewise
//only if day has changed:
if (todayNoHours === savedDateCompare) {
    answersLetters = localStorage.getItem('answersLetters').split(",");
    for (k = 0; k < answersLetters.length; k++) {
        for (m = 0; m < answersLetters[k].length; m++) {
            document.getElementById(`tile${k + 1}${m + 1}`).innerHTML = answersLetters[k][m];
        }
        currentRow = k + 1;
        currentWord = answersLetters[k];
        wordCount = k + 1;
        rowCount = rowCount + 1;
        
        compareWords();
        currentWord = '';

    }

}
}
function compareLetters(letterA, letterB) {
if (letterA === letterB | (letterA === "נ" && letterB === "ן") | (letterA === "צ" && letterB === "ץ") | (letterA === "פ" && letterB === "ף") | (letterA === "כ" && letterB === "ך") | (letterA === "מ" && letterB === "ם")) {
    return true;
}
else if ((letterB === "נ" && letterA === "ן") | (letterB === "צ" && letterA === "ץ") | (letterB === "פ" && letterA === "ף") | (letterB === "כ" && letterA === "ך") | (letterB === "מ" && letterA === "ם")) {
    return true
}
else {
    return false;

}
}
function countDownTimer() {
var todaysDate = new Date()
todaysDate.setDate(todaysDate.getDate() + 1);
todaysDate.setHours(0, 0, 0, 0);
var countDownDate = todaysDate.getTime();

// Update the count down every 1 second
var x = setInterval(function () {
    
    // Get today's date and time
    var now = new Date().getTime();
    
    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    hours = hours.toLocaleString(undefined, { minimumIntegerDigits: 2 });
    minutes = minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 });
    seconds = seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 });
    // Output the result in an element with id="demo"
    document.getElementById("timer").innerHTML = hours + ":"
        + minutes + ":" + seconds;
    if (hours==0 & minutes==0 & seconds==0) {location.reload();};

    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "";
        
    }
}, 1000);
}

//loadUserData();

document.addEventListener("visibilitychange",function(){
//document.getElementById(`tile${rowCount}1`)
if(currentWord==='' && document.visibilityState === 'hidden'){
location.reload();
}
});
const englishKeyboardToHebrew = {
a:'ש',
b:'נ',
c:'ב',
d:'ג',
e:'ק',
f:'כ',
g:'ע',
h:'י',
i:'נ',
j:'ח',
k:'ל',
m:'צ',
n:'מ',
p:'פ',
r:'ר',
s:'ד',
t:'א',
u:'ו',
v:'ה',
x:'ס',
y:'ט',
z:'ז',
',':'ת',
'.':'ץ',
';':'ף',
'l':'ך',
o:'מ',
}
const hebrewLetters = 'אבגדהוזחטיכלמנסעפצקרשתםןץףך';
const suffixLetterToMiddleLetter = {
'ם':'מ',
'ן':'נ',
'ץ':'צ',
'ף':'פ',
'ך':'כ',
}
window.addEventListener('keydown', function (e) {

if (e.key === 'Enter') {
    sendWord();
}
if (e.key === 'Backspace') {
    eraseLetter();
}
if (hebrewLetters.includes(e.key)) {
    clickLetter(suffixLetterToMiddleLetter[e.key] || e.key);
}
const hebrewWordFromEnglish = englishKeyboardToHebrew[e.key.toLowerCase()];
if (hebrewLetters.includes(hebrewWordFromEnglish)) {
    clickLetter(suffixLetterToMiddleLetter[hebrewWordFromEnglish] || hebrewWordFromEnglish);
}
});

function openInstructions() {
document.getElementById('instructions').style.display = 'block';
}

function closeInstructions() {
document.getElementById('instructions').style.display = 'none';
}

// Notify RakRega portal that today's Wordale is done.
// Runs on load (for already-played case) and on game end (handleGameEnd above).
function notifyRakRegaDone() {
    try { window.opener?.postMessage({ type: 'wordale-complete' }, '*'); } catch(e) {}
}
// Small delay so RakRega's message listener has time to register before we fire.
setTimeout(function() {
    const gameDateKey = getCurrentDateKey();
    if (localStorage.getItem('resultSent-' + gameDateKey) === 'true') {
        notifyRakRegaDone();
    }
}, 300);

