import os
import json
import mimetypes
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
import threading
import webbrowser
from datetime import datetime
import platform

class MusicServerHandler(SimpleHTTPRequestHandler):
    music_files = []
    music_dir = None
    
    @classmethod
    def scan_music_folder(cls):
        """Escaneia a pasta Music do Windows em busca de arquivos de áudio"""
        music_files = []
        
        # Detecta o sistema operacional
        system = platform.system()
        
        if system == 'Windows':
            # Caminho da pasta Music no Windows
            music_path = Path.home() / 'Music'
        elif system == 'Darwin':  # macOS
            music_path = Path.home() / 'Music'
        else:  # Linux
            music_path = Path.home() / 'Music'
        
        cls.music_dir = music_path
        
        # Extensões de áudio suportadas
        audio_extensions = {'.mp3', '.wav', '.flac', '.m4a', '.ogg', '.wma'}
        
        if music_path.exists():
            print(f"📁 Escaneando pasta: {music_path}")
            for file_path in music_path.rglob('*'):
                if file_path.suffix.lower() in audio_extensions and file_path.is_file():
                    # Obter informações do arquivo
                    stat = file_path.stat()
                    music_files.append({
                        'id': len(music_files),
                        'name': file_path.stem,
                        'filename': file_path.name,
                        'path': str(file_path),
                        'artist': 'Artista Desconhecido',
                        'addedDate': stat.st_mtime * 1000,  # Convertendo para milissegundos
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                    })
                    print(f"  ✅ Encontrado: {file_path.name}")
            
            print(f"🎵 Total de músicas encontradas: {len(music_files)}")
        else:
            print(f"⚠️ Pasta Music não encontrada em: {music_path}")
            print("   Criando pasta Music...")
            music_path.mkdir(parents=True, exist_ok=True)
            print(f"   ✅ Pasta Music criada em: {music_path}")
            print("   Adicione arquivos de música nesta pasta e reinicie o servidor.")
        
        cls.music_files = music_files
        return music_files
    
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        if parsed_path.path == '/api/music':
            self.send_music_list()
        elif parsed_path.path.startswith('/api/stream/'):
            self.stream_music(parsed_path.path)
        else:
            # Servir arquivos estáticos normalmente
            super().do_GET()
    
    def send_music_list(self):
        """Envia a lista de músicas em formato JSON"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            'success': True,
            'total': len(self.music_files),
            'music': self.music_files,
            'music_dir': str(self.music_dir) if self.music_dir else None
        }
        
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
    
    def stream_music(self, path):
        """Stream de arquivo de música"""
        try:
            # Extrair ID da música da URL
            music_id = int(path.split('/')[-1])
            
            if 0 <= music_id < len(self.music_files):
                music_file = self.music_files[music_id]
                file_path = Path(music_file['path'])
                
                if file_path.exists():
                    # Detectar tipo MIME
                    mime_type, _ = mimetypes.guess_type(str(file_path))
                    if not mime_type:
                        mime_type = 'audio/mpeg'
                    
                    # Enviar cabeçalhos
                    self.send_response(200)
                    self.send_header('Content-type', mime_type)
                    self.send_header('Content-Length', str(file_path.stat().st_size))
                    self.send_header('Accept-Ranges', 'bytes')
                    self.end_headers()
                    
                    # Enviar arquivo em chunks
                    with open(file_path, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    self.send_error(404, "Arquivo não encontrado")
            else:
                self.send_error(404, "Música não encontrada")
        except Exception as e:
            print(f"Erro ao fazer stream: {e}")
            self.send_error(500, f"Erro ao processar arquivo: {str(e)}")
    
    def log_message(self, format, *args):
        """Personalizar mensagens de log"""
        print(f"[OrangeMusic] {format % args}")

def run_server(port=8000):
    """Inicia o servidor HTTP"""
    # Escanear pasta Music
    print("🎵 OrangeMusic Server")
    print("=" * 50)
    print("🔍 Escaneando pasta Music do Windows...")
    MusicServerHandler.scan_music_folder()
    print("=" * 50)
    
    # Configurar servidor
    server_address = ('', port)
    httpd = HTTPServer(server_address, MusicServerHandler)
    
    print(f"🚀 Servidor iniciado em http://localhost:{port}")
    print("📱 Abra seu navegador e acesse o OrangeMusic")
    print("🛑 Pressione Ctrl+C para parar o servidor")
    print("=" * 50)
    
    # Abrir navegador automaticamente
    webbrowser.open(f'http://localhost:{port}')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Servidor encerrado!")

if __name__ == '__main__':
    run_server()