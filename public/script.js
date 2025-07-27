// Global variables
let scrollY = 0
const mousePosition = { x: 0, y: 0 }
let isVisible = false

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations()
  createFloatingParticles()
  setupEventListeners()

  // Trigger initial visibility
  setTimeout(() => {
    isVisible = true
    updateHeroContent()
  }, 100)
})

// Create floating particles
function createFloatingParticles() {
  const particlesContainer = document.getElementById("floating-particles")

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"
    particle.style.animationDelay = Math.random() * 2 + "s"
    particle.style.animationDuration = 3 + Math.random() * 4 + "s"
    particlesContainer.appendChild(particle)
  }
}

// Setup event listeners
function setupEventListeners() {
  // Mouse move for cursor glow
  document.addEventListener("mousemove", handleMouseMove)

  // Scroll events
  window.addEventListener("scroll", handleScroll)

  // Smooth scroll for navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", handleNavClick)
  })

  // Button hover effects
  document.querySelectorAll(".btn-primary, .btn-secondary").forEach((button) => {
    button.addEventListener("mouseenter", handleButtonHover)
    button.addEventListener("mouseleave", handleButtonLeave)
  })
}

// Handle mouse movement
function handleMouseMove(e) {
  mousePosition.x = e.clientX
  mousePosition.y = e.clientY

  const cursorGlow = document.getElementById("cursor-glow")
  cursorGlow.style.left = mousePosition.x + "px"
  cursorGlow.style.top = mousePosition.y + "px"
}

// Handle scroll events
function handleScroll() {
  scrollY = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const scrollProgress = Math.min(scrollY / maxScroll, 1)

  updateDynamicBackground(scrollProgress)
  updateHeader()
  updateHeroParallax()
  updateFloatingElements()
  updateSectionAnimations()
  updateParticles()
}

// Update dynamic background
function updateDynamicBackground(scrollProgress) {
  const background = document.getElementById("dynamic-background")
  const rotation = 180 + scrollProgress * 180
  const opacity = 1 - scrollProgress * 0.3

  background.style.background = `linear-gradient(${rotation}deg, 
        rgba(0,0,0,1) 0%, 
        rgba(20,20,20,${opacity}) 50%, 
        rgba(0,0,0,1) 100%)`
}

// Update header opacity
function updateHeader() {
  const header = document.getElementById("header")
  const opacity = Math.min(scrollY / 100, 0.8)
  const borderOpacity = Math.min(scrollY / 200, 0.1)

  header.style.backgroundColor = `rgba(0,0,0,${opacity})`
  header.style.borderBottom = `1px solid rgba(255,255,255,${borderOpacity})`
}

// Update hero parallax effects
function updateHeroParallax() {
  const heroContent = document.querySelector(".hero-content")
  if (heroContent) {
    const badge = heroContent.querySelector(".badge")
    const title = heroContent.querySelector(".hero-title")
    const description = heroContent.querySelector(".hero-description")
    const buttons = heroContent.querySelector(".hero-buttons")

    if (badge) badge.style.transform = `translateY(${scrollY * 0.1}px)`
    if (title) title.style.transform = `translateY(${scrollY * 0.2}px)`
    if (description) description.style.transform = `translateY(${scrollY * 0.15}px)`
    if (buttons) buttons.style.transform = `translateY(${scrollY * 0.1}px)`
  }
}

// Update floating elements
function updateFloatingElements() {
  const floatingCircle = document.querySelector(".floating-circle")
  const floatingSquare = document.querySelector(".floating-square")
  const floatingDot = document.querySelector(".floating-dot")

  if (floatingCircle) {
    const opacity = Math.max(1 - scrollY / 800, 0)
    floatingCircle.style.transform = `translate(${scrollY * 0.5}px, ${scrollY * 0.3}px) rotate(${scrollY * 0.5}deg)`
    floatingCircle.style.opacity = opacity
  }

  if (floatingSquare) {
    const opacity = Math.max(1 - scrollY / 800, 0)
    floatingSquare.style.transform = `translate(${-scrollY * 0.3}px, ${scrollY * 0.4}px) rotate(${-scrollY * 0.3}deg)`
    floatingSquare.style.opacity = opacity
  }
}

// Update particles based on scroll
function updateParticles() {
  const particles = document.querySelectorAll(".particle")
  particles.forEach((particle, index) => {
    const speed = 0.1 + Math.random() * 0.2
    particle.style.transform = `translateY(${scrollY * speed}px)`
  })
}

// Update section animations based on scroll
function updateSectionAnimations() {
  // How It Works section
  const howItWorksSection = document.getElementById("how-it-works")
  if (howItWorksSection) {
    const sectionTop = howItWorksSection.offsetTop
    const sectionHeight = howItWorksSection.offsetHeight

    // Section background
    const backgroundOpacity = Math.min(scrollY / 500, 0.8)
    howItWorksSection.style.background = `linear-gradient(to bottom, transparent 0%, rgba(10,10,10,${backgroundOpacity}) 50%, transparent 100%)`
    howItWorksSection.style.transform = `translateY(${Math.max(-scrollY * 0.1, -100)}px)`

    // Section header
    const sectionHeader = howItWorksSection.querySelector(".section-header")
    if (sectionHeader) {
      const opacity = Math.min((scrollY - 300) / 300, 1)
      const translateY = Math.max(50 - (scrollY - 300) * 0.2, 0)
      sectionHeader.style.opacity = opacity
      sectionHeader.style.transform = `translateY(${translateY}px)`
    }

    // Step cards
    const stepCards = howItWorksSection.querySelectorAll(".step-card")
    stepCards.forEach((card, index) => {
      const cardScrollStart = 400 + index * 100
      const opacity = Math.min((scrollY - cardScrollStart) / 200, 1)
      const translateY = Math.max(30 - (scrollY - cardScrollStart) * 0.15, 0)
      const scale = Math.min((scrollY - cardScrollStart) / 200 + 0.8, 1)

      if (opacity > 0) {
        card.classList.add("animate-in")
        card.style.opacity = opacity
        card.style.transform = `translateY(${translateY}px) scale(${scale})`
      }
    })
  }

  // Features section
  const featuresSection = document.getElementById("features")
  if (featuresSection) {
    const backgroundOpacity = Math.min((scrollY - 800) / 400, 0.5)
    featuresSection.style.background = `radial-gradient(ellipse at center, rgba(20,20,20,${backgroundOpacity}) 0%, transparent 70%)`
    featuresSection.style.transform = `translateY(${Math.max(-scrollY * 0.05, -50)}px)`

    // Section header
    const sectionHeader = featuresSection.querySelector(".section-header")
    if (sectionHeader) {
      const opacity = Math.min((scrollY - 1000) / 300, 1)
      const translateY = Math.max(50 - (scrollY - 1000) * 0.2, 0)
      sectionHeader.style.opacity = opacity
      sectionHeader.style.transform = `translateY(${translateY}px)`
    }

    // Feature cards
    const featureCards = featuresSection.querySelectorAll(".feature-card")
    featureCards.forEach((card, index) => {
      const cardScrollStart = 1200 + index * 50
      const opacity = Math.min((scrollY - cardScrollStart) / 200, 1)
      const translateY = Math.max(40 - (scrollY - cardScrollStart) * 0.2, 0)
      const rotateX = Math.max(15 - (scrollY - cardScrollStart) * 0.05, 0)

      if (opacity > 0) {
        card.classList.add("animate-in")
        card.style.opacity = opacity
        card.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg)`
      }
    })
  }

  // Testimonials section
  const testimonialsSection = document.getElementById("testimonials")
  if (testimonialsSection) {
    const backgroundOpacity1 = Math.min((scrollY - 1800) / 400, 0.8)
    const backgroundOpacity2 = Math.min((scrollY - 1800) / 400, 0.6)
    testimonialsSection.style.background = `linear-gradient(135deg, rgba(15,15,15,${backgroundOpacity1}) 0%, rgba(5,5,5,${backgroundOpacity2}) 100%)`

    // Section header
    const sectionHeader = testimonialsSection.querySelector(".section-header")
    if (sectionHeader) {
      const opacity = Math.min((scrollY - 2000) / 300, 1)
      const translateY = Math.max(50 - (scrollY - 2000) * 0.2, 0)
      sectionHeader.style.opacity = opacity
      sectionHeader.style.transform = `translateY(${translateY}px)`
    }

    // Testimonial cards
    const testimonialCards = testimonialsSection.querySelectorAll(".testimonial-card")
    testimonialCards.forEach((card, index) => {
      const cardScrollStart = 2200 + index * 100
      const opacity = Math.min((scrollY - cardScrollStart) / 200, 1)
      const translateY = Math.max(30 - (scrollY - cardScrollStart) * 0.15, 0)
      const translateX = Math.sin((scrollY - cardScrollStart) * 0.01) * 10

      if (opacity > 0) {
        card.classList.add("visible")
        card.style.opacity = opacity
        card.style.transform = `translateY(${translateY}px) translateX(${translateX}px)`
      }
    })
  }

  // CTA section
  const ctaSection = document.querySelector(".cta-section")
  if (ctaSection) {
    const backgroundOpacity = Math.min((scrollY - 2800) / 400, 0.8)
    ctaSection.style.background = `radial-gradient(ellipse at center, rgba(30,30,30,${backgroundOpacity}) 0%, rgba(0,0,0,1) 70%)`

    const ctaContent = ctaSection.querySelector(".cta-content")
    if (ctaContent) {
      const opacity = Math.min((scrollY - 3000) / 300, 1)
      const translateY = Math.max(50 - (scrollY - 3000) * 0.2, 0)
      const scale = Math.min((scrollY - 3000) / 300 + 0.9, 1)
      ctaContent.style.opacity = opacity
      ctaContent.style.transform = `translateY(${translateY}px) scale(${scale})`
    }
  }

  // Footer
  const footer = document.getElementById("footer")
  if (footer) {
   const baseOpacity = 0.3;
const opacity = Math.max(baseOpacity, Math.min((scrollY - 3400) / 300, 1));
    footer.style.opacity = opacity
    footer.style.borderTop = `1px solid rgba(255,255,255,${borderOpacity})`
  }
}

// Update hero content visibility
function updateHeroContent() {
  const heroContent = document.querySelector(".hero-content")
  if (heroContent && isVisible) {
    heroContent.style.opacity = "1"
    heroContent.style.transform = "translateY(0)"
  }
}

// Initialize animations
function initializeAnimations() {
  // Set initial states
  const heroContent = document.querySelector(".hero-content")
  if (heroContent) {
    heroContent.style.opacity = "0"
    heroContent.style.transform = "translateY(20px)"
    heroContent.style.transition = "all 2s ease"
  }
}

// Handle navigation clicks
function handleNavClick(e) {
  e.preventDefault()
  const targetId = e.target.getAttribute("href")
  const targetElement = document.querySelector(targetId)

  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Handle button hover effects
function handleButtonHover(e) {
  const button = e.target
  if (button.classList.contains("btn-primary")) {
    button.style.transform = "scale(1.1)"
    button.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  } else if (button.classList.contains("btn-secondary")) {
    button.style.transform = "scale(1.05)"
    button.style.borderColor = "rgba(255,255,255,0.4)"
  }
}

function handleButtonLeave(e) {
  const button = e.target
  if (button.classList.contains("btn-primary")) {
    button.style.transform = "scale(1)"
    button.style.boxShadow = "none"
  } else if (button.classList.contains("btn-secondary")) {
    button.style.transform = "scale(1)"
    button.style.borderColor = "rgba(255,255,255,0.2)"
  }
}

// Smooth scroll polyfill for older browsers
if (!("scrollBehavior" in document.documentElement.style)) {
  const smoothScrollPolyfill = (target) => {
    const targetPosition = target.offsetTop - 64 // Account for header height
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    const duration = 1000
    let start = null

    function animation(currentTime) {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const run = ease(timeElapsed, startPosition, distance, duration)
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    function ease(t, b, c, d) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    requestAnimationFrame(animation)
  }

  // Override navigation click handler for older browsers
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        smoothScrollPolyfill(targetElement)
      }
    })
  })
}

// Intersection Observer for better performance (if supported)
if ("IntersectionObserver" in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
      }
    })
  }, observerOptions)

  // Observe all animatable elements
  document.addEventListener("DOMContentLoaded", () => {
    const animatableElements = document.querySelectorAll(".step-card, .feature-card, .testimonial-card")
    animatableElements.forEach((el) => observer.observe(el))
  })
}