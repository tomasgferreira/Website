let terminalManuallyClosed = false;

document.addEventListener('DOMContentLoaded', () => {
    // Content for each icon's modal
    const iconContent = {
        education: {
            title: "Education",
            text: "Computer Science and Business Management at ISCTE\n\nAI for Product & Automation at Code for All\n\nStartup sprint at Unicorn Factory\n\nAlways learning a new angle\n\nI like the space between code, product, and business"
        },
        ideas: {
            title: "Ideas & Innovation",
            text: "I like launching fast\n\nBuild a v0\nShow it to people\nGet punched by reality\nImprove it\n\nI also like ideas that sound a little crazy at first"
        },
        communication: {
            title: "Communication",
            text: "LinkedIn - Tomasgferreira\n\nGitHub - Tomasgferreira\n\nGitHub - Tomoconstrutor"
        },
        global: {
            title: "Vacation Overdrive",
            text: "Exploring > Relaxing. I usually need vacations after my vacations\n\nStories. Cars. Museums. Strange places.\nThe stuff that makes a trip worth remembering\n\nA good trip gives me memories\nA great one gives me ideas"
        },
        work: {
            title: "Doing Cool Stuff & Getting Paid or Professional Problem Solver",
            text: "I've worked where product meets people\n\nMedCase and SkyBlaze taught me how to turn rough ideas into working products\n\nSales at PMI taught me how to pitch, listen and handle objections in the real world\n\nE-commerce taught me traffic, conversion, SEO and positioning\n\nI like the overlap: build the thing, explain the thing and get people to care"
        },
        tech: {
            title: "Technology (Currently teaching tiny AIs to book flights, chase leads, and remind me to surf.)",
            text: "Building with AI, agents, automations, and APIs\n\nPython, TypeScript, Java, SQL, PostgreSQL, MongoDB\nReact, Next.js, FastAPI, Supabase and Vercel\n\nOpenAI API, Agents SDK, LangGraph, Vercel AI SDK, n8n and no-code tools\n\nI like tools that do things\nNot dashboards that just look pretty\n\nThe stack is flexible\nThe output is the point"
        },
        fitness: {
            title: "Fitness & Health",
            text: "Surfing, hoops, cycling, calisthenics, I'm not picky, just active\n\nI can plank for more than 8 minutes, don't ask me why...\n\nConstantly adding new ways to stay active"
        },
        chat: {
            title: "Lost in Translation",
            text: "Portuguese native, English fluent, Spanish enough to survive\n\n1000+ days on Duolingo: German and Italian loading...\n\nBasically, I can order food anywhere (priority skills)"
        },
        voice: {
            title: "Voice & Audio",
            text: "I listen to a lot of podcasts\n\nMy First Million\nModern Wisdom\nThe AI Daily Brief\nBecoming The Main character\nStarter Story\n\nUsually at 2x speed\nEfficient or mildly concerning. Not sure yet"
        },
        progress: {
            title: "Progress Tracking",
            text: "I like being a beginner at hard things\n\nIt keeps the ego under control\n\nI learn from people with more reps than me\nBuilders. Operators. Founders. Customers.\n\nI'm a work in progress\nLike you"
        },
        innovation: {
            title: "Innovation",
            text: "Most difficult question you can ask me: what's my favorite car?\n\nIdentifying cars on sight (my weirdest party trick)\n\nMy girlfriend's patience is tested regularly when nice cars pass by\n\nI dare you to type the brand of the car you just clicked"
        },
        knowledge: {
            title: "Bookshelf",
            text: "Currently reading: The Four Agreements\n\nBooks are brain food.\n\nLearn from someone else's mistakes\nIt's cheaper"
        }
    };


    // Typing animation function with cancel support
    function typeText(element, text, speed = 20) {
        let index = 0;
        element.innerHTML = '';
        element.classList.add('typing');

        // Cancel previous animation if any
        if (element._typingCancel) {
            element._typingCancel();
        }
        let cancelled = false;
        element._typingCancel = () => { cancelled = true; };

        return new Promise(resolve => {
            function type() {
                if (cancelled) {
                    element.classList.remove('typing');
                    return resolve();
                }
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

    function enhanceCommunicationContent(modalText) {
        const linkedText = modalText.innerHTML
            .replace(
                'LinkedIn - Tomasgferreira',
                'LinkedIn - <a href="https://www.linkedin.com/in/tomasgferreira" target="_blank" rel="noopener noreferrer">Tomasgferreira</a>'
            )
            .replace(
                'GitHub - Tomasgferreira',
                'GitHub - <a href="https://github.com/tomasgferreira" target="_blank" rel="noopener noreferrer">Tomasgferreira</a>'
            )
            .replace(
                'GitHub - Tomoconstrutor',
                'GitHub - <a href="https://github.com/tomoconstrutor" target="_blank" rel="noopener noreferrer">Tomoconstrutor</a>'
            );

        modalText.innerHTML = `${linkedText}<br><br><button type="button" class="contact-scroll-btn">Click here to contact me</button>`;
    }

    function enhanceProgressContent(modalText) {
        const linkedText = modalText.innerHTML
            .replace(
                'Snip to AI',
                '<a href="https://chromewebstore.google.com/detail/snip-to-ai/ecljdeddnnbegaogeejliopbnknjbikp?hl=pt-PT&utm_source=ext_sidebar" target="_blank" rel="noopener noreferrer">Snip to AI</a>'
            )
            .replace(
                'usemute.com',
                '<a href="https://usemute.com" target="_blank" rel="noopener noreferrer">usemute.com</a>'
            )
            .replace(
                'medcase.pt',
                '<a href="https://medcase.pt" target="_blank" rel="noopener noreferrer">medcase.pt</a>'
            );

        modalText.innerHTML = linkedText;
    }

    // Handle all clickable elements
    document.addEventListener('click', async (e) => {
        const contactButton = e.target.closest('.contact-scroll-btn');
        if (contactButton) {
            const modal = contactButton.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
            scrollToContact();
            return;
        }

        const icon = e.target.closest('.icon');
        const progressContainer = e.target.closest('.progress-container');
        
        if (icon || progressContainer) {
            const info = (icon ? icon : progressContainer).getAttribute('data-info');

            const modal = document.getElementById(`modal-${info}`);
            if (modal) {
                const modalText = modal.querySelector('.modal-text');
                modal.style.display = 'block';
                await typeText(modalText, iconContent[info].text);

                if (info === 'communication') {
                    enhanceCommunicationContent(modalText);
                }
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
            await typeText(modalText, "Software engineering at NTT DATA\n\nBuilding useful tools like Snip to AI\n\nHelp you being conscious of your time with mute. (usemute.com)\n\nCo-Founder & CEO at MedCase (medcase.pt) (UFL startup)\n\nTeaching AI and automation to executives");
            enhanceProgressContent(modalText);
        }
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            // Cancel typing animation if running
            const modalText = modal.querySelector('.modal-text');
            if (modalText && modalText._typingCancel) {
                modalText._typingCancel();
            }
            modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            // Cancel typing animation if running
            const modalText = e.target.querySelector('.modal-text');
            if (modalText && modalText._typingCancel) {
                modalText._typingCancel();
            }
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
                const successMessage = 'Message sent. The terminal did its thing.';
                const notificationMessage = document.querySelector('#form-notification .notification-message');
                notificationMessage.textContent = successMessage;

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
                    message.textContent = 'Message sent. The terminal did its thing.'; // Reset message
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
