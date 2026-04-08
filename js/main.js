/* ═══════════════════════════════════════════════════════════
   FLORIAN FEKA – PORTFOLIO  |  main.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── CANVAS BACKGROUND (particle grid) ─── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.5 + 0.5,
    };
  }

  function init() {
    resize();
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(0,212,255,0.03)';
    ctx.lineWidth   = 1;
    const step = 80;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.35)';
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - d / 130)})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();

/* ─── NAVBAR SCROLL ─── */
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ─── MOBILE BURGER ─── */
(function () {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobile-menu');
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ─── ACTIVE NAV LINK ─── */
(function () {
  const links    = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ─── FADE IN ON SCROLL ─── */
(function () {
  const items = document.querySelectorAll(
    '.glass-card, .tl-item, .stat-card, .hero-badge, .hero-name, .hero-subtitle, .hero-sub2, .hero-cta'
  );
  items.forEach(el => el.classList.add('fade-in'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });

  items.forEach(el => io.observe(el));
})();

/* ─── SKILL BAR ANIMATION ─── */
(function () {
  const fills = document.querySelectorAll('.skill-fill');
  const io    = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animated'); io.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
})();

/* ─── TOOL TABS ─── */
(function () {
  document.querySelectorAll('.tool-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
})();

/* ─── SUBNET CALCULATOR ─── */
(function () {
  function ipToNum(ip) {
    return ip.split('.').reduce((acc, v) => (acc << 8) + parseInt(v, 10), 0) >>> 0;
  }
  function numToIp(n) {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  }
  function numToBin(n) {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
      .map(o => o.toString(2).padStart(8, '0'))
      .join('.');
  }
  function classify(ip) {
    const first = (ip >>> 24) & 255;
    if (first < 128) return 'A';
    if (first < 192) return 'B';
    if (first < 224) return 'C';
    if (first < 240) return 'D';
    return 'E';
  }
  function typeOf(ip) {
    const a = (ip >>> 24) & 255, b = (ip >>> 16) & 255;
    if (a === 10) return 'Private (RFC1918)';
    if (a === 172 && b >= 16 && b <= 31) return 'Private (RFC1918)';
    if (a === 192 && b === 168) return 'Private (RFC1918)';
    if (a === 127) return 'Loopback';
    if (a === 169 && b === 254) return 'Link-Local';
    if (a >= 224 && a <= 239) return 'Multicast';
    return 'Public';
  }

  function calc() {
    const raw  = document.getElementById('ip-input').value.trim();
    const cidr = parseInt(document.getElementById('cidr-select').value);
    const parts = raw.split('.');
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      alert('Ungültige IP-Adresse. Beispiel: 192.168.1.0');
      return;
    }
    const mask   = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const ipNum  = ipToNum(raw);
    const net    = (ipNum & mask) >>> 0;
    const bcast  = (net | (~mask >>> 0)) >>> 0;
    const first  = cidr < 31 ? net + 1 : net;
    const last   = cidr < 31 ? bcast - 1 : bcast;
    const hosts  = cidr < 31 ? Math.pow(2, 32 - cidr) - 2 : (cidr === 31 ? 2 : 1);
    const wild   = (~mask) >>> 0;

    document.getElementById('r-network').textContent  = numToIp(net)   + '/' + cidr;
    document.getElementById('r-broadcast').textContent= numToIp(bcast);
    document.getElementById('r-mask').textContent     = numToIp(mask);
    document.getElementById('r-wildcard').textContent = numToIp(wild);
    document.getElementById('r-first').textContent    = numToIp(first);
    document.getElementById('r-last').textContent     = numToIp(last);
    document.getElementById('r-hosts').textContent    = hosts.toLocaleString();
    document.getElementById('r-class').textContent    = classify(ipNum);
    document.getElementById('r-type').textContent     = typeOf(ipNum);
    document.getElementById('r-binary').textContent   = numToBin(mask);
  }

  document.getElementById('calc-btn').addEventListener('click', calc);
  document.getElementById('ip-input').addEventListener('keydown', e => { if (e.key === 'Enter') calc(); });

  document.getElementById('template-select').addEventListener('change', function () {
    if (!this.value) return;
    const [ip, cidr] = this.value.split('/');
    document.getElementById('ip-input').value = ip;
    document.getElementById('cidr-select').value = cidr;
    calc();
    this.value = '';
  });

  // auto calc on load
  document.getElementById('ip-input').value = '192.168.1.0';
  calc();
})();

/* ─── PORT DATABASE ─── */
(function () {
  const PORTS = [
    // Web
    { port: 80,   proto: 'tcp', service: 'HTTP',        desc: 'Hypertext Transfer Protocol – unverschlüsselt',     cat: 'Web' },
    { port: 443,  proto: 'tcp', service: 'HTTPS',       desc: 'HTTP Secure – TLS-verschlüsselt',                   cat: 'Web' },
    { port: 8080, proto: 'tcp', service: 'HTTP-Alt',    desc: 'Alternativer HTTP-Port für Dev/Proxy',              cat: 'Web' },
    { port: 8443, proto: 'tcp', service: 'HTTPS-Alt',   desc: 'Alternativer HTTPS-Port',                           cat: 'Web' },
    { port: 3000, proto: 'tcp', service: 'Dev Server',  desc: 'Node.js / React Dev-Server (Standard)',             cat: 'Web' },
    // Remote Access
    { port: 22,   proto: 'tcp', service: 'SSH',         desc: 'Secure Shell – verschlüsselter Fernzugriff',        cat: 'Remote' },
    { port: 23,   proto: 'tcp', service: 'Telnet',      desc: 'Unverschlüsselter Fernzugriff (veraltet)',          cat: 'Remote' },
    { port: 3389, proto: 'tcp', service: 'RDP',         desc: 'Remote Desktop Protocol (Windows)',                  cat: 'Remote' },
    { port: 5900, proto: 'tcp', service: 'VNC',         desc: 'Virtual Network Computing – Ferndesktop',           cat: 'Remote' },
    // VPN
    { port: 1194, proto: 'udp', service: 'OpenVPN',     desc: 'OpenVPN – Standard UDP-Port',                       cat: 'VPN' },
    { port: 51820, proto: 'udp', service: 'WireGuard',  desc: 'WireGuard VPN – modernes UDP-Protokoll',            cat: 'VPN' },
    { port: 500,  proto: 'udp', service: 'IKEv2/IPSec', desc: 'IKEv2 – Key Exchange für IPSec',                    cat: 'VPN' },
    { port: 4500, proto: 'udp', service: 'IPSec NAT-T', desc: 'IPSec NAT Traversal',                               cat: 'VPN' },
    // DNS
    { port: 53,   proto: 'both', service: 'DNS',        desc: 'Domain Name System – Namensauflösung',             cat: 'DNS' },
    { port: 853,  proto: 'tcp', service: 'DNS-over-TLS', desc: 'Verschlüsselte DNS-Anfragen (DoT)',                cat: 'DNS' },
    { port: 5353, proto: 'udp', service: 'mDNS',        desc: 'Multicast DNS – lokale Namensauflösung',           cat: 'DNS' },
    // Mail
    { port: 25,   proto: 'tcp', service: 'SMTP',        desc: 'Simple Mail Transfer Protocol',                    cat: 'Mail' },
    { port: 465,  proto: 'tcp', service: 'SMTPS',       desc: 'SMTP über SSL/TLS',                                cat: 'Mail' },
    { port: 587,  proto: 'tcp', service: 'SMTP Sub.',   desc: 'SMTP Submission (AuthSMTP)',                        cat: 'Mail' },
    { port: 110,  proto: 'tcp', service: 'POP3',        desc: 'Post Office Protocol v3',                          cat: 'Mail' },
    { port: 995,  proto: 'tcp', service: 'POP3S',       desc: 'POP3 über SSL/TLS',                                cat: 'Mail' },
    { port: 143,  proto: 'tcp', service: 'IMAP',        desc: 'Internet Message Access Protocol',                 cat: 'Mail' },
    { port: 993,  proto: 'tcp', service: 'IMAPS',       desc: 'IMAP über SSL/TLS',                                cat: 'Mail' },
    // File Transfer
    { port: 20,   proto: 'tcp', service: 'FTP Data',    desc: 'FTP Datenverbindung',                              cat: 'File' },
    { port: 21,   proto: 'tcp', service: 'FTP Control', desc: 'FTP Steuerverbindung',                             cat: 'File' },
    { port: 69,   proto: 'udp', service: 'TFTP',        desc: 'Trivial FTP – netzwerkloses Booten',               cat: 'File' },
    { port: 115,  proto: 'tcp', service: 'SFTP',        desc: 'Simple FTP (nicht SSH-SFTP)',                      cat: 'File' },
    { port: 445,  proto: 'tcp', service: 'SMB',         desc: 'Server Message Block – Windows-Freigaben',         cat: 'File' },
    { port: 137,  proto: 'udp', service: 'NetBIOS NS',  desc: 'NetBIOS Name Service',                             cat: 'File' },
    { port: 139,  proto: 'tcp', service: 'NetBIOS SS',  desc: 'NetBIOS Session Service',                          cat: 'File' },
    // Monitoring
    { port: 161,  proto: 'udp', service: 'SNMP',        desc: 'Simple Network Management Protocol',               cat: 'Monitoring' },
    { port: 162,  proto: 'udp', service: 'SNMP Trap',   desc: 'SNMP Trap – aktive Benachrichtigungen',            cat: 'Monitoring' },
    { port: 9100, proto: 'tcp', service: 'Prometheus',  desc: 'Prometheus Node Exporter (Standard)',               cat: 'Monitoring' },
    { port: 3001, proto: 'tcp', service: 'Uptime Kuma', desc: 'Uptime Kuma Monitoring Dashboard',                  cat: 'Monitoring' },
    { port: 3100, proto: 'tcp', service: 'Loki',        desc: 'Grafana Loki – Log-Aggregation',                   cat: 'Monitoring' },
    // Database
    { port: 3306, proto: 'tcp', service: 'MySQL',       desc: 'MySQL / MariaDB Datenbankserver',                  cat: 'Database' },
    { port: 5432, proto: 'tcp', service: 'PostgreSQL',  desc: 'PostgreSQL Datenbankserver',                       cat: 'Database' },
    { port: 6379, proto: 'tcp', service: 'Redis',       desc: 'Redis In-Memory Datenstrukturserver',              cat: 'Database' },
    { port: 27017, proto: 'tcp', service: 'MongoDB',    desc: 'MongoDB Dokumentendatenbank',                      cat: 'Database' },
    { port: 1433, proto: 'tcp', service: 'MSSQL',       desc: 'Microsoft SQL Server',                             cat: 'Database' },
    // Network Services
    { port: 67,   proto: 'udp', service: 'DHCP Server', desc: 'DHCP Serverport',                                  cat: 'Network' },
    { port: 68,   proto: 'udp', service: 'DHCP Client', desc: 'DHCP Clientport',                                  cat: 'Network' },
    { port: 123,  proto: 'udp', service: 'NTP',         desc: 'Network Time Protocol – Zeitsynchronisation',      cat: 'Network' },
    { port: 179,  proto: 'tcp', service: 'BGP',         desc: 'Border Gateway Protocol – Routing',                cat: 'Network' },
    { port: 389,  proto: 'tcp', service: 'LDAP',        desc: 'Lightweight Directory Access Protocol',            cat: 'Network' },
    { port: 636,  proto: 'tcp', service: 'LDAPS',       desc: 'LDAP über SSL/TLS',                                cat: 'Network' },
    { port: 88,   proto: 'tcp', service: 'Kerberos',    desc: 'Kerberos Authentifizierung',                       cat: 'Network' },
    // Container/Proxy
    { port: 2375, proto: 'tcp', service: 'Docker',      desc: 'Docker API (unverschlüsselt)',                     cat: 'Container' },
    { port: 2376, proto: 'tcp', service: 'Docker TLS',  desc: 'Docker API über TLS',                              cat: 'Container' },
    { port: 6443, proto: 'tcp', service: 'K8s API',     desc: 'Kubernetes API Server',                            cat: 'Container' },
    { port: 8096, proto: 'tcp', service: 'Jellyfin',    desc: 'Jellyfin Media Server (HTTP)',                     cat: 'Container' },
    { port: 32400, proto: 'tcp', service: 'Plex',       desc: 'Plex Media Server',                                cat: 'Container' },
    // Security
    { port: 1194, proto: 'tcp', service: 'OpenVPN TCP', desc: 'OpenVPN TCP-Fallback',                             cat: 'VPN' },
    { port: 7080, proto: 'tcp', service: 'Pangolin',    desc: 'Pangolin Reverse Proxy (HTTP)',                    cat: 'Proxy' },
    { port: 7443, proto: 'tcp', service: 'Pangolin TLS', desc: 'Pangolin Reverse Proxy (HTTPS)',                  cat: 'Proxy' },
    { port: 9000, proto: 'tcp', service: 'Portainer',   desc: 'Portainer Docker Management',                      cat: 'Container' },
    { port: 9090, proto: 'tcp', service: 'Prometheus',  desc: 'Prometheus Webinterface',                          cat: 'Monitoring' },
    { port: 8123, proto: 'tcp', service: 'Home Assistant', desc: 'Home Assistant Smart Home',                     cat: 'Container' },
    { port: 9443, proto: 'tcp', service: 'Portainer TLS', desc: 'Portainer über HTTPS',                           cat: 'Container' },
    { port: 53317, proto: 'tcp', service: 'LocalSend',  desc: 'LocalSend Dateiübertragung',                       cat: 'File' },
    { port: 4000, proto: 'tcp', service: 'AdGuard',     desc: 'AdGuard Home Webinterface',                        cat: 'DNS' },
    { port: 3478, proto: 'udp', service: 'STUN/TURN',   desc: 'WebRTC STUN/TURN Relay',                           cat: 'Network' },
    { port: 8883, proto: 'tcp', service: 'MQTT TLS',    desc: 'MQTT über TLS',                                    cat: 'Network' },
    { port: 1883, proto: 'tcp', service: 'MQTT',        desc: 'Message Queuing Telemetry Transport',              cat: 'Network' },
    { port: 5000, proto: 'tcp', service: 'Dev / Flask', desc: 'Flask / Synology DS Photo Standard',              cat: 'Web' },
    { port: 8000, proto: 'tcp', service: 'HTTP Dev',    desc: 'Alternativer Dev-HTTP-Port',                       cat: 'Web' },
    { port: 10250, proto: 'tcp', service: 'Kubelet',    desc: 'Kubernetes Kubelet API',                           cat: 'Container' },
    { port: 2049, proto: 'tcp', service: 'NFS',         desc: 'Network File System',                              cat: 'File' },
    { port: 111,  proto: 'both', service: 'RPC',        desc: 'Remote Procedure Call / Portmapper',               cat: 'Network' },
    { port: 8888, proto: 'tcp', service: 'Jupyter',     desc: 'Jupyter Notebook Server',                          cat: 'Web' },
    { port: 2222, proto: 'tcp', service: 'SSH Alt',     desc: 'Alternativer SSH-Port (Sicherheit)',               cat: 'Remote' },
  ];
  PORTS.sort((a, b) => a.port - b.port);

  let filtered = [...PORTS];
  let currentProto = 'all';
  let searchTerm   = '';

  function protoClass(p) {
    if (p === 'tcp')  return 'proto-tcp';
    if (p === 'udp')  return 'proto-udp';
    return 'proto-both';
  }
  function protoLabel(p) {
    if (p === 'both') return 'TCP+UDP';
    return p.toUpperCase();
  }

  function render() {
    const q = searchTerm.toLowerCase();
    filtered = PORTS.filter(p => {
      const matchProto = currentProto === 'all' || p.proto === currentProto || p.proto === 'both';
      const matchQ = !q || String(p.port).includes(q) || p.service.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      return matchProto && matchQ;
    });
    const tbody = document.getElementById('port-tbody');
    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td><span class="port-num">${p.port}</span></td>
        <td><span class="proto-badge ${protoClass(p.proto)}">${protoLabel(p.proto)}</span></td>
        <td style="font-weight:600;color:var(--text)">${p.service}</td>
        <td>${p.desc}</td>
        <td><span class="cat-badge">${p.cat}</span></td>
      </tr>
    `).join('');
    document.getElementById('port-count').textContent =
      `${filtered.length} von ${PORTS.length} Ports angezeigt`;
  }

  document.getElementById('port-search').addEventListener('input', function () {
    searchTerm = this.value;
    render();
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentProto = this.dataset.proto;
      render();
    });
  });

  render();
})();

/* ─── CONTACT FORM ─── */
(function () {
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('form-name').value;
    const email   = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value || 'Kontaktanfrage';
    const msg     = document.getElementById('form-msg').value;
    const body    = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${msg}`);
    const subj    = encodeURIComponent(subject);
    window.location.href = `mailto:office@flockii69.com?subject=${subj}&body=${body}`;
  });
})();
