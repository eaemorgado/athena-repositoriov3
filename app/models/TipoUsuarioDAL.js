module.exports = class TipoUsuarioDAL {

    constructor(athenashop) {
        this.athenashop = athenashop;
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.athenashop.query('SELECT * FROM tipo_usu where status_tipo_usu = 1', function (error, elements) {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    findID(id) {
        return new Promise((resolve, reject) => {
            this.conexao.query("select*from tipo_usu where id_tipo_usu = ? and status_tipo_usu = 1", [id], function (error, results){
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }

    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.conexao.query("insert into tipo_usu set ?",
            camposJson,
            function (error, elements) {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    }

    update(camposJson) {
        return new Promise((resolve, reject) => {
            this.conexao.query(
                "UPDATE tipo_usu SET tipo_usu = ?, descricao_usu = ? WHERE id_tipo_usu = ?",
                [camposJson.tipo_usu, camposJson.descricao_usu, camposJson.id_tipo_usu],
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
            this.conexao.query("UPDATE tipo_usu SET status_tipo_usu = 0 WHERE id_tipo_usu = ?", [id], function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }
}