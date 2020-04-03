/**
 * Storage class for the language chart
 * Contains all languages that are no programming lanuages
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 * @see {@link https://github.com/github/linguist/blob/master/lib/linguist/languages.yml}
 */
export class NonLangStore {
    constructor () {
        this.config = {
            lang: [
                'ApacheConf',
                'ApacheConf',
                'Arduino',
                'Batchfile',
                'BitBake',
                'CMAKE',
                'CMake',
                'CSS',
                'Dockerfile',
                'GCC Machine Description',
                'Gettext Catalog',
                'Gherkin',
                'Groff',
                'HCL',
                'HTML',
                'Handlebars',
                'Jupyter Notebook',
                'Lex',
                'M4',
                'Makefile',
                'NSIS',
                'Nginx',
                'PLSQL',
                'PLpgSQL',
                'Perl6',
                'Protocol Buffer',
                'QMake',
                'SaltStack',
                'Starlark',
                'Scilab',
                'Smarty',
                'TeX',
                'Vue',
                'XML',
                'XSLT',
                'Yacc'
            ]
        }
    }

    getConfig () {
        return this.config
    }
}
