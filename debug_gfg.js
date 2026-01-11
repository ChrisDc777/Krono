fetch('https://practice.geeksforgeeks.org/problem-of-the-day', {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    redirect: 'follow'
})
.then(res => {
    console.log("Final URL:", res.url);
})
.catch(err => console.error(err));
