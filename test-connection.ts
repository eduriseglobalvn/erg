
async function test() {
    const urls = [
        'http://localhost:8080/api/health',
        'http://127.0.0.1:8080/api/health'
    ];

    for (const url of urls) {
        console.log(`Testing ${url}...`);
        try {
            const res = await fetch(url);
            console.log(`  Status: ${res.status}`);
            const data = await res.json();
            console.log(`  Data: ${JSON.stringify(data).substring(0, 100)}...`);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`  Error: ${error.message}`);
                if ('cause' in error && error.cause) console.error(`  Cause: ${String(error.cause)}`);
                continue;
            }

            console.error(`  Error: ${String(error)}`);
        }
    }
}

test();
