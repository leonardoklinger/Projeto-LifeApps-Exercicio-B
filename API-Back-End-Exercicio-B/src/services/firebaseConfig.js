var admin = require("firebase-admin");
const bucket = admin.storage().bucket()
const BUCKET = "lifeapps-5d77d.appspot.com"
const uploadImagem = (req, res, next) => {
    if (!req.file) return next()
    const imagem = req.file
    const nomeArquivo = Date.now().toString() + '.' + imagem.originalname.split('.').pop()
    const file = bucket.file(nomeArquivo)

    const stream = file.createWriteStream({
        metadata: {
            contentType: imagem.mimetype
        }
    })
    stream.on('error', (e) => {
        console.log(e)
    })

    stream.on('finish', async () => {
        // tornar o arquivo publico
        await file.makePublic()

        // obter a url publica
        req.file.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${nomeArquivo}`
        next()
    })

    stream.end(imagem.buffer)
}


module.exports = uploadImagem
