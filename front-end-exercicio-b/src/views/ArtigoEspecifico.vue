<template>
  <div v-if="artigo[0]" class="area">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand">Artigos</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDarkDropdown"
          aria-controls="navbarNavDarkDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDarkDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Ações
              </a>
              <ul
                class="dropdown-menu dropdown-menu-dark"
                aria-labelledby="navbarDarkDropdownMenuLink"
              >
                <li>
                  <a class="dropdown-item" v-on:click="editar(artigo[0]._id)"
                    >Editar ✏️</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" v-on:click="excluir(artigo[0]._id)"
                    >Excluir 🗑️</a
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="autor">
      <h3>
        Autor: <span>{{ autor == "" ? artigo[0].nome_Autor : autor }}</span>
      </h3>
      <!-- Math.PI > 4 ? "Yep" : "Nope"; -->
    </div>
    <div class="imagem">
      <img :src="imagem == '' ? artigo[0].imagem_artigo : imagem" />
    </div>
    <div class="titulo">
      <h4>{{ titulo == "" ? artigo[0].titulo_artigo : titulo }}</h4>
    </div>
    <div class="conteudo">
      <pre>
          <p>{{ texto == "" ? artigo[0].text_artigo : texto }}</p>
        </pre>
    </div>
    <hr />
    <div class="data">
      <h6>Data Edição: {{ dataEdicao == "" ? artigo[0].dataEdicao_artigo : dataEdicao  }}</h6>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import io from "socket.io-client";
export default {
  name: "ArtigoEspecifico",
  data() {
    return {
      id: this.$route.params.id,
      autor: "",
      titulo: "",
      imagem: "",
      texto: "",
      dataEdicao: ""
    };
  },
  methods: {
    ...mapActions(["buscarArtigoEspecifico", "excluirArtigo"]),
    async editar() {
      try {
        this.$router.push({ name: "EditarArtigo" });
      } catch (error) {
        console.log(error);
      }
    },

    async excluir(id) {
      try {
        const token = Cookie.get("token");
        if (token) {
          jwt.verify(token, "senha", async (err) => {
            if (err == null) {
              await this.excluirArtigo(id);
              this.$router.push({ name: "TodosArtigos" });
              setTimeout(() => {
                this.$router.go();
              }, 500);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    socketArtigo(data){
      if(data == 500){
        this.$router.push({ name: "ArtigoExcluido" });
      }else {
        this.autor = data.nome_Autor
        this.imagem = data.imagem_artigo
        this.titulo = data.titulo_artigo
        this.texto = data.text_artigo
        this.dataEdicao = data.dataEdicao_artigo
      }
    }
  },
  computed: {
    ...mapState(["artigo"]),
  },
  created() {
    this.socket = io("http://localhost:3000");
    this.buscarArtigoEspecifico(this.id);
  },
  mounted() {
    this.socket.on(this.id, (data) => {
      this.socketArtigo(data)
      this.messages = data
    });
  },
};
</script>

<style scoped>
* {
  font-family: "Bebas Neue", cursive;
  font-size: 20px;
}

.autor {
  padding-top: 20px;
}

.autor h3 {
  color: #c1c1c1;
  font-size: 30px;
  padding-left: 32px;
}

.autor h3 span {
  color: #c1c1c1;
  font-size: 25px;
}

.titulo {
  padding-top: 14px;
}

.titulo h4 {
  color: #c1c1c1;
  font-size: 20px;
  padding-left: 32px;
}

.conteudo {
  max-width: 93%;
}

.conteudo p {
  padding-left: 32px;
  font-size: 18;
  color: white;
}

.data h6 {
  color: #c1c1c1;
  padding-left: 65%;
}

img {
  width: 515px;
  height: 270px;
  padding-left: 32px;
}

hr {
  border: none;
  height: 4px;
  background-image: linear-gradient(to right, #f0f0f0, #8f8f8f, #f0f0f0);
}

.area {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  top: 18%;
  width: 550px;
  height: 520px;
  background: #e9e9e9;
  border-bottom: 10px solid #c0bfbf;
  top: 30px;
  margin-bottom: 30px;
  height: auto;
}
</style>