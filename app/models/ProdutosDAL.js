module.exports = class ProdutosDAL {

    constructor(athenashop){
        this.athenashop = athenashop;
    }
    
    FindAll(){
        return new Promise(function(resolve, reject){
            this.athenashop.query('SELECT * FROM produtos ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

     findUserEmail(camposForm) {
         return new Promise((resolve, reject) => {
             this.athenashop.query("SELECT * FROM produtos WHERE email = ?",
             [camposForm.email],
                 function (error, elements) {
                     if (error) {
                         return reject(error);
                     }

                     return resolve(elements);
                });
         });
     };

    findID(id) {
        return new Promise((resolve, reject) => {
            this.athenashop.query('SELECT * FROM produtos WHERE  id_produto = ?', [id], function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    FindPage(pagina, total){
        return new Promise((resolve, reject)=>{
            this.athenashop.query('SELECT * FROM produtos limit '+ pagina + ', '+ total,  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    TotalReg(){
        return new Promise((resolve, reject)=>{
            this.athenashop.query('SELECT count(*) total FROM produtos ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.athenashop.query("insert into produtos set ?",
                camposJson,
                function (error, elements) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(elements);
                });
        });
    }
    update(camposJson, id) {
        return new Promise((resolve, reject) => {
            this.athenashop.query("UPDATE produtos SET ? WHERE id = ?",
            [camposJson, id],
            function (error, results, fields) {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    // delete(id) {
    //     return new Promise((resolve, reject) => {
    //         this.athenashop.query("UPDATE produtos SET id_tipo_usuario = 0 WHERE id = ?", [id], function (error, results) {
    //             if (error) {
    //                 return reject(error);
    //             }
    //             return resolve(results[0]);
    //         });
    //     });
    // }
}