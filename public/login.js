
        // Enhanced form validation and handling
        const form = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberCheckbox = document.getElementById('remember');
        const loginBtn = document.getElementById('loginBtn');
        const btnText = document.getElementById('btnText');
        const loading = document.getElementById('loading');
        const successMessage = document.getElementById('successMessage');
        const welcomeMessage = document.getElementById('welcomeMessage');

        // Enhanced validation with visual feedback
        function validateField(input, errorElement, iconElement, validationFn) {
            const isValid = validationFn();
            
            if (isValid) {
                input.classList.remove('error');
                input.classList.add('success');
                errorElement.classList.remove('show');
                if (iconElement) {
                    iconElement.classList.add('show', 'success');
                    iconElement.classList.remove('error');
                }
            } else {
                input.classList.remove('success');
                input.classList.add('error');
                errorElement.classList.add('show');
                if (iconElement) {
                    iconElement.classList.add('show', 'error');
                    iconElement.classList.remove('success');
                }
            }
            
            return isValid;
        }

        // Real-time validation
        emailInput.addEventListener('input', () => {
            validateField(
                emailInput, 
                document.getElementById('emailError'),
                document.getElementById('emailIcon'),
                () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
            );
        });

        passwordInput.addEventListener('input', () => {
            validateField(
                passwordInput, 
                document.getElementById('passwordError'),
                document.getElementById('passwordIcon'),
                () => passwordInput.value.length > 0
            );
        });

        // Show welcome message for returning users
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                // Simulate checking if user exists
                setTimeout(() => {
                    welcomeMessage.style.display = 'block';
                    welcomeMessage.classList.add('fade-in');
                }, 500);
            }
        });

        // Enhanced form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate fields
            const isEmailValid = validateField(
                emailInput, 
                document.getElementById('emailError'),
                document.getElementById('emailIcon'),
                () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
            );
            
            const isPasswordValid = validateField(
                passwordInput, 
                document.getElementById('passwordError'),
                document.getElementById('passwordIcon'),
                () => passwordInput.value.length > 0
            );
            
            if (!isEmailValid || !isPasswordValid) {
                return;
            }
            
            // Show loading state
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            loading.style.display = 'block';
            
            // Simulate login API call
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                successMessage.style.display = 'block';
                successMessage.classList.add('fade-in');
                form.style.opacity = '0.3';
                form.style.pointerEvents = 'none';
                
                // Simulate redirect after success
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    // window.location.href = '/dashboard';
                }, 2000);
                
                console.log('User logged in:', {
                    email: emailInput.value,
                    remember: rememberCheckbox.checked
                });
                
            } catch (error) {
                alert('Login failed. Please check your credentials and try again.');
            } finally {
                // Reset button state
                loginBtn.disabled = false;
                btnText.style.display = 'block';
                loading.style.display = 'none';
            }
        });

        // Google Sign-In configuration
        window.onload = function () {
            google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
                callback: handleGoogleSignIn,
                auto_select: false,
                cancel_on_tap_outside: false
            });
        };

        // Enhanced Google Sign-In handler
        function handleGoogleSignIn(response) {
            const responsePayload = decodeJwtResponse(response.credential);
            
            console.log('Google Sign-In successful:', responsePayload);
            
            // Show success message
            successMessage.innerHTML = `🎉 Welcome back ${responsePayload.name}! Signed in successfully with Google.`;
            successMessage.style.display = 'block';
            successMessage.classList.add('fade-in');
            form.style.opacity = '0.3';
            form.style.pointerEvents = 'none';
            
            // Simulate redirect
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
                // window.location.href = '/dashboard';
            }, 2000);
        }

        // JWT decoder
        function decodeJwtResponse(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }

        // Google Sign-In button
        document.getElementById('googleSignIn').addEventListener('click', () => {
            google.accounts.id.prompt();
        });

        // Forgot password handler
        document.getElementById('forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show a simple prompt for demo
            const email = prompt('Enter your email address to reset your password:');
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert(`Password reset link sent to ${email}. Please check your inbox.`);
            } else if (email) {
                alert('Please enter a valid email address.');
            }
        });

        // Sign up link handler
        document.getElementById('signupLink').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Redirecting to sign up page...');
            // Here you would redirect to your sign up page
        });

        // Add smooth focus effects
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });

        // Auto-fill demo for testing
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                emailInput.value = 'demo@example.com';
                passwordInput.value = 'password123';
                
                // Trigger validation
                emailInput.dispatchEvent(new Event('input'));
                passwordInput.dispatchEvent(new Event('input'));
            }
        });