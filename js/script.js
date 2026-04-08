/* ============================================================
   FLORIAN FEKA – PORTFOLIO
   JavaScript: Animationen, IPv4 Calculator, Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initTypingEffect();
    initScrollReveal();
    initSkillBars();
    initCounters();
    initCardGlow();
    initParallax();
    initIPv4Calculator();
    initPortDatabase();
});

/* === PARTICLE SYSTEM === */
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const maxParticles = window.innerWidth < 768 ? 40 : 80;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37, 99, 235, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

/* === NAVBAR === */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });
}

/* === TYPING EFFECT === */
function initTypingEffect() {
    const element = document.getElementById('heroTyping');
    const phrases = [
        'Netzwerk-Infrastruktur aufbauen.',
        'VLANs segmentieren.',
        'Docker Container deployen.',
        'Monitoring konfigurieren.',
        'Firewalls absichern.',
        'Linux Server administrieren.',
        'Enterprise-Standards umsetzen.',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 60;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 30;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 60;
        }

        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

/* === SCROLL REVEAL === */
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

/* === SKILL BARS === */
function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    fills.forEach(fill => observer.observe(fill));
}

/* === COUNTER ANIMATION === */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.getAttribute('data-suffix') || '';
                const isYear = el.getAttribute('data-is-year') === 'true';

                if (isYear) {
                    el.textContent = target;
                    return;
                }

                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(current) + suffix;
                }, 25);

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* === CARD GLOW EFFECT === */
function initCardGlow() {
    const cards = document.querySelectorAll('.homelab-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });
}

/* === PARALLAX === */
function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        elements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax'));
            const rect = el.getBoundingClientRect();
            const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
            el.style.transform = `translateY(${-offset}px)`;
        });
    });
}

/* === IPv4 CALCULATOR === */
function initIPv4Calculator() {
    const calcBtn = document.getElementById('calcBtn');
    const ipInput = document.getElementById('ipInput');
    const templateSelect = document.getElementById('templateSelect');

    calcBtn.addEventListener('click', calculateSubnet);
    ipInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') calculateSubnet();
    });
    templateSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            ipInput.value = e.target.value;
            calculateSubnet();
        }
    });

    // Calculate on load
    calculateSubnet();

    function calculateSubnet() {
        const input = ipInput.value.trim();
        const parts = input.split('/');

        if (parts.length !== 2) {
            showError('Format: IP/CIDR (z.B. 192.168.1.0/24)');
            return;
        }

        const ip = parts[0];
        const cidr = parseInt(parts[1]);

        if (!isValidIP(ip)) {
            showError('Ungültige IP-Adresse');
            return;
        }

        if (isNaN(cidr) || cidr < 0 || cidr > 32) {
            showError('CIDR muss zwischen 0 und 32 sein');
            return;
        }

        const ipLong = ipToLong(ip);
        const mask = cidrToMask(cidr);
        const network = ipLong & mask;
        const broadcast = network | (~mask >>> 0);
        const wildcard = (~mask >>> 0);
        const firstHost = cidr < 31 ? network + 1 : network;
        const lastHost = cidr < 31 ? broadcast - 1 : broadcast;
        const usableHosts = cidr <= 30 ? Math.pow(2, 32 - cidr) - 2 : (cidr === 31 ? 2 : 1);

        document.getElementById('resNetwork').textContent = longToIP(network) + '/' + cidr;
        document.getElementById('resBroadcast').textContent = longToIP(broadcast);
        document.getElementById('resSubnet').textContent = longToIP(mask);
        document.getElementById('resWildcard').textContent = longToIP(wildcard);
        document.getElementById('resFirstHost').textContent = longToIP(firstHost);
        document.getElementById('resLastHost').textContent = longToIP(lastHost);
        document.getElementById('resUsable').textContent = usableHosts.toLocaleString();
        document.getElementById('resClass').textContent = getIPClass(ipLong);
        document.getElementById('resType').textContent = getIPType(ipLong);
        document.getElementById('resBinary').textContent = longToBinaryMask(mask);

        // Animate results
        document.querySelectorAll('.calc-result-row').forEach((row, i) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, i * 50);
        });
    }

    function showError(msg) {
        document.querySelectorAll('.calc-value').forEach(el => {
            el.textContent = '–';
        });
        document.getElementById('resNetwork').textContent = msg;
        document.getElementById('resNetwork').style.color = '#ef4444';
        setTimeout(() => {
            document.getElementById('resNetwork').style.color = '';
        }, 2000);
    }

    function isValidIP(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;
        return parts.every(p => {
            const num = parseInt(p);
            return !isNaN(num) && num >= 0 && num <= 255 && String(num) === p;
        });
    }

    function ipToLong(ip) {
        const parts = ip.split('.').map(Number);
        return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
    }

    function longToIP(long) {
        return [
            (long >>> 24) & 255,
            (long >>> 16) & 255,
            (long >>> 8) & 255,
            long & 255
        ].join('.');
    }

    function cidrToMask(cidr) {
        return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    }

    function longToBinaryMask(mask) {
        return [
            ((mask >>> 24) & 255).toString(2).padStart(8, '0'),
            ((mask >>> 16) & 255).toString(2).padStart(8, '0'),
            ((mask >>> 8) & 255).toString(2).padStart(8, '0'),
            (mask & 255).toString(2).padStart(8, '0')
        ].join('.');
    }

    function getIPClass(ip) {
        const first = (ip >>> 24) & 255;
        if (first < 128) return 'A';
        if (first < 192) return 'B';
        if (first < 224) return 'C';
        if (first < 240) return 'D (Multicast)';
        return 'E (Reserved)';
    }

    function getIPType(ip) {
        const first = (ip >>> 24) & 255;
        const second = (ip >>> 16) & 255;

        if (first === 10) return 'Private (RFC1918)';
        if (first === 172 && second >= 16 && second <= 31) return 'Private (RFC1918)';
        if (first === 192 && second === 168) return 'Private (RFC1918)';
        if (first === 127) return 'Loopback';
        if (first === 169 && second === 254) return 'Link-Local (APIPA)';
        if (first >= 224 && first <= 239) return 'Multicast';
        return 'Public';
    }
}

/* === PORT DATABASE === */
function initPortDatabase() {
    const ports = [
        { port: 20, proto: 'TCP', service: 'FTP-Data', desc: 'File Transfer Protocol – Datenkanal' },
        { port: 21, proto: 'TCP', service: 'FTP', desc: 'File Transfer Protocol – Steuerkanal' },
        { port: 22, proto: 'TCP', service: 'SSH', desc: 'Secure Shell – verschlüsselter Remote-Zugriff' },
        { port: 23, proto: 'TCP', service: 'Telnet', desc: 'Unverschlüsselter Remote-Zugriff' },
        { port: 25, proto: 'TCP', service: 'SMTP', desc: 'Simple Mail Transfer Protocol' },
        { port: 53, proto: 'TCP/UDP', service: 'DNS', desc: 'Domain Name System – Namensauflösung' },
        { port: 67, proto: 'UDP', service: 'DHCP', desc: 'Dynamic Host Configuration Protocol (Server)' },
        { port: 68, proto: 'UDP', service: 'DHCP', desc: 'Dynamic Host Configuration Protocol (Client)' },
        { port: 80, proto: 'TCP', service: 'HTTP', desc: 'Hypertext Transfer Protocol' },
        { port: 110, proto: 'TCP', service: 'POP3', desc: 'Post Office Protocol v3' },
        { port: 123, proto: 'UDP', service: 'NTP', desc: 'Network Time Protocol' },
        { port: 143, proto: 'TCP', service: 'IMAP', desc: 'Internet Message Access Protocol' },
        { port: 161, proto: 'UDP', service: 'SNMP', desc: 'Simple Network Management Protocol' },
        { port: 443, proto: 'TCP', service: 'HTTPS', desc: 'HTTP over TLS/SSL – verschlüsseltes Web' },
        { port: 465, proto: 'TCP', service: 'SMTPS', desc: 'SMTP über SSL' },
        { port: 514, proto: 'UDP', service: 'Syslog', desc: 'System Logging Protocol' },
        { port: 587, proto: 'TCP', service: 'SMTP', desc: 'SMTP – Mail Submission' },
        { port: 993, proto: 'TCP', service: 'IMAPS', desc: 'IMAP über SSL' },
        { port: 995, proto: 'TCP', service: 'POP3S', desc: 'POP3 über SSL' },
        { port: 1194, proto: 'UDP', service: 'OpenVPN', desc: 'OpenVPN Tunnel' },
        { port: 1883, proto: 'TCP', service: 'MQTT', desc: 'Message Queuing Telemetry Transport' },
        { port: 3000, proto: 'TCP', service: 'Grafana', desc: 'Grafana Monitoring Dashboard' },
        { port: 3306, proto: 'TCP', service: 'MySQL', desc: 'MySQL/MariaDB Datenbank' },
        { port: 5432, proto: 'TCP', service: 'PostgreSQL', desc: 'PostgreSQL Datenbank' },
        { port: 8080, proto: 'TCP', service: 'HTTP-Alt', desc: 'Alternativer HTTP-Port (Proxy/Dev)' },
        { port: 8443, proto: 'TCP', service: 'HTTPS-Alt', desc: 'Alternativer HTTPS-Port' },
        { port: 9090, proto: 'TCP', service: 'Prometheus', desc: 'Prometheus Monitoring' },
        { port: 51820, proto: 'UDP', service: 'WireGuard', desc: 'WireGuard VPN Tunnel' },
    ];

    const searchInput = document.getElementById('portSearch');
    const tableBody = document.getElementById('portTableBody');

    function renderPorts(filter = '') {
        const filtered = filter
            ? ports.filter(p =>
                String(p.port).includes(filter) ||
                p.service.toLowerCase().includes(filter.toLowerCase()) ||
                p.desc.toLowerCase().includes(filter.toLowerCase()) ||
                p.proto.toLowerCase().includes(filter.toLowerCase())
            )
            : ports;

        tableBody.innerHTML = filtered.map(p => `
            <tr>
                <td class="port-num">${p.port}</td>
                <td>${p.proto}</td>
                <td><strong>${p.service}</strong></td>
                <td>${p.desc}</td>
            </tr>
        `).join('');

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Keine Ergebnisse</td></tr>';
        }
    }

    searchInput.addEventListener('input', (e) => {
        renderPorts(e.target.value);
    });

    renderPorts();
}
