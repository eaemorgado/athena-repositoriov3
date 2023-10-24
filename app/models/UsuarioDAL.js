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

    // findUserEmail() {
    //     return new Promise((resolve, reject) => {
    //         this.athenashop.query("SELECT * FROM usuarios WHERE nome = ? or email = ?", [dadosForm.nome, dadosForm.email], function (error, elements) {
    //             if (error) {
    //                 return reject(error);
    //             }
    //             return resolve(elements);
    //         });
    //     });
    // };

    // findID(id) {
    //     return new Promise((resolve, reject) => {
    //         this.athenashop.query("SELECT id, nome, senha, email, FROM usuarios, tipo_usu t where u.status_usuario = ' and " + "u.tipo_usu = t.tipo_usu and u.id_usu = ?", [id], function(error, elements){
    //             if (error) {
    //                 return reject(error);
    //             }
    //             return resolve(elements);
    //         });
    //     });
    // };

//     create(camposJson) {
//         return new Promise((resolve, reject) => {
//             this.athenashop.query("insert into usuarios set ?", camposJson, function(error, elements){
//                 if (error) {
//                     return reject(error);
//                 }
//                 return resolve(elements);
//             });
//         });
//     };

//     update(camposJson) {
//         return new Promise((resolve, reject) => {
//             this.athenashop.query("UPDATE usuarios SET nome = ?, " + "email = ?, " + "WHERE id = ?", [camposJson.id, camposJson.nome, camposJson.email, camposJson.senha], function (error, results, fields){
//                 if (error){
//                     return reject(error);
//                 }
//                 return resolve(results);
//             });
//         });
//     }

//     delete(id) {
//         return new Promise((resolve, reject) => {
//             this.athenashop.query("UPDATE usuarios SET status_usu = 0 WHERE id = ?", [id], function(error, results) {
//                 if (error) {
//                     return reject(error);
//                 }
//                 return resolve(results[0]);
//             });
//         });
//     }

 }