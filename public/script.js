import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { signOut, getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDiFWXyeXDdF2XUbVSSp1YJInOMi8zxVpw",
    authDomain: "resumeevaluator-98a8f.firebaseapp.com",
    projectId: "resumeevaluator-98a8f",
    storageBucket: "resumeevaluator-98a8f.appspot.com",
    messagingSenderId: "317845582074",
    appId: "1:317845582074:web:c41b5a4436a4c315e71943"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const url = 'http://127.0.0.1:5000/'
const button = document.getElementById('btn')
const fileInput = document.getElementById('file-input');
const btn1 = document.getElementById('btn1')
const homebtn = document.getElementById('navItem1')
const displayFileName = document.getElementById('file-name')
const result = document.getElementById('result')
const firestore = getFirestore(app)
const auth = getAuth(app)

fileInput.addEventListener('change', () => {
    displayFileName.innerText = fileInput.files[0].name
    displayFileName.style.display = 'block'
})

btn1.addEventListener('click', () => {
    fileInput.click()
})



homebtn.addEventListener('click', async () => {
    await signOut(auth)
    window.location.href = 'index.html'
})
button.addEventListener('click', handleClick);
const uid = window.localStorage.getItem('uid')

function handleClick() {
    const formData = new FormData();
    formData.append("pdfFile", fileInput.files[0]);


    fetch("http://localhost:3000/extract-text", {
        method: "POST",
        body: formData
    }).then(response => {
        return response.text();
    }).then(extractedText => {

        //TODO call the api here for ml prediction
        sendDataToMLModel(extractedText)
    });
}


function sendDataToMLModel(extractedText) {
    const reference = [
        {
            keyword: "intern",
            desc: "Team X's sneaky glass has noticed that there is no internship in your academic history. Considering the requirements of companies and their intake, an internship would help you get a good understanding about real-life applications and working scenarios. So, we recommend you to work towards an internship in your field. A good resume should speak volumes about your work so make sure you upload internships and works which are relevant and applicable to your role.Need more help? Fear not, we have curated some good sources and articles related to the topic for your better understanding." +
                "Indeed: https://in.indeed.com/career-advice/career-development/benefits-of-internship" +
                " Capital Placement: https://capital-placement.com/blog/the-importance-of-an-internship-top-5-reasons-why-internships-are-critical/"
        },
        {
            keyword: "internship",
            desc: "Team X's sneaky glass has noticed that there is no internship in your academic history. Considering the requirements of companies and their intake, an internship would help you get a good understanding about real-life applications and working scenarios. So, we recommend you to work towards an internship in your field. A good resume should speak volumes about your work so make sure you upload internships and works which are relevant and applicable to your role.Need more help? Fear not, we have curated some good sources and articles related to the topic for your better understanding." +
                "Indeed: https://in.indeed.com/career-advice/career-development/benefits-of-internship" +
                " Capital Placement: https://capital-placement.com/blog/the-importance-of-an-internship-top-5-reasons-why-internships-are-critical/"
        },
        {
            keyword: "projects",
            desc: "'X'pressing yourself is an essential part isn't it? What if we said, 'good resume, few changes. instead of explaining them like this? Making sure that you have a good sense of words and communication skills is arguably the most important quality for someone in the society. Make sure to showcase yourself in that resume! You see the point, right?" +
                "If you don't, here are a couple of sights which might help you understand the importance of speech and soft skills better." +
                "CNB: https://www.cnbc.com/2022/07/13/in-demand-soft-skills-to-put-in-your-resume.html" +
                "EnhanCV: https://enhancv.com/blog/soft-skills-on-resume/",
        },
        {
            keyword: "softskills",
            desc: "Team 'X'-rays tells us that your resume lacks the projects which display commitment towards the job that you're applying for. Fear now, we are here to guide you. Why projects? It's like showing gravity as a proof for physics or quantum computing for math! It's solid proof for your character and determination towards your interests." +
                "Don't know what to do? We are here. Calm down and grab your reading glasses." +
                "Indeed: https://in.indeed.com/career-advice/resumes-cover-letters/projects-in-resume#:~:text=Work%20projects%20include%20the%20professional,add%20value%20to%20your%20resume." +
                "CakeResume: https://www.cakeresume.com/resources/projects-in-resume?locale=en"
        },
    ]
    const wordsToCheck = [
        'intern',
        'internship',
        'softskills',
        'projects'
    ];

    const recommend = document.getElementById('reco-div')
    if (!extractedText.includes('intern')) {
        recommend.innerHTML += "<div class='card2'>" + reference[0].desc + "</div>"
        recommend.style.display = 'block'
    }
    if (!extractedText.includes('internship')) {
        recommend.innerHTML += "<div class='card2'>" + reference[1].desc + "</div>"
        recommend.style.display = 'block'
    }
    if (!extractedText.includes('softskills')) {
        recommend.innerHTML += "<div class='card2'>" + reference[2].desc + "</div>"
        recommend.style.display = 'block'
    }
    if (!extractedText.includes('projects')) {
        recommend.innerHTML += "<div class='card2'>" + reference[3].desc + "</div>"
        recommend.style.display = 'block'
    }


    fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(extractedText)
        }
    ).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response as JSON
    })
        .then(async (responseData) => {
            // Handle the JSON response data here
            console.log(responseData.fields);
            console.log(responseData.probabilty_list)

            for (var i = 0; i < responseData.fields.length; i++) {
                result.innerHTML += "<div class='card'><h2>" + responseData.fields[i] + "</h2><p>" + responseData.probabilty_list[i] * 100 + "%</p></div>"

                const data = {
                    fileName: fileInput.files[0].name,
                    field: responseData.fields[i],
                    probabilty_list: responseData.probabilty_list[i],
                    date: Date.now()
                }

                const parentDocRef = await doc(firestore, "users", uid)
                const subCollection = "previous"

                const subcollectionRef = collection(parentDocRef, subCollection);
                await addDoc(subcollectionRef, data);
                console.log("data added")
            }

        })
        .catch(error => {
            // Handle errors here
            console.error('There was a problem with the fetch operation:', error);
            alert(error)
        });
}
