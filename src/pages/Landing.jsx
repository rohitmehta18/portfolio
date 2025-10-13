import React, { useState, useEffect, useRef, Children, useCallback, useMemo, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// OGL for background
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

// Icons for social links
import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope, FaYoutube ,FaGraduationCap} from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

// Local assets
import profileAvatar from '../assets/avatar.png';
import projectIridaImg from '../assets/project-irida.png';
import dataVisProImg from '../assets/datavis-pro.png';
import auraCommerceImg from '../assets/aura-commerce.png';
import yapyap from '../assets/yapyap.png';
import acrtable from '../assets/arctable.png';


import './landing.css';


//==================================================================
// Project Data
//==================================================================
const projectsData = [
    {
        name: "Fake Plays",
        title: "React.js, Node.js, Express, MongoDB, Integrated JWT + Google OAuth",
        avatarUrl: projectIridaImg,
        description: "Fake Plays is an AI-powered chatbot designed to offer emotional support and genuine companionship. Whether you’re facing a difficult moment or simply need someone to talk to, Fake Plays provides a safe, judgment-free space where you can freely express your thoughts and feelings.",
        githubUrl: "https://github.com/kalviumcommunity/S84_Rohit_Capstone_FakePlays",
        liveUrl: "https://fake-plays.netlify.app/"
    },
    {
        name: "Screenshot.AI",
        title: "Tkinter, Google Gemini ,OCR Engine ,Tesseract-OCR, PyAutoGUI, Watchdog ,pyttsx3 ",
        avatarUrl: dataVisProImg,
        description: "As a beginner, when I get stuck on a coding problem, my usual process feels quite long. First, I copy the problem statement, then I also copy the prewritten compiler code. After that, I paste everything into an AI tool and ask for the solution, explanation, approach, and time/space complexity. Many times, the code doesn’t work directly, so I copy the error back, ask the AI again, and repeat this cycle. This entire process becomes time-consuming and a bit frustrating. That’s where Screenshot AI makes things easier. Instead of going through all these steps, I can just take a screenshot of the problem, wait a few seconds, press Ctrl + 5, and the code is automatically typed for me. Not only that, it also explains the solution clearly. This way, I can study the explanation and then try solving the question again by myself, which saves time and helps me learn more effectively",
        githubUrl: "https://github.com/rohitmehta18/Screenshot.AI",
        liveUrl: "https://github.com/rohitmehta18/Screenshot.AI/archive/refs/heads/main.zip"
    },
    {
        name: "Snap Speak.Ai",
        title: "Tkinter, Google Gemini ,OCR Engine ,Tesseract-OCR, PyAutoGUI, Watchdog ,pyttsx3",
        avatarUrl: auraCommerceImg,
        description: "As a student, whenever I want to quickly get the answer to an MCQ, the usual process feels quite long. I either scan the question from Google or click a picture and upload it to GPT. But even this is limited, and I can’t keep doing it freely throughout the day. This becomes time-consuming and frustrating when I have many questions to practice. That’s where Snapspeak AI makes things much easier. Instead of going through all these steps, you can just take a screenshot of the question, wait a few seconds, and the answer is instantly speaked out along with an explanation. Not only that, if you add 4 API keys, you can easily process 80–100 screenshots in a single day. This saves a lot of time and lets me focus on actually learning from the explanations rather than struggling with the process.",
        githubUrl: "https://github.com/rohitmehta18/Snapspeak.AI",
        liveUrl: "https://github.com/rohitmehta18/Snapspeak.AI/archive/refs/heads/main.zip"
    },
    {
        name: "Yap Yap",
        title: "React.js, Node.js & Express.js, (WebSocket) for a high-performance,CSS",
        avatarUrl: yapyap,
        description: "I created YapYap to bring back the thrill of a spontaneous chat. It’s an anonymous platform where you can instantly connect with someone new, sharing thoughts without revealing your identity. Built with React and WebSockets, my goal was to provide a clean, simple, and ephemeral space where the focus is entirely on the conversation, not the profiles.",
        githubUrl: "https://github.com/rohitmehta18/yap-yap-",
        liveUrl: "https://yapyapv1.netlify.app/"
    },
    {
        name: "Arc Table",
        title: "In progress",
        avatarUrl: acrtable,
        description: "Making a table tennis game using typescript",
        githubUrl: "https://github.com/rohitmehta18/Arc-Table",
        liveUrl: "#"
    }
];

//==================================================================
// 0. NAVBAR COMPONENT
//==================================================================
const Navbar = ({ theme, setTheme }) => {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <a href="#home" className="nav-logo">RM</a>
                <div className="nav-links">
                    <a href="#introduction">Introduction</a>
                    <a href="#about">About Me</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                </div>
                <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
        </nav>
    );
};

//==================================================================
// 1. THEME TOGGLE COMPONENT
//==================================================================
const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="theme-toggle-container">
      <label className="theme-toggle" htmlFor="theme-toggle-checkbox">
        <input
          type="checkbox"
          id="theme-toggle-checkbox"
          onChange={toggleTheme}
          checked={theme === 'light'}
        />
        <div className="slider"></div>
        <span className="label-dark">Dark</span>
        <span className="label-light">Light</span>
      </label>
    </div>
  );
};


//==================================================================
// 2. IRIDESCENCE BACKGROUND COMPONENT
//==================================================================
const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;
varying vec2 vUv;
void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  uv += (uMouse - vec2(0.5)) * uAmplitude;
  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}`;

function Iridescence({ color = [1, 1, 1], speed = 1.0, amplitude = 0.1, mouseReact = true, ...rest }) {
  const ctnDom = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer({ antialias: true });
    const gl = renderer.gl;

    let program;

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
      }
    }
    window.addEventListener('resize', resize, false);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId;

    function update(t) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }
    if (mouseReact) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (mouseReact) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (ctn && gl.canvas && ctn.contains(gl.canvas)) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact]);

  return <div ref={ctnDom} className="iridescence-container" {...rest} />;
}


//==================================================================
// 3. ADVANCED PROFILE CARD COMPONENT
//==================================================================
const SocialLinks = () => (
    <div className="social-links">
        <a href="https://www.instagram.com/rohitmehta__18/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://www.linkedin.com/in/rohit-mehta-ba4084355/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><FaLinkedin /></a>
        <a href="https://github.com/rohitmehta18" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub"><FaGithub /></a>
        <a href="https://leetcode.com/u/rohitmehta_18/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LeetCode"><SiLeetcode /></a>
        <a href="https://wa.me/919877989570" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp"><FaWhatsapp /></a>
        <a href="mailto:rmehta1836@gmail.com" className="social-link" aria-label="Email"><FaEnvelope /></a>
    </div>
);

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) => round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - toMin));

const AdvancedProfileCard = React.memo(({
  avatarUrl, miniAvatarUrl, name, title, handle, status, contactText,
  showUserInfo = true, enableTilt = true, enableMobileTilt = false,
  mobileTiltSensitivity = 5, onContactClick, className = ''
}) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  
  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;
    let rafId = null;

    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
      const { clientWidth: width, clientHeight: height } = card;
      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;
      
      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(centerY, centerX) / 50, 0, 1)}`,
        '--rotate-x': `${round(-(centerY / 5))}deg`,
        '--rotate-y': `${round(centerX / 4)}deg`
      };
      Object.entries(properties).forEach(([p, v]) => wrap.style.setProperty(p, v));
    };

    return { updateCardTransform, cancelAnimation: () => cancelAnimationFrame(rafId) };
  }, [enableTilt]);

  const handlePointerMove = useCallback(e => {
      if (!cardRef.current || !wrapRef.current || !animationHandlers) return;
      const rect = cardRef.current.getBoundingClientRect();
      animationHandlers.updateCardTransform(e.clientX - rect.left, e.clientY - rect.top, cardRef.current, wrapRef.current);
  }, [animationHandlers]);

  const handlePointerEnter = useCallback(() => {
      if (!wrapRef.current || !cardRef.current || !animationHandlers) return;
      animationHandlers.cancelAnimation();
      wrapRef.current.classList.add('active');
      cardRef.current.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(() => {
      if (!cardRef.current || !wrapRef.current || !animationHandlers) return;
      wrapRef.current.classList.remove('active');
      cardRef.current.classList.remove('active');
      const wrap = wrapRef.current;
      wrap.style.setProperty('--rotate-x', `0deg`);
      wrap.style.setProperty('--rotate-y', `0deg`);
  }, [animationHandlers]);

  const handleDeviceOrientation = useCallback(e => {
      if (!cardRef.current || !wrapRef.current || !animationHandlers || !e.beta || !e.gamma) return;
      const { clientHeight, clientWidth } = cardRef.current;
      animationHandlers.updateCardTransform(
          clientHeight / 2 + e.gamma * mobileTiltSensitivity,
          clientWidth / 2 + (e.beta - 20) * mobileTiltSensitivity,
          cardRef.current,
          wrapRef.current
      );
  }, [animationHandlers, mobileTiltSensitivity]);

  useEffect(() => {
      if (!enableTilt || !animationHandlers || !cardRef.current || !wrapRef.current) return;
      
      const card = cardRef.current;

      const handleClick = () => {
          if (!enableMobileTilt || location.protocol !== 'https:') return;
          if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
              window.DeviceOrientationEvent.requestPermission()
                  .then(state => {
                      if (state === 'granted') window.addEventListener('deviceorientation', handleDeviceOrientation);
                  }).catch(console.error);
          } else {
              window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
      };
      
      card.addEventListener('pointerenter', handlePointerEnter);
      card.addEventListener('pointermove', handlePointerMove);
      card.addEventListener('pointerleave', handlePointerLeave);
      card.addEventListener('click', handleClick);

      return () => {
          card.removeEventListener('pointerenter', handlePointerEnter);
          card.removeEventListener('pointermove', handlePointerMove);
          card.removeEventListener('pointerleave', handlePointerLeave);
          card.removeEventListener('click', handleClick);
          window.removeEventListener('deviceorientation', handleDeviceOrientation);
          animationHandlers.cancelAnimation();
      };
  }, [enableTilt, enableMobileTilt, animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation]);

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()}>
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-avatar-content">
            <img className="avatar" src={avatarUrl} alt={`${name || 'User'} avatar`} loading="lazy" />
            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <img src={miniAvatarUrl || avatarUrl} alt={`${name || 'User'} mini avatar`} loading="lazy" />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                <button className="pc-contact-btn" onClick={onContactClick} type="button">
                  {contactText}
                </button>
              </div>
            )}
          </div>
          <div className="pc-content">
            <SocialLinks />
            <div className="pc-details">
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

//==================================================================
// 4. HERO TEXT COMPONENT
//==================================================================
const HeroText = () => {
    return (
        <div className="hero-text-container">
            <h1 className="hero-name">Hey.. I'm Rohit</h1>
            <p className="hero-bio">
                A Full Stack Developer who loves turning ideas into interactive, creative projects.
            </p>
        </div>
    );
};

//==================================================================
// 5. STEPPER CONTACT FORM COMPONENT
//==================================================================
function Stepper({
  children, initialStep = 1, onStepChange = () => {},
  onFinalStepCompleted = () => {}, ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({});
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted(formData);
    } else {
      onStepChange(newStep);
    }
  };
  
  const handleFormChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };
  
  const modifiedChildren = React.Children.map(children, (child) => {
      return React.cloneElement(child, { onChange: handleFormChange });
  });

  return (
    <div className="stepper-outer-container" {...rest}>
      <div className="step-circle-container">
        <div className="step-indicator-row">
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            return (
              <React.Fragment key={stepNumber}>
                <StepIndicator
                  step={stepNumber}
                  currentStep={currentStep}
                />
                {index < totalSteps - 1 && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>
        <StepContentWrapper
          currentStep={currentStep}
          direction={direction}
        >
          {modifiedChildren[currentStep - 1]}
        </StepContentWrapper>
        <div className="footer-container">
            <div className={`footer-nav ${currentStep !== 1 ? 'spread' : 'end'}`}>
              {currentStep !== 1 && (
                <button onClick={() => { setDirection(-1); updateStep(currentStep - 1); }} className="back-button">
                  Back
                </button>
              )}
              <button onClick={isLastStep ? handleComplete : handleNext} className="next-button">
                {isLastStep ? 'Send Message' : 'Continue'}
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}

function StepContentWrapper({ currentStep, direction, children }) {
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);

    useLayoutEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.offsetHeight);
        }
    }, [currentStep, children]);

    return (
        <motion.div
            className="step-content-default"
            animate={{ height: height || 'auto' }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentStep}
                    ref={contentRef}
                    custom={direction}
                    variants={{
                        enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
                        center: { x: '0%', opacity: 1 },
                        exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    style={{ position: 'absolute', width: '100%' }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

function Step({ children, onChange }) {
    return <div className="step-default">{React.cloneElement(children, { onChange })}</div>;
}

const StepIndicator = ({ step, currentStep }) => {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  return (
    <motion.div className="step-indicator" animate={status}>
      <motion.div
        variants={{
          inactive: { backgroundColor: 'var(--step-indicator-inactive-bg)', borderColor: 'var(--step-indicator-inactive-border)' },
          active: { backgroundColor: 'var(--step-indicator-active-bg)', borderColor: 'var(--step-indicator-active-border)' },
          complete: { backgroundColor: 'var(--button-bg)', borderColor: 'var(--button-bg)' },
        }}
        className="step-indicator-inner"
      >
        {status === 'complete' ? <CheckIcon /> : <span>{step}</span>}
      </motion.div>
    </motion.div>
  );
};

const StepConnector = ({ isComplete }) => (
  <div className="step-connector">
    <motion.div
      className="step-connector-inner"
      animate={{ width: isComplete ? '100%' : '0%' }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--button-text)" strokeWidth={3}>
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);


//==================================================================
// 6. SPOTLIGHT CARD COMPONENT
//==================================================================
const SpotlightCard = ({ children, className = '' }) => {
  const divRef = useRef(null);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = el.offsetWidth;
        const height = el.offsetHeight;

        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);

        const rotateX = (y / height - 0.5) * -25;
        const rotateY = (x / width - 0.5) * 25;
        el.style.setProperty('--rotate-x', `${rotateX}deg`);
        el.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
        el.style.setProperty('--rotate-x', '0deg');
        el.style.setProperty('--rotate-y', '0deg');
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={divRef} className={`card-spotlight ${className}`}>
      <div className="card-spotlight-content">
        {children}
      </div>
    </div>
  );
};


//==================================================================
// 7. PROFILE CARD COMPONENT (SIMPLE VERSION FOR PROJECTS)
//==================================================================
const ProfileCard = React.memo(({
  avatarUrl, name, title, className, onClick
}) => {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = el.offsetWidth;
        const height = el.offsetHeight;
        const rotateX = (y / height - 0.5) * -20;
        const rotateY = (x / width - 0.5) * 20;
        
        el.style.setProperty('--rotate-x', `${rotateX}deg`);
        el.style.setProperty('--rotate-y', `${rotateY}deg`);
        el.style.setProperty('--pointer-x', `${(x/width)*100}%`);
        el.style.setProperty('--pointer-y', `${(y/height)*100}%`);
    };
    
    const handleMouseLeave = () => {
        el.style.setProperty('--rotate-x', '0deg');
        el.style.setProperty('--rotate-y', '0deg');
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`project-card-wrapper ${className}`.trim()} onClick={onClick}>
        <div className="project-card">
            <img className="pc-avatar" src={avatarUrl} alt={name} />
            <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
            </div>
        </div>
    </div>
  );
});

//==================================================================
// 8. PROJECT MODAL COMPONENT
//==================================================================
const ProjectModal = ({ data, closeModal }) => {
    return (
        <motion.div
            className="modal-backdrop"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
                <h2>{data.name}</h2>
                <p>{data.description}</p>
                <div className="modal-buttons">
                    <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="modal-button">GitHub Repo</a>
                    <a href={data.liveUrl} target="_blank" rel="noopener noreferrer" className="modal-button">Web View</a>
                </div>
            </motion.div>
        </motion.div>
    );
};


//==================================================================
// 9. FOOTER COMPONENT
//==================================================================
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2025 Rohit Mehta. All Rights Reserved.</p>
            </div>
        </footer>
    );
};


//==================================================================
// 10. MAIN APP COMPONENT
//==================================================================
export default function App() {
  const [formCompleted, setFormCompleted] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [modalData, setModalData] = useState(null);
  const contactSectionRef = useRef(null);

  const handleFormCompletion = (formData) => {
    console.log("Form Submitted:", formData);
    setFormCompleted(true);
  };
  
  const handleScrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const iridescenceColor = theme === 'light' ? [0.9, 0.9, 0.95] : [0.1, 0.15, 0.2];

  return (
    <div className={`app-container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <Iridescence 
        key={theme} 
        className="background-canvas"
        color={iridescenceColor}
        speed={1.0}
        amplitude={0.25}
        mouseReact={true}
      />
      <main className="content-container">
        <section id="home" className="hero-container">
          <AdvancedProfileCard
            handle="Rohit Mehta"
            status="Full Stack Developer"
            contactText="Get in Touch"
            avatarUrl={profileAvatar}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            onContactClick={handleScrollToContact}
          />
          <HeroText />
        </section>

        <section id="introduction" className="page-section">
            <h2>Introduction</h2>
            <p className="introduction-text">
                I’m a passionate Full Stack Developer with expertise in React, Node.js, Express.js, and MongoDB, along with strong knowledge of C++ (advanced), Java, and Python (intermediate). I specialize in building scalable, real-time applications and love working with interactive front-end technologies like Three.js to create seamless and engaging user experiences. My focus is on designing efficient solutions that are both high-performing and user-friendly. 🚀
            </p>
            <p className="introduction-text">
                Beyond web development, I explore AI-driven applications and document processing using tools like Tesseract OCR and generative AI APIs. With a strong foundation in both software engineering and emerging technologies, I bring a creative and problem-solving mindset to every project. I aim to merge innovation with practical implementation, delivering impactful solutions that push the boundaries of technology. 🚀
            </p>
        </section>

        <section id="about-offer" className="page-section">
          <h2>What I Offer</h2>
          <div className="grid-5">
            <SpotlightCard>
                <h3>Web Development</h3>
                <p>Building responsive, high-performance websites from the ground up using modern technologies like React and basics of Next.js, and WebGL.</p>
            </SpotlightCard>
            <SpotlightCard>
                <h3>UI/UX Design</h3>
               <p>Crafting intuitive and beautiful user interfaces that provide a seamless user experience, focusing on user research and interactive prototypes.</p>
            </SpotlightCard>
            <SpotlightCard>
              <h3>Creative Coding</h3>
              <p>Bringing digital experiences to life with interactive animations, data visualizations, and unique generative art using libraries like Three.js and p5.js. with some basic knowledge</p>
            </SpotlightCard>
            <SpotlightCard>
              <h3>Backend Development</h3>
              <p>Designing and implementing scalable server-side architectures, RESTful APIs, and database integrations with technologies like Node.js, Express, and SQL/NoSQL.</p>
            </SpotlightCard>
            <SpotlightCard>
              <h3>AI-Driven Projects</h3>
              <p>Leveraging artificial intelligence and machine learning to create intelligent applications, from recommendation systems to generative models and chatbots.</p>
            </SpotlightCard>
          </div>
        </section>

        <section id="projects" className="page-section">
          <h2>My Projects</h2>
          <p className="projects-description">
           The following projects highlight my skills and experience through practical, real-world applications. Each project includes a brief description along with links to code repositories and live demos, showcasing my ability to solve complex problems, adapt to diverse technologies, and manage projects efficiently
          </p>
          <div className="grid-5">
            {projectsData.map((project, index) => (
                <ProfileCard 
                  key={index}
                  avatarUrl={project.avatarUrl}
                  name={project.name}
                  title={project.title}
                  onClick={() => setModalData(project)}
                />
            ))}
          </div>
        </section>
        
        <section id="about" className="page-section">
          <h2>Explore More</h2>
            <div className="grid-3">
                <SpotlightCard>
                    <div className="stat-card">
                        <FaGithub className="stat-icon" />
                        <h3 className="stat-number">60+</h3>
                        <p>I have worked on 60+ projects and assignments on GitHub, including open-source contributions. These span a wide range of domains, from frontend and backend development to full-stack applications, reflecting my versatility and hands-on experience across different technologies.</p>
                    </div>
                </SpotlightCard>
                <SpotlightCard>
                    <div className="stat-card">
                        <SiLeetcode className="stat-icon" />
                        <h3 className="stat-number">100+</h3>
                        <p>I have solved 100+ DSA problems on LeetCode, demonstrating strong problem-solving skills and a solid understanding of data structures and algorithms..</p>
                    </div>
                </SpotlightCard>
                <SpotlightCard>
                    <div className="stat-card"> 
                      <FaGraduationCap className="stat-icon" />  
                        <h3>10 CGPA</h3>
                        <p>Secured a perfect 10 CGPA in 2 semesters at Chitkara University while pursuing my BE-CSE degree, showcasing excellence in my academic journey.</p>
                    </div>
                </SpotlightCard>
            </div>
        </section>

        <section id="contact" ref={contactSectionRef} className="page-section">
          <h2>Get In Touch</h2>
          {!formCompleted ? (
            <Stepper onFinalStepCompleted={handleFormCompletion}>
              <Step>
                <div className="form-step">
                  <label htmlFor="name">What's your name?</label>
                  <input type="text" id="name" name="name" placeholder="Enter your name" />
                </div>
              </Step>
              <Step>
                <div className="form-step">
                  <label htmlFor="email">What's your email address?</label>
                  <input type="email" id="email" name="email" placeholder="hello@example.com" />
                </div>
              </Step>
              <Step>
                <div className="form-step">
                  <label htmlFor="message">Your message</label>
                  <textarea id="message" name="message" rows="4" placeholder="Hello there..."></textarea>
                </div>
              </Step>
            </Stepper>
          ) : (
             <div className="form-success-message">
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I'll get back to you shortly.</p>
             </div>
          )}
        </section>
      </main>
      <Footer />
      
      <AnimatePresence>
        {modalData && <ProjectModal data={modalData} closeModal={() => setModalData(null)} />}
      </AnimatePresence>
    </div>
  );
}