
export class EmailMarkup {


    public emailHeader(title = ''){

        return `<html>
                    </head>
                        <title>${title}</title>
                    </head>
                    <body>
                    `;
    }


    public emailContent( html:string ){
        return `
            ${this.emailHeader()}
            ${html}
            ${this.emailFooter()}
        `;
    }


    public emailFooter(link = ''){
        return `
            <foot> ${link} </foot>
            </body>
            </html>`;

    }



}
