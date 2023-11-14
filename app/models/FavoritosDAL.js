module.exports = class FavoritosDAL {

    constructor(athenashop){
        this.athenashop = athenashop;
    }
    
    FindAll(){
        return new Promise(function(resolve, reject){
            this.athenashop.query('SELECT * FROM favoritos ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

     findProdName(camposForm) {
         return new Promise((resolve, reject) => {
             this.athenashop.query("SELECT * FROM favoritos WHERE nome_produto = ?",
             [camposForm.nome_produto],
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
            this.athenashop.query("SELECT * FROM favoritos WHERE id_produto = ?", [id], function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    FindPage(pagina, total){
        return new Promise((resolve, reject)=>{
            this.athenashop.query('SELECT * FROM favoritos limit '+ pagina + ', '+ total,  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    TotalReg(){
        return new Promise((resolve, reject)=>{
            this.athenashop.query('SELECT count(*) total FROM favoritos ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.athenashop.query("insert into favoritos set ?",
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
            this.athenashop.query("UPDATE favoritos SET ? WHERE id = ?",
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