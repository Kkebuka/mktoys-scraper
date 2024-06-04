import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
});


const page = await browser.newPage();

await page.goto('https://mktoys.com', {
        waitUntil: "domcontentloaded",
    });
// 
    await page.click('a[href="/FirstPage/Account"]');
    await page.locator('input#loginUsername').fill('kesea');
    await page.locator('input#loginPassword').fill('739824');
    
    await page.click('button.signIn');
    try {
        await page.waitForNetworkIdle({
          networkIdleTimeout: 5000, // Wait for 5 seconds of network inactivity
          networkIdleInflight: 0    // Wait until there are no more in-flight requests
        });
        // Code to execute after network becomes idle
      } catch (error) {
        console.error('Timeout waiting for network to become idle:', error);
      }
    console.log('logged in')
    // await page.waitForNavigation()
    // await page.waitForNetworkIdle();
    // page.setDefaultTimeout(10000);
    await page.evaluate(() => {
        
        return new Promise((resolve) => {
            console.log('waiting')
            setTimeout(resolve, 5000); // Adjust the delay time as needed
        });
    });
    

    await page.locator('input#content').fill('robot');
    console.log('waiting for search')
    await page.click('div.search-button');
    console.log('search btton clicked')

    await browser.waitForTarget(target => target.type() === 'page');

  // Get the new page instance
  const targets = browser.targets();
  newPage = await targets[targets.length - 1].page();

  // Wait for new page to finish loading
  await newPage.waitForLoadState('networkidle2');

    let nextPage = true;
    const allInfo = [];

    while(nextPage){
        await page.waitForNetworkIdle();

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
            const nextPageLink = await page.waitForSelector('button.btn-next', { timeout: 10000 });
            await nextPageLink.click();
            await page.waitForNavigation();
        } catch (error) {
            console.log("Next page link not found. Exiting loop.");
            nextPage = false;
        }

    }

    console.log(allInfo);
    
    
    await browser.close();


    
