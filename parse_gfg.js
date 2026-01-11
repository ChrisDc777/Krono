const fs = require('fs');

try {
    const html = fs.readFileSync('gfg_dump.html', 'utf8');
    // Find Next.js data
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
    if (!match) {
        console.log("No Next Data found");
        process.exit(1);
    }

    const json = JSON.parse(match[1]);
    
    // Log structure to help find POTD
    // Looking for something like pageProps.problemOfTheDay
    console.log("Keys in props:", Object.keys(json.props));
    if (json.props.pageProps.initialState) {
        console.log("Keys in initialState:", Object.keys(json.props.pageProps.initialState));
        // Using JSON.stringify to find the problem name by regexing the stringified state could be easier
        const stateStr = JSON.stringify(json.props.pageProps.initialState);
        const match = stateStr.match(/"problem_name":"(.*?)"/);
        if (match) {
            console.log("Found problem name:", match[1]);
        } else {
             console.log("Problem name not found in initialState");
        }
        
        // Also look for difficulty
        const diffMatch = stateStr.match(/"difficulty":"(.*?)"/);
        if (diffMatch) console.log("Found difficulty:", diffMatch[1]);
        
        // Look for url
        const urlMatch = stateStr.match(/"problem_url":"(.*?)"/);
        if (urlMatch) console.log("Found URL:", urlMatch[1]);
    }

} catch (e) {
    console.error(e);
}
