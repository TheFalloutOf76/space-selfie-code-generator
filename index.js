import { open } from "@opensrc/deno-open";

function testCode(name, email, code) {
    const response = fetch('https://space.crunchlabs.com/api/cms/user', {
        method: 'POST',
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: `${email}+${code}@gmail.com`,
            code: code
        })
    });

    return response
}

function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function getWorkingCode(name, email) {
    while (true) {
        const guessCode = generateRandomCode();
        let result;
        try {
            result = await testCode(name, email, guessCode);
            result = await result.json();
        } catch (e) {
            continue;
        }
        return guessCode;
    }
}


let username, email, codeCount;

username = prompt('Enter your name:');
email = prompt('Enter your email:');
codeCount = prompt('Enter the number of codes you want to generate:');
codeCount = parseInt(codeCount) || 100;

console.log(`Generating ${codeCount} working codes for ${username}. . .`);

let urlOpened = false;

for (let i = 0; i < codeCount; i++) {
    getWorkingCode(username, email).then((code) => {
        if (!urlOpened) {
            open(`https://space.crunchlabs.com/selfie/${code}`);
            urlOpened = true;
        }
        console.log(`generated code: ${code}! go to https://space.crunchlabs.com/selfie/${code} to upload your selfie!`);
    });
}