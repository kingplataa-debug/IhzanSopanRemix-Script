document.addEventListener('DOMContentLoaded', () => {
  
  // SINKRONISASI NAVIGASI (MOBILE FOOTER DAN DESKTOP BAR)
  const navItems = document.querySelectorAll('.nav-item, .nav-link-desktop');
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetSection = this.getAttribute('data-target');
      
      // Hapus kelas aktif di seluruh elemen navigasi
      navItems.forEach(nav => {
        nav.classList.remove('active');
      });
      
      // Berikan kelas aktif pada elemen navigasi terpilih yang memicu trigger
      document.querySelectorAll(`[data-target="${targetSection}"]`).forEach(matchedNav => {
        matchedNav.classList.add('active');
      });
      
      // Transisi perpindahan section konten
      document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active-section');
      });
      
      const targetElement = document.getElementById(targetSection);
      if(targetElement) {
        targetElement.classList.add('active-section');
        // Auto scroll kembali ke atas halaman saat pindah menu
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // LOGIK FORM CUSTOM DATA STYLE
  const styleSelect = document.getElementById('style');
  if (styleSelect) {
    styleSelect.addEventListener('change', function() {
      const customStyleInput = document.getElementById('custom-style');
      if (this.value === 'Lainnya') {
        customStyleInput.classList.add('show');
        customStyleInput.required = true;
      } else {
        customStyleInput.classList.remove('show');
        customStyleInput.required = false;
        customStyleInput.value = '';
      }
    });
  }

  // KIRIM DATA FORM REQUEST VIA WHATSAPP
  const requestForm = document.getElementById('request-form');
  if (requestForm) {
    requestForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const songTitle = document.getElementById('song-title').value;
      const category = document.getElementById('category').value;
      const customStyle = document.getElementById('custom-style').value;
      
      let style = styleSelect.value;
      if (style === 'Lainnya' && customStyle.trim() !== '') {
        style = customStyle;
      }
      
      const message = `Halo, saya ingin request project aransemen baru:%0A%0A` +
                      `• Judul Lagu/Link: ${encodeURIComponent(songTitle)}%0A` +
                      `• Kategori Berkas: ${encodeURIComponent(category)}%0A` +
                      `• Pilihan Style: ${encodeURIComponent(style)}%0A%0A` +
                      `Berapa estimasi total biayanya?`;
      
      window.open(`https://wa.me/6285753225113?text=${message}`, '_blank');
    });
  }

  // TOMBOL BELI PRODUK VIA WHATSAPP
  document.querySelectorAll('.btn-buy').forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.getAttribute('data-product');
      const productPrice = this.getAttribute('data-price');
      
      // Ambil nilai mentah angka tanpa titik agar format ID lokal konsisten
      const cleanPrice = parseInt(productPrice.replace(/\D/g, '')) || 0;
      const formattedPrice = cleanPrice.toLocaleString('id-ID');
      
      const message = `Halo kak ihzan,%0A%0Asaya ingin membeli berkas Instant Project berikut:%0A` +
                      `• Nama Produk: ${encodeURIComponent(productName)}%0A` +
                      `• Nominal Harga: Rp ${formattedPrice}%0A%0A` +
                      `Apakah berkas FLM tersebut ready untuk dikirim?`;
      
      window.open(`https://wa.me/6285753225113?text=${message}`, '_blank');
    });
  });

  // CORE CORE AUDIO ENGINE MANAGEMENT
  const audioElement = document.getElementById('audio-element');
  const audioPlayer = document.getElementById('audio-player');
  const audioTitle = document.getElementById('audio-title');
  const currentTime = document.getElementById('current-time');
  const duration = document.getElementById('duration');
  const progressBar = document.getElementById('progress-bar');
  const progressContainer = document.getElementById('progress-container');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const stopBtn = document.getElementById('stop-btn');
  const rewindBtn = document.getElementById('rewind-btn');
  const forwardBtn = document.getElementById('forward-btn');
  const volumeSlider = document.getElementById('volume-slider');

  let isPlaying = false;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateProgress() {
    if (audioElement.duration) {
      const progress = (audioElement.currentTime / audioElement.duration) * 100;
      progressBar.style.width = `${progress}%`;
      currentTime.textContent = formatTime(audioElement.currentTime);
    }
  }

  function updateDuration() {
    if (audioElement.duration) {
      duration.textContent = formatTime(audioElement.duration);
    }
  }

  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const durationTime = audioElement.duration;
    if(durationTime) {
      audioElement.currentTime = (clickX / width) * durationTime;
    }
  }

  function updateVolume() {
    audioElement.volume = volumeSlider.value / 100;
  }

  function skipForward() {
    audioElement.currentTime += 4;
  }

  function skipBackward() {
    audioElement.currentTime -= 4;
  }

  if(audioElement) {
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', function() {
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    });
  }

  if(progressContainer) progressContainer.addEventListener('click', setProgress);
  if(rewindBtn) rewindBtn.addEventListener('click', skipBackward);
  if(forwardBtn) forwardBtn.addEventListener('click', skipForward);
  if(volumeSlider) volumeSlider.addEventListener('input', updateVolume);

  if(playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
      if (!audioElement.src) return;
      if (isPlaying) {
        audioElement.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      } else {
        audioElement.play().catch(err => console.log("Audio play error intercepted"));
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      }
      isPlaying = !isPlaying;
    });
  }

  if(stopBtn) {
    stopBtn.addEventListener('click', function() {
      audioElement.pause();
      audioElement.currentTime = 0;
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      progressBar.style.width = '0%';
      currentTime.textContent = '0:00';
    });
  }

  // EVENT ACTION BUTTON PREVIEW PLAY
  document.querySelectorAll('.btn-play').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Cegah propagasi dokumen
      const audioUrl = this.getAttribute('data-audio');
      const productTitle = this.getAttribute('data-title');
      
      if(audioElement && audioPlayer) {
        audioElement.src = audioUrl;
        audioTitle.textContent = productTitle;
        
        audioPlayer.classList.add('active');
        
        audioElement.currentTime = 0;
        audioElement.play()
          .then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
          })
          .catch(err => console.log("Playback error triggered"));
        
        setTimeout(updateDuration, 500);
      }
    });
  });

  // CLOSE PLAYER CONTROL JIKA KLIK DI LUAR CARD/PLAYER
  document.addEventListener('click', function(e) {
    if (audioPlayer && audioPlayer.classList.contains('active')) {
      const isClickInsidePlayer = audioPlayer.contains(e.target);
      const isClickOnPlayBtn = e.target.closest('.btn-play');
      
      if (!isClickInsidePlayer && !isClickOnPlayBtn) {
        audioPlayer.classList.remove('active');
        if(audioElement) {
          audioElement.pause();
          isPlaying = false;
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }
      }
    }
  });

});
