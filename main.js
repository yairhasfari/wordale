

let userWords = []
let count = 0;
let win = false;


//let pickedWord = pickWord();

//which try am i in?
let rowCount = 1;
//compare this to know if word was sent
let wordCount = 0;
let currentWord = '';
let answersColors = [];
let answersLetters = [];
let numOfWordale = 0;
const startDate = new Date(2022, 0, 11);
let today = new Date();
let listOfWords = ["שגשוג", "מפלצת", "חיקוי", "השלמה", "טמטום", "הקרבה", "טיעון","שקדיה", "מדינה", "קרטיב", "עבודה", "ליכוד", "ספורט", "מגניב", "גפרור", "אכלוס", "דוגמן", "הוסטל", "יומרה", "מזעזע", "צליבה", "קפאין", "שרטוט", "סטירה", "הפנוט", "פירוק", "מרגמה", "גסיסה", "מעצור", "תאגיד", " שינון", "שוטרת", "כלנית", "געגוע", "טחינה", "מכוער", "סרסור", "עיראק", "מאמין", "יצירה", "מצנפת", "הטמעה", "תכסיס", "תתרכך", "רמקול", "שניצל", "מנסרה", "רטבים", "נזהרת", "חמדתי", "להבין", "גישור", "תינוק", "מצחיק", "כיפור", "פספוס", "קזינו", "צדדים", "חיטוי", "הרגעה", "נסיעה", "ספרדי", "עניבה", "סטייק", "מרקדת", "מפחיד", "כוורת", "גידול"];
let pickedWord = pickWord();
countDownTimer();


function pickWord() {
    //today = new Date();
    var differenceInTime = today.getTime() - startDate.getTime();

    // To calculate the no. of days between two dates
    var differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    numOfWordale = differenceInDays;
    return listOfWords[differenceInDays];
}
function addUserWord() {
    let userWord = document.getElementById("word").value;
    storeUserWord(userWord);
    //event.preventDefault();
}
//store user's word in data
function storeUserWord(userWord) {
    userWords.push(userWord);
};

function clickLetter(value) {
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
                compareWords();//compares words and does the rest fills tiles accordingly
                rowCount++;
                answersLetters.push(currentWord);//keeps the word in answers array (not the colors)
                saveUserData();//saves answers to localStorage
                currentWord = '';//in order to start new word at next line
            } else {
                openNotification('המילה לא קיימת');
            }
        }
        else { //checks if there are enough letters
            openNotification("אין מספיק אותיות")
        }

    }
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

}

function compareWords() {
    let answer = [];
    let newWord = '';
    let greenIndices = [];
    let yellowIndices = [];
    let greyIndices = [];
    let usedYellowIndices = [];
    for (i = 0; i <= 4; i++) {
        //if letter exists in place:
        if (compareLetters(currentWord[i],pickedWord[i])) {
            greenIndices.push(i);
        } else {
            newWord += pickedWord[i];
        }
    }

    for (i = 0; i <= 4; i++) {
        if (!greenIndices.includes(i)) {
            for (j = 0; j < newWord.length; j++) {
                if (compareLetters(currentWord[i],newWord[j])) {
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


    // color text white
    document.getElementById(`row${wordCount}`).style.color = "white";
    //if correct:
    if (greenIndices.length === 5 || wordCount===6) {
        win = true;
        let winMessage = pickMessage();
        openNotificationLong(winMessage, true);
        openShareNotificationLong();


    }
    function pickMessage(){
        let messageArray=[];
        if (wordCount===1){
            messageArray=['גאוני','אמאל׳ה הצלחת מהר','?די נו, תוך ניחוש','תוצאה מוגזמת','!!!טירוף','שיחקת מדהים','יש לך מוח עצום','תוצאה מפחידה','וואו בדוק רימית']
        }
        if (wordCount===2){
            messageArray=['נולדת לוורדל׳ה','גאוני','אמאל׳ה הצלחת מהר','אחלה תוצאה שבעולם','נראה שהלך מדהים','!!!טירוף','שני ניחושים? קטונתי','יש לך מוח ענק','תוצאה מפחידה','וואו פשוט וואו']
        }
        if (wordCount===3){
            messageArray=['נאי גאה בך','דיייי איזו תוצאה','ניחשת את המילה מהר','שלושה ניחושים? וואו','משחק מדהים שלך','ניחושים ופיגוזים','משחק הבא עלינו','בליגה של הגדולים/גדולות','!טוב מאוד','פשוט מעולה','התרשמנו לטובה ממך','בואנה אחלה תוצאה']
        }
        if (wordCount===4){
            messageArray=['לא רע בכלל','סחתיין עליך','יופי יופי יופי','כפיים לך, הצלחת','נראה לי שיש פה ניחוש מעולה','נתת בראש','אחלה תוצאה שבעולם','עם התמדה מגיעים להכל','פתרת כמו גדול/ה','אחלה בחלה','יופי טופי','משחק טוב כל הכוד','שיחקת מעולה','נהדר ומצוין ואחלה ויופי','כבוד הולך אליך על הפתירה']
        }
        if (wordCount===5){
            messageArray=['ולחשוב שמישהו פקפק בך','לא רע','יפה.. קצת חששנו אבל יפה','יששש הצלחת','הידד זה עבד לך בסוף','אז בסוף ניחשת נכון','נלחצנו לרגע','נפלת 4 פעמים, אבל בסוף קמת כמו גדול/ה','בסדר, אז הצלחת. יופי באמת','ניחוש חמישי זה בסדר, תשתפר/י מחר','שיחקת יפה מאוד','יופייייי']
        }
        if (wordCount===6){
            messageArray=['וואו נלחצנו לרגע, כל הכבוד','שניה לפני הנפילה','הניחוש הגואל!!! כל הכבוד','מי חשב שלא תצליח/י?? לא אנחנו','פאק נלב לנו הלב לתחתון. מזל. כל הכבוד','!!!ניחוש אחרון?? אשכרה','מדובר בגול בדקה התשעים','ידענו שלא תוותר/י','אין עליך בעולם, התמדה זה הסוד','.פאק זה היה קרוב','גדול!!! כמעט הפסדת ואז בסוף - לא','מברוק','אחלה את/ה תאמין/י לי','וואי וואי לא הימרתי שזה יעבוד']
        }
        
        randIndex = Math.floor(Math.random()*(messageArray.length));
        
        return messageArray[randIndex]
    }
    //if ended and lost:
    if (wordCount === 6 && greenIndices.length != 5) {
        let message = `המילה היא ${pickedWord} `;
        openNotificationLong(message, false);
    }
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
    document.getElementById("shareButton").innerHTML="תוצאות הועתקו ללוח";

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
    localStorage.setItem('userDate', today);
    localStorage.setItem('answersColors', answersColors);
    localStorage.setItem('answersLetters', answersLetters)
}
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
function compareLetters(letterA,letterB){
    if (letterA === letterB | (letterA==="נ" && letterB==="ן" )| (letterA==="צ" && letterB==="ץ" )| (letterA==="פ" && letterB==="ף" )| (letterA==="כ" && letterB==="ך" )| (letterA==="מ" && letterB==="ם")){
        return true;
    }
    else{
        return false;

    }
}
function countDownTimer(){
    var todaysDate = new Date()
    todaysDate.setDate(todaysDate.getDate()+1);
    todaysDate.setHours(0,0,0,0);
    var countDownDate=todaysDate.getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  hours=hours.toLocaleString(undefined,{minimumIntegerDigits: 2});
  minutes=minutes.toLocaleString(undefined,{minimumIntegerDigits: 2});
  seconds = seconds.toLocaleString(undefined,{minimumIntegerDigits: 2});
  // Output the result in an element with id="demo"
  document.getElementById("timer").innerHTML =  hours + ":"
  + minutes + ":" + seconds;
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "";
  }
}, 1000);
}

loadUserData();
/*
function getWordsToArray(){
    hebWordsArray=[];
    const fs = require('fs')
    let wordExists = false;
    var wordsHebrew = fs.readFileSync('he-IL.dic', 'utf8')
    splitWordsHebrew = wordsHebrew.split('\r\n');
    for (i = 0; i < splitWordsHebrew.length; i++) {
        if (splitWordsHebrew[i].length===5) {
            if (!(splitWordsHebrew[i].includes('\"'))){
            hebWordsArray.push(splitWordsHebrew[i]);
            }
        }
    }
    var file = fs.createWriteStream('hello2.txt');
    file.on('error', function(err) { Console.log(err) });
    hebWordsArray.forEach(value => file.write(`${value} `));
    file.end();
}
*/
//const fs = require('fs')

// var arr = [];
// while(arr.length < 800){
//     var r = Math.floor(Math.random() * 375245) + 1;
//     if(arr.indexOf(r) === -1) arr.push(r);
// }
// console.log(arr);
/*
var file = fs.createWriteStream('randoms.txt');
    file.on('error', function(err) { Console.log(err) });
    arr.forEach(value => file.write(`${value} `));
    file.end();*/

