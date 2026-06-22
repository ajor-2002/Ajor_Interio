document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const dropdownButtons = document.querySelectorAll('.dropdown-toggle');
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
  document.querySelectorAll('main img').forEach((img) => {
    if (
      img.classList.contains('hero-image') ||
      img.classList.contains('interior-hero-image') ||
      img.classList.contains('refer-hero-image') ||
      img.closest('main > section:first-child')
    ) {
      return;
    }
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  const formSubmitEndpoint = 'https://formsubmit.co/ajax/ajorinterio@gmail.com';
  const authStorageKey = 'ajorInterioAuthUser';

  const sendFormSubmitEmail = async (fields, subject) => {
    const payload = {
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      Page_URL: window.location.href,
      ...fields,
    };

    const response = await fetch(formSubmitEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok || !(data.success === 'true' || data.success === true)) {
      throw new Error(data.message || 'Form submission failed. Please try again.');
    }

    return data;
  };

  const inPagesFolder = window.location.pathname.includes('/pages/');
  let topbarInner = document.querySelector('.topbar-inner');
  if (!topbarInner) {
    const generatedTopbar = document.createElement('div');
    generatedTopbar.className = 'topbar generated-topbar';
    generatedTopbar.innerHTML = `
      <div class="container topbar-inner">
        <div class="top-links"></div>
      </div>
    `;

    const headerTarget = document.querySelector('header, main');
    if (headerTarget) {
      headerTarget.before(generatedTopbar);
    } else {
      document.body.prepend(generatedTopbar);
    }
    topbarInner = generatedTopbar.querySelector('.topbar-inner');
  }

  if (topbarInner) {
    const referPath = inPagesFolder ? 'refer-and-earn.html' : 'pages/refer-and-earn.html';
    const topLinks = topbarInner.querySelector('.top-links');
    const existingActions = topbarInner.querySelector('.top-actions');
    let topActions = existingActions;
    if (!topActions) {
      topActions = document.createElement('div');
      topActions.className = 'top-actions';
      topbarInner.appendChild(topActions);
    }
    if (topLinks && topActions && topLinks !== topActions) {
      Array.from(topLinks.children).forEach((child) => child.remove());
      topLinks.hidden = true;
    }
    Array.from(topActions.children).forEach((child) => {
      if (!child.classList.contains('ajor-auth-actions')) {
        child.remove();
      }
    });
    const referLink = document.createElement('a');
    referLink.href = referPath;
    referLink.className = 'top-link highlight';
    referLink.textContent = 'Refer and Earn';
    topActions.prepend(referLink);
    const authActions = document.createElement('div');
    authActions.className = 'ajor-auth-actions';
    authActions.innerHTML = `
      <button class="ajor-account-button" id="accountBtn" type="button" aria-label="Open login">
        <span>Login</span>
      </button>
      <div class="ajor-profile-wrap" id="userProfile" hidden>
        <button class="ajor-profile-button" id="profileMenuBtn" type="button" aria-label="Open profile menu" aria-expanded="false">
          <span>Login</span>
        </button>
        <div class="ajor-profile-menu" id="profileMenu" hidden>
          <div class="ajor-profile-menu-head">
            <div>
              <strong id="profileName">User</strong>
              <span id="profileEmail"></span>
            </div>
          </div>
          <button type="button" id="logoutBtn">Log out</button>
        </div>
      </div>
    `;

    if (topActions) {
      topActions.appendChild(authActions);
    } else {
      topbarInner.appendChild(authActions);
    }

    const socialIconBase = '/images/';
    const authPopup = document.createElement('div');
    authPopup.className = 'ajor-auth-popups';
    authPopup.innerHTML = `
      <div class="ajor-auth-popup" id="loginPopup" aria-hidden="true">
        <div class="ajor-auth-popup-box login-box" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
          <button class="ajor-auth-close" id="closeLogin" type="button" aria-label="Close login form">&times;</button>
          <h2 id="loginTitle">Log in</h2>
          <p>Log in to your account and seamlessly continue managing your projects, ideas, and progress just where you left off.</p>
          <form id="loginForm">
            <label class="ajor-auth-field ajor-auth-field-email">
              <input type="email" id="loginEmail" placeholder="Enter your email address" autocomplete="email" required />
            </label>
            <button type="submit">Log in</button>
            <div class="ajor-auth-socials" aria-label="Social login options">
              <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" aria-label="Open Facebook login">
                <img loading="lazy" decoding="async" src="${socialIconBase}facebook.png" alt="" aria-hidden="true" />
              </a>
              <a href="https://accounts.google.com/signin" target="_blank" rel="noopener noreferrer" aria-label="Open Google login">
                <img loading="lazy" decoding="async" src="${socialIconBase}google.png" alt="" aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" aria-label="Open Instagram login">
                <img loading="lazy" decoding="async" src="${socialIconBase}instagram.png" alt="" aria-hidden="true" />
              </a>
            </div>
            <p class="ajor-auth-switch">Didn't have an account? <button type="button" data-auth-open="signup">Sign up</button></p>
            <span class="ajor-auth-status" data-auth-status="login" hidden></span>
          </form>
        </div>
      </div>

      <div class="ajor-auth-popup" id="signupPopup" aria-hidden="true">
        <div class="ajor-auth-popup-box signup-box" role="dialog" aria-modal="true" aria-labelledby="signupTitle">
          <button class="ajor-auth-close" id="closeSignup" type="button" aria-label="Close signup form">&times;</button>
          <h2 id="signupTitle">Create Account</h2>
          <p>Create your account to save your projects and continue from any visit.</p>
          <form id="signupForm">
            <label class="ajor-auth-field ajor-auth-field-user">
              <input type="text" id="signupName" name="name" placeholder="Full Name" autocomplete="name" required />
            </label>
            <label class="ajor-auth-field ajor-auth-field-email">
              <input type="email" id="signupEmail" name="email" placeholder="Email Address" autocomplete="email" required />
            </label>
            <button type="submit">Signup</button>
            <p class="ajor-auth-switch">Already have an account? <button type="button" data-auth-open="login">Log in</button></p>
            <span class="ajor-auth-status" data-auth-status="signup" hidden></span>
          </form>
        </div>
      </div>

      <div class="ajor-auth-popup" id="otpPopup" aria-hidden="true">
        <div class="ajor-auth-popup-box otp-box" role="dialog" aria-modal="true" aria-labelledby="otpTitle">
          <button class="ajor-auth-close" id="closeOtp" type="button" aria-label="Close OTP verification">&times;</button>
          <h2 id="otpTitle">Verify OTP</h2>
          <p data-otp-helper>Choose how you want to receive the OTP, then enter the 6-digit code to continue.</p>
          <div class="ajor-otp-methods" role="group" aria-label="OTP delivery method">
            <button type="button" data-otp-send="email">Email OTP</button>
            <button type="button" data-otp-send="whatsapp">WhatsApp OTP</button>
          </div>
          <form id="otpForm">
            <label class="ajor-auth-field ajor-auth-field-otp">
              <input type="text" id="otpCode" name="otp" inputmode="numeric" maxlength="6" placeholder="Enter 6-digit OTP" autocomplete="one-time-code" required />
            </label>
            <button type="submit">Verify &amp; Get Estimate</button>
            <span class="ajor-auth-status" data-auth-status="otp" hidden></span>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(authPopup);

    const accountBtn = document.getElementById('accountBtn');
    const userProfile = document.getElementById('userProfile');
    const profileMenuBtn = document.getElementById('profileMenuBtn');
    const profileMenu = document.getElementById('profileMenu');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginPopup = document.getElementById('loginPopup');
    const signupPopup = document.getElementById('signupPopup');
    const otpPopup = document.getElementById('otpPopup');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const otpForm = document.getElementById('otpForm');
    const otpCodeInput = document.getElementById('otpCode');
    const otpHelper = document.querySelector('[data-otp-helper]');
    const otpSendButtons = Array.from(document.querySelectorAll('[data-otp-send]'));
    let otpState = null;

    const getSavedAuthUser = () => {
      try {
        return JSON.parse(localStorage.getItem(authStorageKey) || 'null');
      } catch (error) {
        return null;
      }
    };

    const saveAuthUser = (user) => {
      localStorage.setItem(authStorageKey, JSON.stringify(user));
    };

    const setAuthStatus = (mode, message, type = 'error') => {
      const status = document.querySelector(`[data-auth-status="${mode}"]`);
      if (!status) return;
      status.textContent = message;
      status.classList.toggle('is-success', type === 'success');
      status.hidden = false;
    };

    const clearAuthStatus = () => {
      document.querySelectorAll('.ajor-auth-status').forEach((status) => {
        status.textContent = '';
        status.classList.remove('is-success');
        status.hidden = true;
      });
    };

    const setLoggedInState = (user) => {
      const isLoggedIn = Boolean(user?.loggedIn || user?.email);
      accountBtn.hidden = isLoggedIn;
      userProfile.hidden = !isLoggedIn;
      if (isLoggedIn) {
        profileName.textContent = user.name || user.email || 'User';
        profileEmail.textContent = user.email || '';
      } else {
        profileMenu.hidden = true;
        profileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    };

    const openPopup = (popup) => {
      clearAuthStatus();
      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
      document.body.classList.add('auth-modal-open');
      window.setTimeout(() => popup.querySelector('input')?.focus(), 0);
    };

    const closePopup = (popup) => {
      popup.classList.remove('is-open');
      popup.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('auth-modal-open');
    };

    const cancelOtpVerification = () => {
      if (otpState?.reject) otpState.reject(new Error('OTP verification cancelled.'));
      otpState = null;
      closePopup(otpPopup);
    };

    const closeAllAuthPopups = () => {
      closePopup(loginPopup);
      closePopup(signupPopup);
      cancelOtpVerification();
    };

    const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

    const formatOtpPhone = (phone) => {
      const digits = (phone || '').replace(/\D/g, '');
      if (digits.length === 10) return `91${digits}`;
      return digits;
    };

    const setOtpLoading = (isLoading) => {
      otpSendButtons.forEach((button) => {
        button.disabled = isLoading;
      });
    };

    const deliverOtp = async (channel) => {
      if (!otpState) return;
      const { user, context } = otpState;
      const otp = generateOtp();
      otpState.code = otp;
      otpState.channel = channel;
      setOtpLoading(true);
      setAuthStatus('otp', `Sending OTP by ${channel === 'email' ? 'email' : 'WhatsApp'}...`, 'success');

      try {
        if (channel === 'email') {
          if (window.location.protocol === 'file:') {
            throw new Error('Open this page through http://127.0.0.1:8000 or your live website before sending Email OTP.');
          }

          await sendFormSubmitEmail(
            {
              Form_Type: 'Estimate OTP',
              Name: user.name,
              email: user.email,
              Email: user.email,
              _replyto: user.email,
              Phone: user.phone,
              OTP: otp,
              Estimate_Type: context || 'Calculator Estimate',
              _autoresponse: `Your Ajor Interio OTP is ${otp}. Enter this code to view your estimate.`,
            },
            'Ajor Interio Estimate OTP'
          );
          setAuthStatus('otp', `OTP sent to ${user.email}.`, 'success');
        } else {
          const whatsappPhone = formatOtpPhone(user.phone);
          if (!whatsappPhone) {
            setAuthStatus('otp', 'Please enter a valid phone number for WhatsApp OTP.');
            return;
          }
          const whatsappText = encodeURIComponent(`Your Ajor Interio OTP is ${otp}. Enter this code to view your estimate.`);
          window.open(`https://wa.me/${whatsappPhone}?text=${whatsappText}`, '_blank', 'noopener');
          setAuthStatus('otp', 'WhatsApp opened with your OTP. Enter the code here to continue.', 'success');
        }
        otpCodeInput?.focus();
      } catch (error) {
        setAuthStatus('otp', error.message || 'Could not send OTP. Please try again.');
      } finally {
        setOtpLoading(false);
      }
    };

    const openOtpVerification = (user, context = 'Calculator Estimate') => {
      return new Promise((resolve, reject) => {
        otpState = {
          user,
          context,
          code: '',
          channel: '',
          resolve,
          reject,
        };
        if (otpForm) otpForm.reset();
        if (otpHelper) {
          otpHelper.textContent = `Send an OTP to ${user.email || 'your email'} or WhatsApp number ${user.phone || ''}, then enter it to view your estimate.`;
        }
        openPopup(otpPopup);
        setAuthStatus('otp', 'Choose Email OTP or WhatsApp OTP.');
      });
    };

    const completeOtpVerification = () => {
      if (!otpState) return;
      const enteredOtp = otpCodeInput?.value.trim() || '';

      if (!otpState.code) {
        setAuthStatus('otp', 'Please send an OTP first.');
        return;
      }

      if (enteredOtp !== otpState.code) {
        setAuthStatus('otp', 'Incorrect OTP. Please check the code and try again.');
        otpCodeInput?.focus();
        return;
      }

      const user = {
        name: otpState.user.name,
        email: otpState.user.email,
        phone: otpState.user.phone,
        loggedIn: true,
        verifiedAt: new Date().toISOString(),
        verifiedBy: otpState.channel,
      };
      saveAuthUser(user);
      setLoggedInState(user);
      setAuthStatus('otp', 'OTP verified. Opening your estimate...', 'success');
      document.dispatchEvent(new CustomEvent('ajor:otp-verified', { detail: user }));
      otpState.resolve(user);
      otpState = null;
      window.setTimeout(() => closePopup(otpPopup), 450);
    };

    accountBtn.addEventListener('click', () => openPopup(loginPopup));
    profileMenuBtn.addEventListener('click', () => {
      const isOpen = profileMenu.hidden;
      profileMenu.hidden = !isOpen;
      profileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(authStorageKey);
      profileMenu.hidden = true;
      profileMenuBtn.setAttribute('aria-expanded', 'false');
      setLoggedInState(null);
    });
    document.getElementById('closeLogin')?.addEventListener('click', () => closePopup(loginPopup));
    document.getElementById('closeSignup')?.addEventListener('click', () => closePopup(signupPopup));
    document.getElementById('closeOtp')?.addEventListener('click', cancelOtpVerification);
    otpSendButtons.forEach((button) => {
      button.addEventListener('click', () => deliverOtp(button.dataset.otpSend));
    });
    otpForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      completeOtpVerification();
    });
    document.querySelectorAll('[data-auth-open]').forEach((button) => {
      button.addEventListener('click', () => {
        closeAllAuthPopups();
        openPopup(button.dataset.authOpen === 'signup' ? signupPopup : loginPopup);
      });
    });

    document.querySelectorAll('.ajor-auth-popup').forEach((popup) => {
      popup.addEventListener('click', (event) => {
        if (event.target !== popup) return;
        if (popup === otpPopup) {
          cancelOtpVerification();
          return;
        }
        closePopup(popup);
      });
    });

    document.addEventListener('click', (event) => {
      if (!userProfile.hidden && !userProfile.contains(event.target)) {
        profileMenu.hidden = true;
        profileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const submitButton = signupForm.querySelector('button[type="submit"]');

      if (!name || !email) {
        setAuthStatus('signup', 'Please fill all fields.');
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Signing up...';

      try {
        await sendFormSubmitEmail(
          {
            Form_Type: 'User Signup',
            Name: name,
            Email: email,
          },
          'New Ajor Interio User Signup'
        );
        const user = {
          name,
          email,
          loggedIn: true,
          signupAt: new Date().toISOString(),
        };
        saveAuthUser(user);
        setLoggedInState(user);
        setAuthStatus('signup', 'Signup successful.', 'success');
        document.dispatchEvent(new CustomEvent('ajor:signup-success', { detail: user }));
        window.setTimeout(closeAllAuthPopups, 500);
      } catch (error) {
        setAuthStatus('signup', error.message || 'Signup failed. Please try again.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Signup';
      }
    });

    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const savedUser = getSavedAuthUser();

      if (!savedUser?.email) {
        setAuthStatus('login', 'Please signup first.');
        window.setTimeout(() => {
          closePopup(loginPopup);
          openPopup(signupPopup);
        }, 500);
        return;
      }

      if (email === savedUser.email) {
        const user = {
          name: savedUser.name,
          email: savedUser.email,
          loggedIn: true,
          loginAt: new Date().toISOString(),
        };
        saveAuthUser(user);
        setLoggedInState(user);
        setAuthStatus('login', 'Login successful.', 'success');
        window.setTimeout(closeAllAuthPopups, 500);
      } else {
        setAuthStatus('login', 'Email does not match your saved profile.');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAllAuthPopups();
    });

    setLoggedInState(getSavedAuthUser());

    window.ajorInterioAuth = {
      getUser: getSavedAuthUser,
      openSignup: () => openPopup(signupPopup),
      openLogin: () => openPopup(loginPopup),
      verifyContact: openOtpVerification,
    };

    // Automatically show login popup after 5 seconds on the home screen
    const isHomePage = !inPagesFolder && (
      window.location.pathname === '/' ||
      window.location.pathname.endsWith('index.html') ||
      window.location.pathname === ''
    );

    if (isHomePage) {
      window.setTimeout(() => {
        const user = getSavedAuthUser();
        const isLoggedIn = Boolean(user?.loggedIn || user?.email);
        if (!isLoggedIn) {
          openPopup(loginPopup);
        }
      }, 5000);
    }
  }

  document.querySelectorAll('.blogs-footer-newsletter, .blog-newsletter-card form').forEach((newsletterForm) => {
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const status = document.createElement('span');
    status.className = 'newsletter-status';
    status.hidden = true;
    newsletterForm.appendChild(status);

    const setNewsletterStatus = (message, type = '') => {
      status.textContent = message;
      status.classList.toggle('is-error', type === 'error');
      status.classList.toggle('is-success', type === 'success');
      status.hidden = false;
    };

    newsletterForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = emailInput?.value.trim() || '';

      if (!email || !emailInput.checkValidity()) {
        emailInput?.focus();
        setNewsletterStatus('Please enter a valid email address.', 'error');
        return;
      }

      const originalButtonText = submitButton?.textContent || '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
      }
      setNewsletterStatus('Sending...', 'success');

      try {
        await sendFormSubmitEmail(
          {
            Form_Type: 'Newsletter Subscription',
            Email: email,
          },
          'New Ajor Interio Newsletter Subscription'
        );
        newsletterForm.reset();
        setNewsletterStatus('Subscribed successfully.', 'success');
      } catch (error) {
        setNewsletterStatus(error.message || 'Subscription failed. Please try again.', 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  });

  const copyrightConsentKey = 'ajorCopyrightAccepted';
  if (localStorage.getItem(copyrightConsentKey) !== 'true') {
    document.body.classList.add('has-copyright-consent');
    const copyrightConsent = document.createElement('div');
    copyrightConsent.className = 'copyright-consent';
    copyrightConsent.innerHTML = `
      <p>Copyright &copy; Ajor Interio. All rights reserved. By continuing, you accept our site terms.</p>
      <button type="button">Accept</button>
    `;
    document.body.appendChild(copyrightConsent);

    copyrightConsent.querySelector('button')?.addEventListener('click', () => {
      localStorage.setItem(copyrightConsentKey, 'true');
      document.body.classList.remove('has-copyright-consent');
      copyrightConsent.remove();
    });
  }

  document
    .querySelectorAll('.faq-list details, .interior-faq-list details, .ajor-offering-faq-list details, .kitchen-calc-faq-list details')
    .forEach((faqItem) => {
      faqItem.addEventListener('toggle', () => {
        if (!faqItem.open) return;

        const faqGroup = faqItem.closest('.faq-list, .interior-faq-list, .ajor-offering-faq-list, .kitchen-calc-faq-list');
        faqGroup?.querySelectorAll('details[open]').forEach((openItem) => {
          if (openItem !== faqItem) {
            openItem.open = false;
          }
        });
      });
    });

  let onlinePill = document.querySelector('.online-pill');
  if (!onlinePill) {
    onlinePill = document.createElement('div');
    onlinePill.className = 'online-pill';
    onlinePill.setAttribute('aria-label', 'We are online');
    onlinePill.innerHTML = `
      <span>We're Online!</span>
      <a href="contact.html">Connect</a>
    `;
    document.body.appendChild(onlinePill);
  }

  if (onlinePill) {
    const supportLogoPath = '/images/logo.png';
    const supportCard = document.createElement('div');
    supportCard.className = 'online-support-card';
    supportCard.setAttribute('aria-hidden', 'true');
    supportCard.innerHTML = `
      <button class="online-support-close" type="button" aria-label="Close support options"></button>
      <div class="online-support-panel" role="dialog" aria-label="Ajor Interio support options">
        <div class="online-support-top"></div>
        <div class="online-support-body">
          <div class="online-support-logo">
            <img src="${supportLogoPath}" alt="" />
          </div>
          <p>We are here to help you! Call or chat to connect with us right away.</p>
          <div class="online-support-actions">
            <a href="tel:+9844443388" data-online-call-open aria-label="Call Ajor Interio">
              <span class="online-support-action-icon">&#9742;</span>
              <strong>Call</strong>
            </a>
            <a href="https://wa.me/919844443388" target="_blank" rel="noopener" aria-label="Chat with Ajor Interio on WhatsApp">
              <span class="online-support-action-icon">&#9635;</span>
              <strong>Chat</strong>
            </a>
          </div>
        </div>
      </div>
      <div class="online-call-panel" aria-hidden="true">
        <form class="online-call-form" aria-label="Call us now form">
          <div class="online-call-header">
            <button class="online-call-back" type="button" aria-label="Back to support options">&#8249;</button>
            <img src="${supportLogoPath}" alt="" />
            <h3>Call us now</h3>
          </div>
          <div class="online-call-body">
            <input type="text" name="name" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="Email Address" required />
            <input type="tel" name="phone" placeholder="Enter your mobile number" required />
            <select name="city" required>
              <option value="">Select your city</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Chennai">Chennai</option>
              <option value="Kochi">Kochi</option>
            </select>
            <input type="text" name="pincode" placeholder="Current Residence Pincode" inputmode="numeric" />
            <button type="submit">&#9742; Call Now</button>
            <span class="online-call-status" hidden></span>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(supportCard);
    const supportPanel = supportCard.querySelector('.online-support-panel');
    const callPanel = supportCard.querySelector('.online-call-panel');
    const callForm = supportCard.querySelector('.online-call-form');
    const callStatus = supportCard.querySelector('.online-call-status');

    const setSupportOpen = (isOpen) => {
      supportCard.classList.toggle('is-open', isOpen);
      supportCard.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      onlinePill.classList.toggle('is-hidden', isOpen);
      if (!isOpen) {
        supportPanel.hidden = false;
        callPanel.classList.remove('is-open');
        callPanel.setAttribute('aria-hidden', 'true');
      }
    };

    onlinePill.addEventListener('click', (event) => {
      event.preventDefault();
      setSupportOpen(true);
    });

    supportCard.querySelector('.online-support-close')?.addEventListener('click', () => {
      setSupportOpen(false);
    });

    supportCard.querySelector('[data-online-call-open]')?.addEventListener('click', (event) => {
      event.preventDefault();
      supportPanel.hidden = true;
      callPanel.classList.add('is-open');
      callPanel.setAttribute('aria-hidden', 'false');
      callForm.querySelector('input')?.focus();
    });

    supportCard.querySelector('.online-call-back')?.addEventListener('click', () => {
      callPanel.classList.remove('is-open');
      callPanel.setAttribute('aria-hidden', 'true');
      supportPanel.hidden = false;
    });

    callForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(callForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const city = (formData.get('city') || '').toString().trim();
      const pincode = (formData.get('pincode') || '').toString().trim();
      const submitButton = callForm.querySelector('button[type="submit"]');
      const digitCount = (phone.match(/\d/g) || []).length;

      const setCallStatus = (message, type = 'error') => {
        callStatus.textContent = message;
        callStatus.classList.toggle('is-success', type === 'success');
        callStatus.hidden = false;
      };

      if (!name || !email || digitCount < 10 || !city) {
        setCallStatus('Please fill name, email, phone and city.');
        return;
      }

      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        await sendFormSubmitEmail(
          {
            Form_Type: 'Call Now Request',
            Name: name,
            Email: email,
            Phone: phone,
            City: city,
            Pincode: pincode || 'Not provided',
          },
          'New Ajor Interio Call Now Request'
        );
        callForm.reset();
        setCallStatus('Request sent. We will call you shortly.', 'success');
      } catch (error) {
        setCallStatus(error.message || 'Could not send request. Please try again.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && supportCard.classList.contains('is-open')) {
        setSupportOpen(false);
      }
    });
  }

  const leadForm = document.querySelector('.lead-form');
  if (leadForm) {
    const formStatus = leadForm.querySelector('.form-status');
    const nameInput = leadForm.querySelector('input[name="name"]');
    const phoneInput = leadForm.querySelector('input[name="phone"]');
    const cityInput = leadForm.querySelector('input[name="city"]');

    const setStatus = (message, type = '') => {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.classList.toggle('is-error', type === 'error');
      formStatus.classList.toggle('is-success', type === 'success');
    };

    const getDigitCount = (value) => (value.match(/\d/g) || []).length;

    const isValidCity = (value) => {
      const trimmed = value.trim();
      return /^[A-Za-z][A-Za-z\s.'-]{1,}$/.test(trimmed);
    };

    leadForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(leadForm);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const city = (formData.get('city') || '').toString().trim();

      if (!name) {
        nameInput?.focus();
        setStatus('Please enter your name.', 'error');
        return;
      }

      if (getDigitCount(phone) < 10) {
        phoneInput?.focus();
        setStatus('Phone number must contain at least 10 digits.', 'error');
        return;
      }

      if (!isValidCity(city)) {
        cityInput?.focus();
        setStatus('Please enter a valid city name.', 'error');
        return;
      }

      const submitButton = leadForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton?.textContent || '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }
      setStatus('Sending your request...', 'success');

      try {
        await sendFormSubmitEmail(
          {
            Form_Type: '3D Design Session Lead',
            Name: name,
            Phone: phone,
            City: city,
          },
          'New 3D Design Session Lead'
        );
        setStatus('Thank you. We will contact you shortly.', 'success');
        leadForm.reset();
      } catch (error) {
        setStatus(`There was an error: ${error.message}`, 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }

  const explicitDesignSessionButtons = Array.from(document.querySelectorAll('[data-design-session-open]'));
  const meetDesignerButtons = Array.from(document.querySelectorAll('a, button')).filter((element) => {
    return element.textContent?.trim().toLowerCase() === 'meet a designer';
  });
  const designSessionOpenButtons = Array.from(new Set([...explicitDesignSessionButtons, ...meetDesignerButtons]));
  let designSessionModal = document.querySelector('[data-design-session-modal]');
  if (designSessionOpenButtons.length && !designSessionModal) {
    designSessionModal = document.createElement('div');
    designSessionModal.className = 'design-session-modal';
    designSessionModal.setAttribute('data-design-session-modal', '');
    designSessionModal.hidden = true;
    designSessionModal.innerHTML = `
      <form class="design-session-dialog" action="https://formsubmit.co/ajorinterio@gmail.com" method="POST" aria-labelledby="design-session-title" data-design-session-form>
        <button class="design-session-close" type="button" aria-label="Close design session form" data-design-session-close>&times;</button>
        <h2 id="design-session-title">Book 3D Design Session</h2>
        <p>Share your details and our designer will contact you shortly.</p>

        <input type="hidden" name="_subject" value="New 3D Design Session Request" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="Page URL" data-design-session-page-url />

        <input name="name" type="text" placeholder="Your Name" autocomplete="name" required />
        <input name="phone" type="tel" placeholder="Phone Number" autocomplete="tel" required />
        <input name="city" type="text" placeholder="City" autocomplete="address-level2" required />
        <select name="timeSlot" aria-label="Select Preferred Time Slot">
          <option value="">Select Preferred Time Slot</option>
          <option value="Morning: 9 AM - 12 PM">Morning: 9 AM - 12 PM</option>
          <option value="Afternoon: 12 PM - 4 PM">Afternoon: 12 PM - 4 PM</option>
          <option value="Evening: 4 PM - 8 PM">Evening: 4 PM - 8 PM</option>
        </select>

        <p class="design-session-status" aria-live="polite"></p>
        <button class="design-session-submit" type="submit">Submit</button>
      </form>
    `;
    document.body.appendChild(designSessionModal);
  }
  const designSessionForm = document.querySelector('[data-design-session-form]');
  if (designSessionOpenButtons.length && designSessionModal && designSessionForm) {
    const designSessionCloseButton = document.querySelector('[data-design-session-close]');
    const designSessionStatus = designSessionForm.querySelector('.design-session-status');
    const designSessionPageUrl = designSessionForm.querySelector('[data-design-session-page-url]');
    const designSessionName = designSessionForm.querySelector('input[name="name"]');
    const designSessionPhone = designSessionForm.querySelector('input[name="phone"]');
    const designSessionCity = designSessionForm.querySelector('input[name="city"]');

    const setDesignSessionStatus = (message, type = '') => {
      if (!designSessionStatus) return;
      designSessionStatus.textContent = message;
      designSessionStatus.classList.toggle('is-error', type === 'error');
      designSessionStatus.classList.toggle('is-success', type === 'success');
    };

    const openDesignSessionModal = () => {
      if (designSessionPageUrl) designSessionPageUrl.value = window.location.href;
      designSessionModal.hidden = false;
      document.body.classList.add('lightbox-open');
      setDesignSessionStatus('');
      window.setTimeout(() => designSessionName?.focus(), 0);
    };

    const closeDesignSessionModal = () => {
      designSessionModal.hidden = true;
      document.body.classList.remove('lightbox-open');
    };

    designSessionOpenButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        openDesignSessionModal();
      });
    });

    designSessionCloseButton?.addEventListener('click', closeDesignSessionModal);
    designSessionModal.addEventListener('click', (event) => {
      if (event.target === designSessionModal) closeDesignSessionModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !designSessionModal.hidden) {
        closeDesignSessionModal();
      }
    });

    designSessionForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(designSessionForm);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const city = (formData.get('city') || '').toString().trim();
      const timeSlot = (formData.get('timeSlot') || '').toString().trim();
      const phoneDigits = (phone.match(/\d/g) || []).length;

      if (!name) {
        designSessionName?.focus();
        setDesignSessionStatus('Please enter your name.', 'error');
        return;
      }

      if (phoneDigits < 10) {
        designSessionPhone?.focus();
        setDesignSessionStatus('Phone number must contain at least 10 digits.', 'error');
        return;
      }

      if (!/^[A-Za-z][A-Za-z\s.'-]{1,}$/.test(city)) {
        designSessionCity?.focus();
        setDesignSessionStatus('Please enter a valid city name.', 'error');
        return;
      }

      const submitButton = designSessionForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton?.textContent || '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }
      setDesignSessionStatus('Sending your request...', 'success');

      try {
        await sendFormSubmitEmail(
          {
            Form_Type: '3D Design Session Request',
            Name: name,
            Phone: phone,
            City: city,
            Preferred_Time_Slot: timeSlot || 'Not selected',
          },
          'New 3D Design Session Request'
        );
        designSessionForm.reset();
        setDesignSessionStatus('Thank you. We will contact you shortly.', 'success');
      } catch (error) {
        setDesignSessionStatus(error.message || 'Could not send request. Please try again.', 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }

  const referCard = document.querySelector('.refer-card');
  if (referCard) {
    const phoneInput = referCard.querySelector('#refer-phone');
    const result = referCard.querySelector('[data-refer-panel="link"] .refer-result');
    const referLinkBox = referCard.querySelector('.refer-link-box');
    const copyButton = referCard.querySelector('.refer-copy-btn');
    const nativeShareButton = referCard.querySelector('.refer-native-share');
    const shareLinks = Array.from(referCard.querySelectorAll('.refer-share a'));
    const tabButtons = Array.from(referCard.querySelectorAll('[data-refer-tab]'));
    const panels = Array.from(referCard.querySelectorAll('[data-refer-panel]'));
    let activeReferTab = 'link';
    let currentReferralUrl = '';
    let currentShareText = '';

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeReferTab = button.dataset.referTab || 'link';
        tabButtons.forEach((tabButton) => {
          tabButton.classList.toggle('active', tabButton === button);
        });
        panels.forEach((panel) => {
          panel.classList.toggle('active', panel.dataset.referPanel === activeReferTab);
        });
      });
    });

    referCard.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (activeReferTab === 'invite') {
        const inviteResult = referCard.querySelector('.refer-invite-result');
        const city = referCard.querySelector('select[name="city"]')?.value.trim();
        const name = referCard.querySelector('input[name="friendName"]')?.value.trim();
        const email = referCard.querySelector('input[name="friendEmail"]')?.value.trim();
        const friendPhone = referCard.querySelector('input[name="friendPhone"]')?.value.trim();
        const yourPhone = referCard.querySelector('input[name="yourPhone"]')?.value.trim();

        if (!city || !name || !email || (friendPhone.match(/\d/g) || []).length < 10 || (yourPhone.match(/\d/g) || []).length < 10) {
          if (inviteResult) {
            inviteResult.textContent = 'Please fill all invite details correctly.';
          }
          return;
        }

        if (inviteResult) {
          inviteResult.textContent = 'Sending referral invite...';
        }

        try {
          await sendFormSubmitEmail(
            {
              Form_Type: 'Referral Invite',
              City: city,
              Friend_Name: name,
              Friend_Email: email,
              Friend_Phone: friendPhone,
              Referrer_Phone: yourPhone,
            },
            'New referral invite from Ajor Interio'
          );
          if (inviteResult) {
            inviteResult.textContent = 'Referral invite sent successfully.';
          }
        } catch (error) {
          if (inviteResult) {
            inviteResult.textContent = `There was an error: ${error.message}`;
          }
        }
        return;
      }

      const phone = (phoneInput?.value || '').trim();
      const digits = (phone.match(/\d/g) || []).join('');

      if (digits.length < 10) {
        if (result) {
          result.textContent = 'Please enter a valid phone number.';
        }
        if (referLinkBox) {
          referLinkBox.hidden = false;
        }
        phoneInput?.focus();
        return;
      }

      const referralCode = digits.slice(-10);
      const referralUrl = `${window.location.origin}${window.location.pathname.replace('pages/refer-and-earn.html', '')}?ref=${referralCode}`;
      const shareText = `Try Ajor Interio for your home interiors. Use my referral link: ${referralUrl}`;
      currentReferralUrl = referralUrl;
      currentShareText = shareText;

      if (result) {
        result.textContent = referralUrl;
      }
      if (referLinkBox) {
        referLinkBox.hidden = false;
      }

      if (shareLinks[0]) {
        shareLinks[0].href = 'https://www.facebook.com/ajorinterio';
      }
      if (shareLinks[1]) {
        shareLinks[1].href = 'https://www.instagram.com/ajorinterio/?hl=en';
      }
      if (shareLinks[2]) {
        shareLinks[2].href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      }
    });

    copyButton?.addEventListener('click', async () => {
      if (!currentReferralUrl) return;

      try {
        await navigator.clipboard.writeText(currentReferralUrl);
        const copyLabel = copyButton.querySelector('span');
        if (copyLabel) {
          copyLabel.textContent = 'Copied';
        }
        setTimeout(() => {
          if (copyLabel) {
            copyLabel.textContent = 'Copy Link';
          }
        }, 1800);
      } catch {
        if (result) {
          result.textContent = `${currentReferralUrl} - copy this link manually.`;
        }
      }
    });

    nativeShareButton?.addEventListener('click', async () => {
      if (!currentReferralUrl) return;

      if (navigator.share) {
        await navigator.share({
          title: 'Ajor Interio referral',
          text: currentShareText,
          url: currentReferralUrl,
        });
        return;
      }

      window.open(`https://wa.me/?text=${encodeURIComponent(currentShareText)}`, '_blank', 'noopener');
    });
  }

  const referSteps = document.querySelector('.refer-steps-wrap');
  if (referSteps) {
    const stepArt = referSteps.querySelector('.refer-steps-art');
    const stepButtons = Array.from(referSteps.querySelectorAll('[data-refer-step]'));
    const stepTitle = referSteps.querySelector('[data-refer-step-title]');
    const stepCopy = referSteps.querySelector('[data-refer-step-copy]');
    const stepContent = {
      1: {
        title: 'Refer',
        copy: 'Tell your friends about us',
      },
      2: {
        title: 'Relax',
        copy: 'Your friend books us',
      },
      3: {
        title: 'Rejoice',
        copy: 'Your friends pay us half, we pay you full',
      },
    };

    stepButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const step = button.dataset.referStep || '2';
        const content = stepContent[step] || stepContent[2];

        stepButtons.forEach((stepButton) => {
          stepButton.classList.toggle('active', stepButton === button);
        });

        if (stepArt) {
          stepArt.classList.remove('is-step-1', 'is-step-2', 'is-step-3');
          stepArt.classList.add(`is-step-${step}`);
        }

        if (stepTitle) {
          stepTitle.textContent = content.title;
        }

        if (stepCopy) {
          stepCopy.textContent = content.copy;
        }
      });
    });
  }

  const kitchenAccessorySlider = document.querySelector('[data-kitchen-accessory-slider]');
  if (kitchenAccessorySlider) {
    const track = kitchenAccessorySlider.querySelector('[data-kitchen-accessory-track]');
    const prevButton = kitchenAccessorySlider.querySelector('[data-kitchen-accessory-prev]');
    const nextButton = kitchenAccessorySlider.querySelector('[data-kitchen-accessory-next]');
    const items = Array.from(kitchenAccessorySlider.querySelectorAll('.kitchen-accessory'));
    let currentIndex = 0;

    const getVisibleCount = () => {
      if (window.matchMedia('(max-width: 520px)').matches) return 1;
      if (window.matchMedia('(max-width: 768px)').matches) return 2;
      return 4;
    };

    const updateKitchenAccessorySlider = () => {
      if (!track || !items.length) return;

      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, items.length - visibleCount);
      currentIndex = Math.min(currentIndex, maxIndex);
      const gap = parseFloat(window.getComputedStyle(track).columnGap || '0') || 0;
      const itemWidth = items[0].getBoundingClientRect().width + gap;

      track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
      if (prevButton) prevButton.disabled = currentIndex === 0;
      if (nextButton) nextButton.disabled = currentIndex >= maxIndex;
    };

    prevButton?.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateKitchenAccessorySlider();
    });

    nextButton?.addEventListener('click', () => {
      currentIndex += 1;
      updateKitchenAccessorySlider();
    });

    window.addEventListener('resize', updateKitchenAccessorySlider, { passive: true });
    updateKitchenAccessorySlider();
  }

  const kitchenFeetSelects = Array.from(document.querySelectorAll('[data-kitchen-feet]'));
  const kitchenInchSelects = Array.from(document.querySelectorAll('[data-kitchen-inch]'));

  const fillNumberSelect = (select, start, end) => {
    const defaultValue = select.dataset.defaultValue || String(start);
    select.replaceChildren();

    for (let value = start; value <= end; value += 1) {
      const option = document.createElement('option');
      option.value = String(value);
      option.textContent = String(value);
      option.selected = String(value) === defaultValue;
      select.append(option);
    }
  };

  kitchenFeetSelects.forEach((select) => fillNumberSelect(select, 5, 20));
  kitchenInchSelects.forEach((select) => fillNumberSelect(select, 0, 11));

  const kitchenEstimateButton = document.querySelector('[data-kitchen-estimate-open]');
  const kitchenLeadForm = document.querySelector('[data-kitchen-lead-form]');
  const kitchenEstimateStatus = document.querySelector('[data-kitchen-estimate-status]');
  const kitchenPriceModal = document.querySelector('[data-kitchen-price-modal]');
  const kitchenPriceSummary = document.querySelector('[data-kitchen-price-summary]');
  const kitchenPriceClose = document.querySelector('[data-kitchen-price-close]');

  const formatIndianPrice = (value) => `₹ ${Math.round(value).toLocaleString('en-IN')}`;

  document.querySelectorAll('.kitchen-accessory').forEach((accessory) => {
    const quantity = accessory.querySelector('strong');
    const buttons = Array.from(accessory.querySelectorAll('button'));
    const minusButton = buttons[0];
    const plusButton = buttons[1];

    const updateQuantity = (nextValue) => {
      const value = Math.max(0, nextValue);
      if (quantity) quantity.textContent = String(value);
      if (minusButton) minusButton.disabled = value === 0;
    };

    minusButton?.addEventListener('click', () => {
      updateQuantity(Number(quantity?.textContent || 0) - 1);
    });

    plusButton?.addEventListener('click', () => {
      updateQuantity(Number(quantity?.textContent || 0) + 1);
    });

    updateQuantity(Number(quantity?.textContent || 0));
  });

  const createKitchenSummaryRow = (label, value, detail = '') => {
    const row = document.createElement('div');
    const labelElement = document.createElement('span');
    const valueElement = document.createElement('strong');
    labelElement.textContent = label;
    valueElement.textContent = value;
    row.append(labelElement, valueElement);

    if (detail) {
      const detailElement = document.createElement('p');
      detailElement.textContent = detail;
      row.append(detailElement);
    }

    return row;
  };

  const openKitchenEstimateModal = () => {
    if (!kitchenPriceModal || !kitchenPriceSummary) return;

    const shape = document.querySelector('input[name="kitchen-shape"]:checked')?.parentElement?.textContent?.trim() || 'L-Shape';
    const wallRows = Array.from(document.querySelectorAll('.kitchen-wall-controls label')).map((label) => {
      const selects = label.querySelectorAll('select');
      return `${selects[0]?.value || 0}ft ${selects[1]?.value || 0}in`;
    });
    const cabinetMaterial = document.querySelector('select[aria-label="Cabinet material"]')?.value || 'Particle Board';
    const shutterMaterial = document.querySelector('select[aria-label="Shutter material and finish"]')?.value || 'Particle Board Matte Laminate';
    const selectedAccessories = Array.from(document.querySelectorAll('.kitchen-accessory'))
      .map((accessory) => {
        const quantity = Number(accessory.querySelector('strong')?.textContent || 0);
        const name = accessory.querySelector('p')?.textContent?.trim() || '';
        return { name, quantity };
      })
      .filter((item) => item.quantity > 0);
    const accessoryNames = selectedAccessories.map((item) => item.quantity > 1 ? `${item.name} x ${item.quantity}` : item.name).join(', ');

    // Get configuration and calculate actual costs
    const config = window.AJOR_KITCHEN_CALCULATOR_CONFIG || {};
    const packageType = 'Premium'; // Default package assumed for base calculation

    // Calculate Running Feet from wall selects
    const runningFeet = Array.from(document.querySelectorAll('.kitchen-wall-controls label')).reduce((sum, label) => {
      const selects = label.querySelectorAll('select');
      const ft = parseFloat(selects[0]?.value) || 0;
      const inch = parseFloat(selects[1]?.value) || 0;
      return sum + ft + (inch / 12);
    }, 0);

    const shapeRate = config.shapeRatePerRunningFoot?.[shape]?.[packageType] || 0;
    const cabinetMultiplier = config.cabinetMaterialMultiplier?.[cabinetMaterial] || 1;
    const shutterMultiplier = config.shutterFinishMultiplier?.[shutterMaterial] || 1;

    const materialCost = runningFeet * shapeRate * cabinetMultiplier * shutterMultiplier;
    const accessoryCost = selectedAccessories.reduce((sum, item) => {
      const rate = config.accessoryRate?.[item.name] || 0;
      return sum + (item.quantity * rate);
    }, 0);

    const subtotal = materialCost + accessoryCost;

    kitchenPriceSummary.replaceChildren(
      createKitchenSummaryRow('Shape:', shape),
      createKitchenSummaryRow('Size:', wallRows.join(' x ')),
      createKitchenSummaryRow('Material:', formatIndianPrice(materialCost), `${cabinetMaterial}, ${shutterMaterial}`),
      createKitchenSummaryRow('Accessories:', formatIndianPrice(accessoryCost), accessoryNames || 'No accessories selected'),
      createKitchenSummaryRow('Sub Total:', formatIndianPrice(subtotal))
    );

    kitchenPriceModal.hidden = false;
    document.body.classList.add('home-calc-summary-open');
    kitchenPriceClose?.focus();
  };

  const closeKitchenEstimateModal = () => {
    if (!kitchenPriceModal) return;
    kitchenPriceModal.hidden = true;
    document.body.classList.remove('home-calc-summary-open');
    kitchenEstimateButton?.focus();
  };

  const getKitchenLeadValue = (name) => {
    const field = kitchenLeadForm?.elements?.[name];
    return field?.value?.trim() || '';
  };

  const setKitchenEstimateStatus = (message, type = 'error') => {
    if (!kitchenEstimateStatus) return;
    kitchenEstimateStatus.textContent = message;
    kitchenEstimateStatus.classList.toggle('is-success', type === 'success');
  };

  const verifyKitchenLead = async () => {
    if (!kitchenLeadForm) return null;
    const name = getKitchenLeadValue('name');
    const phone = getKitchenLeadValue('phone');
    const email = getKitchenLeadValue('email');
    const phoneDigits = (phone.match(/\d/g) || []).length;

    if (!name) {
      kitchenLeadForm.elements?.name?.focus();
      setKitchenEstimateStatus('Please enter your name.');
      return null;
    }

    if (phoneDigits < 10) {
      kitchenLeadForm.elements?.phone?.focus();
      setKitchenEstimateStatus('Please enter a valid mobile number.');
      return null;
    }

    if (!email || !email.includes('@')) {
      kitchenLeadForm.elements?.email?.focus();
      setKitchenEstimateStatus('Please enter a valid email address.');
      return null;
    }

    setKitchenEstimateStatus('Verify OTP to view your estimate.', 'success');

    const user = {
      name,
      phone,
      email,
      possession: getKitchenLeadValue('possession'),
      city: getKitchenLeadValue('city'),
    };

    if (window.ajorInterioAuth?.verifyContact) {
      return window.ajorInterioAuth.verifyContact(user, 'Kitchen Calculator Estimate');
    }

    return user;
  };

  kitchenEstimateButton?.addEventListener('click', async () => {
    try {
      const verifiedUser = await verifyKitchenLead();
      if (verifiedUser) {
        setKitchenEstimateStatus('');
        openKitchenEstimateModal();
      }
    } catch (error) {
      setKitchenEstimateStatus('OTP verification is required to view the estimate.');
    }
  });

  kitchenPriceClose?.addEventListener('click', closeKitchenEstimateModal);
  kitchenPriceModal?.addEventListener('click', (event) => {
    if (event.target === kitchenPriceModal) closeKitchenEstimateModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && kitchenPriceModal && !kitchenPriceModal.hidden) {
      closeKitchenEstimateModal();
    }
  });

  const homeCalcForm = document.querySelector('.home-calc-form');
  if (homeCalcForm) {
    const progressSteps = Array.from(document.querySelectorAll('.home-calc-step'));
    const panels = Array.from(document.querySelectorAll('[data-home-calc-panel]'));
    const backButton = document.querySelector('[data-home-calc-back]');
    const scopeNextButton = document.querySelector('[data-home-calc-scope-next]');
    const packageBackButton = document.querySelector('[data-home-calc-package-back]');
    const packageNextButton = document.querySelector('[data-home-calc-package-next]');
    const estimateBackButton = document.querySelector('[data-home-calc-estimate-back]');
    const estimateForm = document.querySelector('.home-calc-estimate-form');
    const estimateStatus = document.querySelector('.home-calc-estimate-status');
    const budgetOutput = document.querySelector('[data-home-calc-budget]');
    const packageButtons = Array.from(document.querySelectorAll('[data-home-calc-package]'));
    const summaryButton = document.querySelector('[data-home-calc-summary]');
    const summaryModal = document.querySelector('[data-home-calc-summary-modal]');
    const summaryDetails = document.querySelector('[data-home-calc-summary-details]');
    const summaryCloseButton = document.querySelector('[data-home-calc-summary-close]');
    const consultationOpenButton = document.querySelector('[data-home-calc-consultation-open]');
    const consultationModal = document.querySelector('[data-home-calc-consultation-modal]');
    const consultationForm = document.querySelector('[data-home-calc-consultation-form]');
    const consultationCloseButton = document.querySelector('[data-home-calc-consultation-close]');
    const consultationStatus = document.querySelector('.home-calc-consultation-status');
    const consultationHomeButton = document.querySelector('[data-home-calc-consultation-home]');
    const calcToast = document.querySelector('[data-home-calc-toast]');
    const calcToastTitle = document.querySelector('[data-home-calc-toast-title]');
    const calcToastMessage = document.querySelector('[data-home-calc-toast-message]');
    const calcToastClose = document.querySelector('[data-home-calc-toast-close]');
    let calcToastTimer = null;
    const panelByStep = ['space', 'scope', 'package', 'estimate', 'result'];

    const showHomeCalcStep = (stepIndex) => {
      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.homeCalcPanel === panelByStep[stepIndex]);
      });

      progressSteps.forEach((step, index) => {
        const visibleStepIndex = Math.min(stepIndex, 3);
        step.classList.toggle('active', index === visibleStepIndex);
        step.classList.toggle('complete', index < visibleStepIndex);
      });
    };

    const getActiveOptionText = (selector) => {
      const group = document.querySelector(selector);
      return group?.querySelector('.active')?.textContent?.trim() || '';
    };

    const getEstimateFormValue = (name) => {
      const field = estimateForm?.elements?.[name];
      return field?.value?.trim() || '-';
    };

    const getConsultationFormValue = (name) => {
      const field = consultationForm?.elements?.[name];
      return field?.value?.trim() || '';
    };

    const showCalcToast = (title, message) => {
      if (!calcToast || !calcToastTitle || !calcToastMessage) return;

      window.clearTimeout(calcToastTimer);
      calcToastTitle.textContent = title;
      calcToastMessage.textContent = message;
      calcToast.hidden = false;
      calcToast.classList.add('is-visible');

      calcToastTimer = window.setTimeout(() => {
        calcToast.classList.remove('is-visible');
        calcToast.hidden = true;
      }, 4200);
    };


    const hideCalcToast = () => {
      if (!calcToast) return;
      window.clearTimeout(calcToastTimer);
      calcToast.classList.remove('is-visible');
      calcToast.hidden = true;
    };

    const getBudgetRange = () => {
      const bhk = getActiveOptionText('.home-calc-options.bhk');
      const selectedPackage = document.querySelector('[data-home-calc-package].active strong')?.textContent?.trim() || 'Luxury';
      const bhkValue = Number((bhk.match(/\d+/) || ['2'])[0]);
      const calcConfig = window.AJOR_HOME_CALCULATOR_CONFIG || {};
      const propertyType = getActiveOptionText('.home-calc-form fieldset:nth-of-type(1) .home-calc-options') || 'Apartment';
      const projectType = getActiveOptionText('.home-calc-form fieldset:nth-of-type(3) .home-calc-options') || 'Renovation';
      const baseCost = Number(calcConfig.baseCostByBhkAndPackage?.[bhkValue]?.[selectedPackage] || 0);
      const roomRates = calcConfig.roomRateInLakhs || {};
      const roomAmount = Array.from(document.querySelectorAll('[data-room-count]')).reduce((total, room) => {
        const roomKey = room.dataset.roomKey || '';
        const roomCount = Number(room.querySelector('span')?.textContent || 0);
        const roomRate = Number(roomRates[roomKey] || 0);
        return total + roomCount * roomRate;
      }, 0);
      const propertyMultiplier = Number(calcConfig.propertyTypeMultiplier?.[propertyType] || 1);
      const projectMultiplier = Number(calcConfig.projectTypeMultiplier?.[projectType] || 1);
      const rangePercent = Number(calcConfig.rangePercent) || 0.15;
      const adjustedAmount = (baseCost + roomAmount) * propertyMultiplier * projectMultiplier;
      const lower = adjustedAmount;
      const upper = lower + lower * rangePercent;
      return `Rs. ${Math.round(lower)}L - Rs. ${Math.round(upper)}L`;
    };

    const createSummaryRow = (label, value) => {
      const row = document.createElement('p');
      const labelElement = document.createElement('strong');
      labelElement.textContent = `${label}: `;
      row.append(labelElement, document.createTextNode(value || '-'));
      return row;
    };

    const openQuoteSummary = () => {
      if (!summaryModal || !summaryDetails) return;

      const selectedPackage = document.querySelector('[data-home-calc-package].active strong')?.textContent?.trim() || '-';
      const budget = budgetOutput?.textContent?.trim() || getBudgetRange();
      const rows = [
        ['Name', getEstimateFormValue('name')],
        ['Email', getEstimateFormValue('email')],
        ['Mobile', getEstimateFormValue('phone')],
        ['Property Type', getActiveOptionText('.home-calc-form fieldset:nth-of-type(1) .home-calc-options')],
        ['BHK Type', getActiveOptionText('.home-calc-options.bhk')],
        ['Project Type', getActiveOptionText('.home-calc-form fieldset:nth-of-type(3) .home-calc-options')],
        ['Package', selectedPackage],
        ['Visit Date', getEstimateFormValue('visitDate')],
      ];

      summaryDetails.replaceChildren();
      rows.forEach(([label, value]) => {
        summaryDetails.append(createSummaryRow(label, value));
      });

      const costRow = createSummaryRow('Final Estimated Cost', budget);
      costRow.className = 'home-calc-summary-cost';
      summaryDetails.append(costRow);

      summaryModal.hidden = false;
      document.body.classList.add('home-calc-summary-open');
      summaryCloseButton?.focus();
    };

    const closeQuoteSummary = () => {
      if (!summaryModal) return;
      summaryModal.hidden = true;
      document.body.classList.remove('home-calc-summary-open');
      summaryButton?.focus();
    };

    const openConsultationForm = () => {
      if (!consultationModal) return;
      consultationModal.hidden = false;
      document.body.classList.add('home-calc-summary-open');
      if (consultationStatus) {
        consultationStatus.textContent = '';
        consultationStatus.classList.remove('is-error', 'is-success');
      }
      if (consultationHomeButton) {
        consultationHomeButton.hidden = true;
      }
      consultationForm?.elements?.name?.focus();
    };

    const closeConsultationForm = () => {
      if (!consultationModal) return;
      consultationModal.hidden = true;
      document.body.classList.remove('home-calc-summary-open');
      consultationOpenButton?.focus();
    };

    const sendConsultationRequest = async () => {
      if (!consultationForm) return;

      const name = getConsultationFormValue('name');
      const email = getConsultationFormValue('email');
      const phone = getConsultationFormValue('phone');
      const projectType = getConsultationFormValue('projectType');
      const location = getConsultationFormValue('location');
      const timeSlot = getConsultationFormValue('timeSlot');
      const consent = consultationForm.elements?.consent?.checked;
      const phoneDigits = (phone.match(/\d/g) || []).length;

      const setConsultationStatus = (message, type) => {
        if (!consultationStatus) return;
        consultationStatus.textContent = message;
        consultationStatus.classList.toggle('is-error', type === 'error');
        consultationStatus.classList.toggle('is-success', type === 'success');
      };

      if (!name) {
        consultationForm.elements?.name?.focus();
        showCalcToast('Name is missing', 'Please fill out the name field.');
        return;
      }

      if (!email || !email.includes('@')) {
        consultationForm.elements?.email?.focus();
        showCalcToast('Email is missing', 'Please enter a valid email address.');
        return;
      }

      if (phoneDigits < 10) {
        consultationForm.elements?.phone?.focus();
        showCalcToast('Phone number is missing', 'Please enter a valid phone number.');
        return;
      }

      if (!projectType) {
        consultationForm.elements?.projectType?.focus();
        showCalcToast('Project type is missing', 'Please fill out the project type field.');
        return;
      }

      if (!location) {
        consultationForm.elements?.location?.focus();
        showCalcToast('Project location is missing', 'Please fill out the project location field.');
        return;
      }

      if (!timeSlot) {
        consultationForm.elements?.timeSlot?.focus();
        showCalcToast('Time slot is missing', 'Please select your preferred time slot.');
        return;
      }

      if (!consent) {
        consultationForm.elements?.consent?.focus();
        showCalcToast('Permission is missing', 'Please accept the contact permission checkbox.');
        return;
      }

      const selectedPackage = document.querySelector('[data-home-calc-package].active strong')?.textContent?.trim() || '-';
      const budget = budgetOutput?.textContent?.trim() || getBudgetRange();
      const hiddenFields = {
        propertyType: getActiveOptionText('.home-calc-form fieldset:nth-of-type(1) .home-calc-options'),
        bhkType: getActiveOptionText('.home-calc-options.bhk'),
        projectCategory: getActiveOptionText('.home-calc-form fieldset:nth-of-type(3) .home-calc-options'),
        package: selectedPackage,
        budget,
        visitDate: getEstimateFormValue('visitDate'),
        pageUrl: window.location.href,
      };

      Object.entries(hiddenFields).forEach(([key, value]) => {
        const field = consultationForm.querySelector(`[data-home-calc-consultation-hidden="${key}"]`);
        if (field) field.value = value;
      });

      setConsultationStatus('Sending your consultation request...', 'success');
      const submitButton = consultationForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton?.textContent || '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      try {
        await sendFormSubmitEmail(
          {
            Form_Type: 'Free Consultation Request',
            Name: name,
            Email: email,
            Phone: phone,
            Project_Type: projectType,
            Project_Location: location,
            Preferred_Time_Slot: timeSlot,
            Calculator_Property_Type: hiddenFields.propertyType,
            Calculator_BHK_Type: hiddenFields.bhkType,
            Calculator_Project_Category: hiddenFields.projectCategory,
            Calculator_Package: hiddenFields.package,
            Calculator_Estimated_Cost: hiddenFields.budget,
            Calculator_Visit_Date: hiddenFields.visitDate,
          },
          'New Free Consultation Request'
        );
        setConsultationStatus('Thank you. Your request has been sent.', 'success');
        consultationForm.reset();
        if (consultationHomeButton) {
          consultationHomeButton.hidden = false;
        }
      } catch (error) {
        setConsultationStatus(`There was an error: ${error.message}`, 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    };

    homeCalcForm.querySelectorAll('fieldset').forEach((fieldset) => {
      const optionButtons = Array.from(fieldset.querySelectorAll('[data-home-calc-option]'));

      optionButtons.forEach((button) => {
        button.addEventListener('click', () => {
          optionButtons.forEach((optionButton) => {
            optionButton.classList.toggle('active', optionButton === button);
          });
        });
      });
    });

    homeCalcForm.addEventListener('submit', (event) => {
      event.preventDefault();
      showHomeCalcStep(1);
    });

    backButton?.addEventListener('click', () => {
      showHomeCalcStep(0);
    });

    scopeNextButton?.addEventListener('click', () => {
      showHomeCalcStep(2);
    });

    packageBackButton?.addEventListener('click', () => {
      showHomeCalcStep(1);
    });

    packageNextButton?.addEventListener('click', () => {
      showHomeCalcStep(3);
    });

    estimateBackButton?.addEventListener('click', () => {
      showHomeCalcStep(2);
    });

    packageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        packageButtons.forEach((packageButton) => {
          packageButton.classList.toggle('active', packageButton === button);
        });
      });
    });

    estimateForm?.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(estimateForm);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const visitDate = (formData.get('visitDate') || '').toString().trim();

      if (!name) {
        showCalcToast('Name is missing', 'Please fill out the name field.');
        estimateForm.elements?.name?.focus();
        return;
      }

      if ((phone.match(/\d/g) || []).length < 10) {
        showCalcToast('Phone number is missing', 'Please enter a valid phone number.');
        estimateForm.elements?.phone?.focus();
        return;
      }

      if (!email) {
        showCalcToast('Email is missing', 'Please fill out the email field.');
        estimateForm.elements?.email?.focus();
        return;
      }

      if (!visitDate) {
        showCalcToast('Visit date is missing', 'Please select your preferred visit date.');
        estimateForm.elements?.visitDate?.focus();
        return;
      }

      if (estimateStatus) {
        estimateStatus.textContent = 'Verify OTP to view your estimate.';
        estimateStatus.classList.add('is-success');
      }

      try {
        if (window.ajorInterioAuth?.verifyContact) {
          await window.ajorInterioAuth.verifyContact(
            {
              name,
              phone,
              email,
              visitDate,
            },
            'Home Interior Calculator Estimate'
          );
        }

        if (budgetOutput) {
          budgetOutput.textContent = getBudgetRange();
        }

        showHomeCalcStep(4);
      } catch (error) {
        if (estimateStatus) {
          estimateStatus.textContent = 'OTP verification is required to view the estimate.';
          estimateStatus.classList.remove('is-success');
        }
      }
    });

    summaryButton?.addEventListener('click', openQuoteSummary);
    calcToastClose?.addEventListener('click', hideCalcToast);
    summaryCloseButton?.addEventListener('click', closeQuoteSummary);
    summaryModal?.addEventListener('click', (event) => {
      if (event.target === summaryModal) {
        closeQuoteSummary();
      }
    });

    consultationOpenButton?.addEventListener('click', (event) => {
      event.preventDefault();
      openConsultationForm();
    });

    consultationCloseButton?.addEventListener('click', closeConsultationForm);
    consultationModal?.addEventListener('click', (event) => {
      if (event.target === consultationModal) {
        closeConsultationForm();
      }
    });

    consultationForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      sendConsultationRequest();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && summaryModal && !summaryModal.hidden) {
        closeQuoteSummary();
      }

      if (event.key === 'Escape' && consultationModal && !consultationModal.hidden) {
        closeConsultationForm();
      }
    });

    document.querySelectorAll('[data-room-count]').forEach((room) => {
      const value = room.querySelector('span');
      const minus = room.querySelector('[data-room-minus]');
      const plus = room.querySelector('[data-room-plus]');

      minus?.addEventListener('click', () => {
        const nextValue = Math.max(0, Number(value?.textContent || 0) - 1);
        if (value) value.textContent = nextValue.toString();
      });

      plus?.addEventListener('click', () => {
        const nextValue = Number(value?.textContent || 0) + 1;
        if (value) value.textContent = nextValue.toString();
      });
    });
  }

  const modularKitchenGallery = document.querySelector('.mk-gallery-section');
  if (modularKitchenGallery) {
    const cards = Array.from(modularKitchenGallery.querySelectorAll('.mk-design-card'));
    const filterButtons = Array.from(modularKitchenGallery.querySelectorAll('.mk-filter-bar .mk-filter'));
    const loadMoreWrap = modularKitchenGallery.querySelector('.mk-load-more-wrap');
    const loadMoreButton = modularKitchenGallery.querySelector('.mk-load-more');
    const filterDrawer = document.querySelector('.mk-filter-drawer');
    const filterDrawerOverlay = document.querySelector('.mk-filter-drawer-overlay');
    const filterDrawerClose = document.querySelector('.mk-filter-close');
    const filterDrawerCancel = document.querySelector('.mk-filter-cancel');
    const filterDrawerApply = document.querySelector('.mk-filter-apply');
    const filterDrawerClear = document.querySelector('.mk-filter-clear');
    const drawerShapeButtons = Array.from(
      document.querySelectorAll('.mk-filter-drawer .mk-filter-chip[data-filter]')
    );
    const drawerColorButtons = Array.from(
      document.querySelectorAll('.mk-filter-drawer .mk-color-chip[data-color]')
    );
    const drawerFinishButtons = Array.from(
      document.querySelectorAll('.mk-filter-drawer .mk-filter-chip[data-finish]')
    );
    const drawerStorageButtons = Array.from(
      document.querySelectorAll('.mk-filter-drawer .mk-filter-chip[data-storage]')
    );
    const initialLimit = 6;

    let activeFilterMode = 'shape';
    let activeShapeFilter = 'all';
    let activeColorFilter = '';
    let activeFinishFilter = '';
    let activeStorageFilter = '';
    let expanded = false;

    const normalizeText = (value) =>
      (value || '')
        .toString()
        .toLowerCase()
        .replace(/[_\-.]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const detectCategory = (card) => {
      const image = card.querySelector('img');
      const source = normalizeText(
        [card.querySelector('h3')?.textContent, image?.alt, image?.getAttribute('src')]
          .filter(Boolean)
          .join(' ')
      );

      if (source.includes('parallel')) return 'parallel';
      if (source.includes('straight island')) return 'straight-island';
      if (source.includes('l shaped island')) return 'l-shaped-island';
      if (source.includes('u shaped island')) return 'u-shaped-island';
      if (source.includes('u shaped')) return 'u-shaped';
      if (source.includes('l shaped')) return 'l-shaped';
      if (source.includes('straight')) return 'straight';

      return 'all';
    };

    const detectColor = (card) => {
      const image = card.querySelector('img');
      const source = normalizeText(
        [card.querySelector('h3')?.textContent, image?.alt, image?.getAttribute('src')]
          .filter(Boolean)
          .join(' ')
      );

      if (source.includes('black')) return 'black';
      if (source.includes('green') || source.includes('meadow')) return 'green';
      if (source.includes('orange') || source.includes('citrus') || source.includes('amber')) return 'orange';
      if (source.includes('brown') || source.includes('beige') || source.includes('coffee') || source.includes('umber') || source.includes('mojave') || source.includes('walnut') || source.includes('oak') || source.includes('acacia') || source.includes('cappuccino') || source.includes('wood') || source.includes('ecru') || source.includes('chamoisee')) return 'brown';
      if (source.includes('grey') || source.includes('gray') || source.includes('silver') || source.includes('gainsboro')) return 'grey';
      if (source.includes('blue') || source.includes('indigo') || source.includes('navy') || source.includes('lupin') || source.includes('azure')) return 'blue';
      if (source.includes('yellow') || source.includes('buttercream') || source.includes('gold') || source.includes('lemon')) return 'yellow';
      if (source.includes('red') || source.includes('berry') || source.includes('burgundy') || source.includes('ruby')) return 'red';
      if (source.includes('purple') || source.includes('plum') || source.includes('lavender')) return 'purple';
      if (source.includes('pink') || source.includes('rose') || source.includes('passion flower')) return 'pink';
      if (source.includes('ivory') || source.includes('cream') || source.includes('white') || source.includes('frosty')) return 'ivory';

      return 'white';
    };

    const detectFinish = (card) => {
      const image = card.querySelector('img');
      const source = normalizeText(
        [card.querySelector('h3')?.textContent, image?.alt, image?.getAttribute('src')]
          .filter(Boolean)
          .join(' ')
      );

      if (source.includes('acrylic')) return 'acrylic';
      if (source.includes('lacquered') || source.includes('high gloss') || source.includes('glass')) {
        return 'lacquered-glass';
      }
      if (source.includes('membrane')) return 'membrane';
      if (source.includes('gloss') || source.includes('sleek') || source.includes('modern')) return 'gloss';
      return 'matte';
    };

    const detectStorage = (card) => {
      const image = card.querySelector('img');
      const source = normalizeText(
        [card.querySelector('h3')?.textContent, image?.alt, image?.getAttribute('src')]
          .filter(Boolean)
          .join(' ')
      );

      if (source.includes('breakfast counter')) return 'breakfast-counter';
      if (source.includes('built in appliance') || source.includes('appliance') || source.includes('oven')) {
        return 'built-in-appliance';
      }
      if (source.includes('open shelves') || source.includes('open shelf')) return 'open-shelves';
      if (source.includes('glass shutter') || source.includes('glass')) return 'glass-shutter';
      if (source.includes('loft')) return 'loft';
      if (source.includes('tall')) return 'tall-unit';
      return 'base-wall-units';
    };

    cards.forEach((card) => {
      card.dataset.category = detectCategory(card);
      card.dataset.color = detectColor(card);
      card.dataset.finish = detectFinish(card);
      card.dataset.storage = detectStorage(card);
    });

    const getMatchingCards = () =>
      cards.filter((card) => {
        if (activeFilterMode === 'color') {
          return !activeColorFilter || card.dataset.color === activeColorFilter;
        }

        if (activeFilterMode === 'finish') {
          return !activeFinishFilter || card.dataset.finish === activeFinishFilter;
        }

        if (activeFilterMode === 'storage') {
          return !activeStorageFilter || card.dataset.storage === activeStorageFilter;
        }

        return activeShapeFilter === 'all' || card.dataset.category === activeShapeFilter;
      });

    const updateFilterButtons = () => {
      filterButtons.forEach((button) => {
        const buttonFilter = button.dataset.filter || 'all';
        button.classList.toggle(
          'active',
          activeFilterMode === 'shape' && buttonFilter === activeShapeFilter && buttonFilter !== 'more'
        );
      });

      drawerShapeButtons.forEach((button) => {
        button.classList.toggle('active', activeFilterMode === 'shape' && button.dataset.filter === activeShapeFilter);
      });

      drawerColorButtons.forEach((button) => {
        button.classList.toggle('active', activeFilterMode === 'color' && button.dataset.color === activeColorFilter);
      });

      drawerFinishButtons.forEach((button) => {
        button.classList.toggle(
          'active',
          activeFilterMode === 'finish' && button.dataset.finish === activeFinishFilter
        );
      });

      drawerStorageButtons.forEach((button) => {
        button.classList.toggle(
          'active',
          activeFilterMode === 'storage' && button.dataset.storage === activeStorageFilter
        );
      });
    };

    const renderGallery = () => {
      const matchingCards = getMatchingCards();

      cards.forEach((card) => {
        card.classList.add('is-hidden');
        card.setAttribute('aria-hidden', 'true');
      });

      matchingCards.forEach((card, index) => {
        const shouldShow = expanded || index < initialLimit;
        card.classList.toggle('is-hidden', !shouldShow);
        card.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
      });

      if (loadMoreWrap) {
        loadMoreWrap.hidden = expanded || matchingCards.length <= initialLimit;
      }

      if (loadMoreButton) {
        loadMoreButton.textContent = 'Load More';
      }
    };

    const openFilterDrawer = () => {
      if (!filterDrawer) return;
      updateFilterButtons();
      filterDrawer.classList.add('is-open');
      filterDrawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };

    const closeFilterDrawer = () => {
      if (!filterDrawer) return;
      filterDrawer.classList.remove('is-open');
      filterDrawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const buttonFilter = button.dataset.filter || 'all';
        if (buttonFilter === 'more') return;

        activeFilterMode = 'shape';
        activeShapeFilter = buttonFilter;
        expanded = false;
        updateFilterButtons();
        renderGallery();
      });
    });

    drawerShapeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilterMode = 'shape';
        activeShapeFilter = button.dataset.filter || 'all';
        expanded = false;
        updateFilterButtons();
        renderGallery();
        closeFilterDrawer();
      });
    });

    drawerColorButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilterMode = 'color';
        activeColorFilter = button.dataset.color || '';
        expanded = false;
        updateFilterButtons();
        renderGallery();
        closeFilterDrawer();
      });
    });

    drawerFinishButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilterMode = 'finish';
        activeFinishFilter = button.dataset.finish || '';
        expanded = false;
        updateFilterButtons();
        renderGallery();
        closeFilterDrawer();
      });
    });

    drawerStorageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilterMode = 'storage';
        activeStorageFilter = button.dataset.storage || '';
        expanded = false;
        updateFilterButtons();
        renderGallery();
        closeFilterDrawer();
      });
    });

    filterDrawerOverlay?.addEventListener('click', closeFilterDrawer);
    filterDrawerClose?.addEventListener('click', closeFilterDrawer);
    filterDrawerCancel?.addEventListener('click', closeFilterDrawer);
    filterDrawerApply?.addEventListener('click', closeFilterDrawer);
    filterDrawerClear?.addEventListener('click', () => {
      activeFilterMode = 'shape';
      activeShapeFilter = 'all';
      activeColorFilter = '';
      activeFinishFilter = '';
      activeStorageFilter = '';
      expanded = false;
      updateFilterButtons();
      renderGallery();
      closeFilterDrawer();
    });

    loadMoreButton?.addEventListener('click', () => {
      expanded = true;
      renderGallery();
    });

    if (filterDrawer) {
      filterDrawer.setAttribute('aria-hidden', 'true');
    }

    document.querySelector('.mk-filter-outline')?.addEventListener('click', (event) => {
      event.preventDefault();
      openFilterDrawer();
    });

    updateFilterButtons();
    renderGallery();
  }

  const closeOpenDropdowns = (exceptItem = null) => {
    document.querySelectorAll('.nav-item.open').forEach((openItem) => {
      if (openItem !== exceptItem) {
        openItem.classList.remove('open');
      }
    });
  };

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      navList.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navList?.classList.remove('open');
      navToggle?.classList.remove('open');
    });
  });

  dropdownItems.forEach((item) => {
    item.addEventListener('mouseenter', function () {
      closeOpenDropdowns(this);
    });
  });

  dropdownButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const item = this.closest('.nav-item');
      const isOpen = item.classList.contains('open');
      closeOpenDropdowns(item);
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  document.addEventListener('click', function (event) {
    const clickedInsideHeader = event.target.closest('.nav-main') || event.target.closest('.topbar');
    const isDropdown = event.target.closest('.nav-item');
    if (!isDropdown) {
      closeOpenDropdowns();
    }

    if (navList && navToggle && navList.classList.contains('open') && !clickedInsideHeader) {
      navList.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });

  const startAutoCarousel = ({ hoverTarget, scrollContainer, itemTrack, speed = 0.45 }) => {
    const items = Array.from(itemTrack.children);
    if (items.length < 2 || itemTrack.dataset.autoLoopInitialized === 'true') return;

    items.forEach((item) => {
      itemTrack.appendChild(item.cloneNode(true));
    });

    itemTrack.dataset.autoLoopInitialized = 'true';

    let paused = false;

    const tick = () => {
      if (!paused) {
        const loopWidth = itemTrack.scrollWidth / 2;
        if (loopWidth > 0) {
          scrollContainer.scrollLeft += speed;
          if (scrollContainer.scrollLeft >= loopWidth) {
            scrollContainer.scrollLeft -= loopWidth;
          }
        }
      }

      requestAnimationFrame(tick);
    };

    hoverTarget.addEventListener('mouseenter', () => {
      paused = true;
    });
    hoverTarget.addEventListener('mouseleave', () => {
      paused = false;
    });
    hoverTarget.addEventListener('focusin', () => {
      paused = true;
    });
    hoverTarget.addEventListener('focusout', () => {
      paused = false;
    });

    tick();
  };

  const sliderWrappers = document.querySelectorAll('.slider-wrap, .offerings-wrap');

  sliderWrappers.forEach((sliderWrap) => {
    const sliderTrack = sliderWrap.querySelector('.slider-track');
    if (!sliderTrack) return;

    startAutoCarousel({
      hoverTarget: sliderWrap,
      scrollContainer: sliderWrap,
      itemTrack: sliderTrack,
      speed: 0.45,
    });
  });

  document.querySelectorAll('.ajor-luxe-offerings-section').forEach((section) => {
    const cards = Array.from(section.querySelectorAll('.ajor-luxe-offering-card'));
    const prevButton = section.querySelector('.ajor-luxe-offerings-arrow--prev');
    const nextButton = section.querySelector('.ajor-luxe-offerings-arrow--next');
    const slideIds = Array.from(new Set(cards.map((card) => card.dataset.slide).filter(Boolean)));
    let activePage = 0;

    if (cards.length === 0 || !prevButton || !nextButton) return;

    const getPageSize = () => {
      if (window.matchMedia('(max-width: 480px)').matches) return 1;
      if (window.matchMedia('(max-width: 768px)').matches) return 4;
      if (window.matchMedia('(max-width: 1120px)').matches) return 6;
      return 7;
    };

    const renderOfferings = () => {
      if (slideIds.length > 0) {
        activePage = ((activePage % slideIds.length) + slideIds.length) % slideIds.length;
        const activeSlideId = slideIds[activePage];

        cards.forEach((card) => {
          const isVisible = card.dataset.slide === activeSlideId;
          card.classList.toggle('is-hidden', !isVisible);
          card.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
        });

        const hasMultipleSlides = slideIds.length > 1;
        prevButton.disabled = !hasMultipleSlides;
        nextButton.disabled = !hasMultipleSlides;
        return;
      }

      const pageSize = getPageSize();
      const totalPages = Math.max(Math.ceil(cards.length / pageSize), 1);
      activePage = ((activePage % totalPages) + totalPages) % totalPages;
      const start = activePage * pageSize;
      const end = start + pageSize;

      cards.forEach((card, index) => {
        const isVisible = index >= start && index < end;
        card.classList.toggle('is-hidden', !isVisible);
        card.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
      });

      const hasMultiplePages = totalPages > 1;
      prevButton.disabled = !hasMultiplePages;
      nextButton.disabled = !hasMultiplePages;
    };

    prevButton.addEventListener('click', () => {
      activePage -= 1;
      renderOfferings();
    });

    nextButton.addEventListener('click', () => {
      activePage += 1;
      renderOfferings();
    });

    window.addEventListener('resize', renderOfferings, { passive: true });
    renderOfferings();
  });

  document.querySelectorAll('.ajor-luxe-spaces-section').forEach((section) => {
    const tabs = Array.from(section.querySelectorAll('.ajor-luxe-spaces-tab'));
    const cards = Array.from(section.querySelectorAll('.ajor-luxe-space-card'));
    const gallery = section.querySelector('.ajor-luxe-spaces-gallery');

    if (tabs.length === 0 || cards.length === 0) return;

    const setActiveStyle = (style) => {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.spaceStyle === style;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      cards.forEach((card) => {
        const isActive = card.dataset.spaceStyle === style;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      gallery?.setAttribute('data-active-style', style);
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        setActiveStyle(tab.dataset.spaceStyle || 'rustic');
      });
    });

    const initialStyle = tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.spaceStyle || 'rustic';
    setActiveStyle(initialStyle);
  });

  document.querySelectorAll('.mk-accessories-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.mk-accessories-track');
    const cards = Array.from(carousel.querySelectorAll('.mk-accessory-card'));
    const prevButton = carousel.querySelector('.mk-accessories-arrow-prev');
    const nextButton = carousel.querySelector('.mk-accessories-arrow-next');
    let activeIndex = 0;

    if (!track || cards.length === 0 || !prevButton || !nextButton) return;

    const getVisibleCount = () => {
      if (window.matchMedia('(max-width: 520px)').matches) return 1;
      if (window.matchMedia('(max-width: 900px)').matches) return 2;
      return 4;
    };

    const updateCarousel = () => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(cards.length - visibleCount, 0);
      activeIndex = Math.min(activeIndex, maxIndex);
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;

      track.style.transform = `translateX(-${activeIndex * (cardWidth + gap)}px)`;
      prevButton.disabled = activeIndex === 0;
      nextButton.disabled = activeIndex === maxIndex;
    };

    prevButton.addEventListener('click', () => {
      activeIndex = Math.max(activeIndex - 1, 0);
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      activeIndex += 1;
      updateCarousel();
    });

    window.addEventListener('resize', updateCarousel, { passive: true });
    updateCarousel();
  });

  let imageLightbox = null;
  let lastLightboxTrigger = null;

  const getImageLightbox = () => {
    if (imageLightbox) return imageLightbox;

    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded slider image');
    lightbox.innerHTML = `
      <button class="image-lightbox-close" type="button" aria-label="Close image">x</button>
      <figure class="image-lightbox-frame">
        <img src="" alt="" />
        <figcaption></figcaption>
      </figure>
    `;

    document.body.appendChild(lightbox);

    imageLightbox = {
      root: lightbox,
      image: lightbox.querySelector('img'),
      caption: lightbox.querySelector('figcaption'),
      closeButton: lightbox.querySelector('.image-lightbox-close'),
    };

    return imageLightbox;
  };

  const closeImageLightbox = () => {
    if (!imageLightbox) return;

    imageLightbox.root.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');

    if (lastLightboxTrigger && typeof lastLightboxTrigger.focus === 'function') {
      lastLightboxTrigger.focus({ preventScroll: true });
    }
  };

  const openImageLightbox = (image) => {
    const lightbox = getImageLightbox();
    const cardTitle = image.closest('.offering-card')?.querySelector('h3')?.textContent?.trim();
    const caption = cardTitle || image.alt || 'Interior design image';

    lastLightboxTrigger = image;
    lightbox.image.src = image.currentSrc || image.src;
    lightbox.image.alt = image.alt || caption;
    lightbox.caption.textContent = '';
    lightbox.root.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    lightbox.closeButton.focus({ preventScroll: true });
  };

  document.addEventListener('click', (event) => {
    const sliderCard = event.target.closest('.slider-track .offering-card');
    const sliderImage = sliderCard?.querySelector('.offering-image');
    if (!sliderCard || !sliderImage) return;

    event.preventDefault();
    openImageLightbox(sliderImage);
  });

  document.addEventListener('click', (event) => {
    const galleryImage = event.target.closest('.customer-stories-gallery-grid img');
    if (!galleryImage) return;

    event.preventDefault();
    openImageLightbox(galleryImage);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const galleryImage = event.target.closest?.('.customer-stories-gallery-grid img');
    if (!galleryImage) return;

    event.preventDefault();
    openImageLightbox(galleryImage);
  });

  const userDesignsSection = document.querySelector('.user-designs-section');
  if (userDesignsSection) {
    const filterButtons = Array.from(userDesignsSection.querySelectorAll('[data-user-design-filter]'));
    const designCards = Array.from(userDesignsSection.querySelectorAll('[data-user-design-card]'));
    let userDesignComparisonModal = null;
    let lastUserDesignTrigger = null;

    const setComparisonPosition = (position) => {
      if (!userDesignComparisonModal) return;

      const safePosition = Math.max(0, Math.min(100, position));
      userDesignComparisonModal.stage.style.setProperty('--compare-position', `${safePosition}%`);
      userDesignComparisonModal.handle.setAttribute('aria-valuenow', String(Math.round(safePosition)));
    };

    const updateComparisonFromPointer = (event) => {
      if (!userDesignComparisonModal) return;

      const rect = userDesignComparisonModal.stage.getBoundingClientRect();
      const position = ((event.clientX - rect.left) / rect.width) * 100;
      setComparisonPosition(position);
    };

    const closeUserDesignComparison = () => {
      if (!userDesignComparisonModal) return;

      userDesignComparisonModal.root.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');

      if (lastUserDesignTrigger && typeof lastUserDesignTrigger.focus === 'function') {
        lastUserDesignTrigger.focus({ preventScroll: true });
      }
    };

    const getUserDesignComparisonModal = () => {
      if (userDesignComparisonModal) return userDesignComparisonModal;

      const modal = document.createElement('div');
      modal.className = 'user-design-comparison-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'user-design-comparison-title');
      modal.innerHTML = `
        <div class="user-design-comparison-panel">
          <header class="user-design-comparison-header">
            <div>
              <h2 id="user-design-comparison-title">Before and After Comparison</h2>
              <p class="user-design-comparison-meta"></p>
            </div>
            <button class="user-design-comparison-close" type="button" aria-label="Close comparison">x</button>
          </header>
          <div class="user-design-comparison-body">
            <div class="user-design-comparison-stage" style="--compare-position: 50%;">
              <img class="user-design-comparison-before" src="" alt="" />
              <div class="user-design-comparison-after-wrap">
                <img class="user-design-comparison-after" src="" alt="" />
              </div>
              <span class="user-design-comparison-label user-design-comparison-label-before">Before</span>
              <span class="user-design-comparison-label user-design-comparison-label-after">After</span>
              <button class="user-design-comparison-handle" type="button" aria-label="Move comparison slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
                <span>||</span>
              </button>
            </div>
            <p class="user-design-comparison-help">Drag the slider to compare before and after &bull; Click outside to close</p>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      userDesignComparisonModal = {
        root: modal,
        panel: modal.querySelector('.user-design-comparison-panel'),
        meta: modal.querySelector('.user-design-comparison-meta'),
        beforeImage: modal.querySelector('.user-design-comparison-before'),
        afterImage: modal.querySelector('.user-design-comparison-after'),
        stage: modal.querySelector('.user-design-comparison-stage'),
        handle: modal.querySelector('.user-design-comparison-handle'),
        closeButton: modal.querySelector('.user-design-comparison-close'),
      };

      let isDraggingComparison = false;

      userDesignComparisonModal.closeButton.addEventListener('click', closeUserDesignComparison);

      userDesignComparisonModal.root.addEventListener('pointerdown', (event) => {
        if (event.target === userDesignComparisonModal.root) {
          closeUserDesignComparison();
        }
      });

      userDesignComparisonModal.stage.addEventListener('pointerdown', (event) => {
        isDraggingComparison = true;
        userDesignComparisonModal.stage.setPointerCapture?.(event.pointerId);
        updateComparisonFromPointer(event);
      });

      userDesignComparisonModal.stage.addEventListener('pointermove', (event) => {
        if (!isDraggingComparison) return;
        updateComparisonFromPointer(event);
      });

      userDesignComparisonModal.stage.addEventListener('pointerup', () => {
        isDraggingComparison = false;
      });

      userDesignComparisonModal.stage.addEventListener('pointercancel', () => {
        isDraggingComparison = false;
      });

      userDesignComparisonModal.handle.addEventListener('keydown', (event) => {
        const currentValue = Number(userDesignComparisonModal.handle.getAttribute('aria-valuenow')) || 50;

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          setComparisonPosition(currentValue - 5);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          setComparisonPosition(currentValue + 5);
        } else if (event.key === 'Home') {
          event.preventDefault();
          setComparisonPosition(0);
        } else if (event.key === 'End') {
          event.preventDefault();
          setComparisonPosition(100);
        }
      });

      return userDesignComparisonModal;
    };

    const openUserDesignComparison = (card) => {
      const images = Array.from(card.querySelectorAll('.user-design-card-media img'));
      if (images.length < 2) return;

      const modal = getUserDesignComparisonModal();
      const metadata = Array.from(card.querySelectorAll('.user-design-meta span'));

      lastUserDesignTrigger = card;
      modal.beforeImage.src = images[0].currentSrc || images[0].src;
      modal.beforeImage.alt = images[0].alt || 'Before design image';
      modal.afterImage.src = images[1].currentSrc || images[1].src;
      modal.afterImage.alt = images[1].alt || 'After design image';
      modal.meta.replaceChildren(...metadata.map((item) => item.cloneNode(true)));
      modal.root.classList.add('is-open');
      document.body.classList.add('lightbox-open');
      setComparisonPosition(50);
      modal.closeButton.focus({ preventScroll: true });
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const selectedCategory = button.dataset.userDesignFilter;

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle('is-active', isActive);
          filterButton.setAttribute('aria-pressed', String(isActive));
        });

        designCards.forEach((card) => {
          const categories = (card.dataset.category || '').split(/\s+/);
          card.hidden = !categories.includes(selectedCategory);
        });
      });
    });

    filterButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    });

    const activeFilter = filterButtons.find((button) => button.classList.contains('is-active')) || filterButtons[0];
    if (activeFilter) {
      const initialCategory = activeFilter.dataset.userDesignFilter;
      designCards.forEach((card) => {
        const categories = (card.dataset.category || '').split(/\s+/);
        card.hidden = !categories.includes(initialCategory);
      });
    }

    designCards.forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Open before and after comparison');

      card.addEventListener('click', () => {
        openUserDesignComparison(card);
      });

      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        event.preventDefault();
        openUserDesignComparison(card);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && userDesignComparisonModal?.root.classList.contains('is-open')) {
        closeUserDesignComparison();
      }
    });

  }

  document.addEventListener('click', (event) => {
    if (!imageLightbox || !imageLightbox.root.classList.contains('is-open')) return;

    const clickedBackdrop = event.target === imageLightbox.root;
    const clickedClose = event.target.closest('.image-lightbox-close');
    if (clickedBackdrop || clickedClose) {
      closeImageLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageLightbox?.root.classList.contains('is-open')) {
      closeImageLightbox();
    }

  });

  const whyChooseCarousel = document.querySelector('.whyChooseUs_slider__vpqwR');
  if (whyChooseCarousel) {
    const whyChooseTrack = whyChooseCarousel.querySelector('.whyChooseUs_slide-icons__3t3Vh');
    if (whyChooseTrack) {
      startAutoCarousel({
        hoverTarget: whyChooseCarousel,
        scrollContainer: whyChooseCarousel,
        itemTrack: whyChooseTrack,
        speed: 0.5,
      });
    }
  }

  document.querySelectorAll('.trusted-brands-section').forEach((section) => {
    const track = section.querySelector('.trusted-brands-track');
    const slides = Array.from(section.querySelectorAll('.trusted-brands-slide'));
    const dots = Array.from(section.querySelectorAll('.trusted-brand-dots button'));
    if (!track || slides.length < 2 || dots.length === 0) return;

    let activeIndex = 0;
    let rotateTimer = null;

    const setSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${activeIndex * 100}%)`;

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const stopRotation = () => {
      if (rotateTimer) {
        clearInterval(rotateTimer);
        rotateTimer = null;
      }
    };

    const startRotation = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stopRotation();
      rotateTimer = setInterval(() => {
        setSlide(activeIndex + 1);
      }, 3000);
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        setSlide(dotIndex);
        startRotation();
      });
    });

    section.addEventListener('mouseenter', stopRotation);
    section.addEventListener('mouseleave', startRotation);
    section.addEventListener('focusin', stopRotation);
    section.addEventListener('focusout', startRotation);

    setSlide(0);
    startRotation();
  });

  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    const toggleBackToTop = () => {
      backToTopButton.classList.toggle('is-visible', window.scrollY > 420);
    };

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
  }

  const scrollToHashTarget = () => {
    if (!location.hash) return;
    const hashTarget = document.querySelector(location.hash);
    if (hashTarget) {
      hashTarget.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  };

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToHashTarget);
    });
  });

  scrollToHashTarget();

});
