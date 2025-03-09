const endResult = document.getElementById("endResult");
const finalImage = document.getElementById("finalImage");
const potatoName = document.getElementById("potatoName");
const desc1 = document.getElementById("desc1");
const desc2 = document.getElementById("desc2");
const concl = document.getElementById("conclusion");
const gridContainer = document.getElementById("gridContainer");
const endContents = document.getElementById("endContents");
const loader = document.getElementById("loader");
let collectedAnswers = JSON.parse(localStorage.getItem("collectedAnswers"));

let responseMap = [];
let potatoDesc = [];
images = ["chip.PNG", "fry.PNG", "hash.PNG", "mashed.PNG", "tater.PNG", "tornado.PNG"];
let scores = {
    "EST": 0,
    "AGR": 0,
    "CSN": 0,
    "OPN": 0,
    "EXT": 0,
    "MIX": 0,
};
let potatoMapping = {
    "MIX": "tater",
    "OPN": "fry",
    "CSN": "hash",
    "AGR": "mashed",
    "EST": "tornado",
    "EXT": "chip"
};

async function runCode() {
    endContents.style.visibility = "hidden";
    loader.style.display = "flex";

    try {
        // Fetch two JSON files in parallel
        const [response1, response2] = await Promise.all([
            fetch("assets/responses.json"),
            fetch("assets/content.json"),
        ]);

        // Fetch all images in advance so image appears together with final
        // grid container
        const preloadedImages = await Promise.all(
            images.map(img => 
                fetch("assets/final_imgs/" + img)
            )
        );

        // Check if the responses are successful
        if (!response1.ok || !response2.ok) {
            throw new Error('Failed to fetch one or more JSON files');
        }

        // Parse the JSON data from both responses
        const data1 = await response1.json();
        const data2 = await response2.json();

        responseMap = data1;
        potatoDesc = data2;

        generateEndScreen();
        endContents.style.visibility = "visible";
        loader.style.display = "none";


    } catch (error) {
        console.error('Error fetching JSON files:', error);
    }
}


runCode();


let generateEndScreen = () => {
    for (let qnNum = 1; qnNum <= 10; qnNum++) {
        let intp = responseMap[qnNum-1][collectedAnswers[qnNum]];
        let trait = intp.split(" ")[0];
        let sign = intp.split(" ")[1];
        if (sign === "+") scores[trait] += 1;
        else scores[trait] -= 1;
        console.log('done');
    }

    let potato = determinePotato();
    finalImage.src = `assets/final_imgs/${potato}.PNG`;
    potatoName.innerText = potato;
    desc1.innerText = potatoDesc[potato]["desc1"];
    desc2.innerText = potatoDesc[potato]["desc2"];
    concl.innerText = potatoDesc[potato]["conclusion"];

    gridContainer.style.visibility = "visible";
}


let determinePotato = () => {
    let mixValue = scores["MIX"];
    let numAboveZero = Object.values(scores).reduce((a, b) => a + (b > 0), 0);
    if (numAboveZero == 6 || (numAboveZero >= 4 & mixValue == 2)) return "tater";
    let maxKey = Object.entries(scores).reduce((max, [key, value]) => {
        if (value > scores[max] || max === null) {
          max = key;
        }
        return max;
      }, null);

    return potatoMapping[maxKey];
}
