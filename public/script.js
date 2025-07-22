// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Navigation background on scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav")
  if (window.scrollY > 50) {
    nav.style.background = "rgba(255, 255, 255, 0.95)"
    nav.style.boxShadow = "0 4px 6px -1px rgba(44, 62, 80, 0.1)"
  } else {
    nav.style.background = "rgba(255, 255, 255, 0.9)"
    nav.style.boxShadow = "none"
  }
})

// Mobile navigation toggle
const navToggle = document.querySelector(".nav-toggle")
const navLinks = document.querySelector(".nav-links")

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    navToggle.classList.toggle("active")
  })
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

// Add animation classes and observe elements
document.addEventListener("DOMContentLoaded", () => {
  // Add fade-in animation to section headers
  document.querySelectorAll(".section-header").forEach((el) => {
    el.classList.add("fade-in")
    observer.observe(el)
  })

  // Add animations to feature rows
  document.querySelectorAll(".feature-row").forEach((el) => {
    el.classList.add("fade-in")
    observer.observe(el)
  })

  // Add animations to step items
  document.querySelectorAll(".step-item").forEach((el, index) => {
    el.classList.add("fade-in")
    el.style.transitionDelay = `${index * 0.2}s`
    observer.observe(el)
  })

  // Add animations to testimonial cards
  document.querySelectorAll(".testimonial-card").forEach((el, index) => {
    el.classList.add("fade-in")
    el.style.transitionDelay = `${index * 0.1}s`
    observer.observe(el)
  })

  // Add fade-in to CTA section
  const ctaContent = document.querySelector(".cta-content")
  if (ctaContent) {
    ctaContent.classList.add("fade-in")
    observer.observe(ctaContent)
  }

  // Assignment item hover animations
  document.querySelectorAll(".assignment-item").forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`

    // Add subtle animation on load
    setTimeout(() => {
      item.style.animation = "slideInFromLeft 0.5s ease forwards"
    }, index * 100)
  })

  // Smooth reveal animation for handwritten text
  const handwrittenElements = document.querySelectorAll(".handwritten-text > *")
  handwrittenElements.forEach((element, index) => {
    element.style.opacity = "0"
    element.style.transform = "translateX(-10px)"

    setTimeout(
      () => {
        element.style.transition = "all 0.5s ease"
        element.style.opacity = "1"
        element.style.transform = "translateX(0)"
      },
      index * 200 + 1000,
    ) // Delay based on scroll trigger
  })

  // Add loading animation to assignment statuses
  const assignmentStatuses = document.querySelectorAll(".assignment-status")
  assignmentStatuses.forEach((status, index) => {
    if (status.textContent === "Processing") {
      status.style.animation = "pulse 2s infinite"
    }
  })
})

// Theme toggle functionality
const themeToggle = document.querySelector(".theme-toggle")
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")
    const isDark = document.body.classList.contains("dark-theme")
    themeToggle.textContent = isDark ? "☀️" : "🌙"
  })
}

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroCard = document.querySelector(".hero-card")
  const flowingLines = document.querySelector(".flowing-lines")

  if (heroCard) {
    const rate = scrolled * -0.5
    heroCard.style.transform = `translateY(${rate}px)`
  }

  if (flowingLines) {
    const rate = scrolled * 0.1
    flowingLines.style.transform = `translateY(${rate}px)`
  }
})

// Hover effects for interactive elements
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-8px) scale(1.02)"
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)"
  })
})

document.querySelectorAll(".testimonial-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-8px) scale(1.02)"
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)"
  })
})

// Button click animations
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span")
    const rect = this.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    this.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
})

// Add ripple effect styles
const style = document.createElement("style")
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
`
document.head.appendChild(style)

// Stats counter animation
const animateStats = () => {
  const stats = document.querySelectorAll(".stat-number")

  stats.forEach((stat) => {
    const target = stat.textContent
    const isPercentage = target.includes("%")
    const isRating = target.includes("/")
    const isCount = target.includes("+")

    let endValue
    let suffix = ""

    if (isPercentage) {
      endValue = Number.parseFloat(target)
      suffix = "%"
    } else if (isRating) {
      endValue = Number.parseFloat(target)
      suffix = "/5"
    } else if (isCount) {
      endValue = Number.parseInt(target.replace(/[^\d]/g, ""))
      suffix = ",000+"
    } else {
      endValue = Number.parseInt(target)
    }

    let startValue = 0
    const increment = endValue / 100

    const timer = setInterval(() => {
      startValue += increment
      if (startValue >= endValue) {
        startValue = endValue
        clearInterval(timer)
      }

      if (isPercentage) {
        stat.textContent = Math.floor(startValue) + suffix
      } else if (isRating) {
        stat.textContent = startValue.toFixed(1) + suffix
      } else if (isCount) {
        stat.textContent = Math.floor(startValue) + suffix
      } else {
        stat.textContent = Math.floor(startValue) + suffix
      }
    }, 20)
  })
}

// Trigger stats animation when stats section is visible
const statsSection = document.querySelector(".stats")
if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats()
          statsObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  statsObserver.observe(statsSection)
}

// Grid animation for about visual
const gridItems = document.querySelectorAll(".grid-item")
let gridAnimationInterval

const animateGrid = () => {
  let index = 0
  gridAnimationInterval = setInterval(() => {
    gridItems.forEach((item) => item.classList.remove("active"))
    gridItems[index].classList.add("active")
    index = (index + 1) % gridItems.length
  }, 800)
}

const aboutVisualObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateGrid()
      } else {
        clearInterval(gridAnimationInterval)
      }
    })
  },
  { threshold: 0.5 },
)

const visualGrid = document.querySelector(".visual-grid")
if (visualGrid) {
  aboutVisualObserver.observe(visualGrid)
}
