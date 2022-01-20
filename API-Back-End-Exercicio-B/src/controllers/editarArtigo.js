exports.run = async (req, res, ArtigosInformacoes, firebaseConfigDelete) => {
    const socketio = require("../services/socket.io/socket-io")
    const { _id, titulo_artigo, text_artigo, nome_Autor } = req.body
    let data1 = new Date();
    const artigoListarEspecifico = await ArtigosInformacoes.find({ _id: _id })
    if(artigoListarEspecifico[0] == undefined) return res.status(400).json({message: "Artigo não existe !"})

    if(artigoListarEspecifico[0].imagem_artigo == undefined) {
        editarArtigo()
    }else if (req.file != undefined) {
        firebaseConfigDelete.deleteIMG(artigoListarEspecifico[0].imagem_artigo.split("/").pop())
        editarArtigo()
    } else {
        data = { titulo_artigo, text_artigo, dataEdicao_artigo: data1.toLocaleDateString(), nome_Autor }
        artigoEditarBD(_id, data)
    }

    function editarArtigo(){
        data = { titulo_artigo, text_artigo, imagem_artigo: req.file.firebaseUrl, dataEdicao_artigo: data1.toLocaleDateString(), nome_Autor }
        artigoEditarBD(_id, data)
        
    }

    async function artigoEditarBD(_id, data) {
        const artigoEditar = await ArtigosInformacoes.findOneAndUpdate({ _id }, data, { new: true })
        res.json(artigoEditar)
        socket(artigoEditar)
    }

    function socket(data) {
        const socket = socketio.info()
        setTimeout(() => {
            socket.emit(`${data._id.toHexString()}`, data);
        }, 500)
    }
}