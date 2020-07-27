const puppeteer = require('puppeteer');

//Read instagram page

async function start() {

    async function loadMore(page, selector) {
        const moreButton = await page.$(selector)

        if (moreButton) {
            console.log("More");
            await moreButton.click()
            await page.waitFor(selector, { timeout: 5000 }).catch(() => console.log('Timeout')) //the page will wait until the button appears again
            await loadMore(page, selector)
        }
    }

    // Get comments and @
    async function getComments(page, selector) {
        const comments = await page.$$eval(selector, links => links.map(link => link.innerText)) //* We use two '$$' when we want to get all elements 
        return comments
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/p/CChMVvQgYKK/');

    await loadMore(page, '.dCJp8');
    const userId = await getComments(page, '.C4VMK span a'); // It will return an Array with all users @Id
    const counted = count(userId);
    const sorted = sort(counted);
    sorted.forEach(user => console.log(user));

    await browser.close();
}




// Count @ that was repeated

function count(atArray) {
    const count = {}

    atArray.forEach(user => { count[user] = (count[user] || 0) + 1 })
    return count
}


// Order

function sort(countedArr) {
    const entries = []; // * The for loop can be replaced in this case by the Object.entries(countedArr) 

    for (prop in countedArr) {
        entries.push([prop, countedArr[prop]])
    }

    const sorted = entries.sort((a, b) => {
        return b[1] - a[1]
    })

    return sorted;
}


start();