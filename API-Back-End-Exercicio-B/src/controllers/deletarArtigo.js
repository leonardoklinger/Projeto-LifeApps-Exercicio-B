exports.run = async (req, res, ArtigosInformacoes, firebaseConfigDelete) => {
    const socketio = require("../services/socket.io/socket-io")
    const { ID } = req.params
    const artigoDeletar = await ArtigosInformacoes.findByIdAndDelete({ _id: ID.replace(":", "") })
    socket(artigoDeletar)
    if(artigoDeletar == null) return res.status(500).json({ message: "O artigo já foi apagado !" })
    res.json(artigoDeletar)
    if(artigoDeletar.imagem_artigo == undefined) return
    firebaseConfigDelete.deleteIMG(artigoDeletar.imagem_artigo.split("/").pop()[0])

    function socket(data) {
        const socket = socketio.info()
        setTimeout(() => {
            socket.emit(`${data._id.toHexString()}`, 500);
        }, 500)
    }
}