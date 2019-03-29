export const layout = (html: string): string => {
    return `
    <!DOCTYPE html>
        <html lang="">

        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title> - Hackathon Starter</title>
            <meta name="description" content="">
            <meta name="theme-color" content="#4DA5F4">
            <meta name="csrf-token">
            <link rel="shortcut icon" href="/images/favicon.png">
            <link rel="stylesheet" href="/css/main.css">
        </head>

        <body>
            <div id='root'>${html}</div>
            <script src="/js/lib/jquery-3.1.1.min.js"></script>
            <script src="/js/lib/bootstrap.min.js"></script>
            <script async defer src="https://buttons.github.io/buttons.js"></script>
            <script src="/js/main.js"></script>
            <script>
                window.ga = function() {
                    ga.q.push(arguments)
                };
                ga.q = [];
                ga.l = +new Date;
                ga('create', 'UA-38177297-2', 'auto');
                ga('send', 'pageview')
            </script>
            <script src="https://www.google-analytics.com/analytics.js" async defer></script>
        </body>

        </html>
    `;
};
