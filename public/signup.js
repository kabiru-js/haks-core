
        // Enhanced form validation and handling
        const form = document.getElementById('signupForm');
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const termsCheckbox = document.getElementById('terms');
        const signupBtn = document.getElementById('signupBtn');
        const btnText = document.getElementById('btnText');
        const loading = document.getElementById('loading');
        const successMessage = document.getElementById('successMessage');

        // Enhanced password strength checker
        function checkPasswordStrength(password) {
            const strengthIndicator = document.getElementById('passwordStrength');
            const strengthBar = strengthIndicator.querySelector('.strength-bar');
            const strengthText = strengthIndicator.querySelector('.strength-text');
            
            let strength = 0;
            let feedback = '';
            
            if (password.length >= 8) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/\d/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            
            strengthBar.className = 'strength-bar';
            
            if (strength === 0 || password.length === 0) {
                feedback = 'Password strength';
            } else if (strength <= 2) {
                strengthBar.classList.add('strength-weak');
                feedback = 'Weak password';
            } else if (strength === 3) {
                strengthBar.classList.add('strength-medium');
                feedback = 'Medium password';
            } else {
                strengthBar.classList.add('strength-strong');
                feedback = 'Strong password';
            }
            
            strengthText.textContent = feedback;
        }

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

        // Enhanced event listeners with animations
        fullNameInput.addEventListener('input', () => {
            validateField(
                fullNameInput, 
                document.getElementById('fullNameError'),
                document.getElementById('fullNameIcon'),
                () => fullNameInput.value.trim().length >= 2
            );
        });

        emailInput.addEventListener('input', () => {
            validateField(
                emailInput, 
                document.getElementById('emailError'),
                document.getElementById('emailIcon'),
                () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
            );
        });

        passwordInput.addEventListener('input', () => {
            checkPasswordStrength(passwordInput.value);
            validateField(
                passwordInput, 
                document.getElementById('passwordError'),
                document.getElementById('passwordIcon'),
                () => passwordInput.value.length >= 8
            );
            
            // Also validate confirm password if it has a value
            if (confirmPasswordInput.value) {
                validateField(
                    confirmPasswordInput, 
                    document.getElementById('confirmPasswordError'),
                    document.getElementById('confirmPasswordIcon'),
                    () => passwordInput.value === confirmPasswordInput.value
                );
            }
        });

        confirmPasswordInput.addEventListener('input', () => {
            validateField(
                confirmPasswordInput, 
                document.getElementById('confirmPasswordError'),
                document.getElementById('confirmPasswordIcon'),
                () => passwordInput.value === confirmPasswordInput.value
            );
        });

        // Enhanced form submission with better UX
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const isFullNameValid = validateField(
                fullNameInput, 
                document.getElementById('fullNameError'),
                document.getElementById('fullNameIcon'),
                () => fullNameInput.value.trim().length >= 2
            );
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
                () => passwordInput.value.length >= 8
            );
            const isConfirmPasswordValid = validateField(
                confirmPasswordInput, 
                document.getElementById('confirmPasswordError'),
                document.getElementById('confirmPasswordIcon'),
                () => passwordInput.value === confirmPasswordInput.value
            );
            
            if (!termsCheckbox.checked) {
                alert('Please accept the Terms of Service and Privacy Policy');
                return;
            }
            
            if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
                return;
            }
            
            // Show loading state with animation
            signupBtn.disabled = true;
            btnText.style.display = 'none';
            loading.style.display = 'block';
            
            // Simulate API call
            try {
                await new Promise(resolve => setTimeout(resolve, 2500));
                
                // Show success message with animation
                successMessage.style.display = 'block';
                successMessage.classList.add('fade-in');
                form.style.opacity = '0.3';
                form.style.pointerEvents = 'none';
                
                // Here you would typically send the data to your server
                console.log('User registered:', {
                    fullName: fullNameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value
                });
                
            } catch (error) {
                alert('Registration failed. Please try again.');
            } finally {
                // Reset button state
                signupBtn.disabled = false;
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
            
            // Show enhanced success message
            successMessage.innerHTML = `🎉 Welcome ${responsePayload.name}! You've successfully signed in with Google.`;
            successMessage.style.display = 'block';
            successMessage.classList.add('fade-in');
            form.style.opacity = '0.3';
            form.style.pointerEvents = 'none';
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

        // Enhanced Google Sign-In button
        document.getElementById('googleSignIn').addEventListener('click', () => {
            google.accounts.id.prompt();
        });

        // Sign in link handler
        // document.getElementById('signinLink').addEventListener('click', (e) => {
        //     e.preventDefault();
        //     alert('Redirecting to sign in page...');
        // });

        // Add smooth scroll and focus effects
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    