🎵 Music Hub

A tua jornada interativa pelo mundo da música.

O Music Hub é uma aplicação web desenhada para tornar a interação com a música algo divertido. A plataforma combina conteúdos organizados e aprendizagem interativa. 

📋 Índice

- Sobre o Projeto
- Funcionalidades
- Tecnologias
- Deploy
  - Deploy no Netlify

🚀 Sobre o Projeto

O Music Hub foi desenvolvido para centralizar recursos de aprendizagem musical de forma simples e envolvente. Em vez de navegar por vários sites, aqui tens teoria, prática e contexto cultural reunidos e organizados para ajudar na tua evolução musical.

✨ Funcionalidades

**Quiz "Guess the Music":**
Testa os teus conhecimentos musicais com um jogo interativo que usa samples de áudio para te desafiar a adivinhar a música correta.

**Explorador Musical Geográfico:**
Navega num mapa-mundo interativo para descobrir artistas, bandas e géneros musicais populares por país.

**Agenda de Concertos:**
Encontra eventos e concertos futuros, com a capacidade de pesquisar por artista ou localização.

**Radar de Lançamentos:**
Fica a par das novidades com uma lista atualizada dos próximos álbuns e singles da indústria musical.

**Leitor de Vídeoclips Integrado:**
Assiste aos teus videoclips favoritos diretamente na plataforma, através da integração com o YouTube.

**Chatbot Musical:**
Tira as tuas dúvidas rapidamente usando um chatbot inteligente (integrado com BOTSchool.ai) para obter informações musicais.

**Visualização de Dados:**
Explora visualizações de dados e curiosidades sobre a indústria, como o histórico de emissões de CO₂ da Taylor Swift.

🛠️ Tecnologias

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui
- APIs externas de música

🚢 Deploy

🌐 Deploy no Netlify (Recomendado)
1. Acede a https://app.netlify.com
2. Clica em Add new site → Import from Git
3. Escolhe o teu repositório GitHub/GitLab/Bitbucket
4. Configura:
  - Build command: npm run build
  - Publish directory: dist

5. Em Site Settings → Environment Variables, adiciona as variáveis do .env
6. Clica em Deploy site
