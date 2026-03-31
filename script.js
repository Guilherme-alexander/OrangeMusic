let musicList = [];
let currentIndex = 0;
let isPlaying = false;
let audio = new Audio();
let filteredMusicList = [];
let currentView = 'all';
let favorites = new Set();
let searchTerm = '';

// Configuração do volume
audio.volume = 1;

// Carregar favoritos do localStorage
function loadFavorites() {
    const savedFavorites = localStorage.getItem('orangeMusicFavorites');
    if (savedFavorites) {
        favorites = new Set(JSON.parse(savedFavorites));
        updateFavoriteCount();
    }
}

// Salvar favoritos no localStorage
function saveFavorites() {
    localStorage.setItem('orangeMusicFavorites', JSON.stringify([...favorites]));
    updateFavoriteCount();
    updateStats();
}

// Atualizar contador de favoritos
function updateFavoriteCount() {
    const favoriteCount = document.getElementById('favoriteCount');
    const totalFavorites = document.getElementById('totalFavorites');
    if (favoriteCount) favoriteCount.textContent = favorites.size;
    if (totalFavorites) totalFavorites.textContent = favorites.size;
}

// Atualizar estatísticas
function updateStats() {
    document.getElementById('totalFavorites').textContent = favorites.size;
}

// Alternar favorito
function toggleFavorite(musicId, event) {
    event.stopPropagation();
    
    if (favorites.has(musicId)) {
        favorites.delete(musicId);
        showToast('❤️ Removida dos favoritos');
    } else {
        favorites.add(musicId);
        showToast('💖 Adicionada aos favoritos');
    }
    
    saveFavorites();
    
    // Atualizar UI
    if (currentView === 'favorites') {
        refreshCurrentView();
    } else {
        updateFavoriteButtons();
    }
}

// Mostrar toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Atualizar botões de favorito na UI
function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const musicId = parseInt(btn.dataset.id);
        if (favorites.has(musicId)) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('favorited');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Carregar músicas do servidor
async function loadMusicFromServer() {
    try {
        const response = await fetch('/api/music');
        const data = await response.json();
        
        if (data.success && data.music.length > 0) {
            musicList = data.music;
            document.getElementById('totalSongs').textContent = musicList.length;
            loadFavorites();
            refreshCurrentView();
        } else {
            showErrorMessage();
        }
    } catch (error) {
        console.error('Erro ao carregar músicas:', error);
        showErrorMessage();
    }
}

function showErrorMessage() {
    const musicGrid = document.getElementById('musicGrid');
    musicGrid.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <i class="fas fa-folder-open" style="font-size: 48px; color: #ff6b00;"></i>
            <p style="margin-top: 20px;">Nenhuma música encontrada na pasta Music do Windows.</p>
            <p style="margin-top: 10px; color: #ff8c00;">Certifique-se de que há arquivos MP3 na pasta C:\Users\SeuUsuario\Music</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #ff6b00; border: none; border-radius: 8px; color: white; cursor: pointer;">
                <i class="fas fa-sync-alt"></i> Recarregar
            </button>
        </div>
    `;
}

// Ordenar músicas (favoritas no topo)
function sortMusicByFavorites(musicArray) {
    return [...musicArray].sort((a, b) => {
        const aFav = favorites.has(a.id);
        const bFav = favorites.has(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
    });
}

// Atualizar visualização atual
function refreshCurrentView() {
    let filtered = [];
    
    switch(currentView) {
        case 'favorites':
            filtered = musicList.filter(music => favorites.has(music.id));
            document.getElementById('sectionTitle').textContent = 'Músicas Favoritas';
            document.getElementById('searchBar').style.display = 'none';
            break;
        case 'recent':
            const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            filtered = musicList.filter(music => music.addedDate > oneWeekAgo);
            document.getElementById('sectionTitle').textContent = 'Recentemente Adicionadas';
            document.getElementById('searchBar').style.display = 'flex';
            break;
        case 'search':
            filtered = musicList.filter(music => 
                music.name.toLowerCase().includes(searchTerm) || 
                music.artist.toLowerCase().includes(searchTerm)
            );
            document.getElementById('sectionTitle').textContent = 'Resultados da Busca';
            document.getElementById('searchBar').style.display = 'flex';
            break;
        default: // 'all' ou 'home'
            filtered = musicList;
            document.getElementById('sectionTitle').textContent = 'Todas as Músicas';
            document.getElementById('searchBar').style.display = 'flex';
            break;
    }
    
    // Ordenar favoritas no topo
    filtered = sortMusicByFavorites(filtered);
    filteredMusicList = filtered;
    displayMusicList();
}

// Exibir lista de músicas
function displayMusicList() {
    const musicGrid = document.getElementById('musicGrid');
    musicGrid.innerHTML = '';
    
    if (filteredMusicList.length === 0) {
        let message = '';
        if (currentView === 'favorites') {
            message = 'Você ainda não tem músicas favoritas. 💔<br>Clique no ♡ ao lado das músicas para adicionar aos favoritos!';
        } else {
            message = 'Nenhuma música encontrada.';
        }
        musicGrid.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-heart" style="font-size: 48px; color: #ff6b00;"></i>
                <p style="margin-top: 20px;">${message}</p>
            </div>
        `;
        return;
    }
    
    filteredMusicList.forEach((music, index) => {
        const musicCard = document.createElement('div');
        musicCard.className = 'music-card';
        if (currentIndex === musicList.findIndex(m => m.id === music.id)) {
            musicCard.classList.add('active');
        }
        
        musicCard.innerHTML = `
            <button class="favorite-btn ${favorites.has(music.id) ? 'favorited' : ''}" data-id="${music.id}">
                <i class="${favorites.has(music.id) ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <div class="music-icon">
                <i class="fas fa-music"></i>
            </div>
            <div class="music-info">
                <h4 title="${music.name}">${music.name.substring(0, 30)}${music.name.length > 30 ? '...' : ''}</h4>
                <p>${music.artist}</p>
            </div>
        `;
        
        // Adicionar evento de clique para tocar música
        musicCard.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                playMusicByRealIndex(music.id);
            }
        });
        
        // Adicionar evento para botão de favorito
        const favBtn = musicCard.querySelector('.favorite-btn');
        favBtn.addEventListener('click', (e) => {
            toggleFavorite(music.id, e);
        });
        
        musicGrid.appendChild(musicCard);
    });
}

// Tocar música pelo ID real
function playMusicByRealIndex(musicId) {
    const realIndex = musicList.findIndex(m => m.id === musicId);
    if (realIndex !== -1) {
        playMusic(realIndex);
    }
}

// Tocar música
function playMusic(index) {
    if (index < 0 || index >= musicList.length) return;
    
    currentIndex = index;
    const music = musicList[currentIndex];
    
    // Parar áudio atual se estiver tocando
    if (audio.src) {
        audio.pause();
    }
    
    // Criar nova fonte de áudio
    audio.src = `/api/stream/${music.id}`;
    
    // Adicionar listener para erro de reprodução
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            updatePlayButton();
            updateNowPlaying();
        }).catch(error => {
            console.error("Erro ao reproduzir:", error);
            // Tenta reproduzir novamente após um pequeno delay
            setTimeout(() => {
                audio.play().catch(e => console.error("Falha na segunda tentativa:", e));
            }, 100);
        });
    }
    
    audio.addEventListener('loadedmetadata', () => {
        updateDuration();
    });
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        playNext();
    });
    
    updateNowPlaying();
    updateActiveCard();
}

// Atualizar card ativo
function updateActiveCard() {
    const currentMusicId = musicList[currentIndex]?.id;
    document.querySelectorAll('.music-card').forEach(card => {
        const favBtn = card.querySelector('.favorite-btn');
        if (favBtn && parseInt(favBtn.dataset.id) === currentMusicId) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Atualizar informações da música atual
function updateNowPlaying() {
    const music = musicList[currentIndex];
    if (music) {
        document.getElementById('currentTrack').textContent = music.name;
        document.getElementById('currentArtist').textContent = music.artist;
    }
}

// Atualizar botão de play/pause
function updatePlayButton() {
    const playBtn = document.getElementById('playBtn');
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Tocar/Pausar
function togglePlay() {
    if (musicList.length === 0) return;
    
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        if (!audio.src) {
            playMusic(0);
        } else {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                }).catch(error => {
                    console.error("Erro ao reproduzir:", error);
                });
            }
            isPlaying = true;
        }
    }
    updatePlayButton();
}

// Próxima música
function playNext() {
    if (musicList.length === 0) return;
    const nextIndex = (currentIndex + 1) % musicList.length;
    playMusic(nextIndex);
}

// Música anterior
function playPrevious() {
    if (musicList.length === 0) return;
    const prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    playMusic(prevIndex);
}

// Atualizar barra de progresso
function updateProgress() {
    if (audio.duration && !isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progressFill').style.width = percent + '%';
        document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
    }
}

// Atualizar duração
function updateDuration() {
    if (audio.duration && !isNaN(audio.duration)) {
        document.getElementById('duration').textContent = formatTime(audio.duration);
    }
}

// Formatar tempo
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Configurar barra de progresso clicável
function setupProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        if (audio.duration && !isNaN(audio.duration)) {
            audio.currentTime = percent * audio.duration;
        }
    });
}

// Configurar controle de volume
function setupVolumeControl() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeFill = document.getElementById('volumeFill');
    const volumeIcon = document.getElementById('volumeIcon');
    
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.volume = Math.max(0, Math.min(1, percent));
        volumeFill.style.width = (audio.volume * 100) + '%';
        
        if (audio.volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (audio.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    });
}

// Buscar músicas
function searchMusic() {
    searchTerm = document.getElementById('searchInput').value.toLowerCase();
    currentView = 'search';
    refreshCurrentView();
}

// Mudar visualização
function changeView(view) {
    currentView = view;
    refreshCurrentView();
    
    // Atualizar menu ativo
    document.querySelectorAll('.nav-menu li').forEach(li => {
        li.classList.remove('active');
        if (li.dataset.view === view) {
            li.classList.add('active');
        }
    });
}

// Event Listeners
document.getElementById('playBtn').addEventListener('click', togglePlay);
document.getElementById('nextBtn').addEventListener('click', playNext);
document.getElementById('prevBtn').addEventListener('click', playPrevious);
document.getElementById('searchInput').addEventListener('input', searchMusic);

// Navegação
document.querySelectorAll('[data-view]').forEach(element => {
    element.addEventListener('click', () => {
        const view = element.dataset.view;
        changeView(view);
    });
});

// Inicialização
function init() {
    setupProgressBar();
    setupVolumeControl();
    loadMusicFromServer();
    
    // Tratamento de erro do áudio
    audio.addEventListener('error', (e) => {
        console.error('Erro no áudio:', e);
        showToast('Erro ao reproduzir música');
    });
}

init();