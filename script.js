let terminalManuallyClosed = false;

document.addEventListener('DOMContentLoaded', () => {
    // Content for each icon's modal
    const iconContent = {
        education: {
            title: "Education",
            text: "Bachelor in Computer Science and Business Management at ISCTE\n\nDid a sprint at Unicorn Factory, pitched ideas faster than you can say startup"
        },
        ideas: {
            title: "Ideas & Innovation",
            text: "Ship the v0 before breakfast, fix it by lunch\n\nIf your idea sounds crazy, I probably like it"
        },
        communication: {
            title: "Communication",
            text: "Sales Representative at Philip Morris International"
        },
        global: {
            title: "Vacation Overdrive",
            text: "Exploring > Relaxing. I usually need vacations after my vacations\n\nTraveling to find cool stories (and even cooler cars)\n\nWeird museums and mind-bending exhibits? Count me in"
        },
        work: {
            title: "Doing Cool Stuff & Getting Paid or Professional Problem Solver",
            text: "Boosted e-commerce sites from obscurity to top SEO rankings\n\nSolid sales experience at PMI\n\nEvent promotions for dozens of brands\n\nSold products, pitched ideas and nailed presentations. Sleep? Overrated"
        },
        tech: {
            title: "Technology (Currently teaching tiny AIs to book flights, chase leads, and remind me to surf.)",
            text: "Java, Python, SQL, MongoDB — I'll dive into technical stuff when needed\n\nHTML, CSS, Power BI, Google Ads? All part of the toolkit, zero fear factor.\n\nCurrently wiring up AIs and automations so my future self can delegate to… my other future self"
        },
        fitness: {
            title: "Fitness & Health",
            text: "Surfing, hoops, cycling, calisthenics — I'm not picky, just active\n\nConstantly adding new ways to stay active"
        },
        chat: {
            title: "Lost in Translation",
            text: "Portuguese native, English fluent, Spanish enough to survive\n\n1000+ days on Duolingo: German and Italian loading…\n\nBasically, I can order food anywhere (priority skills)"
        },
        voice: {
            title: "Voice & Audio",
            text: "Favorite listens: My First Million, Modern Wisdom, The AI daily brief, Founders\n\nPodcasts at 2x speed; in normal speech they sound stoned now."
        },
        progress: {
            title: "Progress Tracking",
            text: "Passionate about tackling interesting challenges\n\nI like to learn directly from people who've done interesting, real-world things\n\nMy north star is to immerse in meaningful ventures that can challenge me to scale faster\n\nI'm a work in progress, just like you"
        },
        innovation: {
            title: "Innovation",
            text: "Most difficult question you can ask me: what's my favorite car?\n\nIdentifying cars on sight (my weirdest party trick)\n\nMy girlfriend's patience is tested regularly when nice cars pass by"
        },
        knowledge: {
            title: "Bookshelf",
            text: "Currently reading:\n\n- Psychology of selling - Brian Tracy\n\nBooks = brain food. Currently overeating"
        }
    };


    // Typing animation function
    function typeText(element, text, speed = 20) {
        let index = 0;
        element.innerHTML = '';
        element.classList.add('typing');

        return new Promise(resolve => {
            function type() {
                if (index < text.length) {
                    if (text.charAt(index) === '\n') {
                        element.innerHTML += '<br>';
                    } else {
                        element.innerHTML += text.charAt(index);
                    }
                    index++;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing');
                    resolve();
                }
            }
            type();
        });
    }

    // Initialize terminal
    const terminal = document.querySelector('.terminal');
    if (terminal) {
        terminal.style.display = 'block';
    }

    // Function to handle scrolling to contact section
    const scrollToContact = () => {
        setTimeout(() => {
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                const offset = contactSection.offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
                // Ensure terminal is visible after scroll
                if (terminal) {
                    terminal.style.display = 'block';
                }
            }
        }, 100);
    };

    // Handle all clickable elements
    document.addEventListener('click', async (e) => {
        const icon = e.target.closest('.icon');
        const progressContainer = e.target.closest('.progress-container');
        
        if (icon || progressContainer) {
            const info = (icon ? icon : progressContainer).getAttribute('data-info');
            
            if (info === 'communication') {
                scrollToContact();
                return;
            }

            const modal = document.getElementById(`modal-${info}`);
            if (modal) {
                const modalText = modal.querySelector('.modal-text');
                modal.style.display = 'block';
                await typeText(modalText, iconContent[info].text);
            }
        }
    });

    // Progress bar click handler
    document.querySelector('.progress-container').addEventListener('click', async () => {
        const modal = document.getElementById('modal-progress');
        if (modal) {
            const modalText = modal.querySelector('.modal-text');
            const modalTitle = modal.querySelector('.modal-title');
            modalTitle.textContent = "What's in Progress";
            modal.style.display = 'block';
            await typeText(modalText, "Currently working on:\n\n- Wrapping up my bachelor's in Computer Science and Business Management\n\n- Closing deals as a sales representative\n\n- Exploring AI and automation\n\n- Helping parents read cooler bedtime stories");
        }
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Form handling
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // Get form data
            const formData = new FormData(form);
            const fullName = formData.get('name');
            const firstName = fullName.split(' ')[0]; // Extract first name
            const email = formData.get('email');

            // Submit the form data to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Send auto-response email
                try {
                    const emailResponse = await emailjs.send(
                        "service_uxb27hd",
                        "template_8nsi9hr",
                        {
                            to_name: firstName,
                            to_email: email,
                            from_name: "Tomás Ferreira",
                            subject: `from ${firstName} via website`,
                            message: `Hey ${firstName}!\n\nThank you for reaching out!...`
                        }
                    );
                    console.log('EmailJS Response:', emailResponse);
                } catch (emailError) {
                    console.error('Auto-response email failed:', emailError);
                    console.error('Error details:', {
                        status: emailError.status,
                        text: emailError.text,
                        message: emailError.message
                    });
                }

                // Show success notification
                const notification = document.getElementById('form-notification');
                notification.style.display = 'block';

                // Hide notification after 3 seconds
                setTimeout(() => {
                    notification.style.animation = 'slideOut 0.5s ease-out';
                    setTimeout(() => {
                        notification.style.display = 'none';
                        notification.style.animation = '';
                    }, 500);
                }, 3000);

                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            // Show error notification
            const notification = document.getElementById('form-notification');
            const message = notification.querySelector('.notification-message');
            message.textContent = 'Failed to send message. Please try again.';
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.5s ease-out';
                setTimeout(() => {
                    notification.style.display = 'none';
                    notification.style.animation = '';
                    message.textContent = 'Message sent successfully!'; // Reset message
                }, 500);
            }, 3000);
        }
    });

    // Add notification close button functionality
    const notificationClose = document.querySelector('.notification-close');
    if (notificationClose) {
        notificationClose.addEventListener('click', () => {
            const notification = document.getElementById('form-notification');
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                notification.style.display = 'none';
                notification.style.animation = '';
            }, 500);
        });
    }

    // Terminal controls functionality
    const controls = document.querySelectorAll('.control');
    
    controls.forEach(control => {
        control.addEventListener('click', () => {
            if (control.classList.contains('minimize')) {
                terminal.style.transform = 'scale(0.8)';
            } else if (control.classList.contains('maximize')) {
                terminal.style.transform = 'scale(1)';
            } else if (control.classList.contains('close')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Typing animation for inputs
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#00ff00';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = '#00ff00';
        });
    });

    // Scroll trigger for showing the contact form
    window.addEventListener('scroll', () => {
        const contactForm = document.querySelector('.terminal');
        const scrollPosition = window.scrollY + window.innerHeight;
        const formPosition = contactForm.offsetTop;

        if (scrollPosition > formPosition && !terminalManuallyClosed) {
            contactForm.classList.add('show-contact-form');
        }
    });
});