export class NonLangStore {

  constructor() {
     this.config = { lang: ['HTML', 'CSS' ,'Gettext Catalog',
            'Jupyter Notebook', 'Makefile', 'TeX', 'ApacheConf', 'CMAKE',
            'Groff', 'XSLT', 'CMake', 'Nginx', 'QMake', 'Yacc', 'Lex',
            'Protocol Buffer', 'Batchfile', 'Smarty', 'Scilab', 'PLpgSQL',
            'Perl6', 'Handlebars', 'NSIS', 'M4', 'PLSQL', 'Arduino', 'CMake',
            'ApacheConf', 'XML', 'SaltStack', 'Vue', 'GCC Machine Description'] };
    }

  getConfig() {
    return this.config;
  }

}
