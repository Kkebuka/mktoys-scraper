import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
});


const page = await browser.newPage();

await page.goto('https://mktoys.com', {
        waitUntil: "domcontentloaded",
    });

    // await page.click('a[href="/FirstPage/Account"]');
    // await page.locator('input#loginUsername').fill('samaq');
    // await page.locator('input#loginPassword').fill('working');
    // await page.click('button.signIn');

    
    await page.locator('input#content').fill('robot');
    await page.click('div.search-button');
    await page.waitForNavigation();

    let nextPage = true;
    const allInfo = [];

    while(nextPage){
        await waitForNetworkIdle();

        const detailsOnPage =await page.evaluate(() => {
            
            
            const TotalDetails = document.querySelectorAll('.inner-container');
            
            const info = Array.from(TotalDetails).map((singleDetail) => {
                const imageSrc = singleDetail.querySelector('.leftImg').getAttribute('src');
                const name = singleDetail.querySelector('i').innerHTML;
                const newPrice = singleDetail.querySelector('.el-icon-money').innerHTML;
                // console.log(name, newPrice)
                return{imageSrc, name, newPrice};
            });
            console.log(info)
            return info;
        });
    
        allInfo.push(...detailsOnPage);
        
        try {
            const nextPageLink = await page.waitForSelector('button.btn-next]', { timeout: 10000 });
            await nextPageLink.click();
            await page.waitForNavigation();
        } catch (error) {
            console.log("Next page link not found. Exiting loop.");
            nextPage = false;
        }

    }

    console.log(allInfo);
    
    
    await browser.close();


    
