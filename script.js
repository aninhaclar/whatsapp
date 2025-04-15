'use strict'

/***********FETCH API***********/
const getListarContatos = async (numero) => {
    try {
        const contatosUrl = `http://localhost:8080/v1/whatsapp/conversas/${numero}`
        const response = await fetch(contatosUrl)

        if (!response.ok) throw new Error('Erro ao buscar contatos')

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Erro na API:', error)
    }
}

const mostrarMensagens = (conversas, name) => {

    let section = document.querySelector('.mensagens')

    if (!section) {
        section = document.createElement('section')
        section.className = 'mensagens'
        document.body.appendChild(section)
    }

    section.replaceChildren()

    const header = document.createElement('header')
    header.className = 'nomeContato'

    const contatoNome = document.createElement('h2')
    contatoNome.textContent = `${name}`

    header.appendChild(contatoNome)
    section.appendChild(header)

    conversas.forEach(mensagem => {
        const linha = document.createElement('div')
        linha.className = mensagem.sender === 'me' ? 'mensagem-eu' : 'mensagem-ele'  //Mudando a class

        const texto = document.createElement('p')
        texto.textContent = mensagem.content

        const hora = document.createElement('span')
        hora.className = 'hora'
        hora.textContent = mensagem.time

        linha.appendChild(texto)
        linha.appendChild(hora)
        section.appendChild(linha)
    })
}

/***********EXIBIR CONTATOS***********/
const mostrarContatos = (contatos) => {
    const main = document.querySelector('body')
    main.replaceChildren()

    const resultados = document.createElement('section')
    resultados.className = 'resultados'

    const titulo = document.createElement('h2')
    titulo.textContent = 'Meus Contatos'
    resultados.appendChild(titulo)

    contatos.forEach(contato => {
        const container = document.createElement('div')
        container.classList.add('contato')

        const nome = document.createElement('h3')
        nome.textContent = contato.name 

        const descricao = document.createElement('p')
        descricao.textContent = contato.description || 'Sem descrição.' 

        container.appendChild(nome)
        container.appendChild(descricao)

        container.addEventListener('click', () => {
            mostrarMensagens(contato.conversas, contato.name)
        })

        resultados.appendChild(container)
    })

    main.appendChild(resultados)
}

/***********FUNÇÃO LOGIN***********/
async function logarUsuario() {
    const input = document.querySelector('.entrando')
    const numero = input.value.trim()
    if (!numero) return

    const data = await getListarContatos(numero)
    console.log('Dados da API:', data)

    if (!data || !Array.isArray(data.conversas)) {
        alert('Usuário não encontrado ou sem contatos.')
        return
    }

    mostrarContatos(data.conversas)
}

/***********EVENTO DE ENTER***********/
const precionarEnter = ({ key }) => {
    if (key === 'Enter') {
        logarUsuario()
    }
}

document.querySelector('.entrando').addEventListener('keypress', precionarEnter)