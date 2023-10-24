module.exports = class UsuarioDAL {

    constructor(athenashop){
        this.athenashop = athenashop;
    }
    
    FindAll(){
        return new Promise(function(resolve, reject){
            this.athenashop.query('SELECT * FROM usuarios ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    findUserEmail(camposForm) {
        return new Promise((resolve, reject) => {
            this.athenashop.query("SELECT * FROM usuarios WHERE email = ?",
            [camposForm.email],
                function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    // FindPage(pagina, total){
    //     return new Promise((resolve, reject)=>{
    //         this.athenashop.query("SELECT id, nome, email, id_tipo_usuario FROM usuarios " + 
    //          pagina + ', '+ total,  function(error, elements){
    //             if(error){
    //                 return reject(error);
    //             }
    //             return resolve(elements);
    //         });
    //     });
    // };

    FindPage(pagina, total){
        return new Promise((resolve, reject)=>{
            this.athenashop.query('SELECT * FROM usuarios limit '+ pagina + ', '+ total,  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    TotalReg(){
        return new Promise((resolve, reject)=>{
            this.athenashop.query('SELECT count(*) total FROM usuarios ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.conexao.query("insert into usuarios set ?",
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
            this.conexao.query("UPDATE usuarios SET ? WHERE id = ?",
            [camposJson, id],
            function (error, results, fields) {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.conexao.query("UPDATE usuarios SET id_tipo_usuario = 0 WHERE id = ?", [id], function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }
}