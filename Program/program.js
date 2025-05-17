-document.addEventListener('DOMContentLoaded', function () {

    // --- Modal Program Logic ---
    const programModalElement = document.getElementById('programModal');
    if (programModalElement) {
        const modalTitle = programModalElement.querySelector('#modalProgramTitle');
        const modalLogo = programModalElement.querySelector('#modalProgramLogo');
        const modalDescription = programModalElement.querySelector('#modalProgramDescription');
        const modalRegistrationInfo = programModalElement.querySelector('#modalProgramRegistrationInfo'); // Updated ID
        const formProgramNameInput = programModalElement.querySelector('#formProgramName'); // Get hidden input
        const registrationForm = programModalElement.querySelector('#registrationForm'); // Mendapatkan Form

        // --- Event listener saat modal ditampilkan ---
        programModalElement.addEventListener('show.bs.modal', function (event) {
            const card = event.relatedTarget;
            const title = card.getAttribute('data-program-title');
            const logoSrc = card.getAttribute('data-program-logo');
            const description = card.getAttribute('data-program-description');
            const registrationText = card.getAttribute('data-program-registration'); // Get registration text

            // Update konten modal (detail program)
            if (modalTitle) modalTitle.textContent = title;
            if (modalLogo) {
                modalLogo.src = logoSrc ? logoSrc : 'images/placeholder-logo.png';
                modalLogo.alt = title + " Logo";
            }
            if (modalDescription) modalDescription.textContent = description;
            // Update info kontak pendaftaran (jika masih ingin ditampilkan)
            if (modalRegistrationInfo) modalRegistrationInfo.textContent = registrationText;

            // Update nilai hidden input di form dengan nama program
            if (formProgramNameInput) formProgramNameInput.value = title;

            // Reset form setiap kali modal dibuka (opsional, tapi bagus)
            if (registrationForm) registrationForm.reset();
        });

        // --- Event listener untuk form submission ---
        if (registrationForm) {
            registrationForm.addEventListener('submit', function (event) {
                event.preventDefault(); // Mencegah pengiriman form standar (yang akan me-refresh halaman)

                // Ambil data dari form
                const formData = new FormData(registrationForm);
                const program = formData.get('programName');
                const name = formData.get('fullName');
                const studentClass = formData.get('class');
                const contact = formData.get('contact');
                const reason = formData.get('reason');

                // --- Melakukan aksi dengan data form ---

                // CONTOH 1: Menampilkan alert konfirmasi (paling sederhana)
                alert(`Terima kasih, ${name}!\n\nPendaftaran Anda untuk program "${program}" telah diterima (simulasi).\n\nKelas: ${studentClass}\nKontak: ${contact}\nAlasan: ${reason || '-'}\n\nKami akan segera menghubungi Anda.`);

                // CONTOH 2: Mengirim data ke server (membutuhkan backend)
                /*
                fetch('/api/register-program', { // Ganti dengan URL endpoint backend Anda
                    method: 'POST',
                    body: formData // Kirim data form
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(`Terima kasih, ${name}! Pendaftaran Anda untuk program "${program}" berhasil dikirim.`);
                        // Tutup modal setelah berhasil
                        bootstrap.Modal.getInstance(programModalElement).hide();
                    } else {
                        alert(`Maaf, terjadi kesalahan: ${data.message || 'Gagal mengirim pendaftaran.'}`);
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    alert('Maaf, terjadi kesalahan koneksi saat mengirim pendaftaran.');
                });
                */

                // Setelah alert atau pengiriman (jika tidak ditutup otomatis), Anda bisa:
                // registrationForm.reset(); // Reset form lagi
                bootstrap.Modal.getInstance(programModalElement).hide(); // Tutup modal setelah submit

            });
        }
    }

    // --- Kode lain (Filter Prestasi, Navigasi Aktif, Animasi Statistik) ---
   

    // --- Achievement filter functionality ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    const achievementCards = document.querySelectorAll('.achievements-grid .achievement-card');

    if (filterTabs.length > 0 && achievementCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                achievementCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    const parentCol = card.closest('.col-md-6');
                    if (filter === 'all' || cardCategory === filter) {
                        if (parentCol) parentCol.style.display = 'block';
                        else card.style.display = 'block';
                    } else {
                        if (parentCol) parentCol.style.display = 'none';
                        else card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Navigation active state ---
    const navLinks = document.querySelectorAll('header nav ul li a');
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split("/").pop();
        link.classList.remove('active');
        if ((linkPath === currentPath) || (link.textContent === 'Home' && currentPath === 'index.html') || link.classList.contains('active')) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
        link.addEventListener('click', function (e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- Animate stats on scroll ---
    const statsSection = document.querySelector('.stats-cards');
    if (statsSection) {
        const statNumbers = statsSection.querySelectorAll('.stat-number');
        let animated = false;
        const animateStats = () => {
            const statsSectionTop = statsSection.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight - 100;
            if (statsSectionTop < triggerPoint && !animated) {
                statNumbers.forEach(statNumber => {
                    const targetValue = parseInt(statNumber.textContent.replace(/,/g, ''), 10);
                    let currentValue = 0;
                    const duration = 1500;
                    const stepTime = 16;
                    const totalSteps = duration / stepTime;
                    const increment = targetValue / totalSteps;
                    const updateCounter = () => {
                        currentValue += increment;
                        if (currentValue < targetValue) {
                            statNumber.textContent = Math.floor(currentValue);
                            requestAnimationFrame(updateCounter);
                        } else {
                            statNumber.textContent = targetValue.toLocaleString();
                        }
                    };
                    requestAnimationFrame(updateCounter);
                });
                animated = true;
            }
        };
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => { clearTimeout(timeout); func(...args); };
                clearTimeout(timeout); timeout = setTimeout(later, wait);
            };
        };
        const animateStatsDebounced = debounce(animateStats, 50);
        animateStats();
        window.addEventListener('scroll', animateStatsDebounced);
    }

});