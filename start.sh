#!/bin/bash

# OrangeMusic Player - Script de inicialização

echo "========================================"
echo "       OrangeMusic Player"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Erro: Python 3 não encontrado!${NC}"
    echo "Por favor, instale o Python 3.6 ou superior."
    echo "https://www.python.org/downloads/"
    exit 1
fi

echo -e "${GREEN}✓ Python encontrado: $(python3 --version)${NC}"

# Verificar pasta Music
MUSIC_PATH="$HOME/Music"
if [ ! -d "$MUSIC_PATH" ]; then
    echo -e "${YELLOW}Aviso: Pasta Music não encontrada em $MUSIC_PATH${NC}"
    echo "Criando pasta Music..."
    mkdir -p "$MUSIC_PATH"
    echo -e "${GREEN}✓ Pasta Music criada!${NC}"
    echo ""
fi

# Verificar se há arquivos de música
MUSIC_COUNT=$(find "$MUSIC_PATH" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" -o -name "*.flac" \) 2>/dev/null | wc -l)
echo -e "${GREEN}✓ Encontradas $MUSIC_COUNT músicas na pasta Music${NC}"
echo ""

# Iniciar servidor
echo "🚀 Iniciando servidor OrangeMusic..."
echo "📱 Acesse em: http://localhost:8000"
echo "🛑 Pressione Ctrl+C para parar o servidor"
echo ""

# Executar servidor Python
python3 server.py

# Se o servidor fechar com erro
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}Erro ao iniciar o servidor!${NC}"
    echo "Verifique se a porta 8000 está disponível."
    read -p "Pressione Enter para continuar..."
fi