import React from "react";
import { useEffect } from "react";
import "../style.css";

const App = () => {
    useEffect(() => {
        // Web connecting effect
        const canvas = document.getElementById("webCanvas");
        const ctx = canvas?.getContext("2d");
        let width = window.innerWidth;
        let height = window.innerHeight;
        let points = [];
        const numPoints = 70;
        const connectionDistance = 160;
        const mouseRadius = 200;
        let mouseX = null;
        let mouseY = null;

        const resizeCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            if (canvas) {
                canvas.width = width;
                canvas.height = height;
            }
            generatePoints();
        };

        const generatePoints = () => {
            points = [];
            for (let i = 0; i < numPoints; i++) {
                points.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    radius: Math.random() * 2.5 + 1.5,
                });
            }
        };

        const updatePoints = () => {
            points.forEach((point) => {
                point.x += point.vx;
                point.y += point.vy;

                if (point.x < 10 || point.x > width - 10) point.vx *= -0.98;
                if (point.y < 10 || point.y > height - 10) point.vy *= -0.98;
                point.x = Math.max(5, Math.min(width - 5, point.x));
                point.y = Math.max(5, Math.min(height - 5, point.y));

                if (mouseX !== null && mouseY !== null) {
                    const dx = point.x - mouseX;
                    const dy = point.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseRadius) {
                        const angle = Math.atan2(dy, dx);
                        const force = ((mouseRadius - dist) / mouseRadius) * 1.2;
                        point.x += Math.cos(angle) * force;
                        point.y += Math.sin(angle) * force;
                    }
                }
            });
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            points.forEach((point, i) => {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = point.x - points[j].x;
                    const dy = point.y - points[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.35;
                        ctx.beginPath();
                        ctx.moveTo(point.x, point.y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });
            points.forEach((point) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, point.radius + 2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(59, 130, 246, 0.12)";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(59, 130, 246, 0.55)";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(point.x, point.y, point.radius / 1.5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(96, 165, 250, 0.85)";
                ctx.fill();
            });
            updatePoints();
            requestAnimationFrame(draw);
        };

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const onMouseLeave = () => {
            mouseX = null;
            mouseY = null;
        };

        const onTouchMove = (e) => {
            if (e.touches[0]) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            }
        };

        const onTouchEnd = () => {
            mouseX = null;
            mouseY = null;
        };

        const typedTextSpan = document.querySelector(".typed-text");
        const roles = [
            "Senior Software Engineer",
            "Full Stack Web Developer",
            "Node.js & Java Engineer",
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingDelay = 100;
        const erasingDelay = 60;
        const newRoleDelay = 2000;

        const typeEffect = () => {
            if (!typedTextSpan) return;
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeEffect, 500);
                    return;
                }
                setTimeout(typeEffect, erasingDelay);
            } else {
                typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentRole.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, newRoleDelay);
                    return;
                }
                setTimeout(typeEffect, typingDelay);
            }
        };

        const sections = document.querySelectorAll("section");

        const checkVisibility = () => {
            sections.forEach((section) => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop < window.innerHeight - 100) {
                    section.classList.add("visible");
                }
            });
        };

        const updateActiveNav = () => {
            let current = "";
            const scrollPos = window.scrollY + 150;
            sections.forEach((section) => {
                const top = section.offsetTop;
                const height = section.clientHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    current = section.getAttribute("id") || "";
                }
            });
            const navLinkItems = document.querySelectorAll(".nav-link");
            navLinkItems.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href")?.substring(1) === current) {
                    link.classList.add("active");
                }
            });
        };

        const initMobileMenu = () => {
            const menuToggle = document.getElementById("menuToggle");
            const navLinks = document.getElementById("navLinks");
            if (!menuToggle || !navLinks) return;

            const closeMenu = () => navLinks.classList.remove("active");
            const openMenu = () => {
                if (window.innerWidth <= 768) navLinks.classList.add("active");
            };

            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (navLinks.classList.contains("active")) {
                    closeMenu();
                } else {
                    openMenu();
                }
            };

            const navAnchors = navLinks.querySelectorAll(".nav-link");
            menuToggle.addEventListener("click", handleClick);
            navAnchors.forEach((anchor) => {
                anchor.addEventListener("click", closeMenu);
            });

            const handleDocumentClick = (e) => {
                if (window.innerWidth <= 768) {
                    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                        closeMenu();
                    }
                }
            };

            const handleResize = () => {
                if (window.innerWidth > 768) closeMenu();
            };

            document.addEventListener("click", handleDocumentClick);
            window.addEventListener("resize", handleResize);

            return () => {
                menuToggle.removeEventListener("click", handleClick);
                document.removeEventListener("click", handleDocumentClick);
                window.removeEventListener("resize", handleResize);
            };
        };

        const initDownloadResume = () => {
            const downloadBtn = document.getElementById("downloadResumeBtn");
            if (!downloadBtn) return;

            const handleClick = async (e) => {
                e.preventDefault();

                const originalText = downloadBtn.innerHTML;
                downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing CV...';
                downloadBtn.style.opacity = "0.7";

                try {
                    const link = document.createElement("a");
                    link.href = downloadBtn.href;
                    link.download = "Uros_Gligorijevic.pdf";
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showMessage("✓ Resume download started!", "#4ade80");
                } catch (error) {
                    showMessage("❌ Download failed. Please email me.", "#f87171");
                } finally {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.style.opacity = "1";
                }
            };

            const showMessage = (msg, color) => {
                const msgDiv = document.createElement("div");
                msgDiv.innerText = msg;
                msgDiv.style.color = color;
                msgDiv.style.marginTop = "0.6rem";
                msgDiv.style.fontSize = "0.9rem";
                msgDiv.style.textAlign = "center";
                downloadBtn.parentNode?.appendChild(msgDiv);
                setTimeout(() => msgDiv.remove(), 3000);
            };

            downloadBtn.addEventListener("click", handleClick);
            return () => downloadBtn.removeEventListener("click", handleClick);
        };

        const initScrollProgress = () => {
            const progressBar = document.createElement("div");
            progressBar.className = "scroll-progress";
            document.body.appendChild(progressBar);
            return () => {
                progressBar.remove();
            };
        };

        const initLiveDateTime = () => {
            const timeWidget = document.querySelector(".live-time-widget");
            if (!timeWidget) return null;

            const updateTime = () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                });
                const dateString = now.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
                timeWidget.innerHTML = `🕐 ${timeString} | ${dateString}`;
            };

            updateTime();
            const interval = setInterval(updateTime, 1000);
            return () => clearInterval(interval);
        };

        const initVisitorCounter = () => {
            const visitorElement = document.querySelector(".visitor-counter");
            if (!visitorElement) return null;
            let visitors = localStorage.getItem("visitorCount") || 0;
            visitors = parseInt(visitors, 10) + 1;
            localStorage.setItem("visitorCount", visitors);
            visitorElement.innerHTML = `👁️ Total Visitors: ${visitors}`;
            return null;
        };

        const initContactForm = () => {
            const contactForm = document.getElementById("contactForm");
            const feedbackDiv = document.getElementById("formFeedback");
            if (!contactForm || !feedbackDiv) return null;

            if (window.emailjs) {
                window.emailjs.init("Lcl5_FPpIUEWr6joN");
            }

            const handleSubmit = async (e) => {
                e.preventDefault();
                const name = document.getElementById("name")?.value.trim() || "";
                const email = document.getElementById("email")?.value.trim() || "";
                const message = document.getElementById("message")?.value.trim() || "";

                if (!name || !email || !message) {
                    feedbackDiv.innerHTML = '<span style="color:#f87171;">⚠️ Please fill all fields.</span>';
                    setTimeout(() => (feedbackDiv.innerHTML = ""), 3000);
                    return;
                }

                if (!email.includes("@") || !email.includes(".")) {
                    feedbackDiv.innerHTML = '<span style="color:#f87171;">📧 Enter valid email address.</span>';
                    setTimeout(() => (feedbackDiv.innerHTML = ""), 3000);
                    return;
                }

                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (!submitBtn) return;
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                try {
                    const templateParams = {
                        from_name: name,
                        from_email: email,
                        message,
                        to_email: "uros.gligorijevic@outlook.com",
                        reply_to: email,
                        date: new Date().toLocaleString(),
                    };

                    if (window.emailjs) {
                        const response = await window.emailjs.send(
                            "service_1020nur",
                            "template_ffz5yvq",
                            templateParams,
                        );
                        if (response.status === 200) {
                            feedbackDiv.innerHTML = '<span style="color:#4ade80;">✨ Message sent successfully! I\'ll reply within 24 hours.</span>';
                            contactForm.reset();
                        }
                    }
                } catch (error) {
                    console.error("Email error:", error);
                    feedbackDiv.innerHTML = '<span style="color:#f87171;">❌ Failed to send. Please email directly: uros.gligorijevic@outlook.com</span>';
                } finally {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    setTimeout(() => (feedbackDiv.innerHTML = ""), 5000);
                }
            };

            contactForm.addEventListener("submit", handleSubmit);
            return () => contactForm.removeEventListener("submit", handleSubmit);
        };

        const initSmoothScroll = () => {
            const allAnchors = document.querySelectorAll('a[href^="#"]');
            const handlers = [];
            allAnchors.forEach((anchor) => {
                const handleClick = (e) => {
                    const targetId = anchor.getAttribute("href");
                    if (!targetId || targetId === "#") return;
                    const targetElement = document.querySelector(targetId);
                    if (!targetElement) return;
                    e.preventDefault();
                    const header = document.querySelector("header");
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
                    window.scrollTo({ top: targetPosition, behavior: "smooth" });
                };
                anchor.addEventListener("click", handleClick);
                handlers.push({ anchor, handleClick });
            });
            return () => {
                handlers.forEach(({ anchor, handleClick }) => anchor.removeEventListener("click", handleClick));
            };
        };

        const initRippleEffect = () => {
            const buttons = document.querySelectorAll(".btn");
            const handlers = [];
            buttons.forEach((button) => {
                const handleClick = (e) => {
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const ripple = document.createElement("span");
                    ripple.className = "ripple";
                    ripple.style.left = `${x}px`;
                    ripple.style.top = `${y}px`;
                    button.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                };
                button.addEventListener("click", handleClick);
                handlers.push({ button, handleClick });
            });
            return () => {
                handlers.forEach(({ button, handleClick }) => button.removeEventListener("click", handleClick));
            };
        };

        resizeCanvas();
        draw();
        setTimeout(typeEffect, 500);
        const mobileMenuCleanup = initMobileMenu();
        const downloadCleanup = initDownloadResume();
        const contactFormCleanup = initContactForm();
        const smoothScrollCleanup = initSmoothScroll();
        const liveTimeCleanup = initLiveDateTime();
        const visitorCleanup = initVisitorCounter();
        const scrollProgressCleanup = initScrollProgress();
        const rippleCleanup = initRippleEffect();
        checkVisibility();
        updateActiveNav();

        const handleScroll = () => {
            checkVisibility();
            updateActiveNav();
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseleave", onMouseLeave);
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("resize", resizeCanvas);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("resize", resizeCanvas);
            if (mobileMenuCleanup) mobileMenuCleanup();
            if (downloadCleanup) downloadCleanup();
            if (contactFormCleanup) contactFormCleanup();
            if (smoothScrollCleanup) smoothScrollCleanup();
            if (liveTimeCleanup) liveTimeCleanup();
            if (scrollProgressCleanup) scrollProgressCleanup();
            if (rippleCleanup) rippleCleanup();
        };
    }, []);

    return (
        <>
            <canvas id="webCanvas"></canvas>
            <header>
                <div className="container nav-bar">
                    <div className="logo">✦ Uros &lt;/&gt; ✦</div>
                    <div className="menu-icon" id="menuToggle">
                        <i className="fas fa-bars"></i>
                    </div>
                    <ul className="nav-links" id="navLinks">
                        <li>
                            <a href="#home" className="nav-link">
                                <i className="fas fa-home"></i>
                                <span> Home</span>
                            </a>
                        </li>
                        <li>
                            <a href="#about" className="nav-link">
                                <i className="fas fa-user"></i>
                                <span> About</span>
                            </a>
                        </li>
                        <li>
                            <a href="#skills" className="nav-link">
                                <i className="fas fa-code"></i>
                                <span> Skills</span>
                            </a>
                        </li>
                        <li>
                            <a href="#projects" className="nav-link">
                                <i className="fas fa-folder-open"></i>
                                <span> Projects</span>
                            </a>
                        </li>
                        <li>
                            <a href="#resume" className="nav-link">
                                <i className="fas fa-graduation-cap"></i>
                                <span> Education</span>
                            </a>
                        </li>
                        <li>
                            <a href="#contact" className="nav-link">
                                <i className="fas fa-envelope"></i>
                                <span> Contact</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </header>

            <main>
                <section id="home">
                    <div className="container home-grid">
                        <div className="home-content">
                            <h1>
                                Hi, I&apos;m <span className="highlight">Uros Gligorijevic</span>
                            </h1>
                            <div className="typing-wrapper">
                                <span className="typed-text"></span>
                                <span className="cursor-blink"></span>
                            </div>
                            <p>
                                Senior Software Engineer with 6+ years of experience in full-stack web development. Experienced in JavaScript, TypeScript, Node.js, React, Next.js, and Java, with a strong focus on scalable applications, clean code, and modern software development practices.
                            </p>
                            <div className="btn-group">
                                <a href="#contact" className="btn btn-primary">
                                    Let&apos;s talk <i className="fas fa-arrow-right"></i>
                                </a>
                                <a href="#resume" className="btn btn-outline">
                                    View Experience
                                </a>
                            </div>
                        </div>

                        <div className="home-image">
                            <div className="profile-img-wrapper">
                                <div className="profile-img">
                                    <img
                                        src="/Profile Image/uros1.png"
                                        alt="Uros Gligorijevic"
                                        onError={(event) => {
                                            const target = event.currentTarget;
                                            if (target.parentElement) {
                                                target.parentElement.innerHTML =
                                                    "<i class='fas fa-user-astronaut' style='font-size:6rem; color:#a855f7;'></i>";
                                            }
                                        }}
                                    />
                                </div>
                                <div className="tech-badge badge-top-right">
                                    <i className="fab fa-java" style={{ color: "#ff3c00" }}></i>
                                </div>
                                <div className="tech-badge badge-top-left">
                                    <i className="fab fa-python" style={{ color: "#aba337" }}></i>
                                </div>
                                <div className="tech-badge badge-bottom-right">
                                    <i className="fas fa-leaf" style={{ color: "#348731" }}></i>
                                </div>
                                <div className="tech-badge badge-bottom-left">
                                    <i className="fab fa-html5" style={{ color: "#e34f26" }}></i>
                                </div>
                                <div className="tech-badge badge-middle-right">
                                    <i className="fab fa-github" style={{ color: "rgb(255, 255, 255)" }}></i>
                                </div>
                                <div className="tech-badge badge-middle" style={{ marginTop: "60px", marginLeft: "80px" }}>
                                    <i className="fab fa-react" style={{ color: "rgb(18, 100, 207)" }}></i>
                                </div>
                                <div className="tech-badge badge-middle" style={{ marginTop: "-100px", marginLeft: "10px" }}>
                                    <i className="fab fa-angular" style={{ color: "#ff0800" }}></i>
                                </div>
                                <div className="tech-badge badge-top-left" style={{ marginTop: "50px", marginLeft: "300px" }}>
                                    <i className="fab fa-js" style={{ color: "#f7df1e" }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about">
                    <div className="container">
                        <h2 className="section-title">About Me</h2>
                        <div className="about-grid">
                            <div className="about-img">
                                <div className="about-profile-img">
                                    <img
                                        src="/Profile Image/uros2.png"
                                        alt="Uros Gligorijevic"
                                        onError={(event) => {
                                            const target = event.currentTarget;
                                            if (target.parentElement) {
                                                target.parentElement.innerHTML =
                                                    "<i class='fas fa-user-astronaut' style='font-size:6rem; color:#a855f7;'></i>";
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="about-text">
                                <p>
                                    · Senior Software Engineer with 6+ years of experience designing,
                                    building, and maintaining scalable web applications and backend
                                    infrastructure across the full software development lifecycle, from
                                    analysis and design through deployment and maintenance.
                                </p>
                                <p>
                                    · Skilled in JavaScript, TypeScript, Java, and .NET, I build reusable,
                                    reliable, and efficient code with strong focus on performance,
                                    security, and quality. I thrive in Agile environments, DevOps
                                    practices, and close team collaboration.
                                </p>
                            </div>
                            <div className="about-stats">
                                <div className="stat-item">
                                    <span className="stat-number">6+</span>
                                    <span className="stat-label">Years Experience</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">3</span>
                                    <span className="stat-label">Companies</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">20+</span>
                                    <span className="stat-label">Technologies</span>
                                </div>
                            </div>
                            <div className="btn-group">
                                <a href="#contact" className="btn btn-primary">
                                    Let&apos;s talk <i className="fas fa-arrow-right"></i>
                                </a>
                                <a href="#projects" className="btn btn-outline">
                                    Explore Projects
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="skills">
                    <div className="container">
                        <h2 className="section-title">Technical Skills</h2>
                        <div className="skills-wrapper">
                            <div className="skill-category">
                                <h3>
                                    <i className="fas fa-code" style={{ color: "#3b82f6" }}></i> Languages
                                </h3>
                                <div className="skill-items">
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-js" style={{ color: "#f7df1e" }}></i> JavaScript
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-js" style={{ color: "#3178c6" }}></i> TypeScript
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-java" style={{ color: "#ff3700" }}></i> Java
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-python" style={{ color: "#3776ab" }}></i> Python
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-php" style={{ color: "#777bb4" }}></i> PHP
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-code" style={{ color: "#00add8" }}></i> Go
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-terminal" style={{ color: "#a8b9cc" }}></i> C
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-code" style={{ color: "#a8b9cc" }}></i> C++
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-hashtag" style={{ color: "#0078d4" }}></i> C#
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-gem" style={{ color: "#cc342d" }}></i> Ruby
                                    </span>
                                </div>
                            </div>

                            <div className="skill-category">
                                <h3>
                                    <i className="fas fa-globe" style={{ color: "#3b82f6" }}></i> Frameworks/Libraries
                                </h3>
                                <div className="skill-items">
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-react" style={{ color: "#61dafb" }}></i> React
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-angular" style={{ color: "#dd0031" }}></i> Angular
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-vuejs" style={{ color: "#42b883" }}></i> Vue
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-layer-group" style={{ color: "#000000" }}></i> Next.js
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-html5" style={{ color: "#e34f26" }}></i> HTML5
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-css3-alt" style={{ color: "#1572b6" }}></i> CSS3
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-bootstrap" style={{ color: "#7952b3" }}></i> Bootstrap
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-wind" style={{ color: "#38b2ac" }}></i> Tailwind CSS
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-js" style={{ color: "#0769ad" }}></i> jQuery
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-python" style={{ color: "#0c4b33" }}></i> Django
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-flask" style={{ color: "#000000" }}></i> Flask
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-bolt" style={{ color: "#0093d0" }}></i> FastAPI
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-wordpress" style={{ color: "#21759b" }}></i> WordPress
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-shopify" style={{ color: "#8a8f9b" }}></i> Shopify
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-microsoft" style={{ color: "#5c2d91" }}></i> .NET
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-project-diagram" style={{ color: "#e10098" }}></i> GraphQL
                                    </span>
                                </div>
                            </div>

                            {/* <div className="skill-category">
                                <h3>
                                    <i className="fas fa-server" style={{ color: "#3b82f6" }}></i> Backend
                                </h3>
                                <div className="skill-items">
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-node-js" style={{ color: "#339933" }}></i> Node.js
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-server" style={{ color: "#6d28d9" }}></i> Express
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-server" style={{ color: "#e0234e" }}></i> Nest.js
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-leaf" style={{ color: "#6db33f" }}></i> Spring Boot
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-laravel" style={{ color: "#ff2d20" }}></i> Laravel
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-hashtag" style={{ color: "#512bd4" }}></i> .NET Core
                                    </span>
                                </div>
                            </div> */}

                            {/* <div className="skill-category">
                                <h3>
                                    <i className="fas fa-database" style={{ color: "#3b82f6" }}></i> Databases
                                </h3>
                                <div className="skill-items">
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-leaf" style={{ color: "#47a248" }}></i> MongoDB
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-database" style={{ color: "#336791" }}></i> PostgreSQL
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-database" style={{ color: "#418bc4" }}></i> MySQL
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-database" style={{ color: "#dc382d" }}></i> Redis
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-fire" style={{ color: "#ffca28" }}></i> Firebase
                                    </span>
                                </div>
                            </div> */}

                            <div className="skill-category">
                                <h3>
                                    <i className="fas fa-tools" style={{ color: "#3b82f6" }}></i> DevOps &amp; Tools
                                </h3>
                                <div className="skill-items">
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-aws" style={{ color: "#ff9900" }}></i> AWS
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-docker" style={{ color: "#2496ed" }}></i> Docker
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-cubes" style={{ color: "#326ce5" }}></i> Kubernetes
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-microsoft" style={{ color: "#0078d4" }}></i> Azure DevOps
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-gitlab" style={{ color: "#fc6d26" }}></i> GitLab
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-code-branch" style={{ color: "#f05032" }}></i> CI/CD
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-leaf" style={{ color: "#47a248" }}></i> MongoDB
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-database" style={{ color: "#336791" }}></i> PostgreSQL
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-database" style={{ color: "#418bc4" }}></i> MySQL
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-database" style={{ color: "#dc382d" }}></i> Redis
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-fire" style={{ color: "#ffca28" }}></i> Firebase
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-github" style={{ color: "#ffffff" }}></i> GitHub
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-docker" style={{ color: "#2496ed" }}></i> Docker
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-postman" style={{ color: "#ef5b25" }}></i> Postman
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-robot" style={{ color: "#7a7a7a" }}></i> N8N
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-robot" style={{ color: "#7a7a7a" }}></i> Claude
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fab fa-jira" style={{ color: "#0052cc" }}></i> Jira
                                    </span>
                                    <span className="skill-tag special-shimmer">
                                        <i className="fas fa-cloud" style={{ color: "#f57c00" }}></i> Oracle Cloud
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="projects">
                    <div className="container">
                        <h2 className="section-title">Featured Projects</h2>
                        <div className="projects-grid">
                            <div className="project-card">
                                <div className="project-icon">
                                    <i className="fas fa-chart-pie"></i>
                                </div>
                                <h3>TradingVisualizer.com</h3>
                                <p>
                                    Visualization platform for trading performance and market analytics,
                                    delivering interactive charts, portfolio insights, and pattern tracking.
                                </p>
                                <a href="https://tradingvisualizer.com" target="_blank" rel="noreferrer" className="project-btn">
                                    Visit Site <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>

                            <div className="project-card">
                                <div className="project-icon">
                                    <i className="fas fa-bullseye"></i>
                                </div>
                                <h3>UpsellConnect.com</h3>
                                <p>
                                    Conversion-focused upsell platform for ecommerce,
                                    enabling automated offers, cart optimization, and customer growth.
                                </p>
                                <a href="https://upsellconnect.com" target="_blank" rel="noreferrer" className="project-btn">
                                    Visit Site <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="resume" style={{ background: "#0a0f1e", padding: "60px 0" }}>
                    <div className="container">
                        <h2 className="section-title">Education & Experience</h2>
                        <div className="resume-grid">
                            <div className="resume-card">
                                <h3 className="resume-card-title">
                                    <i className="fas fa-briefcase"></i> Experience
                                </h3>
                                <div className="timeline-wrapper">
                                    <div className="timeline-item">
                                        <div className="resume-item">
                                            <div className="resume-year">Apr 2025 — Mar 2026</div>
                                            <div className="resume-detail">
                                                <h3>Software Engineer</h3>
                                                <p className="company">
                                                    <b>Accenture (United Kingdom, Remote)</b>
                                                </p>
                                                <p>
                                                    • Worked with Node, Python and Golang drivers to perform operations such as operations and writing complex
                                                    queries with PostgreSQL, MySQL, Redis, CRUD RabbitMQ.<br />
                                                    • Contributed to the implementation of Microservices architecture company project using .NET Core and Java
                                                    Spring Boot, enhancing scalability and maintainability.<br />
                                                    • Developed and maintained robust and scalable .NET and Java applications using industry best practices and
                                                    coding standards.<br />
                                                    • Implemented automated testing strategies using Jest for React applications and MSTest/NUnit for .NET
                                                    services, achieving 65% test coverage and reducing bug reports by 30%.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="timeline-item">
                                        <div className="resume-item">
                                            <div className="resume-year">Apr 2022 — Feb 2025</div>
                                            <div className="resume-detail">
                                                <h3>Full Stack Web Developer</h3>
                                                <p className="company">
                                                    <b>Vega IT (Serbia, Remote)</b>
                                                </p>
                                                <p>
                                                    • Designed and maintained enterprise web applications and internal business solutions using .NET Core, React,
                                                    Node.js, and SQL technologies.<br />
                                                    • By utilizing a React frontend and a Java backend, we integrated distributed network data from various
                                                    applications into a centralized web portal, reducing access speed to critical data by 20%.<br />
                                                    • Developed enterprise data integration platforms using React and TypeScript, Node.js implementing complex
                                                    data visualization components and interactive dashboards for clients.<br />
                                                    • Using Java, developed a search engine, a Node.js RESTful API for data access, and a React web frontend for
                                                    searching and managing search results, thereby implementing a fast configuration regex search function.<br />
                                                    • Utilized Azure DevOps for source control, release management, and work item tracking.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="timeline-item">
                                        <div className="resume-item">
                                            <div className="resume-year">Sep 2020 — Mar 2022</div>
                                            <div className="resume-detail">
                                                <h3>Web Developer</h3>
                                                <p className="company">
                                                    <b>Getronics (Netherlands, Remote)</b>
                                                </p>
                                                <p>
                                                    • Worked with PHP and Laravel to build simple backend features and handle data.<br />
                                                    • Converted UI/UX mockups to React screens and components with Bootstrap and Tailwind CSS.<br />
                                                    • Worked with React and Node.js to build simple frontend and backend features and handle data.<br />
                                                    • Switched the backend from MySQL to MongoDB to improve scalability and performance as user data and
                                                    transactions grew.<br />
                                                    • Developed and maintained web-based business applications using React, Node.js, PHP, and Laravel.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="resume-card">
                                <h3 className="resume-card-title">
                                    <i className="fas fa-graduation-cap"></i> Education
                                </h3>
                                <div className="timeline-wrapper">
                                    <div className="timeline-item">
                                        <div className="resume-item">
                                            <div className="resume-year">Apr 2016 — May 2020</div>
                                            <div className="resume-detail">
                                                <h3>Bachelor&apos;s degree in Computer Science</h3>
                                                <p>
                                                    <span className="grade">
                                                        University of Belgrade (Serbia)
                                                    </span>
                                                    <br />
                                                    Computer Science<br />
                                                    <b>Bachelor&apos;s Degree</b>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="download-resume">
                            <a
                                id="downloadResumeBtn"
                                href="https://1drv.ms/b/c/17CD9F8D735ED79F/IQBzuNSDXYS8Qp082oPk5XbOAffbnnTfLwQFlIh2WYahsqk?e=r6jDpi"
                                className="btn btn-primary"
                            >
                                <i className="fas fa-download"></i> Download Resume (PDF)
                            </a>
                            <p style={{ fontSize: "0.8rem", color: "#3b82f6", marginTop: "10px" }}>
                                ⚡ If Download doesn&apos;t start, let&apos;s Connect and Mail me!
                            </p>
                        </div>
                    </div>
                </section>

                <section id="contact">
                    <div className="container">
                        <h2 className="section-title">Let&apos;s Connect</h2>
                        <div className="contact-flex">
                            <div className="contact-info">
                                <div className="info-item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Lajkovac, Serbia</span>
                                </div>
                                <div className="info-item">
                                    <i className="fas fa-envelope"></i>
                                    <span>uros.gligorijevic@outlook.com</span>
                                </div>
                                <div className="info-item">
                                    <i className="fas fa-phone-alt"></i>
                                    <span>+380 97 536 12 87</span>
                                </div>
                                <div className="social-links">
                                    <a href="https://github.com/Neji0526" target="_blank" rel="noreferrer" className="social-icon github">
                                        <i className="fab fa-github"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/in/uros-gligorijevic-668a3a416/" target="_blank" rel="noreferrer" className="social-icon linkedin">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                    <a href="https://t.me/powerpnder" target="_blank" rel="noreferrer" className="social-icon telegram">
                                        <i className="fab fa-telegram"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="contact-form">
                                <form id="contactForm">
                                    <div className="input-group">
                                        <input type="text" id="name" placeholder="Your Full Name" required />
                                    </div>
                                    <div className="input-group">
                                        <input type="email" id="email" placeholder="Email address" required />
                                    </div>
                                    <div className="input-group">
                                        <textarea rows="4" id="message" placeholder="Tell me about your product, internship opportunity, or collaboration..." required />
                                    </div>
                                    <button type="submit">
                                        Send Message <i className="fas fa-paper-plane"></i>
                                    </button>
                                    <div className="form-message" id="formFeedback"></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <div className="container">
                    <p>
                        Keep learning. Keep building. Keep improving <br /> © 2026 Developed and Maintained by <b>Uros Gligorijevic</b> | All Rights Reserved
                    </p>
                </div>
            </footer>
        </>
    );
};

export default App;
