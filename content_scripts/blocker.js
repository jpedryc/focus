(async () => {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    // if (window.hasRun) {
    //     return;
    // }
    // window.hasRun = true;

    const blockSite = async () => {
        let blockedHtml = await fetch(await chrome.runtime.getURL('content_scripts/assets/html/blocked.html'));
        blockedHtml = await blockedHtml.text();
        blockedHtml = blockedHtml.replace('LOGO_IMG_PATH', await chrome.runtime.getURL('popup/assets/img/logo.png'));

        // pageContent = await pageContent.text();
        // pageContent = pageContent.replace('%{LOGO}', await chrome.runtime.getURL('popup/assets/img/logo.png'));
        // document.body.innerHTML = pageContent;

        // const blockedHtml = '<html lang="en">\n' +
        //     '<head>\n' +
        //     '    <title>Blocked!</title>\n' +
        //     '    <style>\n' +
        //     '        html, body, .container {\n' +
        //     '            height: 100%;\n' +
        //     '            font-size: 0.8rem;\n' +
        //     '        }\n' +
        //     '\n' +
        //     '        .container {\n' +
        //     '            display: flex;\n' +
        //     '            flex-direction: column;\n' +
        //     '            align-items: center;\n' +
        //     '            justify-content: center;\n' +
        //     '        }\n' +
        //     '\n' +
        //     '        @charset "UTF-8";body{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;line-height:1.4;max-width:800px;margin:20px auto;padding:0 10px;color:#363636;background:#fff;text-rendering:optimizeLegibility}button,input,textarea{transition:background-color .1s linear,border-color .1s linear,color .1s linear,box-shadow .1s linear,transform .1s ease}h1{font-size:2.2em;margin-top:0}h1,h2,h3,h4,h5,h6{margin-bottom:12px}h1,h2,h3,h4,h5,h6,strong{color:#000}b,h1,h2,h3,h4,h5,h6,strong,th{font-weight:600}blockquote{border-left:4px solid rgba(0,150,191,.67);margin:1.5em 0;padding:.5em 1em;font-style:italic}blockquote>footer{margin-top:10px;font-style:normal}address,blockquote cite{font-style:normal}a[href^=mailto]:before{content:"📧 "}a[href^=tel]:before{content:"📞 "}a[href^=sms]:before{content:"💬 "}button,input[type=button],input[type=checkbox],input[type=submit]{cursor:pointer}input:not([type=checkbox]):not([type=radio]),select{display:block}button,input,select,textarea{color:#000;background-color:#efefef;font-family:inherit;font-size:inherit;margin-right:6px;margin-bottom:6px;padding:10px;border:none;border-radius:6px;outline:none}button,input:not([type=checkbox]):not([type=radio]),select,textarea{-webkit-appearance:none}textarea{margin-right:0;width:100%;box-sizing:border-box;resize:vertical}button,input[type=button],input[type=submit]{padding-right:30px;padding-left:30px}button:hover,input[type=button]:hover,input[type=submit]:hover{background:#ddd}button:focus,input:focus,select:focus,textarea:focus{box-shadow:0 0 0 2px rgba(0,150,191,.67)}button:active,input[type=button]:active,input[type=checkbox]:active,input[type=radio]:active,input[type=submit]:active{transform:translateY(2px)}button:disabled,input:disabled,select:disabled,textarea:disabled{cursor:not-allowed;opacity:.5}::-webkit-input-placeholder{color:#949494}:-ms-input-placeholder{color:#949494}::-ms-input-placeholder{color:#949494}::placeholder{color:#949494}a{text-decoration:none;color:#0076d1}a:hover{text-decoration:underline}code,kbd{background:#efefef;color:#000;padding:5px;border-radius:6px}pre>code{padding:10px;display:block;overflow-x:auto}img{max-width:100%}hr{border:none;border-top:1px solid #dbdbdb}table{border-collapse:collapse;margin-bottom:10px;width:100%}td,th{padding:6px;text-align:left}th{border-bottom:1px solid #dbdbdb}tbody tr:nth-child(2n){background-color:#efefef}::-webkit-scrollbar{height:10px;width:10px}::-webkit-scrollbar-track{background:#efefef;border-radius:6px}::-webkit-scrollbar-thumb{background:#d5d5d5;border-radius:6px}::-webkit-scrollbar-thumb:hover{background:#c4c4c4}\n' +
        //     '        /*# sourceMappingURL=light.min.css.map */\n' +
        //     '\n' +
        //     '    </style>\n' +
        //     '</head>\n' +
        //     '<body>\n' +
        //     '\n' +
        //     '</body>\n' +
        //     '</html>\n' +
        //     '\n' +
        //     '<div class="container">\n' +
        //     '    <h1 style="color:red;font-size:3rem;">BLOCKED!</h1>\n' +
        //     '    <div style="width: 500px;">\n' +
        //     // '        <img src="%{LOGO}" alt="Nazar" style="float:left;margin-right:10px;"/>\n' +
        //     // '        <h1>Focus Nazar</h1>\n' +
        //     '        <p style="margin-top:-10px;">\n' +
        //     '            "A naẓar (from Arabic ‏نَظَر‎ [ˈnaðˤar], meaning \'sight\', \'surveillance\', \'attention\', and other related concepts) is an eye-shaped amulet believed to protect against the evil eye." - <a href="https://en.wikipedia.org/wiki/Nazar_(amulet)" title="Nazar Amulet">wikipedia.org</a>\n' +
        //     '        </p>\n' +
        //     '    </div>\n' +
        //     '</div>';

        document.open();
        document.write(blockedHtml);
        document.close();
        window.stop();
    }

    await blockSite();
})();
