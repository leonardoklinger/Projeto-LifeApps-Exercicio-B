exports.run = async (req, res, ArtigosInformacoes) => {
    const { titulo_artigo, text_artigo, nome_Autor } = req.body
    let data1 = new Date();
    data = { titulo_artigo, text_artigo, imagem_artigo: req.file.firebaseUrl , dataEdicao_artigo: data1.toLocaleDateString(), nome_Autor }
    criarArtigos = await ArtigosInformacoes.create(data)
    res.status(200).json(criarArtigos)
}