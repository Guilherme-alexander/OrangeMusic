# 🍊 OrangeMusic - Player de Música estilo Spotify 🎵

Um player de música completo com tema laranja e preto, similar ao Spotify, que carrega automaticamente todas as músicas da pasta Music do Windows.

![OrangeMusic Screenshot](https://github.com/Guilherme-alexander/OrangeMusic/img/screenshot.png)

## ✨ Funcionalidades

- 🎵 **Carregamento Automático**: Escaneia automaticamente a pasta `C:\Users\SeuUsuario\Music` em busca de arquivos de áudio
- 💖 **Sistema de Favoritos**: Marque suas músicas favoritas com um clique
- 🔍 **Busca em Tempo Real**: Encontre músicas rapidamente pelo nome
- 🎨 **Design Moderno**: Tema exclusivo em laranja e preto com efeitos de gradiente
- 🎮 **Player Completo**: Controles de play/pause, próximo/anterior, barra de progresso e volume
- 📊 **Estatísticas**: Visualize o total de músicas e favoritos
- 📱 **Responsivo**: Funciona perfeitamente em desktop e dispositivos móveis
- 💾 **Persistência**: Favoritos salvos localmente no navegador

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python 3.x (servidor HTTP com streaming de áudio)
- **APIs**: File System Access API, Web Audio API
- **Design**: Font Awesome 6.4.0, CSS Grid, Flexbox

## 📋 Pré-requisitos

- Python 3.6 ou superior
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Arquivos de música (MP3, WAV, M4A, etc.) na pasta Music

## 🛠️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/Guilherme-alexander/OrangeMusic.git
cd orangemusic
```

### 2. Execute o servidor

**Windows:**
```bash
start.bat
```
ou
```bash
python server.py
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```
ou
```bash
python3 server.py
```

### 3. Acesse o player
O navegador abrirá automaticamente em `http://localhost:8000`

## 📁 Estrutura do Projeto

```
orangemusic/
├── index.html          # Página principal
├── style.css           # Estilos do player
├── script.js           # Lógica do frontend
├── server.py           # Servidor Python com streaming
├── start.bat           # Script de inicialização (Windows)
├── start.sh            # Script de inicialização (Linux/Mac)
├── requirements.txt    # Dependências Python
└── README.md          # Documentação
```

## 🎯 Como Usar

### Adicionar Músicas
1. Coloque seus arquivos de música na pasta `C:\Users\SeuUsuario\Music`
2. Reinicie o servidor ou recarregue a página
3. As músicas aparecerão automaticamente no player

### Favoritar Músicas
- Clique no coração (♥) ao lado de cada música para adicionar aos favoritos
- As músicas favoritas aparecem no topo da lista
- Acesse a seção "Favoritas" para ver apenas suas músicas favoritas

### Buscar Músicas
- Use a barra de busca no topo para encontrar músicas pelo nome

### Controles do Player
- ▶️ Play/Pause: Clique no botão central
- ⏮️ Anterior: Próximo botão
- ⏭️ Próximo: Botão avançar
- 📊 Barra de Progresso: Clique para avançar/retroceder
- 🔊 Volume: Ajuste na barra de volume à direita

## 🎨 Personalização

### Cores
As cores principais podem ser alteradas no arquivo `style.css`:
- Laranja principal: `#ff6b00`
- Laranja claro: `#ff8c00`
- Preto: `#000000` e `#1a1a1a`

### Extensões de Áudio Suportadas
O servidor reconhece os seguintes formatos:
- MP3 (.mp3)
- WAV (.wav)
- FLAC (.flac)
- M4A (.m4a)
- OGG (.ogg)
- WMA (.wma)

## 🐛 Solução de Problemas

### Nenhuma música encontrada
- Verifique se há arquivos de áudio na pasta `C:\Users\SeuUsuario\Music`
- Confirme se os arquivos têm extensões suportadas (.mp3, .wav, etc.)
- Reinicie o servidor após adicionar novas músicas

### Erro de reprodução
- Atualize a página e tente novamente
- Verifique se o arquivo de música não está corrompido
- Teste com um arquivo MP3 simples

### Servidor não inicia
- Verifique se o Python está instalado: `python --version`
- Confirme se a porta 8000 está disponível
- Execute como administrador se necessário

## 🔧 Configuração Avançada

### Alterar Porta do Servidor
Edite o arquivo `server.py`:
```python
run_server(port=8000)  # Altere para a porta desejada
```

### Adicionar Mais Formatos de Áudio
No arquivo `server.py`, adicione extensões à lista:
```python
audio_extensions = {'.mp3', '.wav', '.flac', '.m4a', '.ogg', '.wma', '.aac'}
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📧 Contato

- **Autor**: Guilherme Alexander
- **GitHub**: https://github.com/Guilherme-alexander

## 🙏 Agradecimentos

- Font Awesome pelos ícones incríveis
- Spotify pela inspiração no design
- Comunidade open-source pelo suporte

---

⭐ Se você gostou do projeto, não esqueça de dar uma estrela no GitHub!